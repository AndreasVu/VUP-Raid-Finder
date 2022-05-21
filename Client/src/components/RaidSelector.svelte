<script lang="ts">
  import Textfield from "@smui/textfield";
  import { createEventDispatcher, onMount } from "svelte";
  import type { Raid } from "../interfaces/RaidCode";
  import { getRaids } from "../stores";
  import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";

  const dispatch = createEventDispatcher();
  let searchTerm = "";
  let raids: Raid[] = [];
  let categories: string[] = [];

  function handleClick(raid: Raid) {
    dispatch("raid-selected", {
      raid: raid,
    });
  }

  onMount(async () => {
    raids = await getRaids();
    let categories = raids.map((raid) => raid.category);
    categories = [...new Set(categories)];
  });
</script>

<div>
  <h3>Select a raid</h3>
  <Textfield bind:value={searchTerm} label="search" />
  <pre class="status">{searchTerm}</pre>

  <Accordion>
    {#each categories as category}
      {category}
      <Panel>
        <Header>{category}</Header>
        <Content>
          <ul>
            {#each raids as raid}
              {#if raid.category == category}
                <li>
                  <a href="#" on:click={() => handleClick(raid)}>
                    {raid.englishName}
                  </a>
                </li>
              {/if}
            {/each}
          </ul>
        </Content>
      </Panel>
    {/each}
  </Accordion>
</div>

<style></style>
