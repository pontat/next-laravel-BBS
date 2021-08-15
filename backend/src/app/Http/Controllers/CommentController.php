<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, int $id): JsonResponse
    {
        $comment = new Comment();
        $comment->post_id = $id;
        $comment->content = $request->content;
        $comment->save();

        return response()->json([
            'id' => $comment->id,
            'post_id' => $comment->post_id,
            'content' => $comment->content,
            'created_at' => $comment->created_at->format('Y.m.d'),
            'updated_at' => $comment->updated_at->format('Y.m.d'),
        ]);
    }
}
