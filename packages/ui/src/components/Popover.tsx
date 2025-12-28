/** @jsxImportSource @nadi/core */
/**
 * @file Popover.tsx
 * @description Popover component for contextual information
 */

import { type JSX, signal, effect, onCleanup } from '@nadi/core';

export interface PopoverProps {
  trigger: JSX.Element;
  content: JSX.Element;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  triggerMode?: 'click' | 'hover';
  arrow?: boolean;
  class?: string;
}

export function Popover(props: PopoverProps): JSX.Element {
  const [isOpen, setIsOpen] = signal(false);
  let wrapperRef: HTMLDivElement | undefined;

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef && !wrapperRef.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  effect(() => {
    if (isOpen() && props.triggerMode === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
      onCleanup(() => {
        document.removeEventListener('mousedown', handleClickOutside);
      });
    }
  });

  const handleTriggerClick = () => {
    if (props.triggerMode !== 'hover') {
      setIsOpen(!isOpen());
    }
  };

  const handleMouseEnter = () => {
    if (props.triggerMode === 'hover') {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (props.triggerMode === 'hover') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={(el) => (wrapperRef = el)}
      data-nadi-component="popover"
      class={`nadi-popover-wrapper ${props.class || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={handleTriggerClick}>
        {props.trigger}
      </div>

      {isOpen() && (
        <div
          class="nadi-popover-content"
          data-placement={props.placement || 'bottom'}
          role="dialog"
          aria-modal="false"
        >
          {props.arrow !== false && <div class="nadi-popover-arrow" />}
          {props.content}
        </div>
      )}
    </div>
  );
}
