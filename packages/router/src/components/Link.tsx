import type { JSX } from '@nadi.js/core';
import { useRouter } from '../hooks';

export interface LinkProps {
  to: string;
  class?: string;
  activeClass?: string;
  children?: JSX.Element | JSX.Element[] | string;
  replace?: boolean;
  prefetch?: boolean;
  onClick?: (e: MouseEvent) => void;
}

/**
 * Link component for client-side navigation
 */
export function Link(props: LinkProps): JSX.Element {
  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    // Allow default behavior for modified clicks
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
      return;
    }

    // Prevent default link behavior
    e.preventDefault();

    // Call custom onClick if provided
    if (props.onClick) {
      props.onClick(e);
    }

    // Navigate
    if (props.replace) {
      router.replace(props.to);
    } else {
      router.push(props.to);
    }
  };

  const isActive = () => {
    const currentPath = router.currentRoute.path;
    return currentPath === props.to;
  };

  const getClassName = () => {
    let className = props.class || '';
    if (isActive() && props.activeClass) {
      className += ' ' + props.activeClass;
    }
    return className;
  };

  return (
    <a
      href={props.to}
      class={getClassName()}
      onClick={handleClick}
    >
      {props.children}
    </a>
  );
}
