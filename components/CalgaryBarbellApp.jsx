"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { createClient } from "@/lib/supabase/client";

/* ============================= PROGRAM DATA ============================= */
const PROGRAM_DATA = JSON.parse(`{"trainingMaxes":{"maxes":{"squat":100,"bench":100,"deadlift":100},"round_to":5},"phases":{"Weeks 1-4":{"1":{"1":[{"exercise":"Competition Squat","sets":4,"reps":7,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.67,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":4,"reps":7,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.67,"lift":"bench"},{"exercise":"Barbell Overhead Press","sets":3,"reps":8,"tempo":"1.0.1","rest":120,"type":"rpe","label":"7RPE"},{"exercise":"Bent Over Row","sets":3,"reps":12,"tempo":"1.0.1","rest":90,"type":"rpe","label":"7RPE"},{"exercise":"GHR Back Extensions","sets":4,"reps":12,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"2":[{"exercise":"Competition Deadlift","sets":4,"reps":7,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.67,"lift":"deadlift"},{"exercise":"3ct Pause Bench","sets":3,"reps":5,"tempo":"1.3.1","rest":180,"type":"pct","pct":0.6,"lift":"bench"},{"exercise":"SSB or High Bar Pause Squat","sets":3,"reps":5,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Wide Grip Seated Row","sets":5,"reps":8,"tempo":"1.1.1","rest":90,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pin Squat","sets":3,"reps":6,"tempo":"1.1.1","rest":120,"type":"pct","pct":0.65,"lift":"squat"},{"exercise":"2 Board Press","sets":3,"reps":6,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"},{"exercise":"1-Arm DB Rows","sets":5,"reps":10,"tempo":"1.0.1","rest":90,"type":"rpe","label":"7.5RPE"},{"exercise":"Birddogs","sets":3,"reps":6,"tempo":"1.1.1","rest":90,"type":"rpe","label":"7RPE"}],"4":[{"exercise":"Pause Deadlift","sets":3,"reps":6,"tempo":"x","rest":120,"type":"pct","pct":0.63,"lift":"deadlift"},{"exercise":"Touch and Go Bench","sets":4,"reps":10,"tempo":"1.0.1","rest":120,"type":"pct","pct":0.63,"lift":"bench"},{"exercise":"Stiff-Legged Deadlift","sets":3,"reps":8,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.4,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":10,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Tricep movement of choice","sets":4,"reps":10,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}]},"2":{"1":[{"exercise":"Competition Squat","sets":4,"reps":6,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.7,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":4,"reps":6,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.7,"lift":"bench"},{"exercise":"Barbell Overhead Press","sets":3,"reps":8,"tempo":"1.0.1","rest":120,"type":"rpe","label":"7RPE"},{"exercise":"Bent Over Row","sets":3,"reps":12,"tempo":"1.0.1","rest":90,"type":"rpe","label":"7RPE"},{"exercise":"GHR Back Extensions","sets":4,"reps":12,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"2":[{"exercise":"Competition Deadlift","sets":4,"reps":6,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.7,"lift":"deadlift"},{"exercise":"3ct Pause Bench","sets":3,"reps":6,"tempo":"1.3.1","rest":180,"type":"pct","pct":0.6,"lift":"bench"},{"exercise":"SSB or High Bar Pause Squat","sets":3,"reps":6,"tempo":"1.2.1","rest":45,"type":"rpe","label":"8RPE"},{"exercise":"Wide Grip Seated Row","sets":5,"reps":8,"tempo":"1.1.1","rest":90,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pin Squat","sets":3,"reps":5,"tempo":"1.1.1","rest":120,"type":"pct","pct":0.7,"lift":"squat"},{"exercise":"2 Board Press","sets":3,"reps":5,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"},{"exercise":"1-Arm DB Rows","sets":5,"reps":10,"tempo":"1.0.1","rest":90,"type":"rpe","label":"7.5RPE"},{"exercise":"Birddogs","sets":3,"reps":6,"tempo":"1.1.1","rest":90,"type":"rpe","label":"7RPE"}],"4":[{"exercise":"Pause Deadlift","sets":3,"reps":5,"tempo":"x","rest":120,"type":"pct","pct":0.65,"lift":"deadlift"},{"exercise":"Touch and Go Bench","sets":4,"reps":10,"tempo":"1.0.1","rest":120,"type":"pct","pct":0.65,"lift":"bench"},{"exercise":"Stiff-Legged Deadlift","sets":3,"reps":8,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.43,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":10,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Tricep movement of choice","sets":4,"reps":10,"tempo":"1.1.1","rest":90,"type":"rpe","label":"8RPE"}]},"3":{"1":[{"exercise":"Competition Squat","sets":4,"reps":6,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.73,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":4,"reps":6,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.73,"lift":"bench"},{"exercise":"Barbell Overhead Press","sets":3,"reps":7,"tempo":"1.0.1","rest":120,"type":"rpe","label":"7RPE"},{"exercise":"Bent Over Row","sets":3,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"7RPE"},{"exercise":"GHR Back Extensions","sets":5,"reps":10,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"2":[{"exercise":"Competition Deadlift","sets":4,"reps":6,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.73,"lift":"deadlift"},{"exercise":"3ct Pause Bench","sets":3,"reps":4,"tempo":"1.3.1","rest":180,"type":"pct","pct":0.65,"lift":"bench"},{"exercise":"SSB or High Bar Pause Squat","sets":3,"reps":4,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Wide Grip Seated Row","sets":5,"reps":8,"tempo":"1.1.1","rest":90,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pin Squat","sets":3,"reps":6,"tempo":"1.1.1","rest":120,"type":"pct","pct":0.68,"lift":"squat"},{"exercise":"2 Board Press","sets":3,"reps":4,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"},{"exercise":"1-Arm DB Rows","sets":5,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"7.5RPE"},{"exercise":"Birddogs","sets":3,"reps":8,"tempo":"1.1.1","rest":90,"type":"rpe","label":"7RPE"}],"4":[{"exercise":"Pause Deadlift","sets":3,"reps":6,"tempo":"x","rest":120,"type":"pct","pct":0.68,"lift":"deadlift"},{"exercise":"Touch and Go Bench","sets":4,"reps":10,"tempo":"1.0.1","rest":120,"type":"pct","pct":0.68,"lift":"bench"},{"exercise":"Stiff-Legged Deadlift","sets":3,"reps":6,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.45,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Tricep movement of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}]},"4":{"1":[{"exercise":"Competition Squat","sets":5,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.75,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":5,"reps":5,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.75,"lift":"bench"},{"exercise":"Barbell Overhead Press","sets":3,"reps":7,"tempo":"1.0.1","rest":120,"type":"rpe","label":"7RPE"},{"exercise":"Bent Over Row","sets":3,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"7RPE"},{"exercise":"GHR Back Extensions","sets":5,"reps":10,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"2":[{"exercise":"Competition Deadlift","sets":5,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.75,"lift":"deadlift"},{"exercise":"3ct Pause Bench","sets":3,"reps":3,"tempo":"1.3.1","rest":180,"type":"pct","pct":0.7,"lift":"bench"},{"exercise":"SSB or High Bar Pause Squat","sets":3,"reps":5,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Wide Grip Seated Row","sets":4,"reps":8,"tempo":"1.1.1","rest":90,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pin Squat","sets":3,"reps":5,"tempo":"1.1.1","rest":120,"type":"pct","pct":0.73,"lift":"squat"},{"exercise":"2 Board Press","sets":3,"reps":6,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"},{"exercise":"1-Arm DB Rows","sets":5,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"7.5RPE"},{"exercise":"Birddogs","sets":4,"reps":8,"tempo":"1.1.1","rest":90,"type":"rpe","label":"7RPE"}],"4":[{"exercise":"Pause Deadlift","sets":3,"reps":5,"tempo":"x","rest":120,"type":"pct","pct":0.73,"lift":"deadlift"},{"exercise":"Touch and Go Bench","sets":4,"reps":8,"tempo":"1.0.1","rest":120,"type":"pct","pct":0.7,"lift":"bench"},{"exercise":"Stiff-Legged Deadlift","sets":3,"reps":6,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.48,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Tricep movement of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}]}},"Weeks 5-8":{"8":{"1":[{"exercise":"Competition Squat","sets":4,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.85,"lift":"squat"},{"exercise":"Competition Squat","sets":3,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.75,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":5,"reps":3,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.85,"lift":"bench"},{"exercise":"Competition Pause Bench","sets":3,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.75,"lift":"bench"},{"exercise":"Stiff-Legged Deadlift","sets":4,"reps":7,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Side Planks","sets":4,"reps":"x","tempo":"x","rest":60,"type":"text","label":"45s"}],"2":[{"exercise":"Competition Deadlift","sets":4,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.85,"lift":"deadlift"},{"exercise":"Competition Deadlift","sets":3,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.75,"lift":"deadlift"},{"exercise":"2ct Pause Bench","sets":4,"reps":4,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.74,"lift":"squat"},{"exercise":"Wide Grip Seated Row","sets":4,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pause Squat","sets":4,"reps":2,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Competition Pause Bench","sets":6,"reps":5,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.68,"lift":"bench"},{"exercise":"Feet Up Bench","sets":4,"reps":4,"tempo":"1.1.1","rest":120,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.74,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}],"4":[{"exercise":"Pause Deadlift","sets":4,"reps":2,"tempo":"x","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Touch and Go Bench","sets":4,"reps":5,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Close Grip Incline Press","sets":4,"reps":10,"tempo":"1.0.1","rest":120,"type":"rpe","label":"7.5RPE"},{"exercise":"1-Arm DB Rows","sets":6,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}]},"5":{"1":[{"exercise":"Competition Squat","sets":3,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.8,"lift":"squat"},{"exercise":"Competition Squat","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.68,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":4,"reps":3,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.8,"lift":"bench"},{"exercise":"Competition Pause Bench","sets":2,"reps":5,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.68,"lift":"bench"},{"exercise":"Stiff-Legged Deadlift","sets":4,"reps":9,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Side Planks","sets":3,"reps":"x","tempo":"x","rest":60,"type":"text","label":"30s"}],"2":[{"exercise":"Competition Deadlift","sets":3,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.8,"lift":"deadlift"},{"exercise":"Competition Deadlift","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.68,"lift":"deadlift"},{"exercise":"2ct Pause Bench","sets":3,"reps":4,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.65,"lift":"squat"},{"exercise":"Wide Grip Seated Row","sets":4,"reps":10,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pause Squat","sets":4,"reps":4,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Pause Bench","sets":6,"reps":5,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.7,"lift":"bench"},{"exercise":"Feet Up Bench","sets":4,"reps":5,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.65,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":10,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}],"4":[{"exercise":"Pause Deadlift","sets":4,"reps":4,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Touch and Go Bench","sets":3,"reps":6,"tempo":"1.0.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Close Grip Incline Press","sets":4,"reps":8,"tempo":"1.0.1","rest":120,"type":"rpe","label":"7RPE"},{"exercise":"1-Arm DB Rows","sets":6,"reps":10,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}]},"6":{"1":[{"exercise":"Competition Squat","sets":4,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.82,"lift":"squat"},{"exercise":"Competition Squat","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.7,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":5,"reps":3,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.82,"lift":"bench"},{"exercise":"Competition Pause Bench","sets":3,"reps":5,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.7,"lift":"bench"},{"exercise":"Stiff-Legged Deadlift","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Side Planks","sets":4,"reps":"x","tempo":"x","rest":60,"type":"text","label":"30s"}],"2":[{"exercise":"Competition Deadlift","sets":4,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.82,"lift":"deadlift"},{"exercise":"Competition Deadlift","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.7,"lift":"deadlift"},{"exercise":"2ct Pause Bench","sets":4,"reps":3,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":3,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.68,"lift":"squat"},{"exercise":"Wide Grip Seated Row","sets":4,"reps":10,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pause Squat","sets":5,"reps":3,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Pause Bench","sets":6,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.73,"lift":"bench"},{"exercise":"Feet Up Bench","sets":3,"reps":4,"tempo":"1.1.1","rest":120,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":3,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.68,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":10,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}],"4":[{"exercise":"Pause Deadlift","sets":5,"reps":3,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Touch and Go Bench","sets":3,"reps":12,"tempo":"1.0.1","rest":180,"type":"rpe","label":"10RPE"},{"exercise":"Close Grip Incline Press","sets":4,"reps":7,"tempo":"1.0.1","rest":120,"type":"rpe","label":"7.5RPE"},{"exercise":"1-Arm DB Rows","sets":6,"reps":10,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}]},"7":{"1":[{"exercise":"Competition Squat","sets":5,"reps":2,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.86,"lift":"squat"},{"exercise":"Competition Squat","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.72,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":5,"reps":2,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.86,"lift":"bench"},{"exercise":"Competition Pause Bench","sets":2,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.72,"lift":"bench"},{"exercise":"Stiff-Legged Deadlift","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Side Planks","sets":4,"reps":"x","tempo":"x","rest":60,"type":"text","label":"45s"}],"2":[{"exercise":"Competition Deadlift","sets":5,"reps":2,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.86,"lift":"deadlift"},{"exercise":"Competition Deadlift","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.72,"lift":"deadlift"},{"exercise":"2ct Pause Bench","sets":3,"reps":3,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.71,"lift":"squat"},{"exercise":"Wide Grip Seated Row","sets":4,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pause Squat","sets":4,"reps":5,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Competition Pause Bench","sets":6,"reps":3,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.75,"lift":"bench"},{"exercise":"Feet Up Bench","sets":4,"reps":3,"tempo":"1.1.1","rest":120,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.71,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}],"4":[{"exercise":"Pause Deadlift","sets":4,"reps":5,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Touch and Go Bench","sets":4,"reps":7,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Close Grip Incline Press","sets":5,"reps":6,"tempo":"1.0.1","rest":120,"type":"rpe","label":"7RPE"},{"exercise":"1-Arm DB Rows","sets":6,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}]}},
"Weeks 9-11":{"9":{"1":[{"exercise":"Competition Squat","sets":5,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.82,"lift":"squat"},{"exercise":"Competition Squat","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.71,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":6,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.82,"lift":"bench"},{"exercise":"Competition Pause Bench","sets":2,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.71,"lift":"bench"},{"exercise":"Bent Over Row","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Rolling Planks","sets":3,"reps":20,"tempo":"x","rest":60,"type":"rpe","label":"7RPE"}],"2":[{"exercise":"Competition Deadlift","sets":4,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.82,"lift":"deadlift"},{"exercise":"Competition Deadlift","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.71,"lift":"deadlift"},{"exercise":"Pin Press","sets":4,"reps":4,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":3,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.68,"lift":"squat"},{"exercise":"Wide Grip Seated Row","sets":4,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pause Squat","sets":1,"reps":4,"tempo":"1.2.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pause Squat","sets":2,"reps":4,"tempo":"1.2.1","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"Competition Pause Bench","sets":6,"reps":5,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.72,"lift":"bench"},{"exercise":"Close Grip Bench","sets":3,"reps":4,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":2,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.68,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}],"4":[{"exercise":"Pause Deadlift","sets":1,"reps":4,"tempo":"x","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pause Deadlift","sets":2,"reps":4,"tempo":"x","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"Bench +mini bands","sets":1,"reps":8,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Bench +mini bands","sets":1,"reps":8,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"Barbell Overhead Press","sets":4,"reps":7,"tempo":"1.0.1","rest":120,"type":"rpe","label":"8RPE"},{"exercise":"1-Arm DB Rows","sets":5,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}]},"10":{"1":[{"exercise":"Competition Squat","sets":6,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.85,"lift":"squat"},{"exercise":"Competition Squat","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.74,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":7,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.85,"lift":"bench"},{"exercise":"Competition Pause Bench","sets":2,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.74,"lift":"bench"},{"exercise":"Bent Over Row","sets":4,"reps":6,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Rolling Planks","sets":4,"reps":20,"tempo":"x","rest":60,"type":"rpe","label":"7RPE"}],"2":[{"exercise":"Competition Deadlift","sets":5,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.85,"lift":"deadlift"},{"exercise":"Competition Deadlift","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.74,"lift":"deadlift"},{"exercise":"Pin Press","sets":4,"reps":5,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":3,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.71,"lift":"squat"},{"exercise":"Wide Grip Seated Row","sets":4,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pause Squat","sets":1,"reps":2,"tempo":"1.2.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pause Squat","sets":3,"reps":2,"tempo":"1.2.1","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"Competition Pause Bench","sets":6,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.75,"lift":"bench"},{"exercise":"Close Grip Bench","sets":1,"reps":3,"tempo":"1.1.1","rest":120,"type":"rpe","label":"9RPE"},{"exercise":"Close Grip Bench","sets":1,"reps":3,"tempo":"1.1.1","rest":120,"type":"load_drop","label":"5% Load Drop"},{"exercise":"Competition Deadlift","sets":3,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.71,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"}],"4":[{"exercise":"Pause Deadlift","sets":1,"reps":2,"tempo":"x","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pause Deadlift","sets":3,"reps":2,"tempo":"x","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"Bench +mini bands","sets":1,"reps":7,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Bench +mini bands","sets":1,"reps":7,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"Barbell Overhead Press","sets":3,"reps":8,"tempo":"1.0.1","rest":120,"type":"rpe","label":"8RPE"},{"exercise":"1-Arm DB Rows","sets":5,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}]},"11":{"1":[{"exercise":"Competition Squat","sets":3,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.83,"lift":"squat"},{"exercise":"Competition Squat","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.76,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":3,"reps":3,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.83,"lift":"bench"},{"exercise":"Competition Pause Bench","sets":2,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.76,"lift":"bench"},{"exercise":"Bent Over Row","sets":4,"reps":5,"tempo":"1.0.1","rest":90,"type":"rpe","label":"8RPE"},{"exercise":"Rolling Planks","sets":4,"reps":24,"tempo":"x","rest":60,"type":"rpe","label":"7RPE"}],"2":[{"exercise":"Competition Deadlift","sets":3,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.83,"lift":"deadlift"},{"exercise":"Competition Deadlift","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.76,"lift":"deadlift"},{"exercise":"Pin Press","sets":4,"reps":3,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":3,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.74,"lift":"squat"},{"exercise":"Wide Grip Seated Row","sets":4,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pause Squat","sets":2,"reps":3,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Pause Bench","sets":5,"reps":3,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.78,"lift":"bench"},{"exercise":"Close Grip Bench","sets":2,"reps":2,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":3,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.74,"lift":"deadlift"},{"exercise":"Vertical Pull of choice","sets":4,"reps":8,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"}],"4":[{"exercise":"Pause Deadlift","sets":2,"reps":3,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Bench +mini bands","sets":1,"reps":6,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Bench +mini bands","sets":1,"reps":6,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"Barbell Overhead Press","sets":3,"reps":5,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"1-Arm DB Rows","sets":5,"reps":8,"tempo":"1.0.1","rest":60,"type":"rpe","label":"8RPE"}]}},
"Weeks 12-15":{"12":{"1":[{"exercise":"Competition Squat","sets":1,"reps":3,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":6,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.65,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":1,"reps":3,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Pause Bench","sets":7,"reps":5,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.65,"lift":"bench"},{"exercise":"Barbell Overhead Press","sets":1,"reps":6,"tempo":"1.0.1","rest":120,"type":"rpe","label":"9RPE"},{"exercise":"Barbell Overhead Press","sets":1,"reps":6,"tempo":"1.0.1","rest":120,"type":"load_drop","label":"-5% Load Drop"}],"2":[{"exercise":"Competition Deadlift","sets":1,"reps":3,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":6,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.65,"lift":"deadlift"},{"exercise":"2ct Pause Bench","sets":1,"reps":4,"tempo":"1.2.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"2ct Pause Bench","sets":2,"reps":4,"tempo":"1.2.1","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"High Bar Squat","sets":3,"reps":4,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pin Squat","sets":1,"reps":3,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pin Squat","sets":1,"reps":4,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pin Squat","sets":1,"reps":4,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Close Grip Bench","sets":1,"reps":3,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Close Grip Bench","sets":2,"reps":3,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Feet Up Bench","sets":1,"reps":5,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Feet Up Bench","sets":1,"reps":5,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"}],"4":[{"exercise":"Pause Deadlift","sets":1,"reps":3,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pause Deadlift","sets":1,"reps":5,"tempo":"x","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pause Deadlift","sets":1,"reps":5,"tempo":"x","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Touch and Go Bench","sets":4,"reps":5,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"}]},"13":{"1":[{"exercise":"Competition Squat","sets":1,"reps":2,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":6,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.68,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":1,"reps":2,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Pause Bench","sets":7,"reps":5,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.68,"lift":"bench"},{"exercise":"Barbell Overhead Press","sets":1,"reps":7,"tempo":"1.0.1","rest":90,"type":"rpe","label":"9RPE"},{"exercise":"Barbell Overhead Press","sets":1,"reps":7,"tempo":"1.0.1","rest":90,"type":"load_drop","label":"-5% Load Drop"}],"2":[{"exercise":"Competition Deadlift","sets":1,"reps":2,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":6,"reps":5,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.68,"lift":"deadlift"},{"exercise":"2ct Pause Bench","sets":3,"reps":5,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"High Bar Squat","sets":1,"reps":3,"tempo":"1.0.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"High Bar Squat","sets":1,"reps":3,"tempo":"1.0.1","rest":180,"type":"load_drop","label":"5% Load Drop"}],"3":[{"exercise":"Pin Squat","sets":1,"reps":2,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pin Squat","sets":1,"reps":5,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pin Squat","sets":1,"reps":5,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Close Grip Bench","sets":1,"reps":2,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Close Grip Bench","sets":1,"reps":2,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Feet Up Bench","sets":1,"reps":6,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Feet Up Bench","sets":1,"reps":6,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"}],"4":[{"exercise":"Pause Deadlift","sets":1,"reps":2,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pause Deadlift","sets":3,"reps":4,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Touch and Go Bench","sets":4,"reps":4,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"}]},"14":{"1":[{"exercise":"Competition Squat","sets":1,"reps":1,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":4,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.72,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":1,"reps":1,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Competition Pause Bench","sets":5,"reps":4,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.72,"lift":"bench"},{"exercise":"Barbell Overhead Press","sets":3,"reps":6,"tempo":"1.0.1","rest":120,"type":"rpe","label":"8RPE"}],"2":[{"exercise":"Competition Deadlift","sets":1,"reps":1,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":4,"reps":4,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.72,"lift":"deadlift"},{"exercise":"2ct Pause Bench","sets":1,"reps":2,"tempo":"1.2.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"2ct Pause Bench","sets":2,"reps":2,"tempo":"1.2.1","rest":180,"type":"load_drop","label":"5% Load Drop"},{"exercise":"High Bar Squat","sets":1,"reps":4,"tempo":"1.0.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"High Bar Squat","sets":2,"reps":4,"tempo":"1.0.1","rest":180,"type":"load_drop","label":"5% Load Drop"}],"3":[{"exercise":"Pin Squat","sets":1,"reps":1,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pin Squat","sets":1,"reps":2,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pin Squat","sets":1,"reps":2,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Close Grip Bench","sets":3,"reps":3,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Feet Up Bench","sets":1,"reps":3,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Feet Up Bench","sets":1,"reps":3,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"}],"4":[{"exercise":"Pause Deadlift","sets":1,"reps":1,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pause Deadlift","sets":1,"reps":2,"tempo":"x","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pause Deadlift","sets":2,"reps":2,"tempo":"x","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Touch and Go Bench","sets":1,"reps":3,"tempo":"1.0.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Touch and Go Bench","sets":1,"reps":3,"tempo":"1.0.1","rest":180,"type":"load_drop","label":"-5% Load Drop"}]},"15":{"1":[{"exercise":"Competition Squat","sets":1,"reps":1,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Squat","sets":3,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.76,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":1,"reps":1,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Competition Pause Bench","sets":4,"reps":3,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.76,"lift":"bench"},{"exercise":"Barbell Overhead Press","sets":1,"reps":5,"tempo":"1.0.1","rest":90,"type":"rpe","label":"9RPE"},{"exercise":"Barbell Overhead Press","sets":1,"reps":5,"tempo":"1.0.1","rest":90,"type":"load_drop","label":"-5% Load Drop"}],"2":[{"exercise":"Competition Deadlift","sets":1,"reps":1,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Competition Deadlift","sets":3,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.76,"lift":"deadlift"},{"exercise":"2ct Pause Bench","sets":3,"reps":4,"tempo":"1.2.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"High Bar Squat","sets":2,"reps":2,"tempo":"1.0.1","rest":180,"type":"rpe","label":"8RPE"}],"3":[{"exercise":"Pin Squat","sets":1,"reps":1,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pin Squat","sets":1,"reps":4,"tempo":"1.1.1","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pin Squat","sets":2,"reps":4,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Close Grip Bench","sets":1,"reps":4,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Close Grip Bench","sets":1,"reps":4,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Feet Up Bench","sets":1,"reps":4,"tempo":"1.1.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Feet Up Bench","sets":1,"reps":4,"tempo":"1.1.1","rest":180,"type":"load_drop","label":"-5% Load Drop"}],"4":[{"exercise":"Pause Deadlift","sets":1,"reps":1,"tempo":"x","rest":180,"type":"rpe","label":"8RPE"},{"exercise":"Pause Deadlift","sets":1,"reps":4,"tempo":"x","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Pause Deadlift","sets":2,"reps":4,"tempo":"x","rest":180,"type":"load_drop","label":"-5% Load Drop"},{"exercise":"Touch and Go Bench","sets":1,"reps":3,"tempo":"1.0.1","rest":180,"type":"rpe","label":"9RPE"},{"exercise":"Touch and Go Bench","sets":2,"reps":3,"tempo":"1.0.1","rest":180,"type":"load_drop","label":"-5% Load Drop"}]}}},
"taper":{"5 Days from Competition":[{"exercise":"Competition Squat","sets":1,"reps":1,"tempo":"1.0.1","rest":180,"type":"opener","label":"Opener"},{"exercise":"Competition Squat","sets":3,"reps":2,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.82,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":1,"reps":1,"tempo":"1.1.1","rest":180,"type":"opener","label":"Opener"},{"exercise":"Competition Pause Bench","sets":3,"reps":2,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.84,"lift":"bench"}],"4 Days from Competition":[{"exercise":"Competition Deadlift","sets":1,"reps":1,"tempo":"1.0.1","rest":180,"type":"opener","label":"Opener"},{"exercise":"Competition Deadlift","sets":2,"reps":2,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.82,"lift":"deadlift"},{"exercise":"Competition Pause Bench","sets":4,"reps":1,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.85,"lift":"bench"}],"3 Days From Competition":[{"exercise":"Competition Squat","sets":1,"reps":1,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.85,"lift":"squat"},{"exercise":"Competition Squat","sets":2,"reps":2,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.78,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":1,"reps":1,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.85,"lift":"bench"},{"exercise":"Competition Pause Bench","sets":3,"reps":2,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.78,"lift":"bench"},{"exercise":"Competition Deadlift","sets":1,"reps":1,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.82,"lift":"deadlift"},{"exercise":"Competition Deadlift","sets":2,"reps":2,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.75,"lift":"deadlift"}],"2 Days From Competition":[{"exercise":"Competition Squat","sets":2,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.75,"lift":"squat"},{"exercise":"Competition Pause Bench","sets":3,"reps":3,"tempo":"1.1.1","rest":180,"type":"pct","pct":0.78,"lift":"bench"},{"exercise":"Competition Deadlift","sets":1,"reps":3,"tempo":"1.0.1","rest":180,"type":"pct","pct":0.75,"lift":"deadlift"}]}}`);

