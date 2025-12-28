"""
Nadi Django adapter for server-side rendering and component integration
"""

import json
from django.http import JsonResponse
from django.shortcuts import render
from django.template import Library
from django.conf import settings
import subprocess

register = Library()

class NadiRenderer:
    def __init__(self):
        self.ssr_url = getattr(settings, 'NADI_SSR_URL', 'http://localhost:13714')
        self.ssr_enabled = getattr(settings, 'NADI_SSR_ENABLED', False)
        self.manifest = self._load_manifest()

    def _load_manifest(self):
        """Load Vite manifest"""
        try:
            manifest_path = settings.BASE_DIR / 'static' / 'build' / 'manifest.json'
            with open(manifest_path, 'r') as f:
                return json.load(f)
        except:
            return {}

    def render(self, request, component, props=None, options=None):
        """Render a Nadi component"""
        props = props or {}
        options = options or {}

        # Handle JSON requests (like Inertia.js)
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'component': component,
                'props': props,
                'url': request.path,
                'version': self._get_version(),
            })

        context = {
            'component': component,
            'props': json.dumps(props),
            'scripts': self._get_scripts(),
            'styles': self._get_styles(),
            'html': '',
            'head': '',
        }

        # SSR rendering
        if self.ssr_enabled and options.get('ssr', True):
            try:
                import requests
                response = requests.post(
                    f'{self.ssr_url}/render',
                    json={'component': component, 'props': props},
                    timeout=2
                )
                data = response.json()
                context['html'] = data.get('html', '')
                context['head'] = data.get('head', '')
            except:
                pass  # Fallback to client-side rendering

        template = options.get('template', 'nadi/app.html')
        return render(request, template, context)

    def _get_scripts(self):
        """Get script tags"""
        if not self.manifest:
            return '<script type="module" src="/static/src/main.ts"></script>'

        scripts = []
        for file, data in self.manifest.items():
            if data.get('isEntry'):
                scripts.append(f'<script type="module" src="/static/build/{data["file"]}"></script>')

        return '\n'.join(scripts)

    def _get_styles(self):
        """Get style tags"""
        styles = []
        for file, data in self.manifest.items():
            if 'css' in data:
                for css_file in data['css']:
                    styles.append(f'<link rel="stylesheet" href="/static/build/{css_file}">')

        return '\n'.join(styles)

    def _get_version(self):
        """Get asset version"""
        import hashlib
        try:
            manifest_path = settings.BASE_DIR / 'static' / 'build' / 'manifest.json'
            with open(manifest_path, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except:
            return 'dev'


# Global renderer instance
nadi = NadiRenderer()


@register.simple_tag
def nadi_render(component, props=None):
    """Template tag for rendering Nadi components"""
    from django.http import HttpRequest
    request = HttpRequest()
    return nadi.render(request, component, props or {})
