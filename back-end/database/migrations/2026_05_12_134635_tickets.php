<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {

            $table->id();
        
            $table->string('title');
        
            $table->longText('description');
        
            $table->foreignId('status_id')
                  ->constrained()
                  ->cascadeOnDelete();
        
            $table->foreignId('priority_id')
                  ->constrained()
                  ->cascadeOnDelete();
        
            $table->foreignId('category_id')
                  ->constrained()
                  ->cascadeOnDelete();
        
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();
        
            $table->foreignId('assigned_to')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
        
            $table->string('attachment')->nullable();
        
            $table->timestamp('resolved_at')->nullable();
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
