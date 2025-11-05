<script>
  import { getContext } from "svelte";
  import { tableContextKey } from "./context";
  let { children } = $props();

  const table = getContext(tableContextKey);
  if (!table) throw new Error("<Tbody> must be used inside <Table>");
</script>

<div>
  {@render children()}
</div>
