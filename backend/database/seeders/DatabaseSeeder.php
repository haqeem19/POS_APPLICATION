<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $coffee = Category::create(['name' => 'Coffee']);
        $bakery = Category::create(['name' => 'Bakery']);

        Product::create([
            'category_id' => $coffee->id,
            'sku' => 'COF-001',
            'name' => 'Es Kopi Susu',
            'cost_price' => 8000,
            'selling_price' => 18000,
            'stock_quantity' => 50,
            'minimum_stock' => 10,
        ]);

        Product::create([
            'category_id' => $bakery->id,
            'sku' => 'BRD-001',
            'name' => 'Roti Coklat',
            'cost_price' => 5000,
            'selling_price' => 12000,
            'stock_quantity' => 30,
            'minimum_stock' => 8,
        ]);

        Customer::create(['name' => 'Walk-in Customer']);
        Supplier::create(['name' => 'Supplier Utama', 'contact_person' => 'Admin']);
    }
}
