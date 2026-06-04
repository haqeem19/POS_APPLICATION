<?php

namespace App\Http\Controllers\Api;

use App\Models\Supplier;

class SupplierController extends CrudController
{
    protected string $model = Supplier::class;

    protected array $rules = [
        'name' => ['required', 'string', 'max:160'],
        'phone' => ['nullable', 'string', 'max:40'],
        'email' => ['nullable', 'email', 'max:160'],
        'address' => ['nullable', 'string'],
        'contact_person' => ['nullable', 'string', 'max:160'],
    ];
}