const PHASE_ORDER = ["Weeks 1-4", "Weeks 5-8", "Weeks 9-11", "Weeks 12-15", "Taper Week"];
const LIFT_META = {
  squat: { label: "Squat", color: "var(--cb-rust)" },
  bench: { label: "Bench", color: "var(--cb-blue)" },
  deadlift: { label: "Deadlift", color: "var(--cb-gold)" },
};

/* The parser only tags entry.lift for %RM-based sets (it reads the formula's
   training-max reference). RPE/opener/text/load-drop sets for the very same
   lifts (e.g. "2ct Pause Squat" run at RPE) never get tagged that way, so we
   fall back to matching the exercise name for every entry type. */
function inferLiftFromName(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes("row")) return null; // e.g. "Seated Row (mimic bench movement)" is a row, not a bench press
  if (n.includes("squat")) return "squat";
  if (n.includes("deadlift")) return "deadlift";
  if (n.includes("bench") || n.includes("board press") || n.includes("pin press") || (n.includes("close grip") && n.includes("press"))) return "bench";
  return null;
}
function resolveLift(entry) {
  return entry.lift || inferLiftFromName(entry.exercise);
}

const PLATES_LB = [45, 35, 25, 10, 5, 2.5];
const PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];
const BAR_PRESETS = {
  standard: { kg: 20, lb: 45, label: "20 kg / 45 lb (standard)" },
  short: { kg: 15, lb: 33, label: "15 kg / 33 lb (short/women's)" },
};
const KG_PER_LB = 0.45359237;

const TAPER_LABELS_SORTED = Object.keys(PROGRAM_DATA.taper).sort((a, b) => {
  const na = parseInt(a);
  const nb = parseInt(b);
  return nb - na; // 5,4,3,2
});

/* ============================= UNIT / MATH HELPERS ============================= */
function lbToKg(lb) {
  return lb * KG_PER_LB;
}
function kgToLb(kg) {
  return kg / KG_PER_LB;
}
function roundToIncrement(value, inc) {
  if (!inc) inc = 1;
  return Math.round(value / inc) * inc;
}
function toDisplay(rawLb, unit, roundToLb, roundToKg) {
  if (rawLb == null || isNaN(rawLb)) return null;
  if (unit === "kg") return roundToIncrement(lbToKg(rawLb), roundToKg);
  return roundToIncrement(rawLb, roundToLb);
}
/* For actual logged weights (as opposed to prescribed/plate-rounded ones) —
   plain unit conversion only, no snapping to the nearest plate increment,
   so typing/editing an arbitrary number isn't corrupted mid-keystroke. */
function lbToDisplayRaw(lb, unit) {
  if (lb == null || isNaN(lb)) return null;
  const v = unit === "kg" ? lbToKg(lb) : lb;
  return Math.round(v * 100) / 100;
}
function displayToLb(value, unit) {
  if (value == null || value === "" || isNaN(value)) return null;
  return unit === "kg" ? kgToLb(Number(value)) : Number(value);
}
function calcRawLb(entry, maxesLb) {
  if (entry.type !== "pct" || !entry.lift) return null;
  const tm = Number(maxesLb[entry.lift]);
  if (!tm || !entry.pct) return null;
  return tm * entry.pct;
}
function platesPerSide(totalDisplay, unit, barType) {
  const preset = BAR_PRESETS[barType] || BAR_PRESETS.standard;
  const bar = preset[unit];
  const set = unit === "kg" ? PLATES_KG : PLATES_LB;
  if (!totalDisplay || totalDisplay <= bar) return [];
  let remaining = (totalDisplay - bar) / 2;
  const result = [];
  for (const p of set) {
    while (remaining + 1e-6 >= p) {
      result.push(p);
      remaining -= p;
    }
  }
  return result;
}
function epleyE1rmLb(weightLb, reps) {
  if (!weightLb || !reps) return null;
  return weightLb * (1 + reps / 30);
}

function prescribedValues(entry, maxesLb, unit, roundToLb, roundToKg) {
  const r = entry.reps != null && !isNaN(Number(entry.reps)) ? Number(entry.reps) : null;
  let w = null;
  let rpe = null;
  if (entry.type === "pct") {
    const raw = calcRawLb(entry, maxesLb);
    const disp = toDisplay(raw, unit, roundToLb, roundToKg);
    w = disp != null ? displayToLb(disp, unit) : null;
  } else if (entry.type === "rpe" && entry.label) {
    const m = entry.label.match(/(\d+(\.\d+)?)/);
    rpe = m ? Number(m[1]) : null;
  }
  return { w, r, rpe };
}

