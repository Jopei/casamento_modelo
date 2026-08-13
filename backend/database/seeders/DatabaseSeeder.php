<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Gift;
use App\Models\ScheduleItem;
use App\Models\StoryItem;
use App\Models\WeddingSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Em producao a senha vem do .env. Sem ADMIN_PASSWORD definido,
        // sorteamos uma e mostramos uma unica vez, para nunca publicar o
        // site com a senha padrao de desenvolvimento.
        $email = env('ADMIN_EMAIL', 'admin@casamento.com');
        $password = env('ADMIN_PASSWORD');

        if (blank($password)) {
            $password = app()->environment('production')
                ? Str::password(16)
                : 'password';
        }

        $admin = Admin::firstOrCreate(
            ['email' => $email],
            ['name' => 'Admin', 'password' => $password]
        );

        if ($admin->wasRecentlyCreated) {
            $this->command?->warn("Admin criado: {$email}");
            $this->command?->warn("Senha: {$password}");
            $this->command?->warn('Anote agora — nao sera exibida de novo.');
        }

        WeddingSetting::firstOrCreate(['id' => 1], [
            'bride_name' => 'Maria',
            'groom_name' => 'Joaquim',
            'wedding_date' => now()->addMonths(6),
            'welcome_message' => 'Estamos muito felizes em compartilhar este momento com voce.',
            'location_name' => 'Jardim Villa Flora',
            'location_address' => 'Estrada das Flores, 1200',
            'dress_code_text' => 'Traje passeio completo.',
            'dress_code_colors' => ['#B8975A', '#F2E8D9', '#6B5B45'],
        ]);

        if (StoryItem::count() === 0) {
            StoryItem::create([
                'title' => 'Como nos conhecemos',
                'description' => 'Um encontro casual que mudou tudo.',
                'year' => '2019',
                'order' => 1,
            ]);
            StoryItem::create([
                'title' => 'O pedido',
                'description' => 'Ao por do sol, sem duvida no coracao.',
                'year' => '2025',
                'order' => 2,
            ]);
        }

        if (ScheduleItem::count() === 0) {
            ScheduleItem::create([
                'event_type' => 'ceremony',
                'time' => '16:00',
                'title' => 'Cerimonia',
                'description' => 'Cerimonia ao ar livre no jardim principal.',
                'icon' => 'rings',
                'order' => 1,
            ]);
            ScheduleItem::create([
                'event_type' => 'reception',
                'time' => '19:00',
                'title' => 'Festa',
                'description' => 'Jantar e festa ate o amanhecer.',
                'icon' => 'music',
                'order' => 2,
            ]);
        }

        if (Gift::count() === 0) {
            Gift::create([
                'name' => 'Jogo de Panelas',
                'description' => 'Para a nossa primeira cozinha.',
                'price' => 250.00,
                'quantity' => 1,
            ]);
            Gift::create([
                'name' => 'Jogo de Cama',
                'description' => 'Para noites tranquilas.',
                'price' => 180.00,
                'quantity' => 2,
            ]);
            Gift::create([
                'name' => 'Presente livre',
                'description' => 'Prefere nos ajudar com um valor a sua escolha? Fique a vontade.',
                'is_free_amount' => true,
            ]);
        }
    }
}
