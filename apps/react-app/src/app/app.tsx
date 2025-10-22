import SimpleVirtualTableReactPackage from '@simple-virtual-table/react-package';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

type Person = {
  id: number;
  name: string;
  email: string;
  age: number;
};

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div>{row.original.id}</div>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
];

const data: Person[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  email: `person${i + 1}@example.com`,
  age: 20 + (i % 50),
}));

export function App() {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <h1>Hello world</h1>
      <SimpleVirtualTableReactPackage data={data} columns={columns} ref={ref} />
    </>
  );
}

export default App;
