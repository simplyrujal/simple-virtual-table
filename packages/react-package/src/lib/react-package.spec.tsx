import { render } from '@testing-library/react';

import SimpleVirtualTableReactPackage from './react-package';

describe('SimpleVirtualTableReactPackage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SimpleVirtualTableReactPackage />);
    expect(baseElement).toBeTruthy();
  });
});
