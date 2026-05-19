<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $query = Ticket::with([
            'user',
            'assignedAgent',
            'status',
            'priority',
            'category'
        ]);

        $user = $request->user();

        if ($user->role === 'user') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'agent') {
            $query->where('assigned_to', $user->id);
        }

        if ($request->has('status_id')) {
            $query->where('status_id', $request->status_id);
        }

        if ($request->has('priority_id')) {
            $query->where('priority_id', $request->priority_id);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $tickets = $query->latest()->paginate(10);

        return response()->json($tickets);
    }

    public function store(StoreTicketRequest $request)
    {
        $ticket = Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'status_id' => $request->status_id,
            'priority_id' => $request->priority_id,
            'category_id' => $request->category_id,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket->load('user', 'status', 'priority', 'category')
        ], 201);
    }

    public function show(string $id)
    {
        $ticket = Ticket::with([
            'user',
            'assignedAgent',
            'status',
            'priority',
            'category',
            'comments.user'
        ])->findOrFail($id);

        $this->authorize('view', $ticket);

        return response()->json($ticket);
    }

    public function update(UpdateTicketRequest $request, string $id)
    {
        $ticket = Ticket::findOrFail($id);

        $this->authorize('update', $ticket);

        $ticket->update($request->validated());

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket->load('user', 'assignedAgent', 'status', 'priority', 'category')
        ]);
    }

    public function destroy(string $id)
    {
        $ticket = Ticket::findOrFail($id);

        $this->authorize('delete', $ticket);

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully'
        ]);
    }
}
