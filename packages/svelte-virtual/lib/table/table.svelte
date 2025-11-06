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

  const setColumnWidths = (index: number, width: number) => {
    columnWidths[index] = width;
  };

  // ✅ Provide all context values
  setContext(tableContextKey, {
    get totalData() {
      return totalData;
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
    get startIndex() {
      return startIndex;
    },
    get endIndex() {
      return endIndex;
    },
    get columnCount() {
      return columnWidths.length;
    },
    setColumnWidths,
  });

  let scrollElementRef: HTMLDivElement | null = null;

  $effect(() => {
    const updateWidth = () => {
      if (scrollElementRef && contentWidth > 0) {
        // Get the container's current width (which is 100% initially)
        // We need to get the parent's width or the actual rendered width
        const container = scrollElementRef;
        // Temporarily ensure width is 100% to get accurate measurement
        container.style.width = "100%";
        // Use requestAnimationFrame to ensure layout has updated
        requestAnimationFrame(() => {
          if (scrollElementRef) {
            const containerWidth = scrollElementRef.clientWidth;
            if (contentWidth > containerWidth) {
              scrollElementRef.style.width = "100%";
            } else {
              scrollElementRef.style.width = "fit-content";
            }
          }
        });
      }
    };
    updateWidth();

    // Handle window resize
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  });

  const handleScroll = (event: Event) => {
    scrollTop = (event.target as HTMLDivElement).scrollTop;
  };
</script>

<div
  bind:this={scrollElementRef}
  class={containerClassName}
  style={`height: ${height}px !important; position: relative !important; width: 100%; overflow: auto; border: 1px solid; border-radius: 4px !important; ${containerStyle}`}
  onscroll={handleScroll}
>
  {@render children()}
</div>
