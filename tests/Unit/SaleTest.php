<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SaleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic unit test example.
     */
    public function test_example(): void
    {
        $this->assertTrue(true);
    }

    public function test_can_calculate_sale_total()
    {
        // Arrange
        $product = Product::create([
            'name' => 'Melancia pequena',
            'price' => 15.00
        ]);

        // Act
        $quantity = 2;
        $totalAmount = $product->price * $quantity;

        // Assert
        $this->assertEquals(30.00, $totalAmount);
    }

    public function test_can_calculate_change_for_cash_payment()
    {
        // Arrange
        $totalAmount = 45.00;
        $receivedAmount = 50.00;

        // Act
        $change = $receivedAmount - $totalAmount;

        // Assert
        $this->assertEquals(5.00, $change);
    }

    public function test_cannot_complete_sale_with_insufficient_payment()
    {
        // Arrange
        $product = Product::create([
            'name' => 'Melancia média',
            'price' => 20.00
        ]);

        // Act
        $quantity = 2;
        $totalAmount = $product->price * $quantity;
        $receivedAmount = 35.00;

        // Assert
        $this->assertTrue($receivedAmount < $totalAmount);
    }
}
