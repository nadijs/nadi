<?php

namespace Nadi;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class NadiServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/nadi.php', 'nadi'
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot()
    {
        // Publish config
        $this->publishes([
            __DIR__.'/../config/nadi.php' => config_path('nadi.php'),
        ], 'nadi-config');

        // Publish views
        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/nadi'),
        ], 'nadi-views');

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'nadi');

        // Register Blade directive
        Blade::directive('nadi', function ($expression) {
            return "<?php echo Nadi\Nadi::render({$expression}); ?>";
        });

        // Register route macro
        \Illuminate\Support\Facades\Route::macro('nadi', function ($uri, $component, $props = []) {
            return \Illuminate\Support\Facades\Route::get($uri, function () use ($component, $props) {
                return \Nadi\Nadi::render($component, is_callable($props) ? $props() : $props);
            });
        });
    }
}
