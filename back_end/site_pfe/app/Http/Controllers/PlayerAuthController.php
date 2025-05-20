<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Player;

class PlayerAuthController extends Controller
{
    /**
     * Vérifier si un joueur existe et créer un compte utilisateur
     */
    public function checkPlayerAndRegister(Request $request)
    {
        try {
            // Journaliser la requête reçue
            Log::info('Requête reçue', [
                'data' => $request->all()
            ]);
            
            // Valider les données
            $validator = Validator::make($request->all(), [
                'firstname' => 'required|string',
                'lastname' => 'required|string',
                'email' => 'required|string|email|unique:users,email',
            ]);

            if ($validator->fails()) {
                Log::error('Erreur de validation', [
                    'errors' => $validator->errors()->toArray(),
                    'request_data' => $request->all()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation: ' . implode(', ', $validator->errors()->all()),
                    'errors' => $validator->errors()
                ], 422);
            }

            // Vérifier si le joueur existe dans la table player
            Log::info('Recherche de joueur', [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname
            ]);
            
            // Recherche plus flexible du joueur
            $player = Player::where(function($query) use ($request) {
                // Recherche exacte
                $query->where('firstname', $request->firstname)
                      ->where('lastname', $request->lastname);
            })
            ->orWhere(function($query) use ($request) {
                // Recherche insensible à la casse
                $query->whereRaw('LOWER(firstname) = ?', [strtolower($request->firstname)])
                      ->whereRaw('LOWER(lastname) = ?', [strtolower($request->lastname)]);
            })
            ->first();
            
            // Journaliser tous les joueurs pour le débogage
            $allPlayers = Player::all(['id', 'firstname', 'lastname']);
            Log::info('Tous les joueurs dans la base de données', [
                'players' => $allPlayers->toArray()
            ]);
            
            Log::info('Résultat de la recherche', [
                'player_found' => $player ? 'oui' : 'non'
            ]);

            if (!$player) {
                Log::warning('Joueur non trouvé', [
                    'firstname' => $request->firstname,
                    'lastname' => $request->lastname
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas enregistré comme joueur dans notre académie. Veuillez vous inscrire d\'abord.'
                ], 404);
            }

            // Générer un mot de passe aléatoire
            $password = Str::random(10);

            // Créer un compte utilisateur
            $user = User::create([
                'name' => $request->firstname . ' ' . $request->lastname,
                'email' => $request->email,
                'password' => bcrypt($password),
                'role' => 'player',
                'player_id' => $player->id
            ]);

            // Générer un token d'authentification
            $token = $user->createToken('playertoken')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Compte créé avec succès',
                'user' => $user,
                'password' => $password, // Envoyer le mot de passe généré (dans un vrai environnement, envoyez-le par email)
                'token' => $token
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du compte', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du compte: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Connexion d'un joueur
     */
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Vérifier l'email
        $user = User::where('email', $fields['email'])->first();

        // Vérifier si l'utilisateur existe et si c'est un joueur
        if (!$user || $user->role !== 'player' || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiants invalides ou vous n\'êtes pas un joueur'
            ], 401);
        }

        // Vérifier si le joueur existe toujours dans la table player
        $player = Player::find($user->player_id);
        if (!$player) {
            return response()->json([
                'success' => false,
                'message' => 'Votre profil de joueur n\'existe plus'
            ], 401);
        }

        // Créer un token
        $token = $user->createToken('playertoken')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => $user,
            'player' => $player,
            'token' => $token
        ], 200);
    }

    /**
     * Profil du joueur (sécurisé)
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        
        // Vérifier si c'est un joueur
        if ($user->role !== 'player') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        // Récupérer les informations du joueur
        $player = Player::find($user->player_id);
        
        if (!$player) {
            return response()->json([
                'success' => false,
                'message' => 'Profil de joueur non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'user' => $user,
            'player' => $player,
            'category' => $player->category
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnecté avec succès'
        ]);
    }
}
