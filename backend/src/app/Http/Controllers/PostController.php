<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::all();

        $formatPosts = [];
        foreach ($posts as $post) {
            $formatPosts[] = [
                'id' => $post->id,
                'title' => mb_strimwidth($post->title, 0, 45, '...', 'UTF-8'),
                'content' => mb_strimwidth($post->content, 0, 300, '...', 'UTF-8'),
                'created_at' => $post->created_at->format('Y.m.d'),
                'updated_at' => $post->updated_at->format('Y.m.d'),
            ];
        }

        return response()->json($formatPosts);
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Post $post)
    {
        //
    }

    public function update(Request $request, Post $post)
    {
        //
    }

    public function destroy(Post $post)
    {
        //
    }
}
