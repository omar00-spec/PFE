<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    public function index()
    {
        return Registration::with('player')->get();
    }

    public function store(Request $request)
    {
        // Valider les données
        $validator = Validator::make($request->all(), [
            'playerName' => 'required|string|max:255',
            'playerFirstName' => 'required|string|max:255',
            'birthDate' => 'required|date',
            'category' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'postalCode' => 'nullable|string',
            'playerPhone' => 'nullable|string',
            'playerEmail' => 'nullable|email',
            'parentName' => 'nullable|string',
            'parentPhone' => 'nullable|string',
            'parentEmail' => 'nullable|email',
            'paymentMethod' => 'required|string|in:Espèces,Chèque,Virement bancaire',
            'documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Créer le joueur
        $player = Player::create([
            'lastname' => $request->playerName,
            'firstname' => $request->playerFirstName,
            'birth_date' => $request->birthDate,
            'category_id' => $request->category,
        ]);

        // Traiter les fichiers
        $documents = [];

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $type => $file) {
                $path = $file->store('registrations/' . $player->id, 'public');
                $documents[$type] = $path;
            }
        }

        // Créer l'inscription
        $registration = Registration::create([
            'player_id' => $player->id,
            'parent_name' => $request->parentName,
            'parent_email' => $request->parentEmail,
            'parent_phone' => $request->parentPhone,
            'documents' => $documents,
            'payment_method' => $request->paymentMethod,
            'status' => 'pending',
        ]);

        // Préparer la réponse en fonction du mode de paiement
        $response = [
            'success' => true,
            'registration' => $registration,
            'player' => $player,
        ];

        // Ajouter les informations spécifiques selon le mode de paiement
        switch ($request->paymentMethod) {
            case 'Virement bancaire':
                $response['redirect'] = true;
                $response['redirect_url'] = '/payment/bank-transfer';
                $response['registration_id'] = $registration->id;
                // Les informations de paiement seront générées par Stripe du côté client
                break;

            case 'Chèque':
                $response['redirect'] = true;
                $response['redirect_url'] = '/payment/check';
                $response['payment_info'] = [
                    'recipient' => 'ACOS Football Academy',
                    'address' => '123 Avenue Mohammed V, Rabat, Maroc',
                    'reference' => 'REG-' . $registration->id,
                ];
                break;

            case 'Espèces':
                $response['redirect'] = false;
                break;
        }

        return response()->json($response, 201);
    }

    public function show(Registration $registration)
    {
        return $registration->load('player');
    }

    public function update(Request $request, Registration $registration)
    {
        $registration->update($request->all());
        return $registration;
    }

    public function destroy(Registration $registration)
    {
        // Supprimer les fichiers associés
        if (!empty($registration->documents)) {
            foreach ($registration->documents as $path) {
                Storage::disk('public')->delete($path);
            }
        }

        $registration->delete();
        return response()->noContent();
    }
}
