<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;

class CustomerController extends CrudController
{
    protected string $model = Customer::class;

    protected array $rules = [
        'name' => ['required', 'string', 'max:160'],
        'phone' => ['nullable', 'string', 'max:40'],
        'email' => ['nullable', 'email', 'max:160'],
        'address' => ['nullable', 'string'],
    ];
}
