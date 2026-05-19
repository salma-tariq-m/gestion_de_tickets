<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin' || 
               $user->id === $ticket->user_id || 
               $user->id === $ticket->assigned_to;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin' || 
               $user->id === $ticket->assigned_to;
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin';
    }
}
