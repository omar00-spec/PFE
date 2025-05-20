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
            $news = News::where('type', $request->type)->get();
        } else {
            // Sinon, retourner toutes les actualités/événements
            $news = News::all();
        }
        
        // Ajouter l'URL complète pour les images
        foreach ($news as $item) {
            if ($item->image) {
                // Vu00e9rifier si le chemin de l'image contient du00e9ju00e0 'news/'
            if (strpos($item->image, 'news/') === 0) {
                $item->image = asset('storage/' . $item->image);
            } else {
                $item->image = asset('storage/news/' . $item->image);
            }
            }
        }
        
        return $news;
    }

    public function getEvents()
    {
        $events = News::where('type', 'event')->get();
        
        // Ajouter l'URL complète pour les images
        foreach ($events as $event) {
            if ($event->image) {
                $event->image = asset('storage/' . $event->image);
            }
        }
        
        return $events;
    }

    public function getNews()
    {
        $news = News::where('type', 'news')->get();
        
        // Ajouter l'URL complète pour les images
        foreach ($news as $item) {
            if ($item->image) {
                // Vu00e9rifier si le chemin de l'image contient du00e9ju00e0 'news/'
            if (strpos($item->image, 'news/') === 0) {
                $item->image = asset('storage/' . $item->image);
            } else {
                $item->image = asset('storage/news/' . $item->image);
            }
            }
        }
        
        return $news;
    }

    public function store(Request $request)
    {
        return News::create($request->all());
    }

    public function show(News $news)
    {
        // Ajouter l'URL complète pour l'image
        if ($news->image) {
            $news->image = asset('storage/' . $news->image);
        }
        
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
