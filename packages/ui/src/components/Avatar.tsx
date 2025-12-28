/** @jsxImportSource @nadi.js/core */
/**
 * @file Avatar.tsx
 * @description User avatar component
 */

import { type JSX, signal } from '@nadi.js/core';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  badge?: JSX.Element;
  fallback?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties | string;
}

export function Avatar(props: AvatarProps): JSX.Element {
  const [imageLoaded, setImageLoaded] = signal(false);
  const [imageError, setImageError] = signal(false);

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const showImage = props.src && imageLoaded() && !imageError();
  const showInitials = props.name && !showImage;

  return (
    <div
      data-nadi-component="avatar"
      data-nadi-avatar
      data-size={props.size || 'md'}
      class={props.class}
      style={props.style}
    >
      {props.src && !imageError() && (
        <img
          src={props.src}
          alt={props.alt || props.name || 'Avatar'}
          class="nadi-avatar-image"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ display: showImage ? 'block' : 'none' }}
        />
      )}

      {showInitials && getInitials(props.name!)}

      {!showImage && !showInitials && props.fallback}

      {props.badge && (
        <div class="nadi-avatar-badge">
          {props.badge}
        </div>
      )}
    </div>
  );
}
