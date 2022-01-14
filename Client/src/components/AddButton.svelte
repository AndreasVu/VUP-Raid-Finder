<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Fab, { Icon } from "@smui/fab";
  const onClick = () => dispatch("click");

  const dispatch = createEventDispatcher();
</script>

<div>
  <Fab on:click={onClick} color="primary">
    <Icon class="material-icons">add</Icon>
  </Fab>
</div>

<style>
  div {
    position: absolute;
    bottom: 0;
    right: 0;
    padding-right: 0.5em;
    padding-bottom: 0.5em;
    z-index: 100;
  }
</style>
