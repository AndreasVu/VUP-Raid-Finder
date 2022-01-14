<script lang="ts">
  import Textfield from "@smui/textfield";
  import { createEventDispatcher, onMount } from "svelte";
  import type { Raid } from "../interfaces/RaidCode";
  import { getRaids } from "../stores";

  const dispatch = createEventDispatcher();
  let searchTerm = "";

  function handleClick(raid: Raid) {
    dispatch("raid-selected", {
      raid: raid,
    });
  }
</script>

<div>
  <h3>Select a raid</h3>
  <Textfield bind:value={searchTerm} label="search" />
  <pre class="status">{searchTerm}</pre>

  {#await getRaids() then raids}
    {#each raids as raid}
      <button on:click={() => handleClick(raid)}>
        {raid.englishName}
      </button>
    {/each}
  {/await}
</div>

<style></style>
