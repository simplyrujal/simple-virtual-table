<script lang="ts">
  import { getContext, setContext, tick } from "svelte";
  import { tableContextKey, tbodyContextKey } from "./context";

  let { children, offsetHeight = 45, ...props } = $props();

  const tableContext = getContext(tableContextKey);
  if (!tableContext) throw new Error("<Tbody> must be used inside <Table>");

  const {
    rowHeight,
    totalData,
    startIndex,
    endIndex,
    contentWidth,
    columnWidths,
    columnCount,
  } = tableContext as any;

  const totalHeight = totalData * offsetHeight;

  let containerRef: HTMLDivElement | null = null;

  // Provide TbodyContext (similar to TbodyContext.Provider in React)
  setContext(tbodyContextKey, {
    get contentWidth() {
      return contentWidth;
    },
    get rowHeight() {
      return rowHeight;
    },
    get columnWidths() {
      return columnWidths;
    },
    get columnCount() {
      return columnCount;
    },
  });

  // Inject rowIndex on Tr elements (similar to React.cloneElement)
  $effect(() => {
    tick().then(() => {
      if (!containerRef) return;

      const trElements = containerRef.querySelectorAll("[data-tr-element]");
      trElements.forEach((el, index) => {
        // Inject rowIndex as absolute index (startIndex + relative index in children)
        el.setAttribute("data-row-index", String(startIndex + index));
      });
    });
  });
</script>

<div
  bind:this={containerRef}
  style="position: relative; height: {totalHeight}px; width: {contentWidth}px; box-sizing: border-box;"
  {...props}
>
  <!-- Spacer for rows before visible range -->
  <div style="height: {startIndex * rowHeight}px;" />

  <!-- Render visible rows (children are rendered here, but we need to inject rowIndex) -->
  {@render children()}

  <!-- Spacer for rows after visible range -->
  <div style="height: {(totalData - endIndex) * rowHeight}px;" />
</div>
