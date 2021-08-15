<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PostTest extends TestCase
{
    public function test_posts_index()
    {
        $response = $this->get('api/posts');
        $response->assertStatus(200);
    }

    public function test_posts_store()
    {
        $response = $this->post('api/posts', [
            'title' => 'testTitle',
            'content' => 'testContent',
        ]);
        $response->assertStatus(200);
    }

    public function test_posts_show()
    {
        $response = $this->get('api/posts/1');
        $response->assertStatus(200);
    }
}
