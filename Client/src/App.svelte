<script lang="ts">
  import AddButton from "./components/AddButton.svelte";
  import RaidList from "./components/RaidList.svelte";
  import RaidMenu from "./components/RaidMenu.svelte";
  import AppBar from "./components/AppBar.svelte";
  import { RaidCodeStore } from "./stores";
  import { onDestroy, onMount } from "svelte/internal";
  import { SignalRController } from "./services/signalRController";
  import type { Raid } from "./interfaces/RaidCode";
import { SelectedRaidsKey } from "./constants/localStorageKeys";

  let controller: SignalRController;
  let raidList: Raid[] = new Array<Raid>();
  let store: RaidCodeStore;

  const addRaidToLocalStorage = (raid: Raid) => {
    const raids: Raid[] = JSON.parse(localStorage.getItem(SelectedRaidsKey) || "[]");
    raids.push(raid);
    localStorage.setItem(SelectedRaidsKey, JSON.stringify(raids));
  };

  const removeRaidToLocalStorage = (raid: Raid) => {
    const raids: Raid[] = JSON.parse(localStorage.getItem(SelectedRaidsKey) || "[]");
    const index = raids.findIndex((r) => r.id === raid.id);

    if (index > -1) {
      raids.splice(index, 1);
      localStorage.setItem(SelectedRaidsKey, JSON.stringify(raids));
    }
  };

  onMount(async () => {
    // connect to backend
    controller = new SignalRController();
    await controller.start();
    store = new RaidCodeStore(controller);
    await store.populateRaidCodeLists();

    // get stored raids
    raidList = JSON.parse(localStorage.getItem(SelectedRaidsKey) || "[]");
  });

  onDestroy(async () => {
    await controller.stop();
  });

  let open = false;

  const handleNewRaid = (event: any) => {
    let raid = event.detail.raid as Raid;
    if (raidList.find(r => r.id === raid.id) === undefined)
    {
      raidList = [...raidList, raid];
      addRaidToLocalStorage(raid);
    }
  };

  const handleRemovedRaid = async (raid: Raid) => {
    await store.unsubscribeToRaid(raid.id);
    raidList = raidList.filter((r) => r.englishName !== raid.englishName);
    removeRaidToLocalStorage(raid);
  };
</script>

<link
  rel="stylesheet"
  href="/build//smui.css"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="stylesheet"
  href="/build/smui-dark.css"
  media="screen and (prefers-color-scheme: dark)"
/>

<AddButton on:click={() => (open = true)} />
<RaidMenu
  {open}
  on:close={() => (open = false)}
  on:raid-selected={handleNewRaid}
/>
<AppBar />
<div id="wrapper">
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

<style lang="scss" global>
  @use './global.scss';

  body, html {
    overflow: hidden;
  }
  .raids {
    display: flex;
    height: 100%;
    width: 100%;
    overflow-x: scroll;
    overflow-y: scroll;
    padding: 0.25em;
  }
  #wrapper {
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    display: flex;
    height: 100%;
    width: 100%;
    overflow-x: scroll;
    margin: 1em 0 1em 1em;
  }

  #wrapper::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
</style>
