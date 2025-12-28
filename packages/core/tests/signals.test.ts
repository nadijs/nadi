import { describe, it, expect, vi } from 'vitest';
import { signal, computed, effect, batch, untrack } from '../src/reactive/signals';

describe('Signals', () => {
  describe('signal()', () => {
    it('should create a signal with initial value', () => {
      const count = signal(0);
      expect(count()).toBe(0);
    });

    it('should update signal value', () => {
      const count = signal(0);
      count(5);
      expect(count()).toBe(5);
    });

    it('should return the new value when setting', () => {
      const count = signal(0);
      const result = count(10);
      expect(result).toBe(10);
    });

    it('should not trigger updates if value is equal', () => {
      const count = signal(0);
      const spy = vi.fn();

      effect(() => {
        count();
        spy();
      });

      spy.mockClear();
      count(0); // Same value
      expect(spy).not.toHaveBeenCalled();
    });

    it('should use custom equals function', () => {
      const obj = signal({ count: 0 }, {
        equals: (a, b) => a.count === b.count
      });
      const spy = vi.fn();

      effect(() => {
        obj();
        spy();
      });

      spy.mockClear();
      obj({ count: 0 }); // Different object, same count
      expect(spy).not.toHaveBeenCalled();
    });

    it('should peek without tracking', () => {
      const count = signal(0);
      const spy = vi.fn();

      effect(() => {
        count.peek();
        spy();
      });

      spy.mockClear();
      count(5);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('computed()', () => {
    it('should create computed signal', () => {
      const count = signal(2);
      const doubled = computed(() => count() * 2);

      expect(doubled()).toBe(4);
    });

    it('should update when dependencies change', () => {
      const count = signal(2);
      const doubled = computed(() => count() * 2);

      count(3);
      expect(doubled()).toBe(6);
    });

    it('should handle multiple dependencies', () => {
      const a = signal(2);
      const b = signal(3);
      const sum = computed(() => a() + b());

      expect(sum()).toBe(5);

      a(5);
      expect(sum()).toBe(8);

      b(10);
      expect(sum()).toBe(15);
    });
  });

  describe('effect()', () => {
    it('should run immediately', () => {
      const spy = vi.fn();
      effect(spy);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should run when dependencies change', () => {
      const count = signal(0);
      const spy = vi.fn();

      effect(() => {
        count();
        spy();
      });

      spy.mockClear();
      count(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should track multiple dependencies', () => {
      const a = signal(1);
      const b = signal(2);
      const spy = vi.fn();

      effect(() => {
        a();
        b();
        spy();
      });

      spy.mockClear();
      a(5);
      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockClear();
      b(10);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should support cleanup functions', () => {
      const cleanup = vi.fn();
      const count = signal(0);

      const dispose = effect(() => {
        count();
        return cleanup;
      });

      count(1);
      expect(cleanup).toHaveBeenCalledTimes(1);

      dispose();
      expect(cleanup).toHaveBeenCalledTimes(2);
    });

    it('should dispose properly', () => {
      const count = signal(0);
      const spy = vi.fn();

      const dispose = effect(() => {
        count();
        spy();
      });

      spy.mockClear();
      dispose();

      count(1);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('batch()', () => {
    it('should batch multiple updates', () => {
      const a = signal(1);
      const b = signal(2);
      const spy = vi.fn();

      effect(() => {
        a();
        b();
        spy();
      });

      spy.mockClear();

      batch(() => {
        a(5);
        b(10);
      });

      // Should only run once after batch
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return the batch function result', () => {
      const result = batch(() => 42);
      expect(result).toBe(42);
    });
  });

  describe('untrack()', () => {
    it('should not track dependencies', () => {
      const count = signal(0);
      const spy = vi.fn();

      effect(() => {
        untrack(() => count());
        spy();
      });

      spy.mockClear();
      count(5);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should return the untrack function result', () => {
      const count = signal(42);
      const result = untrack(() => count());
      expect(result).toBe(42);
    });
  });
});
