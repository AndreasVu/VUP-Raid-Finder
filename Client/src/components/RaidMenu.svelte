<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Dialog, { Title, Content } from "@smui/dialog";
  import Tab, { Label } from "@smui/tab";
  import TabBar from "@smui/tab-bar";
  import RaidSelector from "./RaidSelector.svelte";
  import Options from "./Options.svelte";
  import type { Raid } from "../interfaces/RaidCode";

  export let open: boolean;

  const dispatch = createEventDispatcher();
  const closeHandler = () => dispatch("close");
  let active = "Select Raid";
</script>

<Dialog bind:open on:MDCDialog:closed={closeHandler}>
  <Content>
    <TabBar tabs={["Select Raid", "Options"]} let:tab bind:active>
      <Tab {tab}>
        <Label>{tab}</Label>
      </Tab>
    </TabBar>

    {#if active === "Select Raid"}
      <RaidSelector on:raid-selected />
    {:else}
      <Options />
    {/if}
  </Content>
</Dialog>

<style lang="scss">
</style>
