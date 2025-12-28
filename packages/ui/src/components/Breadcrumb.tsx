/** @jsxImportSource @nadi/core */
/**
 * @file Breadcrumb.tsx
 * @description Navigation breadcrumb component
 */

import { type JSX, For } from '@nadi/core';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string | JSX.Element;
  class?: string;
}

export function Breadcrumb(props: BreadcrumbProps): JSX.Element {
  const separator = props.separator || '/';
  const itemsLength = props.items.length;

  return (
    <nav aria-label="Breadcrumb" data-nadi-component="breadcrumb" data-nadi-breadcrumb class={props.class}>
      <For each={props.items}>
        {(item, index) => {
          const isLast = index() === itemsLength - 1;

          return (
            <div class="nadi-breadcrumb-item">
              {isLast ? (
                <span class="nadi-breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  {item.href ? (
                    <a href={item.href} class="nadi-breadcrumb-link">
                      {item.label}
                    </a>
                  ) : (
                    <span class="nadi-breadcrumb-link" onClick={item.onClick}>
                      {item.label}
                    </span>
                  )}
                  <span class="nadi-breadcrumb-separator" aria-hidden="true">
                    {separator}
                  </span>
                </>
              )}
            </div>
          );
        }}
      </For>
    </nav>
  );
}
