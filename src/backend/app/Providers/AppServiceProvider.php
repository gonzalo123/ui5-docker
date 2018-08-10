<?php

namespace App\Providers;

use PDO;
use Doctrine\DBAL\DriverManager;
use Illuminate\Support\ServiceProvider;
use Monolog\Logger;
use Monolog\Handler\ErrorLogHandler;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
    }

    public function register()
    {
    }
}
