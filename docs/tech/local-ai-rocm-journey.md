---
title: "Remote AI Builds Local AI: The ROCm gfx1103 Journey"
sidebar_label: "🤖 Remote AI → Local AI"
description: "How using Claude as an AI orchestrator exposed the full depth of AMD ROCm's hardware gaps — and why investing in remote AI intelligence today is the surest path to running sovereign local models tomorrow."
tags: [ai, rocm, amd, ollama, llama.cpp, local-llm, hardware]
---

:::info[MISSION BRIEF]
**Hardware involved:** AMD APU laptop (Ryzen 7 PRO 7840U / Radeon 780M / 54GB), NVIDIA GPU laptop (RTX 3070 / Ryzen 7 5800H / 58GB), Intel Xeon workstation (E5-1650 v3 / 78GB / CPU-only)  
**Outcome:** ROCm built from source for gfx1103. Vulkan RADV faster in production. Full stack operational.
:::

## The Core Thesis

There is a productive irony in using a cloud-hosted AI to build, debug, and optimize local AI infrastructure. The exercise documented here took roughly 8 hours of machine time and surfaced every layer of the stack — from systemd service files to Tensile kernel compilation. A solo engineer without AI assistance would have spent days on the rocBLAS TensileLibrary gap alone, if they found the root cause at all.

The lesson: **remote AI is the best investment you can make in local AI**. Not as a permanent crutch, but as a force multiplier that compresses the time from "hardware arrived" to "inference running" from weeks to hours.

---

## The Setup

Three machines form a small distributed inference cluster, built entirely from hardware that was never designed for this purpose:

| Machine | Hardware | Role |
|---------|----------|------|
| AMD APU laptop | Ryzen 7 PRO 7840U / Radeon 780M / 54GB | Orchestration brain host |
| NVIDIA GPU laptop | RTX 3070 Laptop 8GB / Ryzen 7 5800H / 58GB | GPU inference node |
| Intel Xeon workstation | Xeon E5-1650 v3 / 78GB RAM / CPU-only | CPU inference node |

The "brain" is a central LLM running on the AMD APU laptop that orchestrates inference tasks distributed across the GPU and CPU nodes. Standard consumer and prosumer hardware, running Linux, doing something AMD and Intel never marketed it for.

---

## Phase 1: Diagnosing the Existing Setup

Before touching anything, a baseline probe queried each inference node via the Ollama API and measured tokens per second:

| Node | Model | TPS | Latency |
|------|-------|-----|---------|
| GPU node | phi4-mini:3.8b | 119.91 | 425ms |
| CPU node | mistral:7b | 8.44 | 14,542ms |

The GPU result was deceptive. An RTX 3070 should deliver 300+ TPS on a 3.8B model. Investigation revealed two compounding issues:

1. **Ollama 0.21.2** on the GPU laptop — three major versions behind 0.24.0, missing significant GPU kernel improvements
2. **`OLLAMA_NUM_GPU=-1`** in `override.conf` — the GPU was explicitly disabled at the service level, running everything on CPU

Neither issue was visible from the outside. The Ollama server responded, inference worked, TPS looked "acceptable" because there was no baseline to compare against. The AI found both issues in the same diagnostic pass.

The CPU node's 8.44 TPS had a different root cause: 12 logical threads set as `OLLAMA_NUM_PARALLEL=4`, causing constant context switching. With `OLLAMA_NUM_THREAD=6` (physical cores only) and `qwen2.5:3b` replacing `mistral:7b`, the Xeon workstation reached 19.63 TPS — a 132% improvement from thread tuning and model right-sizing alone.

---

## Phase 2: The Model Selection Debate

Three AI models ran a parallel assessment of the best Ollama models for each machine — Claude Sonnet 4.6, Gemini 3.5 Flash, and Claude Opus 4.7. Each worked independently, with results compared afterward.

### NVIDIA GPU laptop (RTX 3070, 8GB VRAM, Ampere SM8.6)

| Role | Model | Consensus |
|------|-------|-----------|
| Best quality | `mistral-nemo:12b` vs `qwen2.5:14b` | Split — VRAM ceiling creates a tradeoff |
| Best speed | `phi4-mini:3.8b` | **All three agree** |
| Best balanced | `qwen3:8b` | **All three agree** |
| Hard avoid | `qwen3:30b`, `gemma3:12b` | **All three agree** |

The key finding: `qwen3:8b` with `think:false` in the API call is the right daily driver. Without `think:false`, qwen3 exhausts its token budget generating internal chain-of-thought that never appears in output — a silent failure mode that produces empty responses at full inference cost.

### Intel Xeon workstation (E5-1650 v3, AVX2, 78GB RAM)

