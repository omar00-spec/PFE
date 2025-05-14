<?php

namespace App\Http\Controllers;

use App\Models\MatchModel;
use Illuminate\Http\Request;


class MatchController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('category_id')) {
            return MatchModel::where('category_id', $request->category_id)
                      ->with('category')
                      ->get();
        }

        return MatchModel::with('category')->get();
    }

    public function store(Request $request)
    {
        return MatchModel::create($request->all());
    }

    public function show(MatchModel $match)
    {
        return $match;
    }

    public function update(Request $request, MatchModel $match)
    {
        $match->update($request->all());
        return $match;
    }

    public function destroy(MatchModel $match)
    {
        $match->delete();
        return response()->noContent();
    }
}
