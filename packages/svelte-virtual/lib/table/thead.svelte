<script>
  import { getContext } from "svelte";
  import { tableContextKey } from "./context";

  const table = getContext(tableContextKey);
  if (!table) throw new Error("<Thead> must be used inside <Table>");
  let { children } = $props();
</script>

<div>
  {@render children()}
</div>