All three models agreed: `phi4:14b` for quality (2-3 TPS but maximum reasoning per parameter), `qwen2.5:3b` for speed (15-19 TPS, proven), `qwen3:8b` with `think:false` for balance. The 78GB RAM creates temptation to run 30B+ models — all three warned against it. At ~1-2 TPS, a single response takes over a minute. RAM is not the bottleneck; Haswell AVX2 compute is.

The split between Claude Sonnet 4.6 and Claude Opus 4.7 on best quality for the GPU node is worth noting: Sonnet preferred `mistral-nemo:12b` as the safest VRAM fit at 7.1GB, while Opus was willing to accept the slight overflow of `qwen2.5:14b` at 9GB for the quality gain. Both are defensible choices depending on workload.

---

## Phase 3: The AMD APU — The Real Hardware Story

The AMD APU laptop's Radeon 780M (GFX1103, RDNA 3, 12 CUs) is the hardware most people actually own. Not a workstation GPU. Not a Mac with unified memory. A laptop APU with 8GB of BIOS-allocated shared VRAM and 27GB of GPU-accessible system RAM.

The initial assessment:
- **ROCm 7.2.1** already installed ✅
- **rocminfo** detects gfx1103 ✅
- **Vulkan RADV** running the existing brain (Gemma-4-26B-A4B, 16GB) ✅

The obvious optimization: build llama.cpp with ROCm/HIP for gfx1103 and replace the oversized 16GB model with `mistral-nemo:12b`. Simple, right?

---

## Phase 4: The rocBLAS Gap

```
rocBLAS error: Cannot read /opt/rocm-7.2.1/lib/rocblas/library/TensileLibrary.dat: 
Illegal seek for GPU arch : gfx1103
```

This error, appearing immediately on first inference attempt with the ROCm binary, is the central problem documented here. rocBLAS — AMD's GEMM library, required for FP16/FP32 matrix multiplication in LLM inference — ships pre-compiled Tensile kernels for specific GPU architectures. In ROCm 7.2.x, gfx1103 is absent from every package variant checked:

- ROCm 7.2.1 SUSE package: no gfx1103
- ROCm 7.2.1 Ubuntu 22.04 package: no gfx1103
- ROCm 7.2.2 Ubuntu package: no gfx1103
- ROCm 7.2.3 Ubuntu package: no gfx1103
- Ollama 0.24.0 ROCm bundle: no gfx1103

This is not a configuration error. This is AMD's packaging team not shipping APU-variant Tensile kernels in the 7.2.x release series. The Radeon 780M — present in every Ryzen 7 7840U laptop sold since 2023, in countless mini PCs, in the Steam Deck OLED — is simply not supported by the packaged rocBLAS.

### The workaround path

Several approaches were tried before the solution:

**ISA override (`HSA_OVERRIDE_GFX_VERSION=11.0.2`):** Makes the GPU report as gfx1102 (nearest RDNA3 discrete GPU). rocBLAS finds the gfx1102 TensileLibrary and loads it. But the pre-compiled gfx1102 shaders execute on gfx1103 silicon and SEGV during the first matrix operation. ISA-level incompatibility, not just metadata.

**hipBLAS stub:** Replace all hipBLAS function calls with no-ops that return `HIPBLAS_STATUS_NOT_SUPPORTED`. This satisfies the linker and prevents rocBLAS initialization. But `GGML_CUDA_FORCE_MMQ` — which routes quantized matrix ops to GGML's custom HIP kernels — only applies to Q4/Q8 matrices. FP16 and FP32 matrices (the output layer of Mistral-NeMo uses FP32) still call hipBLAS directly. The stubs return NOT_SUPPORTED, GGML treats it as a hard error, and the process aborts.

**The real fix:** Build rocBLAS from source targeting gfx1103.

---

## Phase 5: Building rocBLAS for gfx1103

The build required three dependencies that took more troubleshooting than the build itself:

1. **Tensile version pinning**: The rocBLAS cmake downloads Tensile from the `develop` branch by default, which installs 4.47.0. But rocBLAS 7.2.1 requires exactly 4.45.0 (`find_package(Tensile 4.45.0 EXACT REQUIRED)`). Fix: clone Tensile at the `rocm-7.2.1` tag and pass `Tensile_TEST_LOCAL_PATH` to cmake.

2. **HIP compiler for cmake tests**: The `COMPILER_HAS_TARGET_ID_gfx1103` cmake test uses `check_cxx_compiler_flag` which defaults to the system C++ compiler (g++). g++ has no concept of `--offload-arch=gfx1103`. Fix: set `CXX=/opt/rocm-7.2.1/bin/hipcc`.

