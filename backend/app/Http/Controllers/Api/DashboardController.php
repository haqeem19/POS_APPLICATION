<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $today = Carbon::today();

        return response()->json([
            'today_revenue' => Sale::whereDate('sale_date', $today)->sum('total_amount'),
            'today_sales_count' => Sale::whereDate('sale_date', $today)->count(),
            'product_count' => Product::count(),
            'low_stock_count' => Product::whereColumn('stock_quantity', '<=', 'minimum_stock')->count(),
            'low_stock_products' => Product::whereColumn('stock_quantity', '<=', 'minimum_stock')
                ->orderBy('stock_quantity')
                ->limit(10)
                ->get(['id', 'sku', 'name', 'stock_quantity', 'minimum_stock']),
            'recent_sales' => Sale::with('customer')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
