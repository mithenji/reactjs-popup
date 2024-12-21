import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Suspense,
  HTMLAttributes,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { PopupProps, PopupActions, PopupPosition } from './types';
import {
  useOnEscape,
  useRepositionOnResize,
  useOnClickOutside,
  useTabbing,
  useIsomorphicLayoutEffect,
} from './hooks';

import './index.css';

import styles from './styles';
import calculatePosition from './Utils';

let popupIdCounter = 0;

const getRootPopup = () => {
  let PopupRoot = document.getElementById('popup-root');

  if (PopupRoot === null) {
    PopupRoot = document.createElement('div');
    PopupRoot.setAttribute('id', 'popup-root');
    document.body.appendChild(PopupRoot);
  }

  return PopupRoot;
};

// 添加类型声明
interface TriggerProps {
  'aria-describedby': string;
  ref: React.RefObject<HTMLElement>;
  onClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

interface DivProps extends HTMLAttributes<HTMLDivElement> {}

type PopupChildrenType = React.ReactNode | ((close: () => void, isOpen: boolean) => React.ReactNode);

export const Popup = forwardRef<PopupActions, PopupProps>(
  (
    {
      trigger = null,
      onOpen = () => {},
      onClose = () => {},
      defaultOpen = false,
      open = undefined,
      disabled = false,
      nested = false,
      closeOnDocumentClick = true,
      repositionOnResize = true,
      closeOnEscape = true,
      on = ['click'],
      contentStyle = {},
      arrowStyle = {},
      overlayStyle = {},
      className = '',
      position = 'bottom center',
      modal = false,
      lockScroll = false,
      arrow = true,
      offsetX = 0,
      offsetY = 0,
      mouseEnterDelay = 100,
      mouseLeaveDelay = 100,
      keepTooltipInside = false,
      children: childrenProp,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(open || defaultOpen);
    const triggerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const focusedElBeforeOpen = useRef<Element | null>(null);
    const popupId = useRef<string>(`popup-${++popupIdCounter}`);
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    const isModal = modal ? true : !trigger;
    const timeOut = useRef<any>(0);

    useIsomorphicLayoutEffect(() => {
      if (isOpen) {
        focusedElBeforeOpen.current = document.activeElement;
        setPosition();
        focusContentOnOpen(); // for accessibility
        lockScrolll();
      } else {
        resetScroll();
      }
      return () => {
        clearTimeout(timeOut.current);
      };
    }, [isOpen]);

    // for uncontrolled popup we need to sync isOpen with open prop
    useEffect(() => {
      if (typeof open === 'boolean') {
        if (open) openPopup();
        else closePopup();
      }
    }, [open, disabled]);

    const openPopup = (event?: React.SyntheticEvent) => {
      if (isOpen || disabled) return;
      setIsOpen(true);
      setTimeout(() => onOpen(event), 0);
    };

    const closePopup = (
      event?: React.SyntheticEvent | KeyboardEvent | TouchEvent | MouseEvent
    ) => {
      if (!isOpen || disabled) return;
      setIsOpen(false);
      if (isModal) (focusedElBeforeOpen.current as HTMLElement)?.focus();
      setTimeout(() => onClose(event), 0);
    };

    const togglePopup = (event?: React.SyntheticEvent) => {
      event?.stopPropagation();
      if (!isOpen) openPopup(event);
      else closePopup(event);
    };

    const onMouseEnter = (event?: React.SyntheticEvent) => {
      clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => openPopup(event), mouseEnterDelay);
    };

    const onContextMenu = (event?: React.SyntheticEvent) => {
      event?.preventDefault();
      togglePopup();
    };

    const onMouseLeave = (event?: React.SyntheticEvent) => {
      clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => closePopup(event), mouseLeaveDelay);
    };

    const lockScrolll = () => {
      if (isModal && lockScroll)
        document.getElementsByTagName('body')[0].style.overflow = 'hidden'; // migrate to document.body
    };

    const resetScroll = () => {
      if (isModal && lockScroll)
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
    };
    const focusContentOnOpen = () => {
      const focusableEls = contentRef?.current?.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      );
      const firstEl = focusableEls ? Array.from(focusableEls)[0] as HTMLElement : null;
      firstEl?.focus();
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        openPopup();
      },
      close: () => {
        closePopup();
      },
      toggle: () => {
        togglePopup();
      },
    }));

    // set Position
    const setPosition = () => {
      if (isModal || !isOpen) return;
      if (!triggerRef?.current || !contentRef?.current) return;
      
      const trigger = triggerRef.current.getBoundingClientRect();
      const content = contentRef.current.getBoundingClientRect();
      
      const cords = calculatePosition(
        trigger,
        content,
        position as PopupPosition,
        arrow,
        {
          offsetX,
          offsetY,
        },
        keepTooltipInside
      );
      contentRef.current.style.top = `${cords.top + window.scrollY}px`;
      contentRef.current.style.left = `${cords.left + window.scrollX}px`;
      if (arrow && !!arrowRef.current) {
        arrowRef.current.style.transform = cords.transform;
        arrowRef.current.style.setProperty('-ms-transform', cords.transform);
        arrowRef.current.style.setProperty(
          '-webkit-transform',
          cords.transform
        );
        arrowRef.current.style.top =
          arrowStyle.top?.toString() || cords.arrowTop;
        arrowRef.current.style.left =
          arrowStyle.left?.toString() || cords.arrowLeft;
      }
    };
    // hooks
    useOnEscape(closePopup, closeOnEscape); // can be optimized if we disabled for hover
    useTabbing(contentRef, isOpen && isModal);
    useRepositionOnResize(setPosition, repositionOnResize);
    useOnClickOutside(
      { refs: !!trigger ? [contentRef, triggerRef] : [contentRef], 
        handler: closePopup, 
        enabled: closeOnDocumentClick && !nested }
    );
    // render the trigger element and add events
    const renderTrigger = () => {
      const triggerProps: any = {
        key: 'T',
        ref: triggerRef,
        'aria-describedby': popupId.current,
      };
      const onAsArray = Array.isArray(on) ? on : [on];
      for (let i = 0, len = onAsArray.length; i < len; i++) {
        switch (onAsArray[i]) {
          case 'click':
            triggerProps.onClick = togglePopup;
            break;
          case 'right-click':
            triggerProps.onContextMenu = onContextMenu;
            break;
          case 'hover':
            triggerProps.onMouseEnter = onMouseEnter;
            triggerProps.onMouseLeave = onMouseLeave;
            break;
          case 'focus':
            triggerProps.onFocus = onMouseEnter;
            triggerProps.onBlur = onMouseLeave;
            break;
          default:
        }
      }

      if (typeof trigger === 'function') {
        const comp = trigger(isOpen);
        return comp ? React.cloneElement(comp, triggerProps) : null;
      }

      return trigger ? React.cloneElement(trigger, triggerProps) : null;
    };

    const addWarperAction = () => {
      const popupContentStyle = isModal
        ? styles.popupContent.modal
        : styles.popupContent.tooltip;

      const childrenElementProps: any = {
        className: `popup-content ${
          className !== ''
            ? className
                .split(' ')
                .map(c => `${c}-content`)
                .join(' ')
            : ''
        }`,
        style: {
          ...popupContentStyle,
          ...contentStyle,
          pointerEvents: 'auto', //closeOnDocumentClick && nested ? 'auto' : 'none',
        },
        ref: contentRef,
        onClick: (e: any) => {
          e.stopPropagation();
        },
      };
      if (!modal && on.indexOf('hover') >= 0) {
        childrenElementProps.onMouseEnter = onMouseEnter;
        childrenElementProps.onMouseLeave = onMouseLeave;
      }
      return childrenElementProps;
    };

    const renderContent = useCallback(
      (close: () => void, isOpen: boolean) => {
        return typeof childrenProp === 'function' 
          ? childrenProp(close, isOpen) 
          : childrenProp;
      },
      [childrenProp]
    );

    const overlay = !(on.indexOf('hover') >= 0);
    const ovStyle = isModal ? styles.overlay.modal : styles.overlay.tooltip;

    const renderPopupContent = () => (
      <>
        {overlay && (
          <div
            key="O"
            data-testid="overlay"
            data-popup={isModal ? 'modal' : 'tooltip'}
            className={`popup-overlay ${className ? className.split(' ').map(c => `${c}-overlay`).join(' ') : ''}`}
            style={{
              ...ovStyle,
              ...overlayStyle,
              pointerEvents: (closeOnDocumentClick && nested) || isModal ? 'auto' : 'none',
            }}
            onClick={closeOnDocumentClick && nested ? closePopup : undefined}
            tabIndex={-1}
          >
            {isModal && (
              <div
                {...addWarperAction()}
                key="C"
                role={isModal ? 'dialog' : 'tooltip'}
                id={popupId.current}
              >
                {arrow && !isModal && (
                  <div ref={arrowRef} style={styles.popupArrow}>
                    <svg
                      data-testid="arrow"
                      className={`popup-arrow ${className ? className.split(' ').map(c => `${c}-arrow`).join(' ') : ''}`}
                      viewBox="0 0 32 16"
                      style={{
                        position: 'absolute',
                        ...arrowStyle,
                      }}
                    >
                      <path d="M16 0l16 16H0z" fill="currentcolor" />
                    </svg>
                  </div>
                )}
                {renderContent(closePopup, isOpen)}
              </div>
            )}
          </div>
        )}
        {!isModal && (
          <div
            {...addWarperAction()}
            key="C"
            role={isModal ? 'dialog' : 'tooltip'}
            id={popupId.current}
          >
            {arrow && !isModal && (
              <div ref={arrowRef} style={styles.popupArrow}>
                <svg
                  data-testid="arrow"
                  className={`popup-arrow ${className ? className.split(' ').map(c => `${c}-arrow`).join(' ') : ''}`}
                  viewBox="0 0 32 16"
                  style={{
                    position: 'absolute',
                    ...arrowStyle,
                  }}
                >
                  <path d="M16 0l16 16H0z" fill="currentcolor" />
                </svg>
              </div>
            )}
            {renderContent(closePopup, isOpen)}
          </div>
        )}
      </>
    );

    // 初始化 portal container
    useEffect(() => {
      setPortalContainer(getRootPopup());
    }, []);

    return (
      <Suspense fallback={<div>Loading...</div>}>
        {renderTrigger()}
        {isOpen && portalContainer && createPortal(renderPopupContent(), portalContainer)}
      </Suspense>
    );
  }
);

export default Popup;
