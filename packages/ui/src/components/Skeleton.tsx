/** @jsxImportSource @nadi/core */
/**
 * @file Skeleton.tsx
 * @description Loading skeleton component
 */

import { type JSX } from '@nadi/core';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  class?: string;
  style?: JSX.CSSProperties | string;
}

export function Skeleton(props: SkeletonProps): JSX.Element {
  const getWidth = () => {
    if (props.width === undefined) {
      return props.variant === 'circular' ? '40px' : '100%';
    }
    return typeof props.width === 'number' ? `${props.width}px` : props.width;
  };

  const getHeight = () => {
    if (props.height === undefined) {
      if (props.variant === 'circular') return '40px';
      if (props.variant === 'text') return '1em';
      return '120px';
    }
    return typeof props.height === 'number' ? `${props.height}px` : props.height;
  };

  const getBorderRadius = () => {
    if (props.variant === 'circular') return '50%';
    if (props.variant === 'rounded') return 'var(--nadi-radius-lg)';
    if (props.variant === 'text') return 'var(--nadi-radius-sm)';
    return 'var(--nadi-radius-base)';
  };

  return (
    <div
      data-nadi-component="skeleton"
      class={props.class}
      style={{
        width: getWidth(),
        height: getHeight(),
        borderRadius: getBorderRadius(),
        background: 'linear-gradient(90deg, var(--nadi-color-gray-200) 25%, var(--nadi-color-gray-100) 50%, var(--nadi-color-gray-200) 75%)',
        backgroundSize: '200% 100%',
        animation: props.animation !== 'none' ? `nadi-skeleton-${props.animation || 'pulse'} 1.5s ease-in-out infinite` : 'none',
        ...(typeof props.style === 'object' ? props.style : {})
      }}
    />
  );
}
