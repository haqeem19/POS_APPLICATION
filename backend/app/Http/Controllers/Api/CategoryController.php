<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;

class CategoryController extends CrudController
{
    protected string $model = Category::class;

    protected array $rules = [
        'name' => ['required', 'string', 'max:120'],
        'description' => ['nullable', 'string'],
        'is_active' => ['sometimes', 'boolean'],
    ];
}
