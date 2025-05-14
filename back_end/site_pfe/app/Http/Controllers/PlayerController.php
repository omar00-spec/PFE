<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('category_id')) {
            return Player::where('category_id', $request->category_id)
                      ->with('category')
                      ->get();
        }

        return Player::with('category')->get();
    }

    public function store(Request $request)
    {
        return Player::create($request->all());
    }

    public function show(Player $player)
    {
        return $player;
    }

    public function update(Request $request, Player $player)
    {
        $player->update($request->all());
        return $player;
    }

    public function destroy(Player $player)
    {
        $player->delete();
        return response()->noContent();
    }
}
