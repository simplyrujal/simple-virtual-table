# Simple Virtual Table - React

A declarative, high-performance virtual table component for React with automatic row virtualization.

## Installation

```bash
npm install simple-virtual-table-react
# or
yarn add simple-virtual-table-react
# or
pnpm add simple-virtual-table-react
```

## Quick Start

```tsx
import { Table, Thead, Th, Tbody, Tr, Td } from "simple-virtual-table-react";

const data = [
  { id: 1, name: "John", email: "john@example.com", age: 30 },
  { id: 2, name: "Jane", email: "jane@example.com", age: 25 },
  // ... more rows
];

function MyTable() {
  return (
    <Table totalData={data.length} height={600} width={900} rowHeight={45}>
      <Thead>
        <Th width={100}>ID</Th>
        <Th width={200}>Name</Th>
        <Th width={300}>Email</Th>
        <Th width={100}>Age</Th>
      </Thead>
      <Tbody>
        {data.map((row) => (
          <Tr key={row.id}>
            <Td>{row.id}</Td>
            <Td>{row.name}</Td>
            <Td>{row.email}</Td>
            <Td>{row.age}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
```

## Components

### Table

The root component that provides context to all child components.

**Props:**

| Prop              | Type     | Required | Default  | Description                                   |
| ----------------- | -------- | -------- | -------- | --------------------------------------------- |
| `totalData`       | `number` | Yes      | -        | Total number of rows in the dataset           |
| `height`          | `number` | Yes      | -        | Height of the table container                 |
| `width`           | `number` | No       | `"100%"` | Width of the table container                  |
| `rowHeight`       | `number` | No       | `40`     | Height of each row in pixels                  |
| `overscan`        | `number` | No       | `5`      | Number of rows to render outside visible area |
| `className`       | `string` | No       | `""`     | Additional CSS class for container            |
| `headerClassName` | `string` | No       | `""`     | Additional CSS class for header               |

### Thead

Header container component. Must wrap all `Th` components.

**Props:**

| Prop           | Type     | Required | Default | Description              |
| -------------- | -------- | -------- | ------- | ------------------------ |
| `headerHeight` | `number` | No       | `50`    | Height of the header row |

**Note:**

- `Thead` automatically collects column widths from `Th` children and updates the table context.
- The `headerHeight` prop is optional and defaults to 50px. Typically you can omit this prop and use the default.

### Th

Header cell component. Must be used inside `Thead`.

**Props:**

| Prop       | Type     | Required | Default | Description                   |
| ---------- | -------- | -------- | ------- | ----------------------------- |
| `width`    | `number` | No       | `100`   | Width of the column in pixels |
| `minWidth` | `number` | No       | -       | Minimum width of the column   |
| `maxWidth` | `number` | No       | -       | Maximum width of the column   |

### Tbody

Body container component. Must wrap all `Tr` components.

**Props:**

| Prop           | Type     | Required | Default | Description                                |
| -------------- | -------- | -------- | ------- | ------------------------------------------ |
| `offsetHeight` | `number` | No       | `45`    | Height offset for calculating total height |

**Note:**

- `Tbody` automatically injects `rowIndex` prop to all `Tr` children. The `rowIndex` will be the absolute index in the data array (accounting for virtualization).
- `Tbody` automatically calculates `totalHeight` and `totalWidth` from table context.
- The `offsetHeight` prop is optional and used to calculate the total height (defaults to 45px). Typically you can omit this prop and use defaults.

### Tr

Row component. Must be used inside `Tbody`.

**Props:**

| Prop       | Type     | Required | Default | Description                       |
| ---------- | -------- | -------- | ------- | --------------------------------- |
| `rowIndex` | `number` | No       | -       | Automatically injected by `Tbody` |

**Note:** `Tr` automatically injects `colIndex` prop to all `Td` children.

### Td

Cell component. Must be used inside `Tr`.

**Props:**

| Prop       | Type     | Required | Default | Description                    |
| ---------- | -------- | -------- | ------- | ------------------------------ |
| `colIndex` | `number` | No       | -       | Automatically injected by `Tr` |

## Complete Example

This example demonstrates a virtual table with 10,000 rows, showcasing the performance benefits of virtualization:

```tsx
import { Table, Thead, Th, Tbody, Tr, Td } from "simple-virtual-table-react";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: string;
}

const colors: Record<string, string> = {
  Active: "#51cf66",
  Inactive: "#ffd43b",
  Pending: "#74c0fc",
};

// Generate large dataset
const generateData = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 50),
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Pending",
  }));
};

const data = generateData(10000); // Large dataset to showcase virtualization
function UserTable() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#213547" }}>
        Virtual Table Example
      </h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Showing {data.length.toLocaleString()} rows with virtual scrolling
      </p>
      <Table totalData={data.length} height={600} width={900} rowHeight={45}>
        <Thead>
          <Th width={100}>ID</Th>
          <Th width={100}>Name</Th>
          <Th width={250}>Email</Th>
          <Th width={100}>Age</Th>
          <Th width={100}>Status</Th>
        </Thead>
        <Tbody>
          {data.map((row: User) => {
            const status = row.status;
            return (
              <Tr key={row.id}>
                <Td>
                  <strong>{row.id}</strong>
                </Td>
                <Td>
                  <span style={{ color: "#646cff", fontWeight: 500 }}>
                    {row.name}
                  </span>
                </Td>
                <Td>{row.email}</Td>
                <Td>
                  <span
                    style={{
                      color: row.age > 50 ? "#ff6b6b" : "#51cf66",
                    }}
                  >
                    {row.age}
                  </span>
                </Td>
                <Td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: colors[status] + "20",
                      color: colors[status],
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {status}
                  </span>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}
```

**Performance Note:** Even with 10,000 rows, only ~15-20 DOM nodes (visible rows + overscan) are rendered at any time. The table maintains smooth scrolling and low memory usage regardless of dataset size.

## Virtualization

The table automatically handles row virtualization. Only visible rows (plus overscan rows) are rendered in the DOM, making it performant even with thousands of rows.

**Important:**

- Pass `totalData` (the total number of rows) to the `Table` component
- When mapping over data in `Tbody`, map over the **entire** dataset. The table handles virtualization internally by:
  1. Calculating which rows are visible based on scroll position
  2. Rendering spacers above and below visible rows to maintain correct scroll height
  3. Automatically injecting correct `rowIndex` values to `Tr` components
  4. Only rendering visible rows in the DOM

## Styling

All components accept standard HTML attributes and can be styled via:

- Inline `style` prop
- `className` prop (for container, header, and rows)
- CSS targeting the component classes

## TypeScript Support

Full TypeScript support is included. The `Table` component is generic and accepts a type parameter:

```tsx
<Table<MyDataType> totalData={myData.length} ...>
```

## Component Hierarchy Requirements

- `Th` **must** be used inside `Thead`
- `Tr` **must** be used inside `Tbody`
- `Td` **must** be used inside `Tr`
- `Table` **must** wrap everything

Violating these requirements will throw helpful error messages.

## Notes

- Column widths are defined declaratively via `Th` components
- Row heights are consistent (controlled by `rowHeight` prop)
- The table supports horizontal scrolling when content is wider than container
- Header is sticky and remains visible while scrolling
