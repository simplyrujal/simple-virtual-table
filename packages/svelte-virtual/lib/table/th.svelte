<script lang="ts">
  import { getContext, tick } from "svelte";
  import { theadContextKey } from "./context";

  let { children, colIndex, width = 100, ...restProps } = $props();
  let elementRef: HTMLDivElement | null = null;
  let effectiveColIndex = $state(colIndex ?? 0);

  // Ensure Th is used within Thead context - throws error if not wrapped
  const theadContext = getContext(theadContextKey);
  if (!theadContext) {
    throw new Error("Th component must be used inside Thead component");
  }
  const { columnCount } = theadContext as any;

  // Get colIndex from data attribute if not provided as prop
  // This allows Thead to set it via DOM manipulation (similar to React.cloneElement)
  $effect(() => {
    tick().then(() => {
      // Wait for DOM updates so Thead can set the attribute
      if (colIndex !== undefined) {
        effectiveColIndex = colIndex;
      } else if (elementRef) {
        const dataIndex = elementRef.getAttribute("data-col-index");
        if (dataIndex !== null) {
          effectiveColIndex = Number(dataIndex);
        }
      }
    });
  });

  // Set width attribute so Thead can read it
  $effect(() => {
    if (elementRef) {
      elementRef.setAttribute("width", String(width));
      elementRef.setAttribute("data-th-element", "true");
    }
  });
</script>

<div
  bind:this={elementRef}
  style="width: {width}px; border-right: {columnCount > 0 &&
  effectiveColIndex < columnCount - 1
    ? '1px solid #e0e0e0'
    : 'none'}; display: flex; align-items: center; user-select: none; flex-shrink: 0; flex-grow: 0; box-sizing: border-box; text-align: left; padding: 8px 16px; font-weight: 600; font-size: 14px;"
  {...restProps}
>
  {@render children()}
</div>
