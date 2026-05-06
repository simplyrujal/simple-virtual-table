<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { tableContextKey, tbodyContextKey, trContextKey } from "./context";

  let { children, rowIndex: propRowIndex, style = "", ...restProps } = $props();
  let elementRef = $state<HTMLDivElement | null>(null);

  const tableContext = getContext(tableContextKey) as any;
  const tbodyContext = getContext(tbodyContextKey) as any;
  if (!tbodyContext) {
    throw new Error("Tr component must be used inside Tbody component");
  }

  // svelte-ignore state_referenced_locally
  const rowIndex = propRowIndex !== undefined ? propRowIndex : tbodyContext.getNextRowIndex();

  const isVisible = $derived(
    rowIndex >= tableContext.startIndex && rowIndex < tableContext.endIndex
  );

  let colCounter = $state(0);

  setContext(trContextKey, {
    get columnCount() {
      return tbodyContext.columnCount;
    },
    get columnWidths() {
      return tbodyContext.columnWidths;
    },
    get rowHeight() {
      return tbodyContext.rowHeight;
    },
    getNextColIndex(colSpan = 1, rowSpan = 1) {
      // Skip cells that are occupied by rowSpans from above
      while (tbodyContext.isOccupied(rowIndex, colCounter)) {
        colCounter++;
      }
      
      const index = colCounter;
      
      // Register this cell's span so subsequent rows/cells know about it
      tbodyContext.registerSpan(rowIndex, index, rowSpan, colSpan);
      
      colCounter += colSpan;
      return index;
    },
  });
</script>

{#if isVisible}
  <!-- svelte-ignore state_referenced_locally -->
  {(colCounter = 0), ""}
  <div
    bind:this={elementRef}
    style:position="relative"
    style:display="flex"
    style:width="{tbodyContext.contentWidth}px"
    style:height="{tbodyContext.rowHeight}px"
    style:border-bottom="1px solid #e0e0e0"
    style:background-color={rowIndex % 2 === 0 ? "#ffffff" : "#fafafa"}
    style:transition="background-color 0.2s"
    style:box-sizing="border-box"
    style={style}
    {...restProps}
  >
    {@render children()}
  </div>
{/if}
