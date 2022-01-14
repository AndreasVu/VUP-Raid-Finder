<script lang="ts">
  import AddButton from "./components/AddButton.svelte";
  import RaidList from "./components/RaidList.svelte";
  import RaidMenu from "./components/RaidMenu.svelte";
  import AppBar from "./components/AppBar.svelte";
  import { RaidCodeStore } from "./stores";
  import { onMount } from "svelte/internal";
  import { SignalRController } from "./services/signalRController";
  import type { Raid } from "./interfaces/RaidCode";

  let controller: SignalRController;
  let raidList: Raid[] = new Array<Raid>();
  let store: RaidCodeStore;

  onMount(async () => {
    controller = new SignalRController();
    await controller.start();
    store = new RaidCodeStore(controller);
    await store.populateRaidCodeLists();
  });

  let open = false;

  const handleNewRaid = (event: any) => {
    raidList = [...raidList, event.detail.raid];
  };

  const handleRemovedRaid = async (raid: Raid) => {
    await store.unsubscribeToRaid(raid.id);
    raidList = raidList.filter((r) => r.englishName !== raid.englishName);
  };
</script>

<AddButton on:click={() => (open = true)} />
<RaidMenu
  {open}
  on:close={() => (open = false)}
  on:raid-selected={handleNewRaid}
/>
<AppBar />
<div class="raids">
  {#each raidList as raid}
    {#await store.subscribeToRaid(raid.id) then subscriber}
      <RaidList
        {subscriber}
        {raid}
        on:removed={async () => {
          await handleRemovedRaid(raid);
        }}
      />
    {/await}
  {/each}
</div>

<style lang="scss">
  .raids {
    display: flex;
    height: 100%;
    width: 100%;
    overflow-x: scroll;
    overflow-y: scroll;
    padding: 0.25em;
  }
</style>