function isMatchPrescribed(entry, log, prescribed) {
  if (entry.type === "pct") {
    if (log.w == null || log.r == null || prescribed.w == null) return false;
    return Math.abs(log.w - prescribed.w) < 0.6 && Number(log.r) === prescribed.r;
  }
  if (entry.type === "rpe") {
    if (log.r == null || prescribed.r == null) return false;
    const rpeOk = prescribed.rpe == null || (log.rpe != null && Math.abs(log.rpe - prescribed.rpe) < 0.01);
    return Number(log.r) === prescribed.r && rpeOk;
  }
  if (prescribed.r != null) return log.r != null && Number(log.r) === prescribed.r;
  return false;
}

/* ============================= WEEK / DAY MAPPING ============================= */
function weekToPhase(week) {
  const w = Number(week);
  if (w >= 1 && w <= 4) return "Weeks 1-4";
  if (w >= 5 && w <= 8) return "Weeks 5-8";
  if (w >= 9 && w <= 11) return "Weeks 9-11";
  if (w >= 12 && w <= 15) return "Weeks 12-15";
  if (w === 16) return "Taper Week";
  return null;
}
function getEntriesAbs(week, day) {
  const w = Number(week);
  if (w === 16) {
    const label = TAPER_LABELS_SORTED[day - 1];
    return (label && PROGRAM_DATA.taper[label]) || [];
  }
  const phase = weekToPhase(w);
  if (!phase) return [];
  return PROGRAM_DATA.phases[phase]?.[String(w)]?.[String(day)] || [];
}
function sessionKey(week, day) {
  return `session:${week}:${day}`;
}
const ALL_WEEKS = Array.from({ length: 16 }, (_, i) => i + 1);
const ALL_DAYS = [1, 2, 3, 4];

/* Fill in a short description for any exercise here, keyed by its exact
   name as it appears in PROGRAM_DATA (e.g. "Competition Squat"). Anything
   left out just shows a "no description yet" placeholder in the Exercises tab. */
const EXERCISE_DESCRIPTIONS = {
  "Rolling Planks": "Total reps, not per side.",
  "Side Planks": "Seconds per side.",
  "Birddogs": "Reps per side.",
  "Pin Press": "Set pins at chest level.",
};

/* Every distinct exercise name that appears anywhere in the program,
   walked in program order and de-duplicated, each tagged with the lift
   it resolves to (if any) so the Exercises tab can show a LiftBadge. */
