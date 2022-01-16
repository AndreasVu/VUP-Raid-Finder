<script lang="ts">
import { onDestroy, onMount } from "svelte";

  import type { RaidCode } from "../interfaces/RaidCode";

  export let raid: RaidCode;
  let timerId;
  let tweetTime = new Date(raid.tweetedAt);
  let timeElapsed: number;


  onMount(() => {
    timeElapsed = Math.floor(
      (new Date().getTime() - tweetTime.getTime()) / 1000
    );

    timerId = setInterval(() => {
      timeElapsed = Math.floor(
        (new Date().getTime() - tweetTime.getTime()) / 1000
      );
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(timerId);
  });
</script>

<div class="container">
  <div class="mdc-typography--headline6">
    {raid.code}
  </div>

  <div class="mdc-typography--subtitle1">{timeElapsed}s</div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 0.4em;
  }
</style>
