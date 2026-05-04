<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { tableContextKey, theadContextKey } from "./context";

  const tableContext = getContext(tableContextKey);
  if (!tableContext) throw new Error("<Thead> must be used inside <Table>");

  let { children, headerHeight = 50, style = "", ...props } = $props();

  const { columnCount, setColumnWidths } = tableContext as any;

  // Provide TheadContext (similar to TheadContext.Provider in React)
  let colCounter = $state(0);

  setContext(theadContextKey, {
    get columnCount() {
      return tableContext.columnCount;
    },
    get columnWidths() {
      return tableContext.columnWidths;
    },
    setColumnWidths,
    getNextColIndex(colSpan = 1) {
      const index = colCounter;
      colCounter += colSpan;
      return index;
    },
  });

  $effect(() => {
    colCounter = 0;
  });
</script>

<!-- svelte-ignore state_referenced_locally -->
{ (colCounter = 0, "") }
<div
  data-thead-container
  style="position: sticky; top: 0; z-index: 10; display: flex; height: {headerHeight}px; width: {tableContext.contentWidth}px; box-sizing: border-box; {style}"
  {...props}
>
  {@render children()}
</div>
