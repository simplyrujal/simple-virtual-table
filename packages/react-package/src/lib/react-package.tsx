import { ColumnDef } from '@tanstack/react-table';
import TableProvider from '../provider/table-provider';
import DataTable from './data-table';
interface IProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  ref: React.RefObject<HTMLDivElement>;
  fetchMoreOnBottomReached: (target: HTMLDivElement) => void;
}

function SimpleVirtualTableReactPackage<T>(props: IProps<T>) {
  return (
    <TableProvider>
      <DataTable {...props} />
    </TableProvider>
  );
}

export default SimpleVirtualTableReactPackage;
