<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::query()->with('category');

        // Filtrer par type si spécifié
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtrer par catégorie si spécifié
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Trier par date de création
        $query->orderBy('created_at', 'desc');

        return $query->get();
    }

    public function store(Request $request)
    {
        return Media::create($request->all());
    }

    public function show(Media $media)
    {
        return $media->load('category');
    }

    public function update(Request $request, $id)
    {
        $media = Media::findOrFail($id);
        $media->update($request->all());

        return response()->json([
            'message' => 'Média mis à jour avec succès !',
            'media' => $media
        ]);
    }

    public function destroy(Media $media)
    {
        $media->delete();
        return response()->noContent();
    }

    /**
     * Récupère uniquement les médias de type 'photo'
     */
    public function getPhotos()
    {
        return Media::where('type', 'photo')
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Récupère uniquement les médias de type 'video'
     */
    public function getVideos()
    {
        return Media::where('type', 'video')
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Récupère les médias par catégorie
     */
    public function getByCategory($categoryId)
    {
        return Media::where('category_id', $categoryId)
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