3. **msgpackc-cxx**: Tensile's Source library requires the C++ msgpack header library. Not installed by default on SLES 16. Fix: `sudo zypper install -y msgpack-cxx-devel`.

With all dependencies resolved, the build took **17 minutes** generating 2,690 GEMM kernels for gfx1103. The output: `TensileLibrary_lazy_gfx1103.dat`, `Kernels.so-000-gfx1103.hsaco`, and dozens of type-specific kernel files.

Setting `ROCBLAS_TENSILE_LIBPATH` to point at the newly built Tensile library directory instead of the system one resolved the final format-mismatch issue (the system TensileLibrary.dat index and the new librocblas.so need to match versions).

The ROCm server started, loaded all 41 layers to GPU, and ran inference.

---

## Phase 6: The Surprising Result

After all of that, the benchmark:

| Backend | TPS | Notes |
|---------|-----|-------|
| ROCm HIP (built from source) | 2.59 TPS | Tensile fallback kernels, gfx1103 not tuned |
| Vulkan RADV | **6.89 TPS** | Mesa RADV APU-specific optimizations |

Vulkan is **2.7x faster** on the same hardware, same model, same flags.

This outcome is not a failure — it is the actual answer. The Mesa/RADV team has spent years specifically optimizing the Vulkan RDNA3 path for integrated GPU use cases. The Tensile kernels built from source are "fallback" implementations — architecturally correct but not tuned for gfx1103's specific CU configuration, wavefront size, or LPDDR5X bandwidth characteristics. RADV knows things about the 780M that Tensile's generic kernels don't.

The ROCm build was preserved. When AMD ships optimized Tensile kernels for gfx1103 in ROCm 8.x, switching is a one-line change in the service script. The infrastructure is ready.

---

## What This Reveals About the AI Hardware Landscape

The difficulty of this exercise is not a failure of any single component. It reveals a structural gap in the AI hardware ecosystem:

**NVIDIA + CUDA**: Ships ML frameworks out-of-the-box for virtually every GPU sold in the last decade. PyTorch, Ollama, llama.cpp — all work on first install. The "it just works" experience is real.

**Apple Silicon**: Unified memory architecture plus Metal and Core ML frameworks. Models run on Apple hardware with minimal configuration. The unified memory pool means a 16GB M3 Pro can run a 13B model fully in RAM without splitting across CPU/GPU.

**Everyone else**: AMD, Intel, RISC-V, embedded ARM — you are in integration territory. ROCm is powerful and improving rapidly, but its packaging coverage lags behind the hardware it nominally supports. A GPU released in 2023 (gfx1103) missing from ROCm 7.2.x packages released in 2025 is the gap made visible.

This is not a permanent state. AMD's ROCm team is moving fast. RDNA3 APU support is improving. The open-source community (especially Mesa/RADV) often outpaces official vendor tooling — as the Vulkan result demonstrates. But right now, if your hardware is not NVIDIA or Apple Silicon, you should expect integration work.

---

## Why Remote AI Accelerated Everything

Every major decision point in this exercise involved pattern matching across domains that no single engineer holds simultaneously: Linux packaging internals, rocBLAS build system, Tensile's Python-based kernel generator, llama.cpp's cmake structure, hipBLAS linkage semantics, and GPU ISA compatibility. Claude Sonnet 4.6 navigated all of them in sequence, without losing context between steps.

The value is not that the AI knew these answers upfront. It frequently had to search, test, fail, and adjust — just like a human engineer would. The value is **speed and exhaustiveness**. When the hipBLAS stub approach failed, the next approach was identified immediately. When the cmake test failed for a non-obvious reason (wrong compiler), the cmake module source was traced line by line. When the ISA override crashed, the reason was explained at the HSACO kernel execution level.

This is the compound effect of investing in remote AI early: you build better local infrastructure faster, which makes your local inference more capable, which reduces dependence on remote AI for routine tasks. The loop is productive.

---

## Practical Takeaways

**For model selection on constrained hardware:**
- GPU VRAM is the hard ceiling. Budget 10-15% for KV cache on top of model weight size.
- `think:false` is mandatory for all qwen3 API calls — silent empty responses otherwise.
- Prefer `phi4-mini:3.8b` (speed) or `mistral-nemo:12b` (quality) on RDNA3 8GB GPU.
- CPU inference: physical core count matters more than logical. Disable HT via `OLLAMA_NUM_THREAD`.

