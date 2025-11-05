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
  let scrollTop = $state(0);
  let contentWidth = $state(800);
  let columnWidths = $state([150, 150, 150]);
  let startIndex = $state(0);
  let endIndex = $state(totalData);

  const setColumnWidths = (newWidths) => (columnWidths = newWidths);

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
</script>

<div>
  {@render children()}
</div>
