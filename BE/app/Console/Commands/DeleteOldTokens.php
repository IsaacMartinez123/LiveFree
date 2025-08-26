<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class DeleteOldTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Elimina todos los tokens de acceso de la tabla personal_access_tokens a las 12:00 AM / 00:00';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        PersonalAccessToken::select('personal_access_tokens.*')
        ->delete();

        $this->info('Los tokens han sido eliminados exitosamente.');

        return 0;
    }
}