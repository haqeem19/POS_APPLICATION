<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;

class ProductController extends CrudController
{
    protected string $model = Product::class;

    protected array $relations = ['category'];

    protected array $rules = [
        'category_id' => ['nullable', 'exists:categories,id'],
        'sku' => ['required', 'string', 'max:80'],
        'name' => ['required', 'string', 'max:160'],
        'description' => ['nullable', 'string'],
        'cost_price' => ['required', 'numeric', 'min:0'],
        'selling_price' => ['required', 'numeric', 'min:0'],
        'stock_quantity' => ['sometimes', 'integer', 'min:0'],
        'minimum_stock' => ['sometimes', 'integer', 'min:0'],
        'is_active' => ['sometimes', 'boolean'],
    ];

    protected function applySearch($query, string $search): void
    {
        $query->where(function ($query) use ($search): void {
            $query->where('name', 'ilike', "%{$search}%")
                ->orWhere('sku', 'ilike', "%{$search}%");
        });
    }
}
