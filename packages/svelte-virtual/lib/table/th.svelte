<script lang="ts">
  import { getContext, tick } from "svelte";
  import { theadContextKey } from "./context";

  let { children, colIndex, width = 100, ...restProps } = $props();

  // Ensure Th is used within Thead context - throws error if not wrapped
  const theadContext = getContext(theadContextKey);
  if (!theadContext) {
    throw new Error("Th component must be used inside Thead component");
  }
  const { columnCount, setColumnWidths } = theadContext as any;

  $effect(() => {
    tick().then(() => {
      setColumnWidths(colIndex, width);
    });
  });
</script>

<div
  style="width: {width}px; box-sizing: border-box; background-color: #f5f5f5; border-bottom: 2px solid #ddd; border-right: {columnCount >
    0 && colIndex < columnCount - 1
    ? '1px solid #e0e0e0'
    : 'none'}; display: flex; align-items: center; user-select: none; flex-shrink: 0; flex-grow: 0; box-sizing: border-box; text-align: left; padding: 8px 16px; font-weight: 600; font-size: 14px;"
  {...restProps}
>
  {@render children()}
</div>
