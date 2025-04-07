import { Link, type LinkProps } from 'react-router-dom';

import { useWindowsStyle } from '@/shared/hooks';

export function RouteLink({ style, children, ...props }: LinkProps) {
  const windowsStyle = useWindowsStyle();

  return (
    <Link style={{ ...windowsStyle, ...style }} {...props}>
      {children}
    </Link>
  );
}
