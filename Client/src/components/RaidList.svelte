<script lang="ts">
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from "@smui/card";
  import List, { Item, Separator, Text } from "@smui/list";
  import RaidEntry from "./RaidEntry.svelte";
  import Ripple from "@smui/ripple";
  import Snackbar, { Label, Actions } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";
  import type { Raid, RaidCode } from "../interfaces/RaidCode";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { RaidCodeStore } from "../stores";
  import type { Writable } from "svelte/store";
  let selected: string;
  let idSnackbar;
  let raidCodes = new Array<RaidCode>();

  let dispatch = createEventDispatcher();

  export let subscriber: Writable<RaidCode[]>;
  export let raid: Raid;

  onMount(async () => {
    console.log("Subscriber: ", subscriber);
    subscriber.subscribe((newRaidCodes) => {
      console.log("new raid");
      raidCodes = newRaidCodes;
    });
  });

  const handleClick = () => {
    selected = raidCodes.at(0).code;
    idSnackbar.open();
    setTimeout(() => {
      idSnackbar.close();
    }, 1500);
  };

  const handleRemove = () => {
    dispatch("removed");
  };

  onDestroy(() => {});
</script>

<Card class="card">
  <Media class="card-media-16x9 background" aspectRatio="16x9">
    <MediaContent>
      <div class="raid-name">
        <span class="mdc-typography--headline4">{raid.englishName}</span>
      </div>
    </MediaContent>
  </Media>
  <Content class="column">
    <List>
      {#each raidCodes as raidCode}
        <Item class="padding" on:click={handleClick}>
          <RaidEntry raid={raidCode} />
        </Item>
        <Separator />
      {/each}
    </List>
  </Content>
  <div class="buttons">
    <div
      class="mdc-typography--headline5 copy mdc-elevation--z1"
      use:Ripple={{ surface: true, color: "primary" }}
      on:click={handleClick}
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
<Snackbar bind:this={idSnackbar} timeoutMs={4000}>
  <Label>Raid code: {selected} copied</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style lang="scss">
  :global(.background) {
    background-image: url(https://gbf.wiki/images/2/28/Lucilius_ImpossibleHard_twitter.jpg);
    background-size: cover;
    height: 5em;
  }

  :global(.card) {
    width: 20em;
    min-width: 20em;
    height: 100%;
    overflow-x: hidden;
    margin: 0 0.25em;
  }

  :global(.raid-name) {
    background: rgba($color: #000000, $alpha: 0.3);
    color: white;
    width: 100%;
    height: 100%;
  }

  :global(.raid-name span) {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0.25em;
  }

  :global(.column) {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
  }

  :global(.padding) {
    margin: 0.2em;
  }

  :global(.clicked) {
    background-color: #00b0ff;
  }

  :global(.buttons) {
    display: grid;
    justify-content: center;
    align-content: center;

    grid-auto-flow: row;
    gap: 0.5em;
  }

  :global(.copy) {
    text-align: center;
    height: 5em;
    line-height: 5em;
    width: 20em;
    align-self: center;
    justify-self: center;
  }

  :global(.remove) {
    text-align: center;
    width: 20em;
    align-self: center;
    justify-self: center;
  }
</style>
