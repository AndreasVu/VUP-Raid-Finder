<script lang="ts">
  import Card, { Content, Media, MediaContent } from "@smui/card";
  import List, { Item, Separator, Text } from "@smui/list";
  import IconButton, { Icon } from "@smui/icon-button";
  import RaidEntry from "./RaidEntry.svelte";
  import Ripple from "@smui/ripple";
  import Snackbar, { Label, Actions } from "@smui/snackbar";
  import type { Raid, RaidCode } from "../interfaces/RaidCode";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import type { Writable } from "svelte/store";

  let selected: string;
  let idSnackbar;
  let raidCodes = new Array<RaidCode>();
  let dispatch = createEventDispatcher();
  let timeout: NodeJS.Timeout;

  export let subscriber: Writable<RaidCode[]>;
  export let raid: Raid;

  onMount(async () => {
    subscriber.subscribe((newRaidCodes) => {
      raidCodes = newRaidCodes;
    });
  });

  const copyLatestCode = () => {
    const raidCode = raidCodes.find((r) => !r.isUsed);
    raidCode.isUsed = true;
    navigator.clipboard.writeText(raidCode.code);
    selected = raidCode.code;
    showSnakcbar();
  };

  const copyCode = (raidCode: RaidCode) => {
    raidCode.isUsed = true;
    navigator.clipboard.writeText(raidCode.code);
    selected = raidCode.code;
    showSnakcbar();
  };

  const showSnakcbar = () => {
    clearTimeout(timeout);
    idSnackbar.close();
    idSnackbar.open();
    timeout = setTimeout(() => {
      idSnackbar.close();
    }, 1500);
  };

  const handleRemove = () => {
    dispatch("removed");
  };

  onDestroy(() => {});
</script>

<div>
  <Card class="card">
    <div>
      <span class="mdc-typography--headline4">{raid.englishName}</span>
      <IconButton class="material-icons" size="button">more_vert</IconButton>
    </div>
    <Separator />
    <div class="list">
      {#each raidCodes as raidCode}
        <Item class="padding" on:click={() => copyCode(raidCode)}>
          <RaidEntry {raidCode} />
        </Item>
      {/each}
    </div>
    <div class="buttons">
      <div
        class="mdc-typography--headline5 copy mdc-elevation--z1"
        use:Ripple={{ surface: true, color: "primary" }}
        on:click={copyLatestCode}
      >
        COPY LATEST
      </div>
      <div
        class="mdc-typography--headline5 remove mdc-elevation--z1"
        use:Ripple={{ surface: true, color: "warning" }}
        on:click={() => handleRemove()}
      >
        REMOVE
      </div>
    </div>
  </Card>
</div>

<Snackbar bind:this={idSnackbar} timeoutMs={4000}>
  <Label>Raid code: {selected} copied</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style lang="scss">
  .card-container {
  }

  .card {
    width: 20em;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    margin: 0 0.25em;
  }

  .list {
    flex-basis: 100%;
    overflow-y: scroll;
  }

  .raid-name {
    background: rgba($color: #000000, $alpha: 0.3);
    color: white;
    width: 100%;
    height: 100%;
  }

  .raid-name span {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0.25em;
  }

  .buttons {
    display: grid;
    justify-content: center;
    align-content: center;

    grid-auto-flow: row;
    gap: 0.5em;
  }

  .copy {
    text-align: center;
    height: 5em;
    line-height: 5em;
    width: 100%;
    align-self: center;
    justify-self: center;
  }

  .remove {
    width: 20em;
    text-align: center;
    align-self: center;
    justify-self: center;
  }
</style>
