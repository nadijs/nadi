/** @jsxImportSource @nadi.js/core */
/**
 * @file Rating.tsx
 * @description Star rating component
 */

import { type JSX, For, signal, type Accessor } from '@nadi.js/core';

export interface RatingProps {
  value?: number | Accessor<number>;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

export function Rating(props: RatingProps): JSX.Element {
  const resolveValue = (value: any) => typeof value === 'function' ? value() : value;
  const getValue = () => resolveValue(props.value) || 0;
  const max = props.max || 5;
  const [hoverValue, setHoverValue] = signal<number | null>(null);

  const handleClick = (index: number) => {
    if (!props.readonly) {
      props.onChange?.(index + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!props.readonly) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const isStarFilled = (index: number): boolean => {
    const displayValue = hoverValue() !== null ? hoverValue()! : getValue();
    return displayValue > index;
  };

  const isStarHalf = (index: number): boolean => {
    if (!props.allowHalf) return false;
    const displayValue = hoverValue() !== null ? hoverValue()! : getValue();
    return displayValue > index && displayValue < index + 1;
  };

  return (
    <div
      data-nadi-component="rating"
      data-nadi-rating
      data-readonly={props.readonly || false}
      data-size={props.size || 'md'}
      class={props.class}
      onMouseLeave={handleMouseLeave}
      role={props.readonly ? 'img' : 'radiogroup'}
      aria-label={props.readonly ? `Rating: ${getValue()} out of ${max}` : 'Rate this'}
    >
      <For each={Array.from({ length: max }, (_, i) => i)}>
        {(index) => (
          <span
            class="nadi-rating-star"
            data-filled={isStarFilled(index)}
            data-half={isStarHalf(index)}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            role={props.readonly ? undefined : 'radio'}
            aria-checked={props.readonly ? undefined : getValue() === index + 1}
          >
            ★
          </span>
        )}
      </For>
    </div>
  );
}
