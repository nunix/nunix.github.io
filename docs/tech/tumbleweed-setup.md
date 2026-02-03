---
title: Tumbleweed System Initialization
sidebar_label: 🦎 Tumbleweed Setup
slug: /
---

## Repository Sync
Use the following commands to sync with the Tumbleweed rolling mirrors.

<Tabs groupId="package-manager">
  <TabItem value="zypper" label="Zypper (CLI)">
    ```bash
    sudo zypper ref && sudo zypper dup
    ```
  </TabItem>
  <TabItem value="opi" label="OPI (OBS)">
    ```bash
    # For community packages
    opi packagename
    ```
  </TabItem>
</Tabs>

:::info[Rolling Release]
Ensure you are using `dup` (dist-upgrade) rather than `up` to stay on the rolling edge.
:::