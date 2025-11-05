<script lang="ts">
  import { getContext, setContext, tick } from "svelte";
  import { tableContextKey, theadContextKey } from "./context";

  const tableContext = getContext(tableContextKey);
  if (!tableContext) throw new Error("<Thead> must be used inside <Table>");

  let { children, headerHeight = 50, ...props } = $props();

  const { contentWidth, setColumnWidths, columnCount } = tableContext as any;

  let containerRef: HTMLDivElement | null = null;

  // Extract widths from Th children and update table context
  // Similar to React's useLayoutEffect
  $effect(() => {
    tick().then(() => {
      // Wait for DOM updates
      if (!containerRef) return;

      const widths: number[] = [];
      const thElements = containerRef.querySelectorAll("[data-th-element]");

      thElements.forEach((el, index) => {
        const width = Number(el.getAttribute("width")) || 100;
        widths.push(width);
        // Set colIndex on each child element (similar to React.cloneElement)
        el.setAttribute("data-col-index", String(index));
      });

      if (widths.length > 0) {
        setColumnWidths(widths);
      }
    });
  });

  // Provide TheadContext (similar to TheadContext.Provider in React)
  setContext(theadContextKey, {
    get columnCount() {
      return columnCount;
    },
  });
</script>

<div
  bind:this={containerRef}
  data-thead-container
  style="position: sticky; top: 0; z-index: 10; display: flex; height: {headerHeight}px; width: {contentWidth}px; box-sizing: border-box; background-color: #f5f5f5; border-bottom: 2px solid #ddd;"
  {...props}
>
  {@render children()}
</div>
