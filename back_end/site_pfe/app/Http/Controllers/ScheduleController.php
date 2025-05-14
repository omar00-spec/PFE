<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('category_id')) {
            return Schedule::where('category_id', $request->category_id)
                      ->with('category')
                      ->get();
        }

        return Schedule::with('category')->get();
    }

    public function store(Request $request)
    {
        return Schedule::create($request->all());
    }

    public function show(Schedule $schedule)
    {
        return $schedule;
    }

    public function update(Request $request, Schedule $schedule)
    {
        $schedule->update($request->all());
        return $schedule;
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->noContent();
    }
}
