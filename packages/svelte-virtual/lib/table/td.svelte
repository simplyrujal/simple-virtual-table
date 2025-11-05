<script lang="ts">
  import { getContext, tick } from "svelte";
  import { tableContextKey } from "./context";

  let { children, colIndex, ...restProps } = $props();
  let elementRef: HTMLDivElement | null = null;

  const tableContext = getContext(tableContextKey);
  if (!tableContext) {
    throw new Error("<Td> must be used inside <Table>");
  }

  const { columnWidths, columnCount } = tableContext as any;

  // colIndex is injected by Tr component via DOM manipulation (similar to React.cloneElement)
  // If it's missing, that's an error condition
  let effectiveColIndex = $state(colIndex ?? -1);

  $effect(() => {
    tick().then(() => {
      if (colIndex !== undefined) {
        effectiveColIndex = colIndex;
      } else if (elementRef) {
        const dataIndex = elementRef.getAttribute("data-col-index");
        if (dataIndex !== null) {
          effectiveColIndex = Number(dataIndex);
        } else {
          throw new Error(
            "Td component must receive colIndex prop. Make sure it's used inside Tr component."
          );
        }
      }
    });
  });

  // Mark this element so Tr can find it
  $effect(() => {
    if (elementRef) {
      elementRef.setAttribute("data-td-element", "true");
    }
  });

  const width = $derived(columnWidths[effectiveColIndex] ?? 100);
</script>

<div
  bind:this={elementRef}
  style="width: {width}px; min-width: 100px; padding: 8px 16px; font-size: 14px; border-right: {columnCount > 0 && effectiveColIndex < columnCount - 1
    ? '1px solid #e0e0e0'
    : 'none'}; display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0; flex-grow: 0; box-sizing: border-box;"
  {...restProps}
>
  {@render children()}
</div>
