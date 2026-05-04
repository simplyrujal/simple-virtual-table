<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { tbodyContextKey, trContextKey } from "./context";

  let { children, rowIndex, style = "", ...restProps } = $props();
  let elementRef: HTMLDivElement | null = null;

  const tbodyContext = getContext(tbodyContextKey) as any;
  if (!tbodyContext) {
    throw new Error("Tr component must be used inside Tbody component");
  }

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

<!-- svelte-ignore state_referenced_locally -->
{(colCounter = 0), ""}
<div
  bind:this={elementRef}
  style="position: relative; display: flex; width: {tbodyContext.contentWidth}px; height: {tbodyContext.rowHeight}px; border-bottom: 1px solid #e0e0e0; background-color: {rowIndex % 2 === 0 ? '#ffffff' : '#fafafa'}; transition: background-color 0.2s; box-sizing: border-box; {style}"
  {...restProps}
>
  {@render children()}
</div>
