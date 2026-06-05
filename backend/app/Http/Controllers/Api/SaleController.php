<?php

namespace App\Http\Controllers\Api;

use App\Models\Sale;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;

class SaleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);

        $sales = Sale::with(['customer', 'items.product'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('invoice_number', 'ilike', "%{$search}%")
                        ->orWhere('payment_method', 'ilike', "%{$search}%")
                        ->orWhere('status', 'ilike', "%{$search}%")
                        ->orWhereHas('customer', function ($customerQuery) use ($search) {
                            $customerQuery->where('name', 'ilike', "%{$search}%");
                        })
                        ->orWhereHas('items.product', function ($productQuery) use ($search) {
                            $productQuery
                                ->where('name', 'ilike', "%{$search}%")
                                ->orWhere('sku', 'ilike', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate($perPage);

        return response()->json($sales);
    }

    public function store(Request $request, SaleService $saleService): JsonResponse
    {
        $data = $request->validate([
            'customer_id' => ['nullable', 'exists:customers,id'],
            'discount_amount' => ['sometimes', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'numeric', 'min:0'],
            'paid_amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', Rule::in(['cash', 'qris', 'card', 'transfer'])],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.discount_amount' => ['sometimes', 'numeric', 'min:0'],
        ]);

        $sale = $saleService->create($data);

        return response()->json($sale->load(['customer', 'items.product']), 201);
    }

    public function show(Sale $sale): JsonResponse
    {
        return response()->json($sale->load(['customer', 'items.product']));
    }
}
