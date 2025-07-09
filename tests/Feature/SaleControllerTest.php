<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SaleControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_can_access_sales_page()
    {
        $response = $this->get('/vendas');
        $response->assertStatus(200);
    }

    //ajustar futuramente
    // public function test_cannot_create_sale_with_insufficient_payment()
    // {
    //     // Arrange
    //     $product = Product::create([
    //         'name' => 'Melancia grande',
    //         'price' => 30.00
    //     ]);

    //     $saleData = [
    //         'product_id' => $product->id,
    //         'quantity' => 2,
    //         'payment_type' => 'cash',
    //         'received_amount_cash' => '50.00' // Insuficiente para 2 melancias (60.00)
    //     ];

    //     // Act
    //     $response = $this->post('/vendas', $saleData);

    //     // Assert
    //     $response->assertStatus(422)
    //             ->assertJson([
    //                 'success' => false,
    //                 'message' => 'Valor recebido é menor que o total da venda'
    //             ]);
    // }
}
