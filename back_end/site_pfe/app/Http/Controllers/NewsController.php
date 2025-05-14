<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        // Si le type est spécifié, filtrer par type
        if ($request->has('type')) {
            return News::where('type', $request->type)->get();
        }

        // Sinon, retourner toutes les actualités/événements
        return News::all();
    }

    public function getEvents()
    {
        return News::where('type', 'event')->get();
    }

    public function getNews()
    {
        return News::where('type', 'news')->get();
    }

    public function store(Request $request)
    {
        return News::create($request->all());
    }

    public function show(News $news)
    {
        return $news;
    }

    public function update(Request $request, News $news)
    {
        $news->update($request->all());
        return $news;
    }

    public function destroy(News $news)
    {
        $news->delete();
        return response()->noContent();
    }
}