function getAllExercises() {
  const seen = new Map();
  for (const week of ALL_WEEKS) {
    for (const day of ALL_DAYS) {
      getEntriesAbs(week, day).forEach((entry) => {
        if (!seen.has(entry.exercise)) {
          seen.set(entry.exercise, { exercise: entry.exercise, lift: resolveLift(entry) });
        }
      });
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.exercise.localeCompare(b.exercise));
}
const ALL_EXERCISES = getAllExercises();

/* ============================= STORAGE HELPERS =============================
   Everything now lives server-side in Supabase, scoped to the logged-in
   user via their session cookie — the API routes handle the actual
   database access and auth check, this layer just calls them. Same
   function names/shapes as before so every call site elsewhere in the
   app (which already awaits these) didn't need to change. */
async function storageGet(key, fallback) {
  try {
    const res = await fetch(`/api/data/${encodeURIComponent(key)}`);
    if (res.status === 404) return fallback;
    if (!res.ok) return fallback;
    const body = await res.json();
    return body.value;
  } catch (e) {
    /* offline, network error, etc. -> fallback */
  }
  return fallback;
}
async function storageSet(key, value) {
  try {
    await fetch(`/api/data/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
  } catch (e) {
    console.error("storage set failed", e);
  }
}
async function storageListPrefix(prefix) {
  try {
    const res = await fetch(`/api/data-list?prefix=${encodeURIComponent(prefix)}`);
    if (!res.ok) return [];
    const body = await res.json();
    return body.keys || [];
  } catch (e) {
    return [];
  }
}
async function loadAllSessions() {
  try {
    const res = await fetch(`/api/data-list?prefix=${encodeURIComponent("session:")}&values=1`);
    if (!res.ok) return {};
    const body = await res.json();
    const map = {};
    (body.items || []).forEach((row) => {
      map[row.key.replace("session:", "")] = row.value;
    });
    return map;
  } catch (e) {
    return {};
  }
}

const EMPTY_SESSION = () => ({ completion: {}, logs: {}, notes: "", date: "", manuallyCompleted: false });

/* A shared AudioContext, created/resumed only inside a real user-gesture
   handler (e.g. tapping a set checkbox) so the browser's autoplay policy
   allows it. Once unlocked this way, it stays usable for the beep that
   plays later when the rest timer reaches zero (no gesture required then). */
let sharedAudioCtx = null;
function primeAudioCtx() {
  try {
    if (!sharedAudioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) sharedAudioCtx = new Ctx();
    }
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
  } catch (e) {
    /* Web Audio unavailable — the visual alert still works fine on its own. */
  }
}
function playRestCompleteTone() {
  const ctx = sharedAudioCtx;
  if (!ctx) return;
  try {
    const beep = (freq, startAt, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.35, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + dur + 0.02);
    };
    const t0 = ctx.currentTime;
    beep(880, t0, 0.16);
    beep(1046.5, t0 + 0.2, 0.22);
  } catch (e) {
    /* ignore playback errors */
  }
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function totalSetsFor(entry) {
  const n = Math.round(Number(entry.sets));
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/* Reads a per-set completion array for an entry, tolerant of the older
   single-boolean format (a fully-checked exercise from before per-set
   tracking existed) and of an array whose length no longer matches sets. */
function getSetStates(entry, session, idx) {
  const total = totalSetsFor(entry);
  const raw = session.completion?.[idx];
  if (Array.isArray(raw)) {
    const arr = raw.slice(0, total);
    while (arr.length < total) arr.push(false);
    return arr;
  }
  if (raw === true) return Array(total).fill(true);
  return Array(total).fill(false);
}

/* Whether every set of every exercise has actually been checked off,
   ignoring any manual override. */
function allSetsChecked(entries, session) {
  if (!entries || entries.length === 0) return false;
  return entries.every((entry, idx) => {
    const st = getSetStates(entry, session, idx);
    return st.length > 0 && st.every(Boolean);
  });
}

/* A day counts as complete either because every set was checked off, or
   because the person explicitly marked it complete anyway (e.g. they
   skipped an exercise or some sets but still want the program to move
   on). Everything that drives "is this day done" — the day-card badge,
   Next Workout progression, etc. — should go through this. */
function isDayComplete(entries, session) {
  if (session && session.manuallyCompleted) return true;
  return allSetsChecked(entries, session);
}

/* The day immediately after the most recently completed day, walking the
   program in order (week 1 day 1 ... week 16 day 4). If nothing has been
   completed yet, that's week 1 day 1. Returns null once the whole program
   is finished. */
function buildProgramSequence() {
  const sequence = [];
  for (let w = 1; w <= 16; w++) {
    for (let d = 1; d <= 4; d++) {
      if (getEntriesAbs(w, d).length > 0) sequence.push({ week: w, day: d });
    }
  }
  return sequence;
}
const PROGRAM_SEQUENCE = buildProgramSequence();

function computeNextWorkout(allSessions) {
  const sequence = PROGRAM_SEQUENCE;
  let lastCompletedIndex = -1;
  sequence.forEach((pt, i) => {
    const session = allSessions[`${pt.week}:${pt.day}`];
    if (session && isDayComplete(getEntriesAbs(pt.week, pt.day), session)) lastCompletedIndex = i;
  });
  const nextIndex = lastCompletedIndex + 1;
  return nextIndex < sequence.length ? sequence[nextIndex] : null;
}

/* The all-time heaviest logged weight per exercise, across every session
   regardless of program start date — the single source of truth for what
   counts as a PB. Shared by the Log tab's PB medal and the Exercises tab's
   PB stat, so the two can never drift out of sync. */
function computeAllTimeBestWeights(allSessions) {
  const map = {};
  for (const key of Object.keys(allSessions || {})) {
    const [weekStr, dayStr] = key.split(":");
    const week = Number(weekStr);
    const day = Number(dayStr);
    const session = allSessions[key];
    const entries = getEntriesAbs(week, day);
    entries.forEach((entry, idx) => {
      const log = session.logs?.[idx];
      if (!log || log.w == null) return;
      if (!map[entry.exercise] || log.w > map[entry.exercise]) map[entry.exercise] = log.w;
    });
  }
  return map;
}

/* ============================= SMALL UI PIECES ============================= */
function LiftBadge({ lift }) {
  const meta = LIFT_META[lift];
  if (!meta) return null;
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: meta.color,
        marginRight: 7,
        flexShrink: 0,
      }}
    />
  );
}

/* A small gold medal icon, shown next to a set that matches or beats the
   all-time best weight logged for that exercise. */
function PBMedal({ size = 16 }) {
  return (
    <span title="Personal best" aria-label="Personal best" style={{ display: "inline-flex", flexShrink: 0, lineHeight: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M8.3 2h7.4l-2.1 7.5h-3.2L8.3 2z" fill="var(--cb-medal-gold)" />
        <circle cx="12" cy="15" r="6.6" fill="var(--cb-medal-gold)" stroke="var(--cb-medal-ribbon)" strokeWidth="1" />
        <path d="M12 11.6l1.05 2.15 2.35.35-1.7 1.65.4 2.35-2.1-1.1-2.1 1.1.4-2.35-1.7-1.65 2.35-.35 1.05-2.15z" fill="var(--cb-medal-ribbon)" />
      </svg>
    </span>
  );
}

function unitLabel(unit) {
  return unit === "kg" ? "kg" : "lb";
}

/* Shared list of the five main app sections, used by both the desktop
   text tabs and the mobile icon+label tabs so the two stay in sync. */
const NAV_TABS = [
  { value: "overview", label: "Week Overview", shortLabel: "Overview" },
  { value: "log", label: "Log", shortLabel: "Log" },
  { value: "calendar", label: "Calendar", shortLabel: "Calendar" },
  { value: "insights", label: "Insights", shortLabel: "Insights" },
  { value: "exercises", label: "Exercises", shortLabel: "Exercises" },
];

/* Simple line icons (stroke only, no fill) matching the weight of the
   gear/chevron/checkmark icons already used elsewhere in the app. */
function NavTabIcon({ value, size = 20 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (value) {
    case "overview":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1.2" />
          <rect x="13" y="4" width="7" height="7" rx="1.2" />
          <rect x="4" y="13" width="7" height="7" rx="1.2" />
          <rect x="13" y="13" width="7" height="7" rx="1.2" />
        </svg>
      );
    case "log":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <rect x="9" y="2" width="6" height="4" rx="1" />
          <path d="M8.5 13l2.5 2.5L15.5 10" />
        </svg>
      );
    case "exercises":
      return (
        <svg {...common}>
          <rect x="2" y="9" width="3" height="6" rx="1" />
          <rect x="19" y="9" width="3" height="6" rx="1" />
          <rect x="6" y="7" width="2.5" height="10" rx="1" />
          <rect x="15.5" y="7" width="2.5" height="10" rx="1" />
          <line x1="8.5" y1="12" x2="15.5" y2="12" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="3" y1="9.5" x2="21" y2="9.5" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
        </svg>
      );
    case "insights":
      return (
        <svg {...common}>
          <path d="M4 17l5-6 4 4 7-9" />
          <circle cx="4" cy="17" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="9" cy="11" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="13" cy="15" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="20" cy="6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginTop: 14 }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          paddingTop: 8,
          paddingBottom: 8,
          borderBottom: "1px solid var(--cb-border)",
        }}
      >
        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cb-text-muted)" }}>
          {title}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cb-text-faint)" strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}

function LoadDisplay({ entry, maxesLb, unit, roundToLb, roundToKg, barType, showPlates = true }) {
  if (entry.type === "pct") {
    const raw = calcRawLb(entry, maxesLb);
    const w = toDisplay(raw, unit, roundToLb, roundToKg);
    const plates = w && showPlates ? platesPerSide(w, unit, barType) : [];
    return (
      <div style={{ textAlign: "right", marginLeft: "auto" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--cb-text-primary)" }}>
          {w ? `${w}` : "—"}
          <span style={{ fontSize: 12, color: "var(--cb-text-muted-2)", marginLeft: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
            {unitLabel(unit)} · {Math.round(entry.pct * 100)}%
          </span>
        </div>
        {plates.length > 0 && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--cb-text-faint)", marginTop: 2 }}>
            {plates.join(" / ")} <span style={{ opacity: 0.6 }}>per side</span>
          </div>
        )}
      </div>
    );
  }
  if (entry.type === "rpe") {
    return (
      <div style={{ textAlign: "right", marginLeft: "auto" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--cb-text-primary)" }}>
          {entry.label.replace(/RPE/i, "")}
          <span style={{ fontSize: 12, color: "var(--cb-text-muted-2)", marginLeft: 3, fontFamily: "'IBM Plex Mono', monospace" }}>RPE</span>
        </div>
      </div>
    );
  }
  if (entry.type === "opener") {
    return (
      <div style={{ textAlign: "right", marginLeft: "auto" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, color: "var(--cb-gold)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Opener
        </div>
      </div>
    );
  }
  if (entry.type === "load_drop") {
    return (
      <div style={{ textAlign: "right", marginLeft: "auto" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, color: "var(--cb-rust)" }}>{entry.label}</div>
      </div>
    );
  }
  if (entry.type === "text") {
    return (
      <div style={{ textAlign: "right", marginLeft: "auto" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--cb-text-muted)" }}>{entry.label}</div>
      </div>
    );
  }
  return null;
}

/* small numeric input used in the log-expand panel */
function LogField({ label, value, onChange, step, placeholder, min, max }) {
  const handleChange = (raw) => {
    if (raw === "") {
      onChange(null);
      return;
    }
    let n = Number(raw);
    if (Number.isNaN(n)) {
      onChange(null);
      return;
    }
    if (min != null && n < min) n = min;
    if (max != null && n > max) n = max;
    onChange(n);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 0", minWidth: 0 }}>
      <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>
        {label}
      </span>
      <input
        type="number"
        step={step || 1}
        min={min}
        max={max}
        value={value ?? ""}
        placeholder={placeholder || "-"}
        onChange={(e) => handleChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          minWidth: 0,
          padding: "12px 10px",
          background: "var(--cb-bg)",
          border: "1px solid var(--cb-border-strong)",
          borderRadius: 5,
          color: "var(--cb-text-primary)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 16,
        }}
      />
    </div>
  );
}

function verdictFor(entry, log, unit, roundToLb, roundToKg) {
  if (log.r == null) return null;
  const repsTarget = Number(entry.reps);
  if (isNaN(repsTarget)) return null;
  if (log.r > repsTarget) return { text: "Exceeded", color: "var(--cb-green-light)" };
  if (log.r === repsTarget) return { text: "Hit", color: "var(--cb-text-muted-2)" };
  return { text: "Missed", color: "var(--cb-rust)" };
}

function ExerciseRow({ entry, idx, setStates, onToggleSet, log, onLogChange, expanded, onToggleExpand, maxesLb, unit, roundToLb, roundToKg, barType, onOpenHistory, onViewInExercises, bestWeightLb }) {
  const verdict = verdictFor(entry, log, unit, roundToLb, roundToKg);
  const prescribed = prescribedValues(entry, maxesLb, unit, roundToLb, roundToKg);
  const matched = isMatchPrescribed(entry, log, prescribed);
  const totalSets = setStates.length;
  const doneCount = setStates.filter(Boolean).length;
  const done = totalSets > 0 && doneCount === totalSets;
  const isPB = log.w != null && bestWeightLb != null && log.w >= bestWeightLb;

  return (
    <div style={{ borderBottom: "1px solid var(--cb-border)" }}>
      <div
        className="cb-row"
        style={{
          padding: "14px 16px",
          borderLeft: done ? "3px solid var(--cb-green)" : "3px solid transparent",
          transition: "border-color 0.15s ease",
          position: "relative",
        }}
      >
        {isPB && (
          <span style={{ position: "absolute", top: 10, right: 12 }}>
            <PBMedal size={18} />
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", rowGap: 4, paddingRight: isPB ? 26 : 0 }}>
          {done ? (
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "var(--cb-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginRight: 7,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cb-text-on-green)" strokeWidth="4">
                <path d="M4 12.5l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <LiftBadge lift={resolveLift(entry)} />
          )}
          <span
            className="cb-name"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewInExercises) onViewInExercises(entry.exercise);
            }}
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 16,
              fontWeight: 500,
              color: done ? "var(--cb-green-text)" : "var(--cb-text-primary)",
              wordBreak: "break-word",
              cursor: "pointer",
              padding: "8px 4px",
              margin: "-8px -4px",
              display: "inline-block",
            }}
          >
            {entry.exercise}
          </span>
          {done && (
            <span
              style={{
                marginLeft: 10,
                fontFamily: "'Oswald', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--cb-text-on-green)",
                background: "var(--cb-green-light)",
                borderRadius: 3,
                padding: "2px 7px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Completed
            </span>
          )}
          {verdict && (
            <span style={{ marginLeft: 8, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: verdict.color, border: `1px solid ${verdict.color}`, borderRadius: 3, padding: "1px 6px" }}>
              {verdict.text}
            </span>
          )}
        </div>

        <div className="cb-meta" style={{ display: "flex", gap: 16, marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: "var(--cb-text-secondary)", flexWrap: "wrap" }}>
          <span>{entry.sets}×{entry.reps ?? "-"}</span>
          {entry.tempo && entry.tempo !== "x" && <span>tempo {entry.tempo}</span>}
          {entry.rest && <span>rest {entry.rest}s</span>}
        </div>

        <div className="cb-set-boxes" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {setStates.map((checked, si) => (
            <div
              key={si}
              className="cb-set-box"
              onClick={() => onToggleSet(idx, si)}
              aria-label={`Set ${si + 1} of ${totalSets}`}
              style={{
                width: 29,
                height: 29,
                borderRadius: 5,
                border: `2px solid ${checked ? (done ? "var(--cb-green)" : "var(--cb-accent)") : "var(--cb-border-muted)"}`,
                background: checked ? (done ? "var(--cb-green)" : "var(--cb-accent)") : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {checked ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={done ? "var(--cb-text-on-green)" : "var(--cb-text-on-accent)"} strokeWidth="3.5">
                  <path d="M4 12.5l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--cb-text-faint)" }}>{si + 1}</span>
              )}
            </div>
          ))}
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--cb-text-faint)", marginLeft: 4 }}>
            {doneCount}/{totalSets}
          </span>
        </div>

        <div className="cb-row-bottom" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 10, gap: 14 }}>
          <div className="cb-load" style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
            <LoadDisplay entry={entry} maxesLb={maxesLb} unit={unit} roundToLb={roundToLb} roundToKg={roundToKg} barType={barType} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {onOpenHistory && (
              <button
                className="cb-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenHistory(entry.exercise);
                }}
                aria-label="View history for this exercise"
                title="History"
                style={{
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--cb-surface)",
                  border: "1px solid var(--cb-border-strong)",
                  borderRadius: "50%",
                  color: "var(--cb-text-muted)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <button
              className="cb-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(idx);
              }}
              aria-label="Log actual performance"
              style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--cb-surface)",
                border: "1px solid var(--cb-border-strong)",
                borderRadius: "50%",
                color: "var(--cb-text-muted)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="cb-expand-panel" style={{ padding: "4px 16px 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {prescribed.r != null && (
            <label
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
              onClick={() => {
                if (matched) {
                  onLogChange(idx, { w: null, r: null, rpe: null });
                } else {
                  onLogChange(idx, { w: prescribed.w, r: prescribed.r, rpe: prescribed.rpe });
                }
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 3,
                  border: `2px solid ${matched ? "var(--cb-accent)" : "var(--cb-border-muted)"}`,
                  background: matched ? "var(--cb-accent)" : "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {matched && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--cb-text-on-accent)" strokeWidth="4">
                    <path d="M4 12.5l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--cb-text-muted)" }}>Hit it exactly as prescribed</span>
            </label>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "nowrap", alignItems: "flex-end" }}>
            <LogField label={`Weight (${unitLabel(unit)})`} value={log.w == null ? null : lbToDisplayRaw(log.w, unit)} onChange={(v) => onLogChange(idx, { ...log, w: displayToLb(v, unit) })} step={unit === "kg" ? 1.25 : 2.5} min={0} />
            <LogField label="Reps" value={log.r} onChange={(v) => onLogChange(idx, { ...log, r: v })} step={1} min={1} max={50} />
            <LogField label="RPE" value={log.rpe} onChange={(v) => onLogChange(idx, { ...log, rpe: v })} step={0.5} min={1} max={10} />
          </div>
        </div>
      )}
    </div>
  );
}

function NotesBox({ value, onChange }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cb-text-faint)", marginBottom: 6 }}>
        Session Notes
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="How did it feel? Aches, energy, anything worth remembering..."
        rows={3}
        style={{
          width: "100%",
          resize: "vertical",
          background: "var(--cb-surface)",
          border: "1px solid var(--cb-border-strong)",
          borderRadius: 6,
          color: "var(--cb-accent)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          padding: 12,
        }}
      />
    </div>
  );
}

function SettingsPanel({ maxesLb, roundToLb, roundToKg, unit, barType, startDate, theme, onChange, open, onClose, onExportBackup, onImportFile, userEmail, onLogout }) {
  if (!open) return null;
  const fileInputRef = useRef(null);
  const displayMax = (lift) => {
    const raw = maxesLb[lift];
    if (raw == null || raw === "") return "";
    return unit === "kg" ? Math.round(lbToKg(raw) * 10) / 10 : raw;
  };
  return (
    <div
      className="cb-settings-panel"
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: 8,
        background: "var(--cb-surface-2)",
        border: "1px solid var(--cb-border-strong)",
        borderRadius: 6,
        padding: 18,
        width: 290,
        zIndex: 20,
        boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
      }}
    >
      {userEmail && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--cb-border-strong)" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>Logged in as</div>
            <div style={{ fontSize: 12, color: "var(--cb-text-secondary)", fontFamily: "'IBM Plex Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>{userEmail}</div>
          </div>
          <button
            onClick={onLogout}
            style={{
              flexShrink: 0,
              padding: "8px 12px",
              background: "transparent",
              border: "1px solid var(--cb-border-strong)",
              borderRadius: 3,
              color: "var(--cb-text-secondary)",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              cursor: "pointer",
            }}
          >
            Log Out
          </button>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--cb-border-strong)" }}>
        <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, color: "var(--cb-text-muted)" }}>Theme</label>
        <div style={{ display: "flex", border: "1px solid var(--cb-border-strong)", borderRadius: 3, overflow: "hidden" }}>
          {[
            { key: "dark", label: "Dark" },
            { key: "light", label: "Light" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => onChange({ theme: t.key })}
              style={{
                padding: "10px 16px",
                fontSize: 12,
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                background: theme === t.key ? "var(--cb-accent)" : "transparent",
                color: theme === t.key ? "var(--cb-text-on-accent)" : "var(--cb-text-muted-2)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-muted-2)" }}>
          Training Maxes
        </div>
        <div style={{ display: "flex", border: "1px solid var(--cb-border-strong)", borderRadius: 3, overflow: "hidden" }}>
          {["lb", "kg"].map((u) => (
            <button
              key={u}
              onClick={() => onChange({ unit: u })}
              style={{
                padding: "10px 16px",
                fontSize: 12,
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                background: unit === u ? "var(--cb-accent)" : "transparent",
                color: unit === u ? "var(--cb-text-on-accent)" : "var(--cb-text-muted-2)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {u.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {["squat", "bench", "deadlift"].map((lift) => (
        <div key={lift} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <label style={{ display: "flex", alignItems: "center", fontFamily: "'Oswald', sans-serif", fontSize: 14, color: "var(--cb-accent)", textTransform: "capitalize" }}>
            <LiftBadge lift={lift} />
            {lift}
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="number"
              min={0}
              value={displayMax(lift)}
              onChange={(e) => {
                let v = e.target.value === "" ? "" : Number(e.target.value);
                if (v !== "" && v < 0) v = 0;
                const lb = v === "" ? "" : unit === "kg" ? kgToLb(v) : v;
                onChange({ maxesLb: { ...maxesLb, [lift]: lb } });
              }}
              style={{
                width: 70,
                padding: "5px 8px",
                background: "var(--cb-bg)",
                border: "1px solid var(--cb-border-strong)",
                borderRadius: 3,
                color: "var(--cb-text-primary)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 14,
                textAlign: "right",
              }}
            />
            <span style={{ fontSize: 11, color: "var(--cb-text-faint)", fontFamily: "'IBM Plex Mono', monospace" }}>{unitLabel(unit)}</span>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--cb-border-strong)" }}>
        <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, color: "var(--cb-text-muted)" }}>Round to</label>
        {unit === "lb" ? (
          <select
            value={roundToLb}
            onChange={(e) => onChange({ roundToLb: Number(e.target.value) })}
            style={{ background: "var(--cb-bg)", border: "1px solid var(--cb-border-strong)", borderRadius: 3, color: "var(--cb-text-primary)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, padding: "4px 6px" }}
          >
            <option value={5}>5 lb</option>
            <option value={2.5}>2.5 lb</option>
            <option value={1}>1 lb</option>
          </select>
        ) : (
          <select
            value={roundToKg}
            onChange={(e) => onChange({ roundToKg: Number(e.target.value) })}
            style={{ background: "var(--cb-bg)", border: "1px solid var(--cb-border-strong)", borderRadius: 3, color: "var(--cb-text-primary)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, padding: "4px 6px" }}
          >
            <option value={2.5}>2.5 kg</option>
            <option value={1.25}>1.25 kg</option>
            <option value={0.5}>0.5 kg</option>
          </select>
        )}
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--cb-border-strong)" }}>
        <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, color: "var(--cb-text-muted)", display: "block", marginBottom: 6 }}>Bar weight</label>
        <select
          value={barType}
          onChange={(e) => onChange({ barType: e.target.value })}
          style={{ width: "100%", padding: "6px 8px", background: "var(--cb-bg)", border: "1px solid var(--cb-border-strong)", borderRadius: 3, color: "var(--cb-text-primary)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
        >
          {Object.entries(BAR_PRESETS).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.label}
            </option>
          ))}
        </select>
        <div style={{ fontSize: 11, color: "var(--cb-text-faint)", marginTop: 4 }}>Used to work out the plates-per-side breakdown.</div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--cb-border-strong)" }}>
        <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, color: "var(--cb-text-muted)", display: "block", marginBottom: 6 }}>Program start date</label>
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => onChange({ startDate: e.target.value })}
          style={{ width: "100%", padding: "6px 8px", background: "var(--cb-bg)", border: "1px solid var(--cb-border-strong)", borderRadius: 3, color: "var(--cb-text-primary)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
        />
        <div style={{ fontSize: 11, color: "var(--cb-text-faint)", marginTop: 4 }}>Used by "Jump to Today" — assumes Week 1 Day 1 starts this week.</div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--cb-border-strong)" }}>
        <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, color: "var(--cb-text-muted)", display: "block", marginBottom: 8 }}>Backup &amp; Restore</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onExportBackup}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "transparent",
              border: "1px solid var(--cb-border-strong)",
              borderRadius: 3,
              color: "var(--cb-text-secondary)",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              cursor: "pointer",
            }}
          >
            Export
          </button>
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "transparent",
              border: "1px solid var(--cb-border-strong)",
              borderRadius: 3,
              color: "var(--cb-text-secondary)",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              cursor: "pointer",
            }}
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) onImportFile(file);
              e.target.value = "";
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: "var(--cb-text-faint)", marginTop: 6 }}>
          Export a backup file before clearing your browser data or switching devices/browsers — import it here to restore everything.
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "12px 0",
          background: "var(--cb-accent)",
          border: "none",
          borderRadius: 3,
          color: "var(--cb-text-on-accent)",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        Done
      </button>
    </div>
  );
}

/* ============================= REST TIMER ============================= */
function RestTimerBar({ timer, onDismiss, onExtend }) {
  const [now, setNow] = useState(Date.now());
  const beepedRef = useRef(null);
  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [timer]);
  if (!timer) return null;
  const remainingMs = timer.endAt - now;
  const remaining = Math.max(0, Math.ceil(remainingMs / 1000));
  const pct = Math.min(1, Math.max(0, 1 - remaining / timer.duration));
  const done = remaining <= 0;
  const urgent = !done && remaining <= 5;

  if (done && beepedRef.current !== timer.endAt) {
    beepedRef.current = timer.endAt;
    playRestCompleteTone();
  }

  if (done) {
    return (
      <div
        onClick={onDismiss}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          cursor: "pointer",
          animation: "cbRestFlash 0.9s ease-in-out infinite",
          textAlign: "center",
          padding: 24,
        }}
      >
        <span style={{ width: 84, height: 84, borderRadius: "50%", background: "var(--cb-green-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="var(--cb-text-on-green)" strokeWidth="3">
            <path d="M4 12.5l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 30, fontWeight: 700, color: "var(--cb-text-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Rest Over</div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, color: "var(--cb-text-secondary)", maxWidth: 320 }}>{timer.label}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          style={{
            marginTop: 10,
            background: "var(--cb-green-light)",
            border: "none",
            borderRadius: 8,
            color: "var(--cb-text-on-green)",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            padding: "14px 32px",
            cursor: "pointer",
          }}
        >
          Let's Go
        </button>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--cb-text-faint)", marginTop: 4 }}>Tap anywhere to continue</div>
      </div>
    );
  }

  const accent = urgent ? "var(--cb-gold)" : "var(--cb-rust)";
  const accentGlow = urgent ? "rgba(224,164,88,0.33)" : "rgba(200,85,61,0.33)";
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, "0");
  return (
    <div
      className="cb-timerbar"
      style={{
        position: "fixed",
        left: 10,
        right: 10,
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
        zIndex: 50,
        background: "var(--cb-surface)",
        border: `2px solid ${accent}`,
        borderRadius: 14,
        boxShadow: `0 -6px 28px rgba(0,0,0,0.6), 0 2px 22px ${accentGlow}`,
        animation: urgent ? "cbRestUrgentPulse 0.6s ease-in-out infinite" : "cbRestPulse 2.2s ease-in-out infinite",
        overflow: "hidden",
      }}
    >
      <div style={{ height: 4, background: "var(--cb-border)", overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: accent, transition: "width 0.25s linear" }} />
      </div>
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" stroke="var(--cb-border)" strokeWidth="5" fill="none" />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke={accent}
              strokeWidth="5"
              fill="none"
              strokeDasharray={2 * Math.PI * 24}
              strokeDashoffset={2 * Math.PI * 24 * (1 - pct)}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--cb-text-faint)" }}>REST</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, textTransform: "uppercase", color: accent, letterSpacing: "0.05em", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {timer.label}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 34, lineHeight: 1.1, color: "var(--cb-text-primary)", fontWeight: 700, letterSpacing: "0.01em" }}>
            {mm}:{ss}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={onExtend}
            style={{ background: "transparent", border: "1px solid var(--cb-border-strong)", color: "var(--cb-text-secondary)", borderRadius: 6, padding: "10px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'Oswald', sans-serif", fontWeight: 600 }}
          >
            +30s
          </button>
          <button
            onClick={onDismiss}
            aria-label="Dismiss rest timer"
            style={{ background: "transparent", border: "none", color: "var(--cb-text-muted)", cursor: "pointer", fontSize: 26, lineHeight: 1, padding: "10px 12px", margin: "-10px -12px -10px 0" }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================= WORKOUT COMPLETE OVERLAY ============================= */
function WorkoutCompleteOverlay({ label, onBackToOverview, onDismiss }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 85,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        cursor: "pointer",
        background: "rgba(15,23,16,0.97)",
        textAlign: "center",
        padding: 24,
      }}
    >
      <span style={{ width: 84, height: 84, borderRadius: "50%", background: "var(--cb-green-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="var(--cb-text-on-green)" strokeWidth="3">
          <path d="M4 12.5l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 30, fontWeight: 700, color: "var(--cb-text-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Workout Complete</div>
      {label && <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, color: "var(--cb-text-secondary)", maxWidth: 320 }}>{label}</div>}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBackToOverview();
        }}
        style={{
          marginTop: 10,
          background: "var(--cb-green-light)",
          border: "none",
          borderRadius: 8,
          color: "var(--cb-text-on-green)",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          padding: "14px 32px",
          cursor: "pointer",
        }}
      >
        Back to Overview
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--cb-text-muted)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          textDecoration: "underline",
          cursor: "pointer",
          padding: "4px 8px",
        }}
      >
        Stay here
      </button>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--cb-text-faint)", marginTop: 4 }}>Tap anywhere to dismiss</div>
    </div>
  );
}

/* ============================= WEEK OVERVIEW (main page) ============================= */
function WeekOverview({ week, allSessions, nextWorkout, maxesLb, unit, roundToLb, roundToKg, barType, onJumpToDay, onPrevWeek, onNextWeek }) {
  const isTaperWeek = Number(week) === 16;
  const dayLabels = isTaperWeek
    ? TAPER_LABELS_SORTED.map((l, i) => ({ day: i + 1, label: l.replace(/ from Competition/i, "") }))
    : ALL_DAYS.map((d) => ({ day: d, label: `Day ${d}` }));
  const phaseName = weekToPhase(week);
  const heading = isTaperWeek ? "Taper Week" : `Week ${week}`;

  const [expandedDays, setExpandedDays] = useState(() => new Set());
  const nextWorkoutKey = nextWorkout ? `${nextWorkout.week}:${nextWorkout.day}` : "none";
  useEffect(() => {
    if (nextWorkout && nextWorkout.week === Number(week)) {
      setExpandedDays(new Set([nextWorkout.day]));
    } else {
      setExpandedDays(new Set());
    }
    // Only reset when the week being viewed changes, or the next-workout day
    // itself actually changes — not on every unrelated session update, which
    // would otherwise wipe out manually expanded/collapsed days.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, nextWorkoutKey]);

  const toggleDay = (day) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ flexShrink: 0, paddingTop: 16, paddingBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={onPrevWeek}
            disabled={Number(week) <= 1}
            style={{ background: "transparent", border: "1px solid var(--cb-border-strong)", borderRadius: 6, color: Number(week) <= 1 ? "var(--cb-border-strong)" : "var(--cb-text-secondary)", padding: "10px 16px", fontSize: 20, lineHeight: 1, cursor: Number(week) <= 1 ? "default" : "pointer" }}
          >
            ‹
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--cb-accent)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{heading}</div>
            {!isTaperWeek && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--cb-text-faint)", marginTop: 2 }}>{phaseName}</div>}
          </div>
          <button
            onClick={onNextWeek}
            disabled={Number(week) >= 16}
            style={{ background: "transparent", border: "1px solid var(--cb-border-strong)", borderRadius: 6, color: Number(week) >= 16 ? "var(--cb-border-strong)" : "var(--cb-text-secondary)", padding: "10px 16px", fontSize: 20, lineHeight: 1, cursor: Number(week) >= 16 ? "default" : "pointer" }}
          >
            ›
          </button>
        </div>
      </div>

      <div className="cb-scroll-pane" style={{ flex: 1, minHeight: 0, paddingTop: 16, paddingBottom: 140 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {dayLabels.map(({ day, label }) => {
          const entries = getEntriesAbs(week, day);
          if (entries.length === 0) return null;
          const session = allSessions[`${week}:${day}`] || EMPTY_SESSION();
          const complete = isDayComplete(entries, session);
          const isNext = !!nextWorkout && nextWorkout.week === Number(week) && nextWorkout.day === day;
          const expanded = expandedDays.has(day);
          const borderColor = complete ? "var(--cb-green)" : isNext ? "var(--cb-rust)" : "var(--cb-border)";
          const headerBg = complete ? "rgba(127,174,122,0.16)" : isNext ? "rgba(200,85,61,0.12)" : "var(--cb-surface)";

          return (
            <div
              key={day}
              style={{
                border: `2px solid ${borderColor}`,
                borderRadius: 6,
                overflow: "hidden",
                boxShadow: isNext ? "0 0 0 3px rgba(200,85,61,0.18)" : "none",
              }}
            >
              <div
                onClick={() => toggleDay(day)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: headerBg,
                  cursor: "pointer",
                  gap: 10,
                  flexWrap: "wrap",
                  rowGap: 8,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", rowGap: 6 }}>
                  {complete ? (
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--cb-green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--cb-text-on-green)" strokeWidth="4">
                        <path d="M4 12.5l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  ) : isNext ? (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cb-rust)", flexShrink: 0 }} />
                  ) : null}
                  <span
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: complete ? "var(--cb-green-text)" : isNext ? "var(--cb-rust-light-text)" : "var(--cb-accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {label}
                  </span>
                  {complete && (
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 10, fontWeight: 700, color: "var(--cb-text-on-green)", background: "var(--cb-green-light)", borderRadius: 3, padding: "2px 7px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Completed
                    </span>
                  )}
                  {isNext && !complete && (
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 10, fontWeight: 700, color: "var(--cb-text-on-accent)", background: "var(--cb-rust)", borderRadius: 3, padding: "2px 7px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Next Workout
                    </span>
                  )}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cb-text-faint)" strokeWidth="2" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onJumpToDay(day);
                    }}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--cb-border-strong)",
                      borderRadius: 6,
                      color: "var(--cb-text-secondary)",
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      padding: "10px 16px",
                      cursor: "pointer",
                    }}
                  >
                    Open →
                  </button>
                </span>
              </div>
              {expanded &&
                entries.map((entry, idx) => (
                  <div key={idx} style={{ padding: "8px 16px", borderTop: "1px solid var(--cb-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", rowGap: 4 }}>
                      <LiftBadge lift={resolveLift(entry)} />
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, color: "var(--cb-text-secondary)", wordBreak: "break-word" }}>{entry.exercise}</span>
                      <span style={{ marginLeft: 10, fontSize: 13, color: "var(--cb-text-muted)", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>
                        {entry.sets}×{entry.reps ?? "-"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                      <LoadDisplay entry={entry} maxesLb={maxesLb} unit={unit} roundToLb={roundToLb} roundToKg={roundToKg} barType={barType} showPlates={false} />
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

/* ============================= EXERCISES (program-wide directory) ============================= */
const EXERCISE_GROUP_ORDER = [
  { key: "squat", label: "Squat", color: LIFT_META.squat.color },
  { key: "bench", label: "Bench", color: LIFT_META.bench.color },
  { key: "deadlift", label: "Deadlift", color: LIFT_META.deadlift.color },
  { key: "none", label: "Accessory", color: null },
];

function ExerciseCard({ exercise, lift, stats, unit, loadingData }) {
  const description = EXERCISE_DESCRIPTIONS[exercise];
  const [expanded, setExpanded] = useState(false);
  const hasData = stats && stats.timesPerformed > 0;

  const displayTotal = hasData ? Math.round(unit === "kg" ? lbToKg(stats.totalTonnageLb) : stats.totalTonnageLb) : 0;
  const displayPB = hasData ? Math.round((unit === "kg" ? lbToKg(stats.bestWeightLb) : stats.bestWeightLb) * 10) / 10 : 0;
  const displayE1rm = hasData ? Math.round(unit === "kg" ? lbToKg(stats.bestE1rmLb) : stats.bestE1rmLb) : 0;

  const chartData = hasData
    ? stats.history.map((h, i) => ({
        idx: i + 1,
        label: h.week === 16 ? (TAPER_LABELS_SORTED[h.day - 1] || "").replace(/ from Competition/i, "") : `W${h.week}D${h.day}`,
        weight: Math.round((unit === "kg" ? lbToKg(h.w) : h.w) * 10) / 10,
        e1rm: Math.round(unit === "kg" ? lbToKg(epleyE1rmLb(h.w, h.r)) : epleyE1rmLb(h.w, h.r)),
      }))
    : [];

  return (
    <div
      style={{
        padding: "14px 16px",
        border: "1px solid var(--cb-border)",
        borderRadius: 6,
        background: "var(--cb-surface)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <LiftBadge lift={lift} />
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--cb-text-primary)", wordBreak: "break-word" }}>
              {exercise}
            </span>
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 13,
              lineHeight: 1.5,
              color: description ? "var(--cb-text-secondary)" : "var(--cb-text-faint)",
              fontStyle: description ? "normal" : "italic",
            }}
          >
            {description || "No description added yet."}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {hasData && (
            <button
              className="cb-icon-btn"
              onClick={() => setExpanded((e) => !e)}
              aria-label={expanded ? "Collapse stats" : "Expand stats"}
              style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--cb-surface-2)",
                border: "1px solid var(--cb-border-strong)",
                borderRadius: "50%",
                color: "var(--cb-text-muted)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--cb-border)" }}>
        {loadingData ? (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--cb-text-faint)" }}>Loading history…</div>
        ) : !hasData ? (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--cb-text-faint)" }}>Not yet logged</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>Times</div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--cb-text-primary)" }}>{stats.timesPerformed}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>Total</div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--cb-text-primary)" }}>
                {displayTotal.toLocaleString()} <span style={{ fontSize: 10, color: "var(--cb-text-muted-2)", fontFamily: "'IBM Plex Mono', monospace" }}>{unitLabel(unit)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>PB</div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--cb-text-primary)" }}>
                {displayPB} <span style={{ fontSize: 10, color: "var(--cb-text-muted-2)", fontFamily: "'IBM Plex Mono', monospace" }}>{unitLabel(unit)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>E1RM</div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--cb-text-primary)" }}>
                {displayE1rm} <span style={{ fontSize: 10, color: "var(--cb-text-muted-2)", fontFamily: "'IBM Plex Mono', monospace" }}>{unitLabel(unit)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {expanded && hasData && (
        <div style={{ marginTop: 14 }}>
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="var(--cb-border)" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="var(--cb-text-faint)" fontSize={9} tickLine={false} />
                <YAxis stroke="var(--cb-text-faint)" fontSize={9} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "var(--cb-surface-2)", border: "1px solid var(--cb-border-strong)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }} />
                <Legend wrapperStyle={{ fontFamily: "'Oswald', sans-serif", fontSize: 11 }} />
                <Line type="monotone" dataKey="weight" stroke="var(--cb-text-primary)" dot={{ r: 2 }} name={`Weight (${unitLabel(unit)})`} strokeWidth={2} />
                <Line type="monotone" dataKey="e1rm" stroke="var(--cb-rust)" dot={{ r: 2 }} name={`E1RM (${unitLabel(unit)})`} strokeWidth={1.5} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="cb-scroll-pane" style={{ marginTop: 10, maxHeight: 280, display: "flex", flexDirection: "column", gap: 6 }}>
            {stats.history
              .slice()
              .reverse()
              .map((h, i) => {
                const label = h.week === 16 ? (TAPER_LABELS_SORTED[h.day - 1] || "").replace(/ from Competition/i, "") : `Week ${h.week} · Day ${h.day}`;
                const wDisplay = Math.round((unit === "kg" ? lbToKg(h.w) : h.w) * 100) / 100;
                const isPB = h.w >= stats.bestWeightLb;
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: i === 0 ? "none" : "1px solid var(--cb-border-2)" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, color: "var(--cb-text-secondary)" }}>{label}</div>
                      {h.date && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--cb-text-faint)", marginTop: 1 }}>{h.date}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      {isPB && <PBMedal size={14} />}
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--cb-text-primary)" }}>
                        {wDisplay} {unitLabel(unit)} × {h.r} reps
                        {h.rpe != null ? ` @${h.rpe}` : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function ExercisesView({ initialSearch, onConsumeInitialSearch, allSessions, startDate, unit, loadingData }) {
  const [search, setSearch] = useState(() => initialSearch || "");
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set(EXERCISE_GROUP_ORDER.map((g) => g.key)));

  useEffect(() => {
    if (initialSearch && onConsumeInitialSearch) onConsumeInitialSearch();
    // Only meant to run once, right after this view mounts with a linked-in
    // search term — not on every keystroke change to the local search state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleGroup = (key) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /* One pass over every logged session builds, per exercise: how many times
     it's been logged with actual weight & reps, total tonnage, best single
     weight, best E1RM, and the full chronological history for the chart.
     Restricted to sessions on/after the entered program start date, when set. */
  const allTimeBestWeightLb = useMemo(() => computeAllTimeBestWeights(allSessions), [allSessions]);

  const statsByExercise = useMemo(() => {
    const map = {};
    ALL_EXERCISES.forEach(({ exercise }) => {
      map[exercise] = {
        timesPerformed: 0,
        totalTonnageLb: 0,
        bestWeightLb: allTimeBestWeightLb[exercise] || 0,
        bestE1rmLb: 0,
        history: [],
      };
    });
    for (const key of Object.keys(allSessions || {})) {
      const [weekStr, dayStr] = key.split(":");
      const week = Number(weekStr);
      const day = Number(dayStr);
      const session = allSessions[key];
      if (startDate && (!session.date || session.date < startDate)) continue;
      const entries = getEntriesAbs(week, day);
      entries.forEach((entry, idx) => {
        const stat = map[entry.exercise];
        if (!stat) return;
        const log = session.logs?.[idx];
        if (!log || log.w == null || log.r == null) return;
        stat.timesPerformed += 1;
        const sets = Number(entry.sets) || 0;
        stat.totalTonnageLb += sets * log.r * log.w;
        const e1rm = epleyE1rmLb(log.w, log.r);
        if (e1rm && e1rm > stat.bestE1rmLb) stat.bestE1rmLb = e1rm;
        stat.history.push({ week, day, date: session.date, w: log.w, r: log.r, rpe: log.rpe });
      });
    }
    Object.values(map).forEach((s) => s.history.sort((a, b) => a.week - b.week || a.day - b.day));
    return map;
  }, [allSessions, startDate, allTimeBestWeightLb]);

  const visibleExercises = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_EXERCISES.filter(({ exercise }) => {
      if (q && !exercise.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search]);

  const groups = useMemo(() => {
    const byKey = { squat: [], bench: [], deadlift: [], none: [] };
    visibleExercises.forEach((ex) => {
      byKey[ex.lift || "none"].push(ex);
    });
    return EXERCISE_GROUP_ORDER.map((g) => ({ ...g, items: byKey[g.key] })).filter((g) => g.items.length > 0);
  }, [visibleExercises]);

  const isSearchActive = search.trim() !== "";

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ flexShrink: 0, paddingTop: 16, paddingBottom: 14 }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises…"
          style={{
            width: "100%",
            padding: search ? "10px 40px 10px 12px" : "10px 12px",
            background: "var(--cb-surface)",
            border: "1px solid var(--cb-border-strong)",
            borderRadius: 6,
            color: "var(--cb-text-primary)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 14,
          }}
        />
        {search && (
          <button
            className="cb-clear-btn"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              top: "50%",
              right: 4,
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "var(--cb-text-muted)",
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        )}
      </div>
      </div>

      <div className="cb-scroll-pane" style={{ flex: 1, minHeight: 0, paddingTop: 20, paddingBottom: 140 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {groups.length === 0 ? (
          <div style={{ color: "var(--cb-text-faint)", fontSize: 13, padding: 24, border: "1px dashed var(--cb-border-strong)", borderRadius: 6, textAlign: "center" }}>
            No exercises match your search.
          </div>
        ) : (
          groups.map((group) => {
            const isOpen = isSearchActive || !collapsedGroups.has(group.key);
            return (
              <div key={group.key}>
                <div
                  onClick={() => toggleGroup(group.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: isOpen ? 10 : 0,
                    paddingBottom: 8,
                    borderBottom: "1px solid var(--cb-border)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {group.color ? (
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
                    ) : (
                      <span style={{ width: 9, height: 9, borderRadius: "50%", border: "1.5px solid var(--cb-border-muted)", flexShrink: 0 }} />
                    )}
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cb-text-muted)", fontWeight: 600 }}>
                      {group.label}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--cb-text-faint)" }}>{group.items.length}</span>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--cb-text-faint)"
                    strokeWidth="2"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {isOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {group.items.map(({ exercise, lift }) => (
                      <ExerciseCard key={exercise} exercise={exercise} lift={lift} stats={statsByExercise[exercise]} unit={unit} loadingData={loadingData} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}

/* ============================= INSIGHTS (E1RM CHART + HEATMAP) ============================= */
function InsightsView({ unit, sessions, loadingData }) {
  const chartData = useMemo(() => {
    const perWeek = {}; // week -> {squat, bench, deadlift}
    for (let w = 1; w <= 16; w++) perWeek[w] = { week: w };
    for (const key of Object.keys(sessions)) {
      const [weekStr, dayStr] = key.split(":");
      const week = Number(weekStr);
      const day = Number(dayStr);
      const session = sessions[key];
      const entries = getEntriesAbs(week, day);
      entries.forEach((entry, idx) => {
        const log = session.logs?.[idx];
        const lift = resolveLift(entry);
        if (!log || log.w == null || log.r == null || !lift) return;
        const e1rm = epleyE1rmLb(log.w, log.r);
        if (!e1rm) return;
        const display = unit === "kg" ? lbToKg(e1rm) : e1rm;
        const cur = perWeek[week][lift];
        if (!cur || display > cur) perWeek[week][lift] = Math.round(display);
      });
    }
    return Object.values(perWeek);
  }, [sessions, unit]);

  const tonnageData = useMemo(() => {
    const perWeek = {}; // week -> {squat, bench, deadlift} tonnage totals
    for (let w = 1; w <= 16; w++) perWeek[w] = { week: w, squat: 0, bench: 0, deadlift: 0 };
    for (const key of Object.keys(sessions)) {
      const [weekStr, dayStr] = key.split(":");
      const week = Number(weekStr);
      const day = Number(dayStr);
      const session = sessions[key];
      const entries = getEntriesAbs(week, day);
      entries.forEach((entry, idx) => {
        const log = session.logs?.[idx];
        const lift = resolveLift(entry);
        if (!log || log.w == null || log.r == null || !lift) return;
        const sets = Number(entry.sets);
        if (!sets) return;
        const tonnageLb = sets * log.r * log.w;
        const display = unit === "kg" ? lbToKg(tonnageLb) : tonnageLb;
        perWeek[week][lift] += display;
      });
    }
    return Object.values(perWeek).map((w) => ({
      week: w.week,
      squat: Math.round(w.squat) || null,
      bench: Math.round(w.bench) || null,
      deadlift: Math.round(w.deadlift) || null,
    }));
  }, [sessions, unit]);

  const prData = useMemo(() => {
    const perWeek = {};
    for (let w = 1; w <= 16; w++) perWeek[w] = { week: w };
    const best = {
      squat: { e1rm: 0, weight: 0 },
      bench: { e1rm: 0, weight: 0 },
      deadlift: { e1rm: 0, weight: 0 },
    };
    for (const key of Object.keys(sessions)) {
      const [weekStr, dayStr] = key.split(":");
      const week = Number(weekStr);
      const day = Number(dayStr);
      const session = sessions[key];
      const entries = getEntriesAbs(week, day);
      entries.forEach((entry, idx) => {
        const log = session.logs?.[idx];
        const lift = resolveLift(entry);
        if (!log || !lift || !LIFT_META[lift]) return;
        if (log.w != null) {
          const wDisplay = unit === "kg" ? lbToKg(log.w) : log.w;
          const curW = perWeek[week][`${lift}_weight`];
          if (!curW || wDisplay > curW) perWeek[week][`${lift}_weight`] = Math.round(wDisplay * 10) / 10;
          if (wDisplay > best[lift].weight) best[lift].weight = Math.round(wDisplay * 10) / 10;
        }
        if (log.w != null && log.r != null) {
          const e1rm = epleyE1rmLb(log.w, log.r);
          if (e1rm) {
            const eDisplay = unit === "kg" ? lbToKg(e1rm) : e1rm;
            const curE = perWeek[week][`${lift}_e1rm`];
            if (!curE || eDisplay > curE) perWeek[week][`${lift}_e1rm`] = Math.round(eDisplay);
            if (eDisplay > best[lift].e1rm) best[lift].e1rm = Math.round(eDisplay);
          }
        }
      });
    }
    return { series: Object.values(perWeek), best };
  }, [sessions, unit]);

  const heatmapCells = useMemo(() => {
    const cells = [];
    for (const week of ALL_WEEKS) {
      for (let day = 1; day <= 4; day++) {
        const entries = getEntriesAbs(week, day);
        const session = sessions[`${week}:${day}`];
        let total = 0;
        let done = 0;
        entries.forEach((entry, idx) => {
          const setTotal = totalSetsFor(entry);
          total += setTotal;
          if (session) done += getSetStates(entry, session, idx).filter(Boolean).length;
        });
        cells.push({ week, day, total, done, pct: total ? done / total : null });
      }
    }
    return cells;
  }, [sessions]);

  const hasAnyE1rm = chartData.some((d) => d.squat || d.bench || d.deadlift);
  const hasAnyPR = Object.values(prData.best).some((b) => b.e1rm > 0 || b.weight > 0);
  const hasAnyTonnage = tonnageData.some((d) => d.squat || d.bench || d.deadlift);

  return (
    <div style={{ marginTop: 8 }}>
      <CollapsibleSection title={`Estimated 1RM by week (${unitLabel(unit)})`} defaultOpen={false}>
        {loadingData ? (
          <div style={{ color: "var(--cb-text-faint)", fontSize: 13, padding: 20 }}>Loading logged sets…</div>
        ) : !hasAnyE1rm ? (
          <div style={{ color: "var(--cb-text-faint)", fontSize: 13, padding: 20, border: "1px dashed var(--cb-border-strong)", borderRadius: 6, textAlign: "center" }}>
            Log actual weight &amp; reps on a set (tap the arrow on any exercise) to start building this chart.
          </div>
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="var(--cb-border)" strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="var(--cb-text-faint)" fontSize={11} tickLine={false} label={{ value: "Week", position: "insideBottom", offset: -2, fill: "var(--cb-text-faint)", fontSize: 11 }} />
                <YAxis stroke="var(--cb-text-faint)" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "var(--cb-surface-2)", border: "1px solid var(--cb-border-strong)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }} labelFormatter={(w) => `Week ${w}`} />
                <Legend wrapperStyle={{ fontFamily: "'Oswald', sans-serif", fontSize: 12 }} />
                <Line type="monotone" dataKey="squat" stroke={LIFT_META.squat.color} dot={{ r: 3 }} connectNulls name="Squat" />
                <Line type="monotone" dataKey="bench" stroke={LIFT_META.bench.color} dot={{ r: 3 }} connectNulls name="Bench" />
                <Line type="monotone" dataKey="deadlift" stroke={LIFT_META.deadlift.color} dot={{ r: 3 }} connectNulls name="Deadlift" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title={`Weekly Volume (${unitLabel(unit)})`} defaultOpen={false}>
        {loadingData ? (
          <div style={{ color: "var(--cb-text-faint)", fontSize: 13, padding: 20 }}>Loading logged sets…</div>
        ) : !hasAnyTonnage ? (
          <div style={{ color: "var(--cb-text-faint)", fontSize: 13, padding: 20, border: "1px dashed var(--cb-border-strong)", borderRadius: 6, textAlign: "center" }}>
            Log actual weight &amp; reps to see tonnage (sets × reps × weight) per lift by week.
          </div>
        ) : (
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={tonnageData} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid stroke="var(--cb-border)" strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="var(--cb-text-faint)" fontSize={11} tickLine={false} label={{ value: "Week", position: "insideBottom", offset: -2, fill: "var(--cb-text-faint)", fontSize: 11 }} />
                <YAxis stroke="var(--cb-text-faint)" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--cb-surface-2)", border: "1px solid var(--cb-border-strong)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }} labelFormatter={(w) => `Week ${w}`} />
                <Legend wrapperStyle={{ fontFamily: "'Oswald', sans-serif", fontSize: 12 }} />
                <Bar dataKey="squat" fill={LIFT_META.squat.color} name="Squat" radius={[2, 2, 0, 0]} />
                <Bar dataKey="bench" fill={LIFT_META.bench.color} name="Bench" radius={[2, 2, 0, 0]} />
                <Bar dataKey="deadlift" fill={LIFT_META.deadlift.color} name="Deadlift" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Personal Records" defaultOpen={false}>
        {loadingData ? (
          <div style={{ color: "var(--cb-text-faint)", fontSize: 13, padding: 20 }}>Loading logged sets…</div>
        ) : !hasAnyPR ? (
          <div style={{ color: "var(--cb-text-faint)", fontSize: 13, padding: 20, border: "1px dashed var(--cb-border-strong)", borderRadius: 6, textAlign: "center" }}>
            Log actual weight &amp; reps to track your heaviest lifts and best estimated 1RM per lift here.
          </div>
        ) : (
          <div className="cb-pr-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
            {["squat", "bench", "deadlift"].map((lift) => {
              const b = prData.best[lift];
              const liftHasData = b.e1rm > 0 || b.weight > 0;
              return (
                <div key={lift} style={{ border: "1px solid var(--cb-border)", borderRadius: 6, padding: 14, background: "var(--cb-surface)" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                    <LiftBadge lift={lift} />
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--cb-text-primary)", fontWeight: 600 }}>
                      {LIFT_META[lift].label}
                    </span>
                  </div>
                  {!liftHasData ? (
                    <div style={{ color: "var(--cb-text-faint)", fontSize: 12, padding: "16px 0", textAlign: "center" }}>No sets logged yet</div>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: 18, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>Best E1RM</div>
                          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--cb-text-primary)" }}>
                            {b.e1rm || "—"} <span style={{ fontSize: 11, color: "var(--cb-text-muted-2)", fontFamily: "'IBM Plex Mono', monospace" }}>{unitLabel(unit)}</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>Heaviest Weight</div>
                          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--cb-text-primary)" }}>
                            {b.weight || "—"} <span style={{ fontSize: 11, color: "var(--cb-text-muted-2)", fontFamily: "'IBM Plex Mono', monospace" }}>{unitLabel(unit)}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: 130 }}>
                        <ResponsiveContainer>
                          <LineChart data={prData.series} margin={{ top: 4, right: 8, bottom: 0, left: -28 }}>
                            <CartesianGrid stroke="var(--cb-border)" strokeDasharray="3 3" />
                            <XAxis dataKey="week" stroke="var(--cb-text-faint)" fontSize={9} tickLine={false} />
                            <YAxis stroke="var(--cb-text-faint)" fontSize={9} tickLine={false} domain={["auto", "auto"]} />
                            <Tooltip contentStyle={{ background: "var(--cb-surface-2)", border: "1px solid var(--cb-border-strong)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }} labelFormatter={(w) => `Week ${w}`} />
                            <Line type="monotone" dataKey={`${lift}_e1rm`} stroke="var(--cb-text-primary)" strokeDasharray="4 3" dot={{ r: 2 }} connectNulls name="E1RM" strokeWidth={1.5} />
                            <Line type="monotone" dataKey={`${lift}_weight`} stroke={LIFT_META[lift].color} dot={{ r: 2 }} connectNulls name="Heaviest" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ display: "flex", gap: 14, marginTop: 4, justifyContent: "center", fontSize: 10, color: "var(--cb-text-muted-2)", fontFamily: "'IBM Plex Mono', monospace" }}>
                        <span>— E1RM</span>
                        <span style={{ opacity: 0.7 }}>┄ Heaviest</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Adherence" defaultOpen={false}>
        {loadingData ? (
          <div style={{ color: "var(--cb-text-faint)", fontSize: 13 }}>Loading…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "40px repeat(4, 1fr)", gap: 4, maxWidth: 420 }}>
            <div />
            {ALL_DAYS.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, color: "var(--cb-text-faint)", fontFamily: "'IBM Plex Mono', monospace" }}>
                D{d}
              </div>
            ))}
            {ALL_WEEKS.map((week) => (
              <React.Fragment key={week}>
                <div style={{ fontSize: 10, color: "var(--cb-text-faint)", fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center" }}>
                  {week === 16 ? "Tp" : `W${week}`}
                </div>
                {ALL_DAYS.map((day) => {
                  const cell = heatmapCells.find((c) => c.week === week && c.day === day);
                  const empty = !cell || cell.total === 0;
                  const alpha = empty ? 0 : 0.18 + cell.pct * 0.72;
                  return (
                    <div
                      key={day}
                      title={empty ? "No session" : `Week ${week} Day ${day}: ${cell.done}/${cell.total} sets done`}
                      style={{
                        aspectRatio: "1",
                        borderRadius: 3,
                        background: empty ? "var(--cb-surface)" : `rgba(200,85,61,${alpha})`,
                        border: "1px solid var(--cb-border)",
                      }}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}

/* ============================= EXERCISE HISTORY DRILL-DOWN ============================= */
function ExerciseHistoryModal({ exercise, sessions, unit, onClose }) {
  const rows = useMemo(() => {
    const out = [];
    for (const key of Object.keys(sessions)) {
      const [weekStr, dayStr] = key.split(":");
      const week = Number(weekStr);
      const day = Number(dayStr);
      const session = sessions[key];
      const entries = getEntriesAbs(week, day);
      entries.forEach((entry, idx) => {
        if (entry.exercise !== exercise) return;
        const log = session.logs?.[idx];
        const setStates = getSetStates(entry, session, idx);
        const anySetDone = setStates.some(Boolean);
        if (!anySetDone && (!log || (log.w == null && log.r == null && log.rpe == null))) return;
        out.push({ week, day, date: session.date, entry, log: log || {}, done: anySetDone });
      });
    }
    out.sort((a, b) => a.week - b.week || a.day - b.day);
    return out;
  }, [exercise, sessions]);

  const lift = rows.length ? resolveLift(rows[0].entry) : null;
  let bestWeight = 0;
  let bestE1rm = 0;
  rows.forEach((r) => {
    if (r.log.w != null) {
      const wd = unit === "kg" ? lbToKg(r.log.w) : r.log.w;
      if (wd > bestWeight) bestWeight = wd;
      if (r.log.r != null) {
        const e = epleyE1rmLb(r.log.w, r.log.r);
        if (e) {
          const ed = unit === "kg" ? lbToKg(e) : e;
          if (ed > bestE1rm) bestE1rm = ed;
        }
      }
    }
  });

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,9,8,0.72)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--cb-surface)",
          border: "1px solid var(--cb-border-strong)",
          borderRadius: 8,
          width: "100%",
          maxWidth: 460,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ flexShrink: 0, padding: "16px 18px 12px", borderBottom: "1px solid var(--cb-border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <LiftBadge lift={lift} />
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--cb-text-primary)", wordBreak: "break-word" }}>{exercise}</span>
            </div>
            {rows.length > 0 && (
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>Heaviest</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--cb-accent)" }}>
                    {bestWeight ? `${Math.round(bestWeight * 10) / 10} ${unitLabel(unit)}` : "—"}
                  </div>
                </div>
                {bestE1rm > 0 && (
                  <div>
                    <div style={{ fontSize: 9, textTransform: "uppercase", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>Best E1RM</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--cb-accent)" }}>{Math.round(bestE1rm)} {unitLabel(unit)}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>Times logged</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--cb-accent)" }}>{rows.length}</div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "var(--cb-text-faint)",
              fontSize: 22,
              lineHeight: 1,
              cursor: "pointer",
              flexShrink: 0,
              margin: "-6px -6px 0 0",
            }}
          >
            ×
          </button>
        </div>
        <div className="cb-scroll-pane" style={{ flex: 1, minHeight: 0, padding: "6px 0" }}>
          {rows.length === 0 ? (
            <div style={{ padding: "24px 18px", color: "var(--cb-text-faint)", fontSize: 13, textAlign: "center" }}>Nothing logged for this exercise yet.</div>
          ) : (
            rows.map((r, i) => {
              const wDisplay = r.log.w != null ? lbToDisplayRaw(r.log.w, unit) : null;
              const label = r.week === 16 ? (TAPER_LABELS_SORTED[r.day - 1] || "").replace(/ from Competition/i, "") : `Week ${r.week} · Day ${r.day}`;
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid var(--cb-border-2)", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, color: "var(--cb-text-secondary)" }}>{label}</div>
                    {r.date && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--cb-text-faint)", marginTop: 2 }}>{r.date}</div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {wDisplay != null || r.log.r != null || r.log.rpe != null ? (
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--cb-accent)" }}>
                        {wDisplay != null ? `${wDisplay} ${unitLabel(unit)}` : "—"}
                        {r.log.r != null ? ` × ${r.log.r}` : ""}
                        {r.log.rpe != null ? ` @${r.log.rpe}` : ""}
                      </div>
                    ) : (
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--cb-text-faint)" }}>Checked off, no data</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================= CALENDAR VIEW ============================= */
function CalendarView({ sessions, loadingData, onJumpToSession }) {
  const dateIndex = useMemo(() => {
    const idx = {};
    for (const key of Object.keys(sessions)) {
      const [weekStr, dayStr] = key.split(":");
      const session = sessions[key];
      if (!session.date) continue;
      if (!idx[session.date]) idx[session.date] = [];
      idx[session.date].push({ week: Number(weekStr), day: Number(dayStr) });
    }
    return idx;
  }, [sessions]);

  const mostRecentDate = useMemo(() => {
    const dates = Object.keys(dateIndex).sort();
    return dates.length ? dates[dates.length - 1] : null;
  }, [dateIndex]);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && !loadingData) {
      if (mostRecentDate) {
        const d = new Date(mostRecentDate + "T00:00:00");
        setViewMonth({ y: d.getFullYear(), m: d.getMonth() });
      }
      setInitialized(true);
    }
  }, [initialized, loadingData, mostRecentDate]);

  const monthName = new Date(viewMonth.y, viewMonth.m, 1).toLocaleString("default", { month: "long", year: "numeric" });
  const firstDow = new Date(viewMonth.y, viewMonth.m, 1).getDay();
  const daysInMonth = new Date(viewMonth.y, viewMonth.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const changeMonth = (delta) => {
    setViewMonth((cur) => {
      let m = cur.m + delta;
      let y = cur.y;
      if (m < 0) {
        m = 11;
        y -= 1;
      } else if (m > 11) {
        m = 0;
        y += 1;
      }
      return { y, m };
    });
  };

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={() => changeMonth(-1)} style={{ background: "transparent", border: "1px solid var(--cb-border-strong)", borderRadius: 6, color: "var(--cb-text-secondary)", padding: "10px 16px", fontSize: 20, lineHeight: 1, cursor: "pointer" }}>
          ‹
        </button>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--cb-accent)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{monthName}</div>
        <button onClick={() => changeMonth(1)} style={{ background: "transparent", border: "1px solid var(--cb-border-strong)", borderRadius: 6, color: "var(--cb-text-secondary)", padding: "10px 16px", fontSize: 20, lineHeight: 1, cursor: "pointer" }}>
          ›
        </button>
      </div>
      {loadingData ? (
        <div style={{ color: "var(--cb-text-faint)", fontSize: 13, padding: 20 }}>Loading sessions…</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 10, color: "var(--cb-text-faint)", fontFamily: "'IBM Plex Mono', monospace" }}>
                {d}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {cells.map((day, i) => {
              if (day == null) return <div key={i} />;
              const dateStr = `${viewMonth.y}-${String(viewMonth.m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const matches = dateIndex[dateStr];
              const isToday = dateStr === todayISO();
              return (
                <div
                  key={i}
                  onClick={() => matches && matches[0] && onJumpToSession(matches[0].week, matches[0].day)}
                  title={matches ? `${matches.length} session${matches.length > 1 ? "s" : ""} logged` : undefined}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 6,
                    border: isToday ? "1px solid var(--cb-rust)" : "1px solid var(--cb-border)",
                    background: matches ? "rgba(200,85,61,0.22)" : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: matches ? "pointer" : "default",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    color: matches ? "var(--cb-accent)" : "var(--cb-text-faint)",
                  }}
                >
                  {day}
                  {matches && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cb-rust)", marginTop: 2 }} />}
                </div>
              );
            })}
          </div>
          {!mostRecentDate && (
            <div style={{ marginTop: 16, color: "var(--cb-text-faint)", fontSize: 13, textAlign: "center", border: "1px dashed var(--cb-border-strong)", borderRadius: 6, padding: 20 }}>
              No completed sessions have a date yet — mark a set done in the Log tab to get started.
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============================= MAIN APP ============================= */
export default function CalgaryBarbellApp({ userEmail }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const [mode, setMode] = useState("overview"); // overview | log | calendar | insights | exercises
  const [phase, setPhase] = useState("Weeks 1-4");
  const [week, setWeek] = useState("1");
  const [day, setDay] = useState("1");
  const [taperLabel, setTaperLabel] = useState(TAPER_LABELS_SORTED[0]);

  const [maxesLb, setMaxesLb] = useState(PROGRAM_DATA.trainingMaxes.maxes);
  const [roundToLb, setRoundToLb] = useState(PROGRAM_DATA.trainingMaxes.round_to || 5);
  const [roundToKg, setRoundToKg] = useState(2.5);
  const [unit, setUnit] = useState("lb");
  const [barType, setBarType] = useState("standard");
  const [startDate, setStartDate] = useState("");
  const [theme, setTheme] = useState("dark");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    if (!settingsOpen) return;
    const handlePointerDown = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [settingsOpen]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const [session, setSession] = useState(EMPTY_SESSION());
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [timer, setTimer] = useState(null); // { label, endAt, duration }
  const [showWorkoutComplete, setShowWorkoutComplete] = useState(false);
  const [allSessions, setAllSessions] = useState({}); // "week:day" -> session, across the whole program
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyExercise, setHistoryExercise] = useState(null); // exercise name for drill-down modal
  const [pendingExerciseSearch, setPendingExerciseSearch] = useState(""); // seeds the Exercises tab search box when linked from the Log tab
  const didInitialJump = useRef(false);

  const nextWorkout = useMemo(() => computeNextWorkout(allSessions), [allSessions]);

  /* All-time heaviest logged weight per exercise — used to flag a set in
     the Log tab as a PB the moment it ties or beats it. */
  const exerciseBestWeightLb = useMemo(() => computeAllTimeBestWeights(allSessions), [allSessions]);

  const isTaper = phase === "Taper Week";
  const absWeek = isTaper ? 16 : Number(week);
  const absDay = isTaper ? TAPER_LABELS_SORTED.indexOf(taperLabel) + 1 : Number(day);
  const entries = getEntriesAbs(absWeek, absDay);
  const skey = sessionKey(absWeek, absDay);

  /* ---- load settings once ---- */
  useEffect(() => {
    (async () => {
      const saved = await storageGet("settings", null);
      if (saved) {
        if (saved.maxesLb) setMaxesLb(saved.maxesLb);
        if (saved.roundToLb) setRoundToLb(saved.roundToLb);
        if (saved.roundToKg) setRoundToKg(saved.roundToKg);
        if (saved.unit) setUnit(saved.unit);
        if (saved.barType) setBarType(saved.barType);
        if (saved.startDate) setStartDate(saved.startDate);
        if (saved.theme) setTheme(saved.theme);
      } else if (typeof window !== "undefined" && window.matchMedia) {
        // No saved preference yet — match the device's system theme once,
        // rather than always defaulting to dark.
        try {
          if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light");
        } catch (e) {
          /* matchMedia unavailable — keep the dark default */
        }
      }
      setSettingsLoaded(true);
    })();
  }, []);
  useEffect(() => {
    if (!settingsLoaded) return;
    storageSet("settings", { maxesLb, roundToLb, roundToKg, unit, barType, startDate, theme });
  }, [maxesLb, roundToLb, roundToKg, unit, barType, startDate, theme, settingsLoaded]);

  /* ---- load the whole program's session history once, for Insights / Calendar / drill-down ---- */
  useEffect(() => {
    (async () => {
      const map = await loadAllSessions();
      setAllSessions(map);
      setLoadingHistory(false);
      if (!didInitialJump.current) {
        didInitialJump.current = true;
        const next = computeNextWorkout(map);
        if (next) {
          const targetPhase = weekToPhase(next.week);
          if (targetPhase) {
            setPhase(targetPhase);
            if (targetPhase === "Taper Week") setTaperLabel(TAPER_LABELS_SORTED[next.day - 1]);
            else setWeek(String(next.week));
          }
        }
      }
    })();
  }, []);

  /* ---- load session whenever the viewed day changes ---- */
  useEffect(() => {
    let cancelled = false;
    setExpandedIdx(null);
    setShowWorkoutComplete(false);
    (async () => {
      const saved = await storageGet(skey, null);
      if (!cancelled) setSession(saved || EMPTY_SESSION());
    })();
    return () => {
      cancelled = true;
    };
  }, [skey]);

  const persistSession = useCallback(
    (next) => {
      setSession(next);
      storageSet(skey, next);
      setAllSessions((prev) => ({ ...prev, [`${absWeek}:${absDay}`]: next }));
    },
    [skey, absWeek, absDay]
  );

  const toggleSet = useCallback(
    (idx, setIdx) => {
      const entry = entries[idx];
      const cur = getSetStates(entry, session, idx);
      const next = cur.slice();
      const nowChecked = !next[setIdx];
      next[setIdx] = nowChecked;
      const nextSession = { ...session, completion: { ...session.completion, [idx]: next } };
      if (next.every(Boolean) && !nextSession.date) nextSession.date = todayISO();
      const wasComplete = isDayComplete(entries, session);
      const willCompleteWorkout = !wasComplete && isDayComplete(entries, nextSession);
      persistSession(nextSession);
      if (nowChecked && !willCompleteWorkout) {
        const restSec = Number(entry?.rest);
        if (restSec) {
          primeAudioCtx();
          setTimer({ label: entry.exercise, endAt: Date.now() + restSec * 1000, duration: restSec });
        }
      }
      if (willCompleteWorkout) {
        setShowWorkoutComplete(true);
      }
    },
    [session, persistSession, entries]
  );

  const toggleManualComplete = useCallback(() => {
    const wasComplete = isDayComplete(entries, session);
    const nextSession = { ...session, manuallyCompleted: !session.manuallyCompleted };
    if (nextSession.manuallyCompleted && !nextSession.date) nextSession.date = todayISO();
    const willBeComplete = isDayComplete(entries, nextSession);
    persistSession(nextSession);
    if (!wasComplete && willBeComplete) {
      setShowWorkoutComplete(true);
    }
  }, [session, persistSession, entries]);

  const updateLog = useCallback(
    (idx, log) => {
      persistSession({ ...session, logs: { ...session.logs, [idx]: log } });
    },
    [session, persistSession]
  );

  const updateNotes = useCallback(
    (notes) => {
      persistSession({ ...session, notes });
    },
    [session, persistSession]
  );

  const updateDate = useCallback(
    (date) => {
      persistSession({ ...session, date });
    },
    [session, persistSession]
  );

  /* ---- keep week/day valid when phase changes ---- */
  useEffect(() => {
    if (!isTaper) {
      const weeks = Object.keys(PROGRAM_DATA.phases[phase] || {}).sort((a, b) => Number(a) - Number(b));
      if (weeks.length && !weeks.includes(week)) setWeek(weeks[0]);
    }
    // eslint-disable-next-line
  }, [phase]);
  useEffect(() => {
    if (!isTaper) {
      const days = Object.keys(PROGRAM_DATA.phases[phase]?.[week] || {}).sort((a, b) => Number(a) - Number(b));
      if (days.length && !days.includes(day)) setDay(days[0]);
    }
    // eslint-disable-next-line
  }, [phase, week]);

  const doneCount = entries.filter((entry, i) => {
    const st = getSetStates(entry, session, i);
    return st.length > 0 && st.every(Boolean);
  }).length;
  const total = entries.length;
  const pctDone = total ? Math.round((doneCount / total) * 100) : 0;



  const viewExerciseInExercisesTab = (exerciseName) => {
    setPendingExerciseSearch(exerciseName);
    setMode("exercises");
  };

  /* Swipe left/right anywhere in the tab content area switches between the
     5 main tabs, in NAV_TABS order. The content follows the finger in real
     time rather than snapping instantly, with light resistance at the first
     and last tab, and either finishes the transition (sliding the new tab
     in from the opposite edge) or springs back if released short of the
     commit threshold. Guarded so it doesn't fire while a modal/overlay is
     open, and bails out to normal scrolling the moment a gesture turns out
     to be more vertical than horizontal. */
  const touchStartRef = useRef(null);
  const contentRef = useRef(null);
  const swipeBlocked = settingsOpen || !!historyExercise || showWorkoutComplete;
  const [dragX, setDragX] = useState(0);
  const [dragAnimating, setDragAnimating] = useState(false);

  const handleContentTouchStart = (e) => {
    if (swipeBlocked || dragAnimating || e.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, lock: null };
  };

  const handleContentTouchMove = (e) => {
    const start = touchStartRef.current;
    if (!start || swipeBlocked) return;
    const touch = e.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (start.lock == null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      start.lock = Math.abs(dx) > Math.abs(dy) * 1.3;
      if (!start.lock) {
        touchStartRef.current = null;
        return;
      }
    }
    if (!start.lock) return;
    const currentIndex = NAV_TABS.findIndex((t) => t.value === mode);
    let next = dx;
    if (currentIndex === 0 && dx > 0) next = dx * 0.55;
    if (currentIndex === NAV_TABS.length - 1 && dx < 0) next = dx * 0.55;
    setDragX(next);
  };

  const handleContentTouchEnd = () => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || !start.lock) {
      if (dragX !== 0) setDragX(0);
      return;
    }
    const width = (contentRef.current && contentRef.current.clientWidth) || 320;
    const commit = Math.abs(dragX) > width * 0.28;
    const currentIndex = NAV_TABS.findIndex((t) => t.value === mode);
    const direction = dragX < 0 ? 1 : -1; // dragging left reveals the next tab
    const targetIndex = currentIndex + direction;
    const canCommit = commit && targetIndex >= 0 && targetIndex < NAV_TABS.length;

    if (!canCommit) {
      setDragAnimating(true);
      setDragX(0);
      setTimeout(() => setDragAnimating(false), 320);
      return;
    }

    setDragAnimating(true);
    setDragX(-direction * width);
    setTimeout(() => {
      setMode(NAV_TABS[targetIndex].value);
      setDragAnimating(false);
      setDragX(direction * width);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDragAnimating(true);
          setDragX(0);
          setTimeout(() => setDragAnimating(false), 320);
        });
      });
    }, 260);
  };

  const jumpToDayFromOverview = (d) => {
    if (isTaper) setTaperLabel(TAPER_LABELS_SORTED[d - 1]);
    else setDay(String(d));
    setMode("log");
  };

  const jumpToSession = (targetWeek, targetDay) => {
    const targetPhase = weekToPhase(targetWeek);
    if (!targetPhase) return;
    setMode("log");
    setPhase(targetPhase);
    if (targetPhase === "Taper Week") {
      setTaperLabel(TAPER_LABELS_SORTED[targetDay - 1]);
    } else {
      setWeek(String(targetWeek));
      setDay(String(targetDay));
    }
  };

  const dayIndexInProgram = PROGRAM_SEQUENCE.findIndex((pt) => pt.week === absWeek && pt.day === absDay);
  const canStepDay = (delta) => {
    const idx = dayIndexInProgram + delta;
    return dayIndexInProgram !== -1 && idx >= 0 && idx < PROGRAM_SEQUENCE.length;
  };
  const stepDay = (delta) => {
    const idx = dayIndexInProgram + delta;
    if (dayIndexInProgram === -1 || idx < 0 || idx >= PROGRAM_SEQUENCE.length) return;
    const target = PROGRAM_SEQUENCE[idx];
    jumpToSession(target.week, target.day);
  };
  const prevDay = () => stepDay(-1);
  const nextDay = () => stepDay(1);

  const goToWeekOverview = (targetWeek) => {
    const targetPhase = weekToPhase(targetWeek);
    if (!targetPhase) return;
    setPhase(targetPhase);
    if (targetPhase === "Taper Week") {
      setTaperLabel(TAPER_LABELS_SORTED[0]);
    } else {
      setWeek(String(targetWeek));
    }
    setMode("overview");
  };

  const prevWeek = () => goToWeekOverview(Math.max(1, absWeek - 1));
  const nextWeek = () => goToWeekOverview(Math.min(16, absWeek + 1));

  const exportBackup = async () => {
    const savedSettings = await storageGet("settings", null);
    const sessions = await loadAllSessions();
    const payload = {
      app: "calgary-barbell-16-week",
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: savedSettings,
      sessions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calgary-barbell-backup-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importBackupFile = async (file) => {
    let data;
    try {
      const text = await file.text();
      data = JSON.parse(text);
    } catch (e) {
      window.alert("Could not read that file — make sure it's a backup exported from this app.");
      return;
    }
    if (!data || typeof data !== "object" || (!data.sessions && !data.settings)) {
      window.alert("That file doesn't look like a valid backup for this app.");
      return;
    }
    const proceed = window.confirm("Importing will overwrite the current data on this device with the contents of this backup. Continue?");
    if (!proceed) return;
    if (data.settings) await storageSet("settings", data.settings);
    if (data.sessions && typeof data.sessions === "object") {
      for (const key of Object.keys(data.sessions)) {
        await storageSet(`session:${key}`, data.sessions[key]);
      }
    }
    window.alert("Backup imported. The app will now reload.");
    window.location.reload();
  };

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        background: "var(--cb-bg)",
        color: "var(--cb-text-primary)",
        borderRadius: 8,
        position: "relative",
        maxWidth: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
      className={`cb-app${theme === "light" ? " cb-theme-light" : ""}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
        input[type=date] { color-scheme: dark; }
        .cb-theme-light input[type=date] { color-scheme: light; }

        .cb-app {
          --cb-bg: #141311;
          --cb-surface: #1a1815;
          --cb-surface-2: #211f1c;
          --cb-border: #2a2824;
          --cb-border-strong: #3a3733;
          --cb-border-muted: #5a564d;
          --cb-border-2: #232120;
          --cb-text-primary: #f2ede4;
          --cb-text-secondary: #c9c2b6;
          --cb-text-muted: #a89f90;
          --cb-text-muted-2: #8a8378;
          --cb-text-faint: #726b5f;
          --cb-accent: #e8d9c5;
          --cb-text-on-accent: #1c1a17;
          --cb-rust: #c8553d;
          --cb-blue: #3d7ea6;
          --cb-gold: #e0a458;
          --cb-green: #4a8752;
          --cb-green-light: #7fae7a;
          --cb-green-text: #a8d4a0;
          --cb-text-on-green: #0f1710;
          --cb-medal-gold: #d4af37;
          --cb-medal-ribbon: #8a6d1f;
          --cb-rust-light-text: #e8b199;
        }
        .cb-app.cb-theme-light {
          --cb-bg: #f5f1e8;
          --cb-surface: #ffffff;
          --cb-surface-2: #efe8da;
          --cb-border: #e3ddd0;
          --cb-border-strong: #cfc6b4;
          --cb-border-muted: #b0a68f;
          --cb-border-2: #e8e2d5;
          --cb-text-primary: #1c1a17;
          --cb-text-secondary: #45403a;
          --cb-text-muted: #6b6459;
          --cb-text-muted-2: #7a7266;
          --cb-text-faint: #948c7d;
          --cb-accent: #a8432e;
          --cb-text-on-accent: #fbf8f2;
          --cb-rust: #b8492f;
          --cb-blue: #2f688a;
          --cb-gold: #b9812f;
          --cb-green: #3f7546;
          --cb-green-light: #6ea369;
          --cb-green-text: #2f6b37;
          --cb-text-on-green: #f7f3ec;
          --cb-medal-gold: #c49a2e;
          --cb-medal-ribbon: #7a5f1a;
          --cb-rust-light-text: #8a3d26;
        }

        .cb-app { height: 100vh; }
        @supports (height: 100dvh) {
          .cb-app { height: 100dvh; }
        }
        .cb-scroll-pane { overflow-y: auto; -webkit-overflow-scrolling: touch; }

        @keyframes cbRestPulse {
          0%, 100% { box-shadow: 0 -6px 28px rgba(0,0,0,0.6), 0 -2px 22px rgba(200,85,61,0.25); }
          50% { box-shadow: 0 -6px 28px rgba(0,0,0,0.6), 0 -4px 34px rgba(200,85,61,0.55); }
        }
        @keyframes cbRestUrgentPulse {
          0%, 100% { box-shadow: 0 -6px 28px rgba(0,0,0,0.6), 0 -2px 22px rgba(224,164,88,0.35); }
          50% { box-shadow: 0 -6px 28px rgba(0,0,0,0.6), 0 -5px 42px rgba(224,164,88,0.8); }
        }
        @keyframes cbRestFlash {
          0%, 100% { background: rgba(15,23,16,0.97); }
          50% { background: rgba(50,90,55,0.97); }
        }

        @media (max-width: 480px) {
          .cb-topbar { padding: 14px 10px 0 !important; }
          .cb-content { padding: 0 10px !important; }
          .cb-title-eyebrow { font-size: 10px !important; letter-spacing: 0.18em !important; }
          .cb-title-main { font-size: 21px !important; }
          .cb-header { flex-wrap: nowrap !important; align-items: center !important; }
          .cb-row { padding: 12px 10px !important; }
          .cb-expand-panel { padding-left: 12px !important; gap: 10px !important; }
          .cb-settings-panel { width: calc(100vw - 56px) !important; max-width: 290px !important; }
          .cb-pr-grid { grid-template-columns: 1fr !important; }
          .cb-tabnav-desktop { display: none !important; }
          .cb-tabnav-mobile { display: grid !important; }
          .cb-set-box { width: 40px !important; height: 40px !important; border-radius: 6px !important; }
          .cb-set-box svg { width: 18px !important; height: 18px !important; }
          .cb-set-box span { font-size: 13px !important; }
          .cb-row-bottom { gap: 18px !important; }
          .cb-row-bottom > div:last-child { gap: 14px !important; }
          .cb-icon-btn { width: 40px !important; height: 40px !important; }
          .cb-clear-btn { width: 42px !important; height: 42px !important; }
        }
      `}</style>

      <div className="cb-topbar" style={{ flexShrink: 0, padding: "22px 18px 0" }}>
      <div className="cb-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", flexWrap: "wrap", rowGap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div className="cb-title-eyebrow" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: "0.25em", color: "var(--cb-rust)", textTransform: "uppercase" }}>
            Calgary Barbell
          </div>
          <div className="cb-title-main" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 30, fontWeight: 700, letterSpacing: "0.01em", color: "var(--cb-text-primary)", lineHeight: 1.1 }}>
            16-Week Program
          </div>
        </div>
        <div className="cb-header-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>

          <div ref={settingsRef} style={{ position: "relative" }}>
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid var(--cb-border-strong)",
                background: "var(--cb-surface-2)",
                color: "var(--cb-accent)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Training max settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>
            <SettingsPanel
              maxesLb={maxesLb}
              roundToLb={roundToLb}
              roundToKg={roundToKg}
              unit={unit}
              barType={barType}
              startDate={startDate}
              theme={theme}
              onChange={(patch) => {
                if ("maxesLb" in patch) setMaxesLb(patch.maxesLb);
                if ("roundToLb" in patch) setRoundToLb(patch.roundToLb);
                if ("roundToKg" in patch) setRoundToKg(patch.roundToKg);
                if ("unit" in patch) setUnit(patch.unit);
                if ("barType" in patch) setBarType(patch.barType);
                if ("startDate" in patch) setStartDate(patch.startDate);
                if ("theme" in patch) setTheme(patch.theme);
              }}
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              onExportBackup={exportBackup}
              onImportFile={importBackupFile}
              userEmail={userEmail}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* Text tabs — shown on regular/desktop widths */}
      <div className="cb-tabnav-desktop" style={{ marginTop: 20, display: "flex", gap: 6, flexWrap: "wrap", rowGap: 10, borderBottom: "1px solid var(--cb-border)", paddingBottom: 10 }}>
        {NAV_TABS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            style={{
              padding: "6px 4px",
              marginRight: 14,
              border: "none",
              borderBottom: mode === m.value ? "2px solid var(--cb-rust)" : "2px solid transparent",
              background: "transparent",
              color: mode === m.value ? "var(--cb-text-primary)" : "var(--cb-text-faint)",
              fontFamily: "'Oswald', sans-serif",
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: "pointer",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Icon + label tabs — shown on mobile widths instead of the text row above */}
      <div
        className="cb-tabnav-mobile"
        style={{
          display: "none",
          marginTop: 16,
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 2,
          borderBottom: "1px solid var(--cb-border)",
          paddingBottom: 8,
        }}
      >
        {NAV_TABS.map((m) => {
          const isActive = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              aria-label={m.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 4,
                padding: "8px 2px 8px",
                border: "none",
                borderBottom: isActive ? "2px solid var(--cb-rust)" : "2px solid transparent",
                background: "transparent",
                color: isActive ? "var(--cb-text-primary)" : "var(--cb-text-faint)",
                cursor: "pointer",
                minWidth: 0,
                width: "100%",
              }}
            >
              <NavTabIcon value={m.value} size={26} />
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {m.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
      </div>

      <div
        ref={contentRef}
        className="cb-content"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "0 18px",
          transform: dragX ? `translateX(${dragX}px)` : undefined,
          transition: dragAnimating ? "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
        onTouchStart={handleContentTouchStart}
        onTouchMove={handleContentTouchMove}
        onTouchEnd={handleContentTouchEnd}
      >
      {mode === "log" && (
        <>
          <div style={{ flexShrink: 0, paddingTop: 16, paddingBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={prevDay}
                disabled={!canStepDay(-1)}
                style={{ background: "transparent", border: "1px solid var(--cb-border-strong)", borderRadius: 6, color: !canStepDay(-1) ? "var(--cb-border-strong)" : "var(--cb-text-secondary)", padding: "10px 16px", fontSize: 20, lineHeight: 1, cursor: !canStepDay(-1) ? "default" : "pointer" }}
              >
                ‹
              </button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--cb-accent)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {isTaper ? taperLabel.replace(/ from Competition/i, "") : `Day ${day}`}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--cb-text-faint)", marginTop: 2 }}>
                  {isTaper ? "Taper Week" : `Week ${week}`}
                </div>
              </div>
              <button
                onClick={nextDay}
                disabled={!canStepDay(1)}
                style={{ background: "transparent", border: "1px solid var(--cb-border-strong)", borderRadius: 6, color: !canStepDay(1) ? "var(--cb-border-strong)" : "var(--cb-text-secondary)", padding: "10px 16px", fontSize: 20, lineHeight: 1, cursor: !canStepDay(1) ? "default" : "pointer" }}
              >
                ›
              </button>
            </div>

            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif", whiteSpace: "nowrap" }}>
                  Completed
                </span>
                <input
                  type="date"
                  value={session.date || ""}
                  onChange={(e) => updateDate(e.target.value)}
                  style={{
                    padding: "5px 8px",
                    background: "var(--cb-surface)",
                    border: "1px solid var(--cb-border-strong)",
                    borderRadius: 3,
                    color: "var(--cb-text-primary)",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                  }}
                />
              </label>
            </div>

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 6, background: "var(--cb-border)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${pctDone}%`, height: "100%", background: "var(--cb-rust)", transition: "width 0.2s ease" }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--cb-text-muted-2)", minWidth: 46, textAlign: "right" }}>
                {doneCount}/{total}
              </div>
            </div>
          </div>

          <div className="cb-scroll-pane" style={{ flex: 1, minHeight: 0, paddingBottom: 140 }}>
          <div style={{ marginTop: 16, border: "1px solid var(--cb-border)", borderRadius: 6, overflow: "hidden" }}>
            {entries.length === 0 && (
              <div style={{ padding: 30, textAlign: "center", color: "var(--cb-text-faint)", fontFamily: "'Oswald', sans-serif" }}>
                No exercises logged for this session.
              </div>
            )}
            {entries.map((entry, idx) => (
              <ExerciseRow
                key={idx}
                entry={entry}
                idx={idx}
                setStates={getSetStates(entry, session, idx)}
                onToggleSet={toggleSet}
                log={session.logs[idx] || {}}
                onLogChange={updateLog}
                expanded={expandedIdx === idx}
                onToggleExpand={(i) => setExpandedIdx((cur) => (cur === i ? null : i))}
                maxesLb={maxesLb}
                unit={unit}
                roundToLb={roundToLb}
                roundToKg={roundToKg}
                barType={barType}
                onOpenHistory={setHistoryExercise}
                onViewInExercises={viewExerciseInExercisesTab}
                bestWeightLb={exerciseBestWeightLb[entry.exercise]}
              />
            ))}
          </div>

          {doneCount < total && (
            <label
              style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
              onClick={toggleManualComplete}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 3,
                  border: `2px solid ${session.manuallyCompleted ? "var(--cb-green)" : "var(--cb-border-muted)"}`,
                  background: session.manuallyCompleted ? "var(--cb-green)" : "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {session.manuallyCompleted && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--cb-text-on-green)" strokeWidth="4">
                    <path d="M4 12.5l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--cb-text-muted)" }}>
                Mark this workout complete without finishing all exercises
              </span>
            </label>
          )}

          <NotesBox value={session.notes || ""} onChange={updateNotes} />
          </div>
        </>
      )}

      {mode === "overview" && (
        <WeekOverview
          week={absWeek}
          allSessions={allSessions}
          nextWorkout={nextWorkout}
          maxesLb={maxesLb}
          unit={unit}
          roundToLb={roundToLb}
          roundToKg={roundToKg}
          barType={barType}
          onJumpToDay={jumpToDayFromOverview}
          onPrevWeek={prevWeek}
          onNextWeek={nextWeek}
        />
      )}

      {mode === "exercises" && (
        <ExercisesView
          initialSearch={pendingExerciseSearch}
          onConsumeInitialSearch={() => setPendingExerciseSearch("")}
          allSessions={allSessions}
          startDate={startDate}
          unit={unit}
          loadingData={loadingHistory}
        />
      )}

      {mode === "calendar" && (
        <div className="cb-scroll-pane" style={{ flex: 1, minHeight: 0, paddingTop: 16, paddingBottom: 24 }}>
          <CalendarView sessions={allSessions} loadingData={loadingHistory} onJumpToSession={jumpToSession} />
        </div>
      )}

      {mode === "insights" && (
        <div className="cb-scroll-pane" style={{ flex: 1, minHeight: 0, paddingTop: 16, paddingBottom: 24 }}>
          <InsightsView unit={unit} sessions={allSessions} loadingData={loadingHistory} />
        </div>
      )}
      </div>

      <RestTimerBar
        timer={timer}
        onDismiss={() => setTimer(null)}
        onExtend={() => setTimer((t) => (t ? { ...t, endAt: t.endAt + 30000, duration: t.duration + 30 } : t))}
      />

      {showWorkoutComplete && (
        <WorkoutCompleteOverlay
          label={isTaper ? taperLabel.replace(/ from Competition/i, "") : `Week ${week} · Day ${day}`}
          onBackToOverview={() => {
            setShowWorkoutComplete(false);
            setMode("overview");
          }}
          onDismiss={() => setShowWorkoutComplete(false)}
        />
      )}

      {historyExercise && (
        <ExerciseHistoryModal
          exercise={historyExercise}
          sessions={allSessions}
          unit={unit}
          onClose={() => setHistoryExercise(null)}
        />
      )}
    </div>
  );
}
