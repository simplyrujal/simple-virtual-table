<script lang="ts">
  import { setContext } from "svelte";
  import { tableContextKey } from "./context";

  // ✅ Get props reactively
  let {
    totalData,
    rowHeight = 40,
    height = 400,
    containerStyle = {},
    overscan = 5,
    containerClassName = "",
    children,
  } = $props();

  // ✅ Define internal state (for scroll, etc.)
  let scrollTop = $state<number>(0);
  let columnWidths = $state<number[]>([]);

  const visibleStart = $derived(Math.floor(scrollTop / rowHeight));
  const visibleEnd = $derived(Math.ceil((scrollTop + height) / rowHeight));
  const startIndex = $derived(Math.max(0, visibleStart - overscan));
  const endIndex = $derived(Math.min(totalData, visibleEnd + overscan));

  const contentWidth = $derived(columnWidths.reduce((sum, w) => sum + w, 0));

  const setColumnWidths = (index: number, width: number, colSpan = 1) => {
    const widthPerCol = width / colSpan;
    for (let i = 0; i < colSpan; i++) {
      columnWidths[index + i] = widthPerCol;
    }
  };

  // ✅ Provide all context values
  setContext(tableContextKey, {
    get totalData() {
      return totalData;
    },
    get startIndex() {
      return startIndex;
    },
    get endIndex() {
      return endIndex;
    },
    get rowHeight() {
      return rowHeight;
    },
    get height() {
      return height;
    },
    get overscan() {
      return overscan;
    },
    get scrollTop() {
      return scrollTop;
    },
    get contentWidth() {
      return contentWidth;
    },
    get columnWidths() {
      return columnWidths;
    },
    get columnCount() {
      return columnWidths.length;
    },
    setColumnWidths,
  });

  let scrollElementRef: HTMLDivElement | null = null;

  const handleScroll = (event: Event) => {
    scrollTop = (event.target as HTMLDivElement).scrollTop;
  };
</script>

<div
  bind:this={scrollElementRef}
  class={containerClassName}
  onscroll={handleScroll}
  style:height="{height}px"
  style:width="fit-content"
  style:max-width="100%"
  style:overflow="auto"
  style:position="relative"
  style:border="1px solid"
  style:border-radius="4px"
  style={Object.entries(containerStyle)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}
>
  {@render children()}
</div>
