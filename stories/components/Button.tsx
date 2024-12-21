import React, { forwardRef, ButtonHTMLAttributes } from 'react';

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ children = 'click Me ', ...props }, ref) => (
  <button
    ref={ref}
    {...props}
    style={{ 
      padding: '10px', 
      margin: '10px',
      cursor: 'pointer',
      backgroundColor: 'beige',
      border: '2px dashed grey',
      fontSize: '20px'
    }}
  >
    {children}
  </button>
));

Button.displayName = 'Button';
