<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MediaController extends Controller
{
    /**
     * Affiche la liste des médias (photos et vidéos)
     */
    public function index(Request $request)
    {
        $type = $request->query('type', 'all');

        if ($type === 'photo') {
            $items = Media::where('type', 'photo')->orderBy('created_at', 'desc')->get();
        } elseif ($type === 'video') {
            $items = Media::where('type', 'video')->orderBy('created_at', 'desc')->get();
        } else {
            $items = Media::orderBy('created_at', 'desc')->get();
        }

        return response()->json($items);
    }

    /**
     * Stocke un nouveau média
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'type' => 'required|in:photo,video',
            'file_path' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $media = Media::create($request->all());

        return response()->json($media, 201);
    }

    /**
     * Affiche un média spécifique
     */
    public function show($id)
    {
        $media = Media::findOrFail($id);
        return response()->json($media);
    }

    /**
     * Met à jour un média existant
     */
    public function update(Request $request, $id)
    {
        $media = Media::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'type' => 'sometimes|required|in:photo,video',
            'file_path' => 'sometimes|required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $media->update($request->all());

        return response()->json($media);
    }

    /**
     * Supprime un média
     */
    public function destroy($id)
    {
        $media = Media::findOrFail($id);
        $media->delete();

        return response()->json(null, 204);
    }
}