**For AMD ROCm on APUs (gfx1103, gfx1102):**
- ROCm 7.2.x does not include gfx1103 TensileLibrary in any official package.
- Building from source works but produces fallback kernels only.
- Vulkan RADV currently outperforms ROCm HIP on the 780M — use it.
- Set `GGML_VULKAN_DEVICE=0` and build with `-DGGML_VULKAN=ON`.
- Watch for ROCm 8.x — gfx1103 optimized kernels likely incoming.

**For service deployment:**
- Pin `ROCBLAS_TENSILE_LIBPATH` when using source-built rocBLAS to avoid library/index mismatches.
- ngram-cache speculation (`--spec-type ngram-cache --draft 8`) adds 10-25% throughput on repetitive prompts at zero quality cost.
- KV cache quantization (`--cache-type-k q8_0 --cache-type-v q8_0`) reduces memory pressure significantly.

---

## Final State

```
Local brain (AMD APU laptop, port 11436)
  Binary:  llama.cpp Vulkan RADV
  Model:   mistral-nemo:12b Q4_K_M — 7.1GB, 41/41 layers GPU
  TPS:     6.89 tokens/sec (Radeon 780M gfx1103, RDNA 3)
  vs old:  Gemma-4-26B Vulkan — 5-7 TPS, 16GB, dominated GTT pool

ROCm build preserved — ready for ROCm 8.x upgrade path.
rocBLAS gfx1103 TensileLibrary at build/Tensile/library/
```

---

## The Cost of Getting Here — And the ROI of Starting Remote

This post opened with the claim that remote AI is the best investment you can make in local AI. Here is what that investment actually looked like.

### What a solo engineer would have spent

The exercise spanned six distinct problem domains. Estimating conservatively, an experienced platform engineer working alone would have needed:

| Phase | Solo engineer time |
|-------|--------------------|
| Diagnosing Ollama GPU disable + version gap | 2–3 hours |
| Model selection research (3 machines, 20+ models) | 3–4 hours |
| ROCm cmake setup + Tensile version debugging | 4–6 hours |
| rocBLAS source build + dependency chain | 3–4 hours |
| SEGV/INTERNAL_ERROR root cause + workaround attempts | 4–8 hours |
| Benchmarking, validation, documentation | 2–3 hours |
| **Total** | **18–28 hours** |

At the **2026 US median platform engineer salary of ~$155,000/year** — approximately **$75/hour** fully loaded — that is $1,350 to $2,100 in engineer time. Use the midpoint: **~$1,700**.

The hardest phase — the rocBLAS TensileLibrary gap — is where the estimate is most optimistic. This is a known-unknown: an engineer who has never encountered `gfx1103 not in TensileLibrary.dat` would not know what they were looking for. The error message is cryptic, the packaging gap is not documented anywhere obvious, and the ISA incompatibility between gfx1102 and gfx1103 kernels is not in any README. Realistically, this single issue could absorb a full working week before the root cause is correctly identified.

### What the AI-assisted run actually cost

| Item | Cost |
|------|------|
| Active engineer attention (reviewing, approving, redirecting) | ~4 hours × $75 = **$300** |
| Claude Sonnet 4.6 API usage (~2M input / 500K output tokens) | ~**$13.50** |
| Claude Opus 4.7 (model assessment, inquisitor pass) | ~**$2.50** |
| Gemini 3.5 Flash (model assessment) | ~**$0.50** |
| **Total** | **~$316** |

Total savings versus solo engineering: **~$1,400**, or roughly **82% reduction** in cost for the same outcome.

The more honest framing is not just money. It is **resolution certainty**. A solo engineer might have given up on ROCm after the first SEGV and accepted "Vulkan works, good enough." That would have been a reasonable call, but it would have left the underlying AMD packaging gap undocumented and the source-build path unexplored. The AI did not give up — it tried ISA override, hipBLAS stubbing, cmake modifications, and source builds in sequence, logging why each failed before moving to the next. The result is a complete map of the territory, not just a path through it.

### The compound return

The thesis at the start was: *remote AI today accelerates local AI tomorrow*. After this exercise:

- Three machines are running optimized local inference, correctly tuned for their hardware
- The rocBLAS gfx1103 gap is documented with exact failure modes and workarounds
- The ROCm source build path is ready for a one-line upgrade when ROCm 8.x ships optimized kernels
- This post exists, which means the next person with a Radeon 780M spends hours reading, not days debugging

That documentation value is real and is not captured in the cost calculation. But the AI produced it as a byproduct of the work, not as a separate deliverable.

The initial assumption holds: **the cost of remote AI intelligence is a fraction of the cost of the integration work it compresses**. For hardware that is not NVIDIA or Apple Silicon — which is most hardware, in most budgets, in most datacenters outside hyperscalers — that compression is the difference between a local AI stack that works and one that stays on the shelf.