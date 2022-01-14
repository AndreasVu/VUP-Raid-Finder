<script lang="ts">
  import type { RaidCode } from "../interfaces/RaidCode";

  export let raid: RaidCode;
</script>

<div class="container">
  <div class="mdc-typography--headline6">
    {raid.code}
  </div>

  <div class="mdc-typography--subtitle1">0s</div>
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
