<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function createUser()
    {
        return User::create([
            'name' => 'teste',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);
    }

    /**
     * Test that products page can be accessed.
     */
    public function test_can_access_products_page()
    {
        $response = $this->get('/cadastro-produtos');
        $response->assertStatus(200);
    }

    /**
     * Test that a product can be created successfully.
     */
    public function test_can_create_product()
    {
        $user = $this->createUser();

        $productData = [
            'name' => 'Melancia',
            'price' => 30
        ];

        $response = $this->actingAs($user)->post('/cadastro-produtos', $productData);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'name' => 'Melancia',
            'price' => 30
        ]);
    }

    /**
     * Test that product creation fails with invalid data.
     */
    public function test_cannot_create_product_with_invalid_data()
    {
        $user = $this->createUser();

        $productData = [
            'name' => '',
            'price' => -1
        ];

        $response = $this->actingAs($user)->post('/cadastro-produtos', $productData);

        $response->assertSessionHasErrors(['name', 'price']);
        $this->assertDatabaseCount('products', 0);
    }

    /**
     * Test that duplicate product names are not allowed.
     */
    public function test_cannot_create_duplicate_product_name()
    {
        $user = $this->createUser();

        Product::create([
            'name' => 'Melao',
            'price' => 13.00
        ]);

        $productData = [
            'name' => 'Melao',
            'price' => 12.00
        ];

        $response = $this->actingAs($user)->post('/cadastro-produtos', $productData);

        $response->assertSessionHasErrors(['name']);
        $this->assertDatabaseCount('products', 1);
    }

    /**
     * Test that a product can be deleted.
     */
    public function test_can_delete_product()
    {
        $user = $this->createUser();

        $product = Product::create([
            'name' => 'Melancia teste',
            'price' => 42.50
        ]);

        $response = $this->actingAs($user)->delete("/produtos/{$product->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('products', [
            'id' => $product->id
        ]);
    }
}
