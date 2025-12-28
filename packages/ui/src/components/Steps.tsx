/** @jsxImportSource @nadi/core */
/**
 * @file Steps.tsx
 * @description Step progress indicator component
 */

import { type JSX, For } from '@nadi/core';

export interface StepItem {
  title: string;
  description?: string;
  icon?: JSX.Element;
}

export interface StepsProps {
  items: StepItem[];
  current: number;
  direction?: 'horizontal' | 'vertical';
  status?: 'waiting' | 'process' | 'finish' | 'error';
  class?: string;
}

export function Steps(props: StepsProps): JSX.Element {
  const getStepStatus = (index: number): string => {
    if (index < props.current) return 'completed';
    if (index === props.current) {
      return props.status === 'error' ? 'error' : 'active';
    }
    return 'waiting';
  };

  return (
    <ol
      data-nadi-component="steps"
      data-nadi-steps
      data-direction={props.direction || 'horizontal'}
      class={props.class}
    >
      <For each={props.items}>
        {(item, index) => {
          const status = getStepStatus(index());
          return (
            <li class="nadi-step" data-status={status}>
              <div class="nadi-step-indicator">
                {status === 'completed' ? '✓' : item.icon || index() + 1}
              </div>
              <div class="nadi-step-content">
                <div class="nadi-step-title">{item.title}</div>
                {item.description && (
                  <div class="nadi-step-description">{item.description}</div>
                )}
              </div>
              <div class="nadi-step-connector" />
            </li>
          );
        }}
      </For>
    </ol>
  );
}
