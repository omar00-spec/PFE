<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Envoyer un email avec un lien de ru00e9initialisation du mot de passe
     */
    public function sendResetLinkEmail(Request $request)
    {
        // Valider l'email
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Aucun compte n\'est associu00e9 u00e0 cette adresse email.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Adresse email invalide',
                'errors' => $validator->errors()
            ], 422);
        }

        // Gu00e9nu00e9rer un token unique
        $token = Str::random(60);

        // Enregistrer le token dans la base de donnu00e9es
        DB::table('password_resets')->where('email', $request->email)->delete();
        
        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);

        // Construire l'URL de réinitialisation
        $resetUrl = env('FRONTEND_URL', 'http://localhost:5173') . '/reset-password?token=' . $token . '&email=' . urlencode($request->email);

        // Mode développement : toujours renvoyer l'URL dans la réponse
        // Tentative d'envoi d'email, mais nous affichons toujours l'URL dans la réponse
        try {
            Mail::send('emails.reset_password', ['resetUrl' => $resetUrl], function ($message) use ($request) {
                $message->to($request->email);
                $message->subject('Réinitialisation de votre mot de passe');
            });
            
            // Même si l'email est envoyé avec succès, nous incluons l'URL dans la réponse pour le développement
            return response()->json([
                'success' => true,
                'message' => 'Un lien de réinitialisation a été envoyé à votre adresse email. En mode développement, l\'URL est également fournie ci-dessous.',
                'reset_url' => $resetUrl // Toujours inclure l'URL pour le développement
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur d'envoi d'email, journaliser l'erreur et renvoyer l'URL
            \Log::error('Erreur d\'envoi d\'email: ' . $e->getMessage());
            
            return response()->json([
                'success' => true,
                'message' => 'Un lien de réinitialisation a été généré (l\'envoi d\'email a échoué).',
                'reset_url' => $resetUrl
            ]);
        }
    }

    /**
     * Réinitialiser le mot de passe
     */
    public function reset(Request $request)
    {
        // Valider les donnu00e9es
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Donnu00e9es invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vu00e9rifier si le token est valide
        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Ce lien de ru00e9initialisation est invalide.'
            ], 400);
        }

        // Vu00e9rifier si le token est expiru00e9 (1 heure)
        $createdAt = Carbon::parse($resetRecord->created_at);
        if (Carbon::now()->diffInMinutes($createdAt) > 60) {
            DB::table('password_resets')->where('email', $request->email)->delete();
            
            return response()->json([
                'success' => false,
                'message' => 'Ce lien de ru00e9initialisation a expiru00e9.'
            ], 400);
        }

        // Vu00e9rifier si le token correspond
        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Ce lien de ru00e9initialisation est invalide.'
            ], 400);
        }

        // Mettre u00e0 jour le mot de passe
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token de ru00e9initialisation
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Votre mot de passe a u00e9tu00e9 ru00e9initialisu00e9 avec succu00e8s.'
        ]);
    }
}
