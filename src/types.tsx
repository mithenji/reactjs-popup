import React, { ReactNode, CSSProperties } from 'react';

export type EventType = 'hover' | 'click' | 'focus' | 'right-click';
export type PopupPosition =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'center center';

export type PopupActions = {
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
};

export interface ArrowStyle extends CSSProperties {
  top?: string;
  left?: string;
}

export interface PopupProps {
  trigger?: React.ReactElement | ((isOpen: boolean) => React.ReactElement);
  open?: boolean;
  disabled?: boolean;
  nested?: boolean;
  defaultOpen?: boolean;
  on?: EventType | EventType[];
  children: ReactNode | ((close: () => void, isOpen: boolean) => ReactNode);
  position?: PopupPosition | PopupPosition[];
  offsetX?: number;
  offsetY?: number;
  arrow?: boolean;
  modal?: boolean;
  lockScroll?: boolean;
  closeOnDocumentClick?: boolean;
  closeOnEscape?: boolean;
  repositionOnResize?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  onOpen?: (event?: React.SyntheticEvent) => void;
  onClose?: (
    event?: React.SyntheticEvent | KeyboardEvent | TouchEvent | MouseEvent
  ) => void;
  contentStyle?: CSSProperties;
  overlayStyle?: CSSProperties;
  arrowStyle?: ArrowStyle;
  className?: string;
  keepTooltipInside?: boolean | string;
}
