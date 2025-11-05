<script lang="ts">
  import { getContext, setContext, tick } from "svelte";
  import { tbodyContextKey, trContextKey } from "./context";

  let { children, rowIndex, ...restProps } = $props();
  let elementRef: HTMLDivElement | null = null;

  // Ensure Tr is used within Tbody context - throws error if not wrapped
  const tbodyContext = getContext(tbodyContextKey);
  if (!tbodyContext) {
    throw new Error("Tr component must be used inside Tbody component");
  }

  const { contentWidth, rowHeight, columnCount, columnWidths } =
    tbodyContext as any;

  // rowIndex is injected by Tbody component via DOM manipulation (similar to React.cloneElement)
  // If it's missing, that's an error condition
  let effectiveRowIndex = $state(rowIndex ?? -1);

  $effect(() => {
    tick().then(() => {
      if (rowIndex !== undefined) {
        effectiveRowIndex = rowIndex;
      } else if (elementRef) {
        const dataIndex = elementRef.getAttribute("data-row-index");
        if (dataIndex !== null) {
          effectiveRowIndex = Number(dataIndex);
        } else {
          throw new Error(
            "Tr component must receive rowIndex prop. Make sure it's used inside Tbody component."
          );
        }
      }
    });
  });

  // Provide TrContext (similar to TrContext.Provider in React)
  setContext(trContextKey, {
    get columnCount() {
      return columnCount;
    },
    get columnWidths() {
      return columnWidths;
    },
  });

  let trContainerRef: HTMLDivElement | null = null;

  // Inject colIndex on Td elements (similar to React.cloneElement)
  $effect(() => {
    tick().then(() => {
      if (!trContainerRef) return;

      const tdElements = trContainerRef.querySelectorAll("[data-td-element]");
      tdElements.forEach((el, index) => {
        el.setAttribute("data-col-index", String(index));
      });
    });
  });

  // Mark this element so Tbody can find it
  $effect(() => {
    if (elementRef) {
      elementRef.setAttribute("data-tr-element", "true");
    }
  });
</script>

<div
  bind:this={elementRef}
  style="display: flex; width: {contentWidth}px; height: {rowHeight}px; border-bottom: 1px solid #e0e0e0; background-color: {effectiveRowIndex %
    2 ===
  0
    ? '#ffffff'
    : '#fafafa'}; transition: background-color 0.2s; box-sizing: border-box;"
  {...restProps}
>
  <div bind:this={trContainerRef} style="display: contents;">
    {@render children()}
  </div>
</div>
