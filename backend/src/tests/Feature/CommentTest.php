<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CommentTest extends TestCase
{
    public function test_comments_store()
    {
        $response = $this->post('api/posts/1/comments', [
            'content' => 'testComment',
        ]);
        $response->assertStatus(200);
    }
}
