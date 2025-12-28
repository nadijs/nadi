/** @jsxImportSource @nadi.js/core */
/**
 * @file Timeline.tsx
 * @description Timeline component for displaying events
 */

import { type JSX, For } from '@nadi.js/core';

export interface TimelineItem {
  title: string;
  description?: string;
  time?: string;
  icon?: JSX.Element;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'primary' | 'success' | 'error' | 'neutral';
  class?: string;
}

export function Timeline(props: TimelineProps): JSX.Element {
  return (
    <ul
      data-nadi-component="timeline"
      data-nadi-timeline
      data-variant={props.variant || 'primary'}
      class={props.class}
    >
      <For each={props.items}>
        {(item) => (
          <li class="nadi-timeline-item">
            <div class="nadi-timeline-dot">
              {item.icon}
            </div>
            <div class="nadi-timeline-content">
              <div class="nadi-timeline-title">{item.title}</div>
              {item.description && (
                <div class="nadi-timeline-description">{item.description}</div>
              )}
              {item.time && (
                <div class="nadi-timeline-time">{item.time}</div>
              )}
            </div>
          </li>
        )}
      </For>
    </ul>
  );
}
