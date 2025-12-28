import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRouter } from '../src/router';
import type { RouteDefinition } from '../src/types';

describe('Router', () => {
  let routes: RouteDefinition[];

  beforeEach(() => {
    // Reset history
    window.history.replaceState(null, '', '/');

    routes = [
      {
        path: '/',
        name: 'home',
        meta: { title: 'Home' },
      },
      {
        path: '/about',
        name: 'about',
      },
      {
        path: '/users/:id',
        name: 'user',
      },
      {
        path: '/admin',
        name: 'admin',
        children: [
          {
            path: '/admin/dashboard',
            name: 'admin-dashboard',
          },
        ],
      },
    ];
  });

  describe('Route Matching', () => {
    it('should match root route', () => {
      const router = createRouter({ routes });
      expect(router.currentRoute.path).toBe('/');
      expect(router.currentRoute.name).toBe('home');
    });

    it('should match static routes', async () => {
      const router = createRouter({ routes });
      await router.push('/about');
      expect(router.currentRoute.path).toBe('/about');
      expect(router.currentRoute.name).toBe('about');
    });

    it('should match dynamic routes with parameters', async () => {
      const router = createRouter({ routes });
      await router.push('/users/123');
      expect(router.currentRoute.path).toBe('/users/123');
      expect(router.currentRoute.params.id).toBe('123');
    });

    it('should match nested routes', async () => {
      const router = createRouter({ routes });
      await router.push('/admin/dashboard');
      expect(router.currentRoute.path).toBe('/admin/dashboard');
      expect(router.currentRoute.name).toBe('admin-dashboard');
    });
  });

  describe('Navigation', () => {
    it('should navigate using push', async () => {
      const router = createRouter({ routes });
      await router.push('/about');
      expect(router.currentRoute.path).toBe('/about');
      expect(window.location.pathname).toBe('/about');
    });

    it('should navigate using replace', async () => {
      const router = createRouter({ routes });
      await router.replace('/about');
      expect(router.currentRoute.path).toBe('/about');
    });

    it('should handle back navigation', () => {
      const router = createRouter({ routes });
      const backSpy = vi.spyOn(window.history, 'back');
      router.back();
      expect(backSpy).toHaveBeenCalled();
    });

    it('should handle forward navigation', () => {
      const router = createRouter({ routes });
      const forwardSpy = vi.spyOn(window.history, 'forward');
      router.forward();
      expect(forwardSpy).toHaveBeenCalled();
    });

    it('should handle go navigation', () => {
      const router = createRouter({ routes });
      const goSpy = vi.spyOn(window.history, 'go');
      router.go(-2);
      expect(goSpy).toHaveBeenCalledWith(-2);
    });
  });

  describe('Navigation Guards', () => {
    it('should call global beforeEach guard', async () => {
      const beforeEach = vi.fn(() => true);
      const router = createRouter({ routes, beforeEach });

      await router.push('/about');
      expect(beforeEach).toHaveBeenCalled();
    });

    it('should cancel navigation when guard returns false', async () => {
      const beforeEach = vi.fn(() => false);
      const router = createRouter({ routes, beforeEach });

      await router.push('/about');
      expect(router.currentRoute.path).toBe('/');
    });

    it('should redirect when guard returns string', async () => {
      const beforeEach = vi.fn((to) => {
        if (to.path === '/admin') {
          return '/';
        }
        return true;
      });
      const router = createRouter({ routes, beforeEach });

      await router.push('/admin');
      expect(router.currentRoute.path).toBe('/');
    });

    it('should call route-specific beforeEnter guard', async () => {
      const beforeEnter = vi.fn(() => true);
      if (routes[1]) {
        routes[1].beforeEnter = beforeEnter;
      }

      const router = createRouter({ routes });
      await router.push('/about');

      expect(beforeEnter).toHaveBeenCalled();
    });

    it('should call afterEach hook', async () => {
      const afterEach = vi.fn();
      const router = createRouter({ routes, afterEach });

      await router.push('/about');
      expect(afterEach).toHaveBeenCalled();
    });
  });

  describe('Query Parameters', () => {
    it('should parse query parameters', async () => {
      const router = createRouter({ routes });
      await router.push('/about?tab=profile&page=2');

      expect(router.currentRoute.query.tab).toBe('profile');
      expect(router.currentRoute.query.page).toBe('2');
    });
  });

  describe('Hash', () => {
    it('should parse hash', async () => {
      const router = createRouter({ routes });
      await router.push('/about#section');

      expect(router.currentRoute.hash).toBe('#section');
    });
  });

  describe('Guard Registration', () => {
    it('should register and unregister beforeEach guard', async () => {
      const router = createRouter({ routes });
      const guard = vi.fn(() => true);

      const unregister = router.beforeEach(guard);
      await router.push('/about');
      expect(guard).toHaveBeenCalledTimes(1);

      unregister();
      await router.push('/');
      expect(guard).toHaveBeenCalledTimes(1);
    });

    it('should register and unregister afterEach hook', async () => {
      const router = createRouter({ routes });
      const hook = vi.fn();

      const unregister = router.afterEach(hook);
      await router.push('/about');
      expect(hook).toHaveBeenCalledTimes(1);

      unregister();
      await router.push('/');
      expect(hook).toHaveBeenCalledTimes(1);
    });
  });
});
