<?php

namespace Nadi;

class Nadi
{
    protected static $manifest = null;
    protected static $basePath = '';

    /**
     * Initialize Nadi with base path
     */
    public static function init(string $basePath = '')
    {
        self::$basePath = $basePath ?: public_path();
        self::loadManifest();
    }

    /**
     * Load Vite manifest
     */
    protected static function loadManifest()
    {
        $manifestPath = self::$basePath . '/build/manifest.json';

        if (file_exists($manifestPath)) {
            self::$manifest = json_decode(file_get_contents($manifestPath), true);
        }
    }

    /**
     * Render a Nadi component
     */
    public static function render(string $component, array $props = [], array $options = [])
    {
        $isSSR = $options['ssr'] ?? false;
        $layout = $options['layout'] ?? 'app';

        if (request()->wantsJson() || request()->header('X-Inertia')) {
            return response()->json([
                'component' => $component,
                'props' => $props,
                'url' => request()->url(),
                'version' => self::getVersion(),
            ]);
        }

        if ($isSSR) {
            return self::renderSSR($component, $props, $layout);
        }

        return view("nadi::{$layout}", [
            'component' => $component,
            'props' => json_encode($props),
            'scripts' => self::getScripts(),
            'styles' => self::getStyles(),
        ]);
    }

    /**
     * Render with SSR
     */
    protected static function renderSSR(string $component, array $props, string $layout)
    {
        // Call Node.js SSR server or use prerendered content
        $ssrServer = config('nadi.ssr_url', 'http://localhost:13714');

        try {
            $response = file_get_contents($ssrServer . '/render', false, stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => 'Content-Type: application/json',
                    'content' => json_encode([
                        'component' => $component,
                        'props' => $props,
                    ]),
                    'timeout' => 2,
                ],
            ]));

            $data = json_decode($response, true);

            return view("nadi::{$layout}", [
                'component' => $component,
                'props' => json_encode($props),
                'html' => $data['html'] ?? '',
                'head' => $data['head'] ?? '',
                'scripts' => self::getScripts(),
                'styles' => self::getStyles(),
            ]);
        } catch (\Exception $e) {
            // Fallback to client-side rendering
            return self::render($component, $props, ['ssr' => false, 'layout' => $layout]);
        }
    }

    /**
     * Get script tags
     */
    protected static function getScripts(): string
    {
        if (!self::$manifest) {
            return '<script type="module" src="/src/main.ts"></script>';
        }

        $scripts = '';
        foreach (self::$manifest as $file => $data) {
            if (isset($data['isEntry']) && $data['isEntry']) {
                $scripts .= '<script type="module" src="/build/' . $data['file'] . '"></script>';
            }
        }

        return $scripts;
    }

    /**
     * Get style tags
     */
    protected static function getStyles(): string
    {
        if (!self::$manifest) {
            return '';
        }

        $styles = '';
        foreach (self::$manifest as $file => $data) {
            if (isset($data['css'])) {
                foreach ($data['css'] as $cssFile) {
                    $styles .= '<link rel="stylesheet" href="/build/' . $cssFile . '">';
                }
            }
        }

        return $styles;
    }

    /**
     * Get asset version
     */
    protected static function getVersion(): string
    {
        return md5_file(self::$basePath . '/build/manifest.json') ?: 'dev';
    }
}
