# OMAWSL

Adapt Omarchy to WSL for developer tooling.

## Prerequisites

- Fork github.com/basecamp/omarchy
  - Needed to adapt the install scripts
- Install WSL with BTRFS: https://github.com/artiga033/WSL/releases/tag/feature-release%2Fcustom-root-fs%402.6.3
  - Run: `wsl --uninstall`: This will only remove current WSL version without a change in the distros or config
  - Run: `Add-AppxPackage -AllowUnsigned .\Microsoft.WSL_2.6.3.1_x64_ARM64.msixbundle`
- Install official Archlinux for WSL: `wsl --install --distribution archlinux --name omawsl --fs-type btrfs --fs-mount-options compress=zstd,subvol=@,ssd,discard`
- Install required packages:

```bash
pacman -Syu

pacman -S git sudo vim
```

- Create a user: `useradd -m -s /bin/bash -G wheel omauser`
- Reset password: `passwd omauser`
- Set the default user:

```bash
vim /etc/wsl.conf

# Insert here
[user]
default = omauser

[boot]
systemd = true
```

- Exit, stop the distro and enter again:

````powershell
wsl --terminate omawsl

wsl -d omawsl
````

## Understanding the installation

Omarchy is split in different "phases" with potentially sub-layers, with the `install.sh` script calling the "Layer 1":

```bash
...
# Install
source "$OMARCHY_INSTALL/helpers/all.sh"
source "$OMARCHY_INSTALL/preflight/all.sh"
source "$OMARCHY_INSTALL/packaging/all.sh"
source "$OMARCHY_INSTALL/config/all.sh"
source "$OMARCHY_INSTALL/login/all.sh"
source "$OMARCHY_INSTALL/post-install/all.sh"
```

