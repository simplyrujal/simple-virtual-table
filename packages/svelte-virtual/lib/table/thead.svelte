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
  style:position="sticky"
  style:top="0"
  style:z-index="10"
  style:display="flex"
  style:height="{headerHeight}px"
  style:width="{tableContext.contentWidth}px"
  style:box-sizing="border-box"
  style:background-color="#f5f5f5"
  style:border-bottom="2px solid #ddd"
  style={style}
  {...props}
>
  {@render children()}
</div>
