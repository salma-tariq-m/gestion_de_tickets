<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;
use Illuminate\Support\Facades\Validator;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Ticket::with([
            'user',
            'assignedAgent',
            'status',
            'priority',
            'category'
        ]);
    
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'title' => 'required|string|max:255',

            'description' => 'required|string',

            'status_id' => 'required|exists:statuses,id',

            'priority_id' => 'required|exists:priorities,id',

            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $ticket = Ticket::create([

            'title' => $request->title,

            'description' => $request->description,

            'status_id' => $request->status_id,

            'priority_id' => $request->priority_id,

            'category_id' => $request->category_id,

            'user_id' => 1,
        ]);

        return response()->json([

            'message' => 'Ticket created successfully',

            'ticket' => $ticket
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ticket = Ticket::with([
            'user',
            'assignedAgent',
            'status',
            'priority',
            'category',
            'comments.user'
        ])->find($id);

        if (!$ticket) {

            return response()->json([
                'message' => 'Ticket not found'
            ], 404);
        }

        return response()->json($ticket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ticket = Ticket::find($id);

        if (!$ticket) {

            return response()->json([
                'message' => 'Ticket not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [

            'title' => 'sometimes|string|max:255',

            'description' => 'sometimes|string',

            'status_id' => 'sometimes|exists:statuses,id',

            'priority_id' => 'sometimes|exists:priorities,id',

            'category_id' => 'sometimes|exists:categories,id',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $ticket->update($request->all());

        return response()->json([

            'message' => 'Ticket updated successfully',

            'ticket' => $ticket
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ticket = Ticket::find($id);

        if (!$ticket) {

            return response()->json([
                'message' => 'Ticket not found'
            ], 404);
        }

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully'
        ]);
    }
}