This current install process will fail on WSL due to customization to boot loader (which WSL doesn't need/use). And as this is an installation, the correct decision to set strict checks, makes the install fail on any error.

While keeping this mindset, we still need to adapt the script to the platform itself, so below we'll deep dive into the 6 "Layer 1" scripts and see what they need to be adapted (if anything).

### Set the environment

With Archlinux installed, the user created and set by default, the basic packages installed, let's create the default environment to start:

````bash
git clone https://github.com/nunix/omarchy $HOME/.local/share/omarchy

cd $HOME/.local/share/omarchy
````

:::note To the future me

This repo has different branches, and all the changes described here will "only" go to the `wsl` branch. The `master` branch will keep being an unaltered version of Omarchy repo.

:::

Last task before we can start, is to create a "parallel" route for WSL scripts. This will allow to keep the modularity and see exactly where the differences are between bare metal and WSL:

````bash
cp ./install.sh ./install-wsl.sh

vim ./install-wsl.sh

#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -eEo pipefail

# Define Omarchy locations
export OMARCHY_PATH="$HOME/.local/share/omarchy"
export OMARCHY_INSTALL="$OMARCHY_PATH/install"
export OMARCHY_INSTALL_LOG_FILE="/var/log/omarchy-install.log"
export PATH="$OMARCHY_PATH/bin:$PATH"

# Install
echo "[Layer 1] Running Helpers"
source "$OMARCHY_INSTALL/helpers/all.sh"
# echo "[Layer 1] Running Preflight"
#source "$OMARCHY_INSTALL/preflight/all.sh"
# echo "[Layer 1] Running Packaging"
#source "$OMARCHY_INSTALL/packaging/all.sh"
# echo "[Layer 1] Running Config"
#source "$OMARCHY_INSTALL/config/all.sh"
# echo "[Layer 1] Running Login"
#source "$OMARCHY_INSTALL/login/all.sh"
# echo "[Layer 1] Running Post Install"
#source "$OMARCHY_INSTALL/post-install/all.sh"
````

:::tip Environment variables

To keep the logic and not forget about the environment variables, the script is kept as is, initially, and the "Layer 1" script calls are commented, except for the first one.

:::

Each section, if required, will be tested and modified as follow:

1. Test "Layer 1" script as is
2. On error, go to "Layer 1" script directory, and run "Layer 2" scripts individually
3. For scripts failing, make a copy as `[script name]-wsl.sh` and adapt it
   1. If the whole script fails, copy the "Layer 2" script the same way, and remove the line of the failing script
   2. Update the "Layer 1" script to call the "Layer 2" WSL script
4. The results will be visible in a table so we can keep a visual track. A note will be given to provide an idea of the efforts needed to adapt the script. This is really just for fun and only based on my own knowledge or if AI needed to be involved. 5 points less per extra test, and 20 points if AI is involved, with 5 points again per test if it doesn't fix it on first try.

### Helpers

The first "Layer 1" script is, as it names states, a series of scripts helping with the installation process itself. From the logo displayed, to the logging, these scripts do not interfere with the installation itself.

List of the "Layer 2" scripts:

````bash
source $OMARCHY_INSTALL/helpers/chroot.sh
source $OMARCHY_INSTALL/helpers/presentation.sh
source $OMARCHY_INSTALL/helpers/errors.sh
source $OMARCHY_INSTALL/helpers/logging.sh
````

Let's run the "Layer 1" script:

````bash
### Current install state
cat ./install-wsl.sh
...
# Install
echo "[Layer 1] Running Helpers"
source "$OMARCHY_INSTALL/helpers/all.sh"
# echo "[Layer 1] Running Preflight"
#source "$OMARCHY_INSTALL/preflight/all.sh"
# echo "[Layer 1] Running Packaging"
#source "$OMARCHY_INSTALL/packaging/all.sh"
# echo "[Layer 1] Running Config"
#source "$OMARCHY_INSTALL/config/all.sh"
# echo "[Layer 1] Running Login"
#source "$OMARCHY_INSTALL/login/all.sh"
# echo "[Layer 1] Running Post Install"
#source "$OMARCHY_INSTALL/post-install/all.sh"

### Run the script
source ./install-wsl.sh
````

#### Results

The scripts ran without any error:

| Layer 1 script | Runs | ai prompts | grade |
| -------------- | ---- | ---------- | ----- |
| Helpers        | 1    | 0          | 100   |
| Preflight      | -    | -          | -     |
| Packaging      | -    | -          | -     |
| Config         | -    | -          | -     |
| Login          | -    | -          | -     |
| Post Install   | -    | -          | -     |

As expected, this script was straight-forward and fully compatible with WSL.

### Preflight

The second "Layer 1" script contains the system checks like type of Arch distro used, filesystem type and if Secure Boot is disabled. This section might already come to challenge the compatibility grade, so let's see how it goes.

List of the "Layer 2" scripts:

````bash
source $OMARCHY_INSTALL/preflight/guard.sh
source $OMARCHY_INSTALL/preflight/begin.sh
run_logged $OMARCHY_INSTALL/preflight/show-env.sh
run_logged $OMARCHY_INSTALL/preflight/pacman.sh
run_logged $OMARCHY_INSTALL/preflight/migrations.sh
run_logged $OMARCHY_INSTALL/preflight/first-run-mode.sh
run_logged $OMARCHY_INSTALL/preflight/disable-mkinitcpio.sh
````

Let's run the "Layer 1" script:

````bash
### Current install state
cat ./install-wsl.sh
...
# Install
echo "[Layer 1] Running Helpers"
source "$OMARCHY_INSTALL/helpers/all.sh"
echo "[Layer 1] Running Preflight"
source "$OMARCHY_INSTALL/preflight/all.sh"
# echo "[Layer 1] Running Packaging"
#source "$OMARCHY_INSTALL/packaging/all.sh"
# echo "[Layer 1] Running Config"
#source "$OMARCHY_INSTALL/config/all.sh"
# echo "[Layer 1] Running Login"
#source "$OMARCHY_INSTALL/login/all.sh"
# echo "[Layer 1] Running Post Install"
#source "$OMARCHY_INSTALL/post-install/all.sh"

### Run the script
source ./install-wsl.sh
````

#### Errors

The first run directly shows an issue with Limine bootloader. This is expected as WSL doesn't use a Linux bootloader for the distros.

Luckily for us, the script related to the bootloader is clearly identified: `disable-mkinitcpio.sh`. So we need to bypass it, by commenting the line in the "Layer 2" script:

````bash
vim ./install/preflight/all.sh

source $OMARCHY_INSTALL/preflight/guard.sh
source $OMARCHY_INSTALL/preflight/begin.sh
run_logged $OMARCHY_INSTALL/preflight/show-env.sh
run_logged $OMARCHY_INSTALL/preflight/pacman.sh
run_logged $OMARCHY_INSTALL/preflight/migrations.sh
run_logged $OMARCHY_INSTALL/preflight/first-run-mode.sh
#run_logged $OMARCHY_INSTALL/preflight/disable-mkinitcpio.sh
````

The second run shows again the warning and the cause is due to the "Layer 2" script `guard.sh` that checks if `limine` command exists. We have to bypass it by commenting the line near the end:

````bash
vim ./install/preflight/guard.sh

...
# Must have limine installed
#command -v limine &>/dev/null || abort "Limine bootloader"

# Must have btrfs root filesystem
[ "$(findmnt -n -o FSTYPE /)" = "btrfs" ] || abort "Btrfs root filesystem" 

# Cleared all guards
echo "Guards: OK"
````

After the second run, the script prompt keeps showing the logs. This is due to a loop not closing (yet) or a bug with one of the "Layer 2" scripts.

Going through every "Layer 2" script, allows to confirm each one works, and the script at fault is `begin.sh` which displays the installation status by reading the log file. As the installation is being done step by step, this script can be commented for now, and it will be reactivated once the whole process works:

```bash
# Final status of the Preflight main script
source $OMARCHY_INSTALL/preflight/guard.sh
#source $OMARCHY_INSTALL/preflight/begin.sh
run_logged $OMARCHY_INSTALL/preflight/show-env.sh
run_logged $OMARCHY_INSTALL/preflight/pacman.sh
run_logged $OMARCHY_INSTALL/preflight/migrations.sh
run_logged $OMARCHY_INSTALL/preflight/first-run-mode.sh
#run_logged $OMARCHY_INSTALL/preflight/disable-mkinitcpio.sh
```

:::important UPDATE

As described in Packaging's Errors, the "Layer 2" script `preflight/pacman.sh` contains a condition that doesn't apply to the local tests. So it needs to be temporarily disabled:

````bash
vim ./install/preflight/pacman.sh

#if [[ -n ${OMARCHY_ONLINE_INSTALL:-} ]]; then
  # Install build tools
  sudo pacman -S --needed --noconfirm base-devel

  # Configure pacman
  if [[ ${OMARCHY_MIRROR:-} == "edge" ]] ; then
    sudo cp -f ~/.local/share/omarchy/default/pacman/pacman-edge.conf /etc/pacman.conf
    sudo cp -f ~/.local/share/omarchy/default/pacman/mirrorlist-edge /etc/pacman.d/mirrorlist
  else
    sudo cp -f ~/.local/share/omarchy/default/pacman/pacman-stable.conf /etc/pacman.conf
    sudo cp -f ~/.local/share/omarchy/default/pacman/mirrorlist-stable /etc/pacman.d/mirrorlist
  fi

  sudo pacman-key --recv-keys 40DFB630FF42BCFFB047046CF0134EE680CAC571 --keyserver keys.openpgp.org
  sudo pacman-key --lsign-key 40DFB630FF42BCFFB047046CF0134EE680CAC571

  sudo pacman -Sy
  sudo pacman -S --noconfirm --needed omarchy-keyring


  # Refresh all repos
  sudo pacman -Syyu --noconfirm
#fi
````

:::

#### Results

Due to the different runs to confirm all the "Layer 2" scripts, this "Layer 1" script is a bit impact:

| Layer 1 script | Runs | ai prompts | grade |
| -------------- | ---- | ---------- | ----- |
| Helpers        | 1    | 0          | 100   |
| Preflight      | 6    | 0          | 70    |
| Packaging      | -    | -          | -     |
| Config         | -    | -          | -     |
| Login          | -    | -          | -     |
| Post Install   | -    | -          | -     |

This part behaved also as expected, due to the potential low-system checks such as the bootloader. This is great to see the difference between bare metal installation and WSL, but it's also very meaningful to understand how much WSL evolved over the years and the compatibility is still very high.

### Packaging

The third "Layer 1" script contains the base packages needed by Omarchy, alongside with some visuals like fonts and icons.

:::tip

This guide is based on Omarchy v3, and still contains all DHH omakase choices for applications. However, starting Omarchy v4, a minimal base will be available, and this section might be more lightweight.

Still, if wanted, the list of the base packages can be modified in the file `./install/omarchy-base.packages`

:::

List of the "Layer 2" scripts:

````bash
run_logged $OMARCHY_INSTALL/packaging/base.sh
run_logged $OMARCHY_INSTALL/packaging/fonts.sh
run_logged $OMARCHY_INSTALL/packaging/nvim.sh
run_logged $OMARCHY_INSTALL/packaging/icons.sh
run_logged $OMARCHY_INSTALL/packaging/webapps.sh
run_logged $OMARCHY_INSTALL/packaging/tuis.sh
````

Let's run the "Layer 1" script:

````bash
### Current install state
cat ./install-wsl.sh
...
# Install
echo "[Layer 1] Running Helpers"
source "$OMARCHY_INSTALL/helpers/all.sh"
echo "[Layer 1] Running Preflight"
source "$OMARCHY_INSTALL/preflight/all.sh"
echo "[Layer 1] Running Packaging"
source "$OMARCHY_INSTALL/packaging/all.sh"
# echo "[Layer 1] Running Config"
#source "$OMARCHY_INSTALL/config/all.sh"
# echo "[Layer 1] Running Login"
#source "$OMARCHY_INSTALL/login/all.sh"
# echo "[Layer 1] Running Post Install"
#source "$OMARCHY_INSTALL/post-install/all.sh"

### Run the script
source ./install-wsl.sh
````

#### Errors

The first run helped understand an error was "invisible" from the previous section. The issue comes from the check in "Layer 2" script `preflight/pacman.sh`. 

The second run was successful, or if we apply the logic from the previous run, nothing at this stage throw an error.

:::note Ghostty Terminfo error

Due to the different runs, the error `ghostty-terminfo: /usr/share/terminfo/g/ghostty exists in filesystem (owned by ncurses)` appeared. A quick and dirty solution was to remove the Ghostty entry from Terminfo: `sudo rm /usr/share/terminfo/g/ghostty`.

However, when running Omarchy install only once, this issue doesn't appear.

:::

#### Results

Only two runs were needed, showcasing the applications high compatibility in WSL:

| Layer 1 script | Runs | ai prompts | grade |
| -------------- | ---- | ---------- | ----- |
| Helpers        | 1    | 0          | 100   |
| Preflight      | 6    | 0          | 70    |
| Packaging      | 2    | 0          | 95    |
| Config         | -    | -          | -     |
| Login          | -    | -          | -     |
| Post Install   | -    | -          | -     |

This section confirms once again that when it comes to applications installation, WSL behaves exactly like bare metal. The error was due to the a previous script.

### Config

The fourth "Layer 1" script focus on the system configuration, targeting the OS and Hardware layers.

By default, we can already disable all the Hardware related scripts, as it will not be applicable to WSL. And for the OS related configurations, we can disable the low-level one, such as power profiles.

List of the "Layer 2" scripts with the disabled ones for reference:

````bash
run_logged $OMARCHY_INSTALL/config/config.sh
run_logged $OMARCHY_INSTALL/config/theme.sh
run_logged $OMARCHY_INSTALL/config/branding.sh
run_logged $OMARCHY_INSTALL/config/git.sh
run_logged $OMARCHY_INSTALL/config/gpg.sh
run_logged $OMARCHY_INSTALL/config/timezones.sh
#run_logged $OMARCHY_INSTALL/config/increase-sudo-tries.sh
#run_logged $OMARCHY_INSTALL/config/increase-lockout-limit.sh
run_logged $OMARCHY_INSTALL/config/ssh-flakiness.sh
#run_logged $OMARCHY_INSTALL/config/detect-keyboard-layout.sh
#run_logged $OMARCHY_INSTALL/config/xcompose.sh
run_logged $OMARCHY_INSTALL/config/mise-work.sh
#run_logged $OMARCHY_INSTALL/config/fix-powerprofilesctl-shebang.sh
run_logged $OMARCHY_INSTALL/config/docker.sh
run_logged $OMARCHY_INSTALL/config/mimetypes.sh
run_logged $OMARCHY_INSTALL/config/localdb.sh
#run_logged $OMARCHY_INSTALL/config/walker-elephant.sh
#run_logged $OMARCHY_INSTALL/config/fast-shutdown.sh
#run_logged $OMARCHY_INSTALL/config/sudoless-asdcontrol.sh
#run_logged $OMARCHY_INSTALL/config/input-group.sh
run_logged $OMARCHY_INSTALL/config/omarchy-ai-skill.sh
run_logged $OMARCHY_INSTALL/config/hardware/network.sh
#run_logged $OMARCHY_INSTALL/config/hardware/set-wireless-regdom.sh
#run_logged $OMARCHY_INSTALL/config/hardware/fix-fkeys.sh
#run_logged $OMARCHY_INSTALL/config/hardware/bluetooth.sh
#run_logged $OMARCHY_INSTALL/config/hardware/printer.sh
#run_logged $OMARCHY_INSTALL/config/hardware/usb-autosuspend.sh
#run_logged $OMARCHY_INSTALL/config/hardware/ignore-power-button.sh
run_logged $OMARCHY_INSTALL/config/hardware/nvidia.sh
run_logged $OMARCHY_INSTALL/config/hardware/intel.sh
#run_logged $OMARCHY_INSTALL/config/hardware/fix-f13-amd-audio-input.sh
#run_logged $OMARCHY_INSTALL/config/hardware/fix-bcm43xx.sh
#run_logged $OMARCHY_INSTALL/config/hardware/fix-apple-spi-keyboard.sh
#run_logged $OMARCHY_INSTALL/config/hardware/fix-apple-suspend-nvme.sh
#run_logged $OMARCHY_INSTALL/config/hardware/fix-apple-t2.sh
#run_logged $OMARCHY_INSTALL/config/hardware/fix-surface-keyboard.sh
````

Let's run the "Layer 1" script:

````bash
### Current install state
cat ./install-wsl.sh
...
# Install
echo "[Layer 1] Running Helpers"
source "$OMARCHY_INSTALL/helpers/all.sh"
echo "[Layer 1] Running Preflight"
source "$OMARCHY_INSTALL/preflight/all.sh"
echo "[Layer 1] Running Packaging"
source "$OMARCHY_INSTALL/packaging/all.sh"
echo "[Layer 1] Running Config"
source "$OMARCHY_INSTALL/config/all.sh"
# echo "[Layer 1] Running Login"
#source "$OMARCHY_INSTALL/login/all.sh"
# echo "[Layer 1] Running Post Install"
#source "$OMARCHY_INSTALL/post-install/all.sh"

### Run the script
source ./install-wsl.sh
````

#### Results

With the WSL understanding, specifically for the Hardware layer, we only need one run:

| Layer 1 script | Runs | ai prompts | grade |
| -------------- | ---- | ---------- | ----- |
| Helpers        | 1    | 0          | 100   |
| Preflight      | 6    | 0          | 70    |
| Packaging      | 2    | 0          | 95    |
| Config         | 1    | 0          | 100   |
| Login          | -    | -          | -     |
| Post Install   | -    | -          | -     |

This section can seem as a perfect run, however understanding the main differences between WSL, which is a microVM, and bare metal hardware profiles, is key.

### Login

The fifth "Layer 1" script configures the Login related applications. However this is not applicable to WSL, as the graphical environment is loaded **after** WSL is loaded and the user already logged in (from the console, think SSH).

The "Layer 1" script remains unchanged:

````bash
### Current install state
cat ./install-wsl.sh
...
# Install
echo "[Layer 1] Running Helpers"
source "$OMARCHY_INSTALL/helpers/all.sh"
echo "[Layer 1] Running Preflight"
source "$OMARCHY_INSTALL/preflight/all.sh"
echo "[Layer 1] Running Packaging"
source "$OMARCHY_INSTALL/packaging/all.sh"
echo "[Layer 1] Running Config"
source "$OMARCHY_INSTALL/config/all.sh"
# echo "[Layer 1] Running Login"
#source "$OMARCHY_INSTALL/login/all.sh"
# echo "[Layer 1] Running Post Install"
#source "$OMARCHY_INSTALL/post-install/all.sh"

### Run the script
source ./install-wsl.sh
````

#### Results

This section is not applicable to WSL:

| Layer 1 script | Runs | ai prompts | grade |
| -------------- | ---- | ---------- | ----- |
| Helpers        | 1    | 0          | 100   |
| Preflight      | 6    | 0          | 70    |
| Packaging      | 2    | 0          | 95    |
| Config         | 1    | 0          | 100   |
| Login          | 0    | 0          | 0     |
| Post Install   | -    | -          | -     |

When a configuration or scripts are not applicable to WSL, it demonstrates the limitation of certain workflows, or projects, which require a full-blown Linux installation.

### Post Install

The sixth and last "Layer 1" script finalizes the installation. 

There's only three "Layer 2" scripts, and one of them is not applicable to WSL as it targets the shutdown function.

List of the "Layer 2" scripts with the disabled one for reference:

````bash
run_logged $OMARCHY_INSTALL/post-install/pacman.sh
#source $OMARCHY_INSTALL/post-install/allow-reboot.sh
source $OMARCHY_INSTALL/post-install/finished.sh
````

Let's run the "Layer 1" script:

````bash
### Current install state
cat ./install-wsl.sh
...
# Install
echo "[Layer 1] Running Helpers"
source "$OMARCHY_INSTALL/helpers/all.sh"
echo "[Layer 1] Running Preflight"
source "$OMARCHY_INSTALL/preflight/all.sh"
echo "[Layer 1] Running Packaging"
source "$OMARCHY_INSTALL/packaging/all.sh"
echo "[Layer 1] Running Config"
source "$OMARCHY_INSTALL/config/all.sh"
# echo "[Layer 1] Running Login"
#source "$OMARCHY_INSTALL/login/all.sh"
echo "[Layer 1] Running Post Install"
source "$OMARCHY_INSTALL/post-install/all.sh"

### Run the script
source ./install-wsl.sh
````

#### Results

With the WSL understanding, specifically for the Hardware layer, we only need one run:

| Layer 1 script | Runs | ai prompts | grade |
| -------------- | ---- | ---------- | ----- |
| Helpers        | 1    | 0          | 100   |
| Preflight      | 6    | 0          | 70    |
| Packaging      | 2    | 0          | 95    |
| Config         | 1    | 0          | 100   |
| Login          | -    | -          | -     |
| Post Install   | -    | -          | -     |

This section can seem as a perfect run, however understanding the main differences between WSL, which is a microVM, and bare metal hardware profiles, is key.