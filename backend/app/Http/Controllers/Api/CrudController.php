<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

abstract class CrudController extends Controller
{
    protected string $model;

    protected array $rules = [];

    protected array $relations = [];

    public function index(Request $request): JsonResponse
    {
        $query = $this->model::query()->with($this->relations)->latest();

        if ($request->filled('search')) {
            $this->applySearch($query, (string) $request->query('search'));
        }

        return response()->json($query->paginate((int) $request->query('per_page', 15)));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules);
        $record = $this->model::create($data);

        return response()->json($record->load($this->relations), 201);
    }

    public function show(Request $request): JsonResponse
    {
        $record = $this->resolveRecord($request);

        return response()->json($record->load($this->relations));
    }

    public function update(Request $request): JsonResponse
    {
        $record = $this->resolveRecord($request);
        $data = $request->validate($this->rules);
        $record->update($data);

        return response()->json($record->load($this->relations));
    }

    public function destroy(Request $request): JsonResponse
    {
        $record = $this->resolveRecord($request);
        $record->delete();

        return response()->json(status: 204);
    }

    protected function applySearch($query, string $search): void
    {
        $query->where('name', 'ilike', "%{$search}%");
    }

    protected function resolveRecord(Request $request)
    {
        $id = collect($request->route()->parameters())->last();

        return $this->model::findOrFail($id);
    }
}
