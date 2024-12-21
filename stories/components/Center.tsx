import React, { ReactNode, CSSProperties } from 'react';

interface CenterProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const Center = ({ children, style }: CenterProps) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      ...style
    }}
  >
    {children}
  </div>
);

Center.displayName = 'Center';
