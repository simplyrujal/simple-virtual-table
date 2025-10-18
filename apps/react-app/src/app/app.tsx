import SimpleVirtualTableReactPackage from '@simple-virtual-table/react-package';
import React from 'react';

export function App() {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <SimpleVirtualTableReactPackage
      data={[]}
      columns={[]}
      ref={ref}
      fetchMoreOnBottomReached={(target) => {
        console.log(target);
      }}
    />
  );
}

export default App;
