<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return Contact::all();
    }

    public function store(Request $request)
    {
        return Contact::create($request->all());
    }

    public function show(Contact $contact)
    {
        return $contact;
    }
    public function update(Request $request, Contact $contact)
    {
        $contact->update($request->all());
        return $contact;
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->noContent();
    }
}
