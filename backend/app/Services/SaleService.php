<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SaleService
{
    public function create(array $data): Sale
    {
        return DB::transaction(function () use ($data): Sale {
            $items = collect($data['items']);
            $productIds = $items->pluck('product_id')->all();
            $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

            $subtotal = 0;
            $normalizedItems = [];

            foreach ($items as $item) {
                $product = $products->get($item['product_id']);

                if (! $product || ! $product->is_active) {
                    abort(422, 'Produk tidak tersedia.');
                }

                if ($product->stock_quantity < $item['quantity']) {
                    abort(422, "Stok {$product->name} tidak mencukupi.");
                }

                $lineDiscount = (float) ($item['discount_amount'] ?? 0);
                $lineTotal = ((float) $product->selling_price * (int) $item['quantity']) - $lineDiscount;

                if ($lineTotal < 0) {
                    abort(422, 'Diskon item tidak boleh melebihi subtotal item.');
                }

                $subtotal += $lineTotal;
                $normalizedItems[] = [
                    'product' => $product,
                    'quantity' => (int) $item['quantity'],
                    'unit_price' => $product->selling_price,
                    'discount_amount' => $lineDiscount,
                    'line_total' => $lineTotal,
                ];
            }

            $discount = (float) ($data['discount_amount'] ?? 0);
            $tax = (float) ($data['tax_amount'] ?? 0);
            $total = $subtotal - $discount + $tax;

            if ($total < 0) {
                abort(422, 'Diskon transaksi tidak boleh melebihi subtotal.');
            }

            if ((float) $data['paid_amount'] < $total) {
                abort(422, 'Nominal pembayaran kurang dari total transaksi.');
            }

            $sale = Sale::create([
                'customer_id' => $data['customer_id'] ?? null,
                'invoice_number' => 'INV-'.now()->format('YmdHis').'-'.Str::upper(Str::random(4)),
                'sale_date' => now(),
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'tax_amount' => $tax,
                'total_amount' => $total,
                'paid_amount' => $data['paid_amount'],
                'change_amount' => (float) $data['paid_amount'] - $total,
                'payment_method' => $data['payment_method'],
                'status' => 'paid',
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($normalizedItems as $item) {
                $sale->items()->create([
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount_amount' => $item['discount_amount'],
                    'line_total' => $item['line_total'],
                ]);

                $item['product']->decrement('stock_quantity', $item['quantity']);

                StockMovement::create([
                    'product_id' => $item['product']->id,
                    'type' => 'out',
                    'quantity' => $item['quantity'],
                    'reference_type' => 'sale',
                    'reference_id' => $sale->id,
                    'notes' => "Penjualan {$sale->invoice_number}",
                ]);
            }

            return $sale;
        });
    }
}
