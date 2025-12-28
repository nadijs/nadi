/** @jsxImportSource @nadi.js/core */
/**
 * @file Pagination.tsx
 * @description Pagination component for navigating pages
 */

import { type JSX, For, type Accessor } from '@nadi.js/core';

export interface PaginationProps {
  total: number;
  current: number | Accessor<number>;
  onChange: (page: number) => void;
  pageSize?: number;
  showFirstLast?: boolean;
  siblingCount?: number;
  class?: string;
}

export function Pagination(props: PaginationProps): JSX.Element {
  const resolveValue = (value: any) => typeof value === 'function' ? value() : value;
  const getCurrent = () => resolveValue(props.current);
  const pageSize = props.pageSize || 10;
  const totalPages = Math.ceil(props.total / pageSize);
  const siblingCount = props.siblingCount || 1;

  const getPageNumbers = (): (number | string)[] => {
    const current = getCurrent();
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Calculate range
    const leftSibling = Math.max(2, current - siblingCount);
    const rightSibling = Math.min(totalPages - 1, current + siblingCount);

    // Add left ellipsis
    if (leftSibling > 2) {
      pages.push('left-ellipsis');
    }

    // Add page numbers
    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    // Add right ellipsis
    if (rightSibling < totalPages - 1) {
      pages.push('right-ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      props.onChange(page);
    }
  };

  return (
    <nav aria-label="Pagination" data-nadi-component="pagination" class={props.class}>
      <ul data-nadi-pagination>
        {props.showFirstLast && (
          <li class="nadi-pagination-item">
            <button
              class="nadi-pagination-button"
              onClick={() => handlePageChange(1)}
              disabled={getCurrent() === 1}
              aria-label="First page"
            >
              ««
            </button>
          </li>
        )}

        <li class="nadi-pagination-item">
          <button
            class="nadi-pagination-button"
            onClick={() => handlePageChange(getCurrent() - 1)}
            disabled={getCurrent() === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
        </li>

        <For each={getPageNumbers()}>
          {(page) => (
            <li class="nadi-pagination-item">
              {typeof page === 'string' ? (
                <span class="nadi-pagination-ellipsis">...</span>
              ) : (
                <button
                  class="nadi-pagination-button"
                  data-active={getCurrent() === page}
                  onClick={() => handlePageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={getCurrent() === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </li>
          )}
        </For>

        <li class="nadi-pagination-item">
          <button
            class="nadi-pagination-button"
            onClick={() => handlePageChange(getCurrent() + 1)}
            disabled={getCurrent() === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </li>

        {props.showFirstLast && (
          <li class="nadi-pagination-item">
            <button
              class="nadi-pagination-button"
              onClick={() => handlePageChange(totalPages)}
              disabled={getCurrent() === totalPages}
              aria-label="Last page"
            >
              »»
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
