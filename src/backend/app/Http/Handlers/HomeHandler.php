<?php

namespace App\Http\Handlers;

class HomeHandler
{
    public function __invoke()
    {
        return ['date' => (new \DateTime())->format('c')];
    }
}