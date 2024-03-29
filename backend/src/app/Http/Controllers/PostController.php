<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = Post::latest()->get();

        $formatPosts = [];
        foreach ($posts as $post) {
            $formatPosts[] = [
                'id' => $post->id,
                'title' => mb_strimwidth($post->title, 0, 45, '...', 'UTF-8'),
                'content' => mb_strimwidth($post->content, 0, 150, '...', 'UTF-8'),
                'created_at' => $post->created_at->format('Y.m.d'),
                'updated_at' => $post->updated_at->format('Y.m.d'),
            ];
        }

        return response()->json($formatPosts);
    }

    public function store(Request $request): JsonResponse
    {
        $post = new Post();
        $post->title = $request->title;
        $post->content = $request->content;
        $post->save();

        return response()->json($post);
    }

    public function show(int $id): JsonResponse
    {
        $post = Post::with('comments')->findOrFail($id);

        $formatComments = [];
        foreach ($post->comments as $comment) {
            $formatComments[] = [
                'id' => $comment->id,
                'post_id' => $comment->post_id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->format('Y.m.d'),
                'updated_at' => $comment->updated_at->format('Y.m.d'),
            ];
        }

        return response()->json([
            'id' => $post->id,
            'title' => $post->title,
            'content' => $post->content,
            'created_at' => $post->created_at->format('Y.m.d'),
            'updated_at' => $post->updated_at->format('Y.m.d'),
            'comments' => $formatComments,
        ]);
    }
}
