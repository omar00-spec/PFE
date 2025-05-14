<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsController extends Controller
{
    /**
     * Affiche la liste des actualités et événements
     */
    public function index(Request $request)
    {
        $type = $request->query('type', 'all');

        if ($type === 'news') {
            $items = News::where('type', 'news')->orderBy('created_at', 'desc')->get();
        } elseif ($type === 'event') {
            $items = News::where('type', 'event')->orderBy('created_at', 'desc')->get();
        } else {
            $items = News::orderBy('created_at', 'desc')->get();
        }

        return response()->json($items);
    }

    /**
     * Stocke une nouvelle actualité ou événement
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:news,event',
            'location' => 'nullable|string|max:255',
            'event_time' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $news = News::create($request->all());

        return response()->json($news, 201);
    }

    /**
     * Affiche une actualité ou un événement spécifique
     */
    public function show($id)
    {
        $news = News::findOrFail($id);
        return response()->json($news);
    }

    /**
     * Met à jour une actualité ou un événement existant
     */
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:news,event',
            'location' => 'nullable|string|max:255',
            'event_time' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'date' => 'sometimes|required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $news->update($request->all());

        return response()->json($news);
    }

    /**
     * Supprime une actualité ou un événement
     */
    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $news->delete();

        return response()->json(null, 204);
    }
}
