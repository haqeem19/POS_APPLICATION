<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StockMovementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $movements = StockMovement::with('product')
            ->latest()
            ->paginate((int) $request->query('per_page', 15));

        return response()->json($movements);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'type' => ['required', Rule::in(['in', 'out', 'adjustment'])],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        $movement = DB::transaction(function () use ($data): StockMovement {
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);
            $delta = $data['type'] === 'in' ? $data['quantity'] : -$data['quantity'];

            if ($data['type'] === 'adjustment') {
                $delta = $data['quantity'] - $product->stock_quantity;
            }

            if ($product->stock_quantity + $delta < 0) {
                abort(422, 'Stok produk tidak mencukupi.');
            }

            $product->increment('stock_quantity', $delta);

            return StockMovement::create([
                ...$data,
                'reference_type' => 'manual',
            ]);
        });

        return response()->json($movement->load('product'), 201);
    }

    public function show(Request $request): JsonResponse
    {
        $stockMovement = \App\Models\StockMovement::findOrFail(collect($request->route()->parameters())->last());

        return response()->json($stockMovement->load('product'));
    }
}
