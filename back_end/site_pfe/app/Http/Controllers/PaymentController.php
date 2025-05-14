<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    /**
     * Créer une session de paiement pour un virement bancaire via Stripe
     */
    public function createBankTransferSession(Request $request)
    {
        try {
            $registration = Registration::with('player')->findOrFail($request->registration_id);

            // Configuration de la clé API Stripe
            Stripe::setApiKey(config('services.stripe.secret'));

            // Définir le prix en fonction de la catégorie ou un prix fixe
            $price = 500; // 500 MAD par exemple, à ajuster selon vos besoins

            // Créer une session de paiement Stripe
            $session = Session::create([
                'payment_method_types' => ['card', 'bancontact', 'ideal', 'sepa_debit'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'mad',
                        'product_data' => [
                            'name' => 'Inscription - ACOS Football Academy',
                            'description' => 'Inscription pour ' . $registration->player->firstname . ' ' . $registration->player->lastname,
                        ],
                        'unit_amount' => $price * 100, // Stripe utilise les centimes
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => config('app.frontend_url') . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => config('app.frontend_url') . '/payment/cancel',
                'client_reference_id' => $registration->id,
                'metadata' => [
                    'registration_id' => $registration->id,
                    'player_name' => $registration->player->firstname . ' ' . $registration->player->lastname,
                ],
            ]);

            // Mettre à jour le statut de l'inscription
            $registration->payment_status = 'processing';
            $registration->save();

            return response()->json([
                'success' => true,
                'session_id' => $session->id,
                'checkout_url' => $session->url,
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe API Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la session de paiement',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            Log::error('Payment Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Webhook pour traiter les événements Stripe
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sigHeader, $endpointSecret
            );

            // Traiter différents types d'événements
            switch ($event->type) {
                case 'checkout.session.completed':
                    $session = $event->data->object;
                    $this->handleSuccessfulPayment($session);
                    break;

                case 'payment_intent.payment_failed':
                    $paymentIntent = $event->data->object;
                    $this->handleFailedPayment($paymentIntent);
                    break;
            }

            return response()->json(['status' => 'success']);

        } catch (\UnexpectedValueException $e) {
            Log::error('Webhook Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Webhook Signature Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            Log::error('Webhook Processing Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Traiter un paiement réussi
     */
    private function handleSuccessfulPayment($session)
    {
        $registrationId = $session->client_reference_id;

        $registration = Registration::find($registrationId);
        if ($registration) {
            $registration->payment_status = 'completed';
            $registration->payment_method = 'Virement bancaire (Stripe)';
            $registration->payment_reference = $session->payment_intent;
            $registration->save();

            // Vous pourriez également envoyer un email de confirmation ici
        }
    }

    /**
     * Traiter un paiement échoué
     */
    private function handleFailedPayment($paymentIntent)
    {
        // Rechercher l'inscription associée au paiement échoué
        $registration = Registration::where('payment_reference', $paymentIntent->id)->first();

        if ($registration) {
            $registration->payment_status = 'failed';
            $registration->save();

            // Vous pourriez envoyer un email pour informer l'utilisateur de l'échec
        }
    }

    /**
     * Vérifier l'état d'un paiement
     */
    public function checkPaymentStatus(Request $request)
    {
        try {
            $sessionId = $request->session_id;

            Stripe::setApiKey(config('services.stripe.secret'));
            $session = Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                return response()->json([
                    'success' => true,
                    'paid' => true,
                    'status' => 'completed',
                ]);
            }

            return response()->json([
                'success' => true,
                'paid' => false,
                'status' => $session->payment_status,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du paiement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
