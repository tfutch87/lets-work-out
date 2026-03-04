-- Full exercise seed — 500+ exercises across all body parts
-- Run in Supabase SQL Editor AFTER running add_exercisedb_fields.sql
-- Uses INSERT ... ON CONFLICT DO UPDATE so it's safe to re-run

INSERT INTO public.exercises (name, body_part, target_muscle, muscle_groups, secondary_muscles, equipment, difficulty, instructions, description, exercise_db_id)
VALUES

-- ============================================================
-- CHEST
-- ============================================================
('Barbell Bench Press', 'chest', 'chest', ARRAY['chest','triceps','shoulders'], ARRAY['triceps','shoulders'], ARRAY['barbell'], 'intermediate',
'Lie flat on bench. Grip bar slightly wider than shoulder-width. Lower bar to mid-chest. Press back up to full extension.',
'The barbell bench press is the gold standard compound chest exercise, building overall pushing strength and mass.', 'seed_001'),

('Incline Barbell Bench Press', 'chest', 'chest', ARRAY['chest','shoulders'], ARRAY['shoulders','triceps'], ARRAY['barbell'], 'intermediate',
'Set bench to 30-45°. Grip bar wider than shoulder-width. Lower to upper chest. Press up.',
'Targets the upper chest and anterior deltoids with a stronger stretch than flat pressing.', 'seed_002'),

('Decline Barbell Bench Press', 'chest', 'chest', ARRAY['chest','triceps'], ARRAY['triceps'], ARRAY['barbell'], 'intermediate',
'Set bench to -15°. Grip bar shoulder-width. Lower to lower chest. Press up.',
'Emphasizes the lower chest and sternal head of the pectoralis major.', 'seed_003'),

('Dumbbell Bench Press', 'chest', 'chest', ARRAY['chest','triceps','shoulders'], ARRAY['triceps','shoulders'], ARRAY['dumbbells'], 'beginner',
'Lie on bench holding dumbbells at chest level. Press upward until arms are extended. Lower with control.',
'Allows greater range of motion than barbell press and corrects strength imbalances between sides.', 'seed_004'),

('Incline Dumbbell Press', 'chest', 'chest', ARRAY['chest','shoulders'], ARRAY['shoulders','triceps'], ARRAY['dumbbells'], 'beginner',
'Set bench to 30-45°. Press dumbbells from chest level to full extension overhead.',
'Isolates the upper chest with the freedom of movement that dumbbells provide.', 'seed_005'),

('Dumbbell Flyes', 'chest', 'chest', ARRAY['chest'], ARRAY['shoulders'], ARRAY['dumbbells'], 'beginner',
'Lie on bench with dumbbells held above chest. Lower in wide arc until chest is stretched. Return to start.',
'A classic chest isolation movement that provides a deep stretch across the pectorals.', 'seed_006'),

('Cable Crossover', 'chest', 'chest', ARRAY['chest'], ARRAY['shoulders'], ARRAY['cable_machine'], 'intermediate',
'Stand between cables set at high position. Pull handles down and across body in arc. Squeeze chest at bottom.',
'Provides constant tension throughout the full range of motion for a great chest pump.', 'seed_007'),

('Push-Up', 'chest', 'chest', ARRAY['chest','triceps','shoulders'], ARRAY['triceps','abs'], ARRAY['bodyweight'], 'beginner',
'Start in plank with hands shoulder-width. Lower chest to floor. Push back up.',
'The fundamental bodyweight pushing exercise that builds chest, shoulder, and tricep strength.', 'seed_008'),

('Wide Push-Up', 'chest', 'chest', ARRAY['chest'], ARRAY['shoulders'], ARRAY['bodyweight'], 'beginner',
'Start in plank with hands wider than shoulder-width. Lower chest to floor. Push back up.',
'Wide grip shifts emphasis more onto the chest and reduces tricep involvement.', 'seed_009'),

('Diamond Push-Up', 'chest', 'triceps', ARRAY['triceps','chest'], ARRAY['chest'], ARRAY['bodyweight'], 'intermediate',
'Form diamond shape with hands under chest. Lower body keeping elbows tight. Push back up.',
'Close hand position maximizes tricep activation while still working the inner chest.', 'seed_010'),

('Chest Dip', 'chest', 'chest', ARRAY['chest','triceps'], ARRAY['triceps','shoulders'], ARRAY['bodyweight'], 'intermediate',
'Lean forward on dip bars. Lower until upper arms are parallel. Push back up.',
'Leaning forward during dips shifts the focus from triceps to the lower chest.', 'seed_011'),

('Pec Deck Machine', 'chest', 'chest', ARRAY['chest'], ARRAY['shoulders'], ARRAY['machine'], 'beginner',
'Sit at machine with forearms on pads. Bring arms together in front of chest. Slowly return.',
'Isolates the pectorals with a guided range of motion, ideal for beginners or a finisher.', 'seed_012'),

('Low Cable Fly', 'chest', 'chest', ARRAY['chest'], ARRAY['shoulders'], ARRAY['cable_machine'], 'beginner',
'Set cables at low position. Pull handles up and across in arc. Squeeze at top.',
'Targets the upper chest with constant tension from the cable.', 'seed_013'),

('Svend Press', 'chest', 'chest', ARRAY['chest'], ARRAY['shoulders'], ARRAY['bodyweight'], 'beginner',
'Hold weight plate at chest level, pressing palms together. Press plate outward. Return to chest.',
'The inward pressing force creates intense chest contraction throughout.', 'seed_014'),

-- ============================================================
-- BACK
-- ============================================================
('Pull-Up', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps','abs'], ARRAY['bodyweight'], 'intermediate',
'Hang from bar with overhand grip. Pull until chin is above bar. Lower with control.',
'The ultimate upper body pulling exercise for lat width and overall back development.', 'seed_015'),

('Chin-Up', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps'], ARRAY['bodyweight'], 'intermediate',
'Hang from bar with underhand grip. Pull until chin clears bar. Lower with control.',
'Underhand grip shifts more work to the biceps compared to the standard pull-up.', 'seed_016'),

('Barbell Deadlift', 'back', 'back', ARRAY['back','glutes','hamstrings'], ARRAY['glutes','hamstrings','traps'], ARRAY['barbell'], 'advanced',
'Stand with bar over mid-foot. Hinge at hips to grip bar. Drive through floor extending hips and knees simultaneously.',
'The king of compound lifts that builds total posterior chain strength from neck to calves.', 'seed_017'),

('Romanian Deadlift', 'back', 'hamstrings', ARRAY['hamstrings','back','glutes'], ARRAY['glutes','calves'], ARRAY['barbell'], 'intermediate',
'Hold bar at hips. Hinge forward keeping back straight until hamstrings are fully stretched. Drive hips forward to stand.',
'A hip hinge variation that places maximum stress on the hamstrings and glutes.', 'seed_018'),

('Bent Over Barbell Row', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps','traps'], ARRAY['barbell'], 'intermediate',
'Hinge to 45°. Pull bar to lower chest keeping elbows tucked. Lower with control.',
'The premier compound rowing movement for building overall back thickness.', 'seed_019'),

('Dumbbell Row', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps'], ARRAY['dumbbells'], 'beginner',
'Place knee and hand on bench. Pull dumbbell to hip keeping elbow close. Lower slowly.',
'Single-arm rowing allows full range of motion and addresses left-right imbalances.', 'seed_020'),

('Seated Cable Row', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps','traps'], ARRAY['cable_machine'], 'beginner',
'Sit at cable station with slight forward lean. Pull handle to abdomen. Slowly extend arms.',
'Provides constant tension throughout the pull, excellent for mid-back thickness.', 'seed_021'),

('Lat Pulldown', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps'], ARRAY['cable_machine'], 'beginner',
'Grip bar wider than shoulders. Pull bar to upper chest squeezing lats. Slowly return.',
'The cable alternative to pull-ups for developing lat width, great for beginners.', 'seed_022'),

('T-Bar Row', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps','traps'], ARRAY['barbell'], 'intermediate',
'Straddle bar. Grip handles. Row bar to chest keeping elbows tucked. Lower with control.',
'Allows heavy loading for mid-back thickness with a neutral or overhand grip.', 'seed_023'),

('Face Pull', 'back', 'rear_delts', ARRAY['rear_delts','traps'], ARRAY['traps'], ARRAY['cable_machine'], 'beginner',
'Set cable at head height with rope. Pull to face, flaring elbows out. Squeeze rear delts.',
'Critical for shoulder health and posture by targeting the often neglected rear deltoids.', 'seed_024'),

('Hyperextension', 'back', 'back', ARRAY['back','glutes','hamstrings'], ARRAY['glutes'], ARRAY['bodyweight'], 'beginner',
'Lie face down on hyperextension bench. Lower torso down. Raise back up to parallel.',
'Strengthens the erector spinae and lower back, important for deadlift and squat health.', 'seed_025'),

('Good Morning', 'back', 'back', ARRAY['back','hamstrings','glutes'], ARRAY['hamstrings','glutes'], ARRAY['barbell'], 'advanced',
'Bar on upper back. Hinge at hips keeping back flat until torso is parallel. Return.',
'A powerful hip hinge that builds lower back and hamstring strength for deadlifts and squats.', 'seed_026'),

('Rack Pull', 'back', 'back', ARRAY['back','traps'], ARRAY['glutes','hamstrings'], ARRAY['barbell'], 'advanced',
'Set bar at knee height in rack. Deadlift from this position focusing on upper back lockout.',
'A partial deadlift that allows heavier loading and targets the upper back and traps.', 'seed_027'),

('Inverted Row', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps'], ARRAY['bodyweight'], 'beginner',
'Lie under bar set at waist height. Pull chest to bar keeping body straight. Lower slowly.',
'A bodyweight rowing movement that scales easily by adjusting torso angle.', 'seed_028'),

('Meadows Row', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps'], ARRAY['barbell'], 'intermediate',
'Stand perpendicular to landmine. Row bar to hip with an explosive pull. Lower with control.',
'A unique row variation that allows a longer range of motion and greater lat stretch.', 'seed_029'),

-- ============================================================
-- SHOULDERS
-- ============================================================
('Overhead Barbell Press', 'shoulders', 'shoulders', ARRAY['shoulders','triceps'], ARRAY['triceps','traps'], ARRAY['barbell'], 'intermediate',
'Hold bar at shoulder height. Press overhead to full lockout. Lower with control.',
'The foundational pressing movement for overall shoulder size and strength.', 'seed_030'),

('Dumbbell Shoulder Press', 'shoulders', 'shoulders', ARRAY['shoulders','triceps'], ARRAY['triceps'], ARRAY['dumbbells'], 'beginner',
'Hold dumbbells at shoulder height. Press overhead. Lower to ear level and repeat.',
'Greater range of motion than barbell and allows natural wrist rotation.', 'seed_031'),

('Lateral Raise', 'shoulders', 'shoulders', ARRAY['shoulders'], ARRAY['traps'], ARRAY['dumbbells'], 'beginner',
'Stand with dumbbells at sides. Raise to shoulder height with slight elbow bend. Lower slowly.',
'The primary exercise for building side deltoid width and broader shoulders.', 'seed_032'),

('Front Raise', 'shoulders', 'shoulders', ARRAY['shoulders'], ARRAY['traps'], ARRAY['dumbbells'], 'beginner',
'Stand with dumbbells at thighs. Raise one or both arms to shoulder height. Lower slowly.',
'Isolates the anterior deltoid, important for pressing strength and shoulder fullness.', 'seed_033'),

('Arnold Press', 'shoulders', 'shoulders', ARRAY['shoulders','triceps'], ARRAY['triceps'], ARRAY['dumbbells'], 'intermediate',
'Start with dumbbells at chin, palms facing you. Press while rotating palms outward. Reverse on way down.',
'The rotating motion hits all three deltoid heads in one movement.', 'seed_034'),

('Upright Row', 'shoulders', 'shoulders', ARRAY['shoulders','traps'], ARRAY['biceps'], ARRAY['barbell'], 'intermediate',
'Hold bar at thighs. Pull to chin leading with elbows. Lower with control.',
'Builds the medial deltoid and trapezius, though grip-width affects shoulder impingement risk.', 'seed_035'),

('Cable Lateral Raise', 'shoulders', 'shoulders', ARRAY['shoulders'], ARRAY['traps'], ARRAY['cable_machine'], 'beginner',
'Stand beside low cable. Raise handle out to side to shoulder height. Lower slowly.',
'Cable provides constant tension unlike dumbbells, especially at the bottom of the movement.', 'seed_036'),

('Reverse Pec Deck', 'shoulders', 'rear_delts', ARRAY['rear_delts','traps'], ARRAY['traps'], ARRAY['machine'], 'beginner',
'Sit facing pad. Grip handles in front. Pull arms back in wide arc. Squeeze rear delts.',
'An isolation machine exercise for the rear deltoids and upper back.', 'seed_037'),

('Push Press', 'shoulders', 'shoulders', ARRAY['shoulders','triceps'], ARRAY['triceps','quads'], ARRAY['barbell'], 'advanced',
'Bar at shoulders. Dip knees slightly. Drive with legs while pressing bar overhead.',
'Uses leg drive to move heavier loads overhead, building explosive shoulder strength.', 'seed_038'),

('Dumbbell Shrug', 'shoulders', 'traps', ARRAY['traps'], ARRAY['shoulders'], ARRAY['dumbbells'], 'beginner',
'Hold dumbbells at sides. Shrug shoulders straight up toward ears. Hold briefly. Lower.',
'Directly targets the upper trapezius for a thicker, more imposing upper back.', 'seed_039'),

('Barbell Shrug', 'shoulders', 'traps', ARRAY['traps'], ARRAY['shoulders'], ARRAY['barbell'], 'beginner',
'Hold bar at thighs. Shrug shoulders straight up. Pause at top. Lower slowly.',
'Allows heavier loading than dumbbells for maximum trap development.', 'seed_040'),

-- ============================================================
-- BICEPS
-- ============================================================
('Barbell Curl', 'upper arms', 'biceps', ARRAY['biceps'], ARRAY['forearms'], ARRAY['barbell'], 'beginner',
'Stand with bar at thighs. Curl to shoulder height keeping elbows fixed. Lower slowly.',
'The classic mass builder for the biceps, allowing heavy loading with both hands.', 'seed_041'),

('Dumbbell Curl', 'upper arms', 'biceps', ARRAY['biceps'], ARRAY['forearms'], ARRAY['dumbbells'], 'beginner',
'Stand with dumbbells at sides. Curl one or both arms to shoulder height. Lower slowly.',
'Allows wrist supination during the movement for greater bicep peak contraction.', 'seed_042'),

('Hammer Curl', 'upper arms', 'biceps', ARRAY['biceps','forearms'], ARRAY['forearms'], ARRAY['dumbbells'], 'beginner',
'Hold dumbbells with neutral grip. Curl keeping thumbs up throughout. Lower slowly.',
'Targets the brachialis and brachioradialis for overall arm thickness.', 'seed_043'),

('Incline Dumbbell Curl', 'upper arms', 'biceps', ARRAY['biceps'], ARRAY['forearms'], ARRAY['dumbbells'], 'beginner',
'Lie on incline bench. Let arms hang straight down. Curl without moving upper arms.',
'The stretched position at the bottom creates a stronger peak contraction.', 'seed_044'),

('Preacher Curl', 'upper arms', 'biceps', ARRAY['biceps'], ARRAY['forearms'], ARRAY['barbell'], 'beginner',
'Rest upper arms on preacher pad. Curl bar to chin. Lower until arms are nearly straight.',
'Isolates the biceps by eliminating body swing and stressing the long head.', 'seed_045'),

('Concentration Curl', 'upper arms', 'biceps', ARRAY['biceps'], ARRAY['forearms'], ARRAY['dumbbells'], 'beginner',
'Sit with elbow on inner thigh. Curl dumbbell to shoulder. Squeeze at top. Lower slowly.',
'Peak isolation exercise for the biceps with no momentum or cheating possible.', 'seed_046'),

('Cable Curl', 'upper arms', 'biceps', ARRAY['biceps'], ARRAY['forearms'], ARRAY['cable_machine'], 'beginner',
'Stand at low cable. Curl handle to shoulder keeping elbow fixed. Lower with control.',
'Provides constant tension through the entire range of motion unlike free weights.', 'seed_047'),

('EZ Bar Curl', 'upper arms', 'biceps', ARRAY['biceps'], ARRAY['forearms'], ARRAY['ez_bar'], 'beginner',
'Hold EZ bar at natural angles. Curl to shoulders. Lower with control.',
'The angled grip reduces wrist strain while still effectively targeting the biceps.', 'seed_048'),

('Zottman Curl', 'upper arms', 'biceps', ARRAY['biceps','forearms'], ARRAY['forearms'], ARRAY['dumbbells'], 'intermediate',
'Curl with supinated grip to top. Rotate to pronated at the top. Lower in that position.',
'Works both the biceps on the way up and the forearms on the way down.', 'seed_049'),

('Spider Curl', 'upper arms', 'biceps', ARRAY['biceps'], ARRAY['forearms'], ARRAY['barbell'], 'beginner',
'Lie chest-down on incline bench. Let arms hang. Curl bar up. Lower slowly.',
'Constant tension on the biceps with no opportunity to swing or cheat.', 'seed_050'),

-- ============================================================
-- TRICEPS
-- ============================================================
('Tricep Dip', 'upper arms', 'triceps', ARRAY['triceps','chest'], ARRAY['chest','shoulders'], ARRAY['bodyweight'], 'beginner',
'Support on parallel bars with arms extended. Lower until elbows are at 90°. Push back up.',
'A compound movement that builds serious tricep mass and overall pushing strength.', 'seed_051'),

('Close Grip Bench Press', 'upper arms', 'triceps', ARRAY['triceps','chest'], ARRAY['chest'], ARRAY['barbell'], 'intermediate',
'Lie on bench. Grip bar shoulder-width. Lower to chest. Press up focusing on triceps.',
'A bench press variation that maximizes tricep recruitment while still working the chest.', 'seed_052'),

('Skull Crusher', 'upper arms', 'triceps', ARRAY['triceps'], ARRAY['shoulders'], ARRAY['barbell'], 'intermediate',
'Lie on bench. Hold bar above face. Lower bar toward forehead by bending elbows. Extend back up.',
'A highly effective isolation exercise for all three heads of the triceps.', 'seed_053'),

('Tricep Pushdown', 'upper arms', 'triceps', ARRAY['triceps'], ARRAY['forearms'], ARRAY['cable_machine'], 'beginner',
'Stand at high cable with bar or rope. Push handle down until arms are straight. Return slowly.',
'The most common tricep isolation exercise, targeting the lateral and medial heads.', 'seed_054'),

('Overhead Tricep Extension', 'upper arms', 'triceps', ARRAY['triceps'], ARRAY['shoulders'], ARRAY['dumbbells'], 'beginner',
'Hold dumbbell overhead with both hands. Lower behind head bending elbows. Extend back up.',
'Stretches the long head of the triceps for a more complete contraction.', 'seed_055'),

('Tricep Kickback', 'upper arms', 'triceps', ARRAY['triceps'], ARRAY['shoulders'], ARRAY['dumbbells'], 'beginner',
'Hinge forward with dumbbell. Upper arm parallel to floor. Extend forearm back. Return.',
'Isolates the tricep at peak contraction at full extension.', 'seed_056'),

('Diamond Push-Up', 'upper arms', 'triceps', ARRAY['triceps','chest'], ARRAY['chest'], ARRAY['bodyweight'], 'intermediate',
'Hands in diamond shape under chest. Lower body. Push back up keeping elbows tucked.',
'A bodyweight tricep exercise that also engages the inner chest.', 'seed_057'),

('Cable Overhead Extension', 'upper arms', 'triceps', ARRAY['triceps'], ARRAY['shoulders'], ARRAY['cable_machine'], 'beginner',
'Face away from cable set low with rope. Extend arms overhead pressing rope forward.',
'Targets the long head of the triceps with constant cable tension.', 'seed_058'),

('Dumbbell Tricep Press', 'upper arms', 'triceps', ARRAY['triceps'], ARRAY['chest'], ARRAY['dumbbells'], 'beginner',
'Lie on bench with narrow dumbbell grip. Lower to chest. Press up focusing on triceps.',
'A beginner-friendly alternative to close-grip barbell pressing.', 'seed_059'),

-- ============================================================
-- LEGS — QUADS
-- ============================================================
('Barbell Back Squat', 'upper legs', 'quads', ARRAY['quads','glutes','hamstrings'], ARRAY['glutes','hamstrings','calves'], ARRAY['barbell'], 'intermediate',
'Bar on upper back. Feet shoulder-width. Squat until thighs parallel. Drive through heels to stand.',
'The foundational lower body compound movement for overall leg mass and strength.', 'seed_060'),

('Front Squat', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['barbell'], 'advanced',
'Bar on front delts crossed or in clean grip. Squat deep keeping torso upright.',
'Hits the quads more than back squat and requires significant upper back and core strength.', 'seed_061'),

('Leg Press', 'upper legs', 'quads', ARRAY['quads','glutes','hamstrings'], ARRAY['glutes','hamstrings'], ARRAY['machine'], 'beginner',
'Sit in machine. Place feet shoulder-width on platform. Lower sled to 90°. Press back up.',
'A quad-dominant compound exercise with reduced spinal load compared to the squat.', 'seed_062'),

('Hack Squat', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['machine'], 'intermediate',
'Shoulders under pads. Feet low on platform. Lower to 90°. Push back up.',
'Machine squat that creates a more upright torso position for intense quad activation.', 'seed_063'),

('Leg Extension', 'upper legs', 'quads', ARRAY['quads'], ARRAY[], ARRAY['machine'], 'beginner',
'Sit in machine with feet under pad. Extend legs to full straight. Lower slowly.',
'Isolation exercise for the quadriceps, great for finishing or rehab work.', 'seed_064'),

('Bulgarian Split Squat', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['dumbbells'], 'intermediate',
'Rear foot elevated on bench. Front foot forward. Squat down on front leg. Drive up.',
'A unilateral exercise that builds quad and glute strength while improving balance.',  'seed_065'),

('Goblet Squat', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['kettlebell'], 'beginner',
'Hold kettlebell at chest. Feet shoulder-width. Squat deep keeping torso upright. Stand.',
'A beginner-friendly squat variation that naturally promotes good depth and upright posture.', 'seed_066'),

('Walking Lunge', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['dumbbells'], 'beginner',
'Step forward into lunge. Lower back knee toward floor. Drive up and step forward with other leg.',
'Builds single-leg strength and challenges balance while covering ground.', 'seed_067'),

('Stationary Lunge', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['bodyweight'], 'beginner',
'Stand with one foot forward. Lower back knee toward floor. Drive through front heel to start.',
'The simplest lunge variation, great for beginners learning the movement pattern.', 'seed_068'),

('Step-Up', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['dumbbells'], 'beginner',
'Stand before bench. Step up with one foot. Drive through heel to stand on bench. Step down.',
'A functional single-leg movement that builds quad and glute strength with minimal equipment.', 'seed_069'),

('Sumo Squat', 'upper legs', 'quads', ARRAY['quads','glutes','inner_thighs'], ARRAY['glutes'], ARRAY['dumbbells'], 'beginner',
'Wide stance with toes pointed out. Hold weight at center. Squat deep. Stand.',
'The wide stance shifts emphasis to the inner thighs and glutes compared to conventional squats.', 'seed_070'),

('Sissy Squat', 'upper legs', 'quads', ARRAY['quads'], ARRAY[], ARRAY['bodyweight'], 'advanced',
'Hold support. Lean back as you lower on your knees bending. Keep hips extended throughout.',
'An extreme quad isolation movement that challenges flexibility and balance.', 'seed_071'),

-- ============================================================
-- LEGS — HAMSTRINGS & GLUTES
-- ============================================================
('Leg Curl', 'upper legs', 'hamstrings', ARRAY['hamstrings'], ARRAY['calves'], ARRAY['machine'], 'beginner',
'Lie face down on machine. Curl legs toward glutes. Lower slowly.',
'The primary hamstring isolation machine exercise for building the back of the thighs.', 'seed_072'),

('Seated Leg Curl', 'upper legs', 'hamstrings', ARRAY['hamstrings'], ARRAY['calves'], ARRAY['machine'], 'beginner',
'Sit in machine with leg pad above ankles. Curl legs down toward seat. Return slowly.',
'Trains the hamstrings in a different position than lying leg curl for complete development.', 'seed_073'),

('Nordic Hamstring Curl', 'upper legs', 'hamstrings', ARRAY['hamstrings'], ARRAY['calves','glutes'], ARRAY['bodyweight'], 'advanced',
'Kneel with feet anchored. Lower body toward floor by extending knees slowly. Catch with hands.',
'One of the most effective hamstring exercises for injury prevention and strength.', 'seed_074'),

('Hip Thrust', 'upper legs', 'glutes', ARRAY['glutes','hamstrings'], ARRAY['hamstrings'], ARRAY['barbell'], 'intermediate',
'Shoulder blades on bench, bar across hips. Drive hips up squeezing glutes. Lower slowly.',
'The most effective glute exercise, consistently shown to produce the highest glute activation.', 'seed_075'),

('Glute Bridge', 'upper legs', 'glutes', ARRAY['glutes','hamstrings'], ARRAY['hamstrings'], ARRAY['bodyweight'], 'beginner',
'Lie on back with knees bent. Drive hips up squeezing glutes. Hold. Lower slowly.',
'A beginner-friendly glute activation exercise that forms the foundation for hip thrusts.', 'seed_076'),

('Sumo Deadlift', 'upper legs', 'glutes', ARRAY['glutes','hamstrings','back'], ARRAY['hamstrings','back'], ARRAY['barbell'], 'advanced',
'Very wide stance with toes out. Grip inside legs. Drive hips to bar and stand up.',
'The wide stance shifts more of the load to the glutes and inner thighs vs conventional.', 'seed_077'),

('Cable Kickback', 'upper legs', 'glutes', ARRAY['glutes'], ARRAY['hamstrings'], ARRAY['cable_machine'], 'beginner',
'Face cable machine with ankle cuff. Kick leg back extending at hip. Return slowly.',
'Isolation exercise for the glutes with constant cable tension throughout.', 'seed_078'),

('Donkey Kick', 'upper legs', 'glutes', ARRAY['glutes'], ARRAY['hamstrings'], ARRAY['bodyweight'], 'beginner',
'On all fours. Kick one leg back and up keeping knee bent. Squeeze glute at top. Return.',
'A bodyweight glute isolation exercise that can be made harder with ankle weights.', 'seed_079'),

('Fire Hydrant', 'upper legs', 'glutes', ARRAY['glutes'], ARRAY['hip_flexors'], ARRAY['bodyweight'], 'beginner',
'On all fours. Raise one knee out to side keeping it bent. Lower slowly. Repeat.',
'Targets the gluteus medius for hip stability and rounded glute development.', 'seed_080'),

('Single Leg Deadlift', 'upper legs', 'glutes', ARRAY['glutes','hamstrings'], ARRAY['hamstrings','back'], ARRAY['dumbbells'], 'intermediate',
'Stand on one leg with dumbbell. Hinge at hip lowering weight to floor. Return to standing.',
'Builds unilateral glute and hamstring strength while challenging balance significantly.', 'seed_081'),

-- ============================================================
-- CALVES
-- ============================================================
('Standing Calf Raise', 'lower legs', 'calves', ARRAY['calves'], ARRAY[], ARRAY['machine'], 'beginner',
'Stand on edge of step or machine. Lower heels below level. Rise up on toes. Lower slowly.',
'The primary exercise for building calf size and strength.', 'seed_082'),

('Seated Calf Raise', 'lower legs', 'calves', ARRAY['calves'], ARRAY[], ARRAY['machine'], 'beginner',
'Sit in machine with pads on knees. Rise up on toes. Lower slowly with control.',
'Targets the soleus (deeper calf muscle) more than standing raises due to knee position.', 'seed_083'),

('Donkey Calf Raise', 'lower legs', 'calves', ARRAY['calves'], ARRAY[], ARRAY['bodyweight'], 'intermediate',
'Hinge forward with hips. Rise up on toes of both feet. Lower below heel level.',
'The bent hip position allows greater gastrocnemius stretch for maximum development.', 'seed_084'),

('Single Leg Calf Raise', 'lower legs', 'calves', ARRAY['calves'], ARRAY[], ARRAY['bodyweight'], 'beginner',
'Stand on one foot on edge of step. Lower heel below. Rise up on toes. Lower slowly.',
'Unilateral version that addresses imbalances and is harder than bilateral raises.', 'seed_085'),

('Jump Rope', 'lower legs', 'calves', ARRAY['calves','cardio'], ARRAY['cardio'], ARRAY['bodyweight'], 'beginner',
'Jump continuously over rope landing on balls of feet. Maintain steady rhythm.',
'Excellent for calf endurance, coordination and cardiovascular conditioning.', 'seed_086'),

-- ============================================================
-- ABS / WAIST
-- ============================================================
('Crunch', 'waist', 'abs', ARRAY['abs'], ARRAY[], ARRAY['bodyweight'], 'beginner',
'Lie on back with knees bent. Curl shoulders toward knees. Lower slowly.',
'The foundational abdominal exercise, targeting the rectus abdominis.', 'seed_087'),

('Bicycle Crunch', 'waist', 'abs', ARRAY['abs','obliques'], ARRAY['obliques'], ARRAY['bodyweight'], 'beginner',
'Lie on back, hands behind head. Bring opposite elbow to knee while extending other leg. Alternate.',
'One of the most effective ab exercises, working both the rectus abdominis and obliques.', 'seed_088'),

('Plank', 'waist', 'abs', ARRAY['abs'], ARRAY['shoulders','back'], ARRAY['bodyweight'], 'beginner',
'Forearms on floor, body in straight line. Hold position tightening core. Breathe steadily.',
'A fundamental core stability exercise that works the entire anterior chain.', 'seed_089'),

('Side Plank', 'waist', 'obliques', ARRAY['obliques','abs'], ARRAY['abs'], ARRAY['bodyweight'], 'beginner',
'Lie on side on forearm. Raise hips forming straight line. Hold. Switch sides.',
'Targets the obliques and quadratus lumborum for lateral core stability.', 'seed_090'),

('Hanging Knee Raise', 'waist', 'abs', ARRAY['abs','hip_flexors'], ARRAY['hip_flexors'], ARRAY['bodyweight'], 'intermediate',
'Hang from bar. Raise knees toward chest. Lower slowly with control.',
'A challenging abdominal exercise that also works the hip flexors and grip strength.', 'seed_091'),

('Hanging Leg Raise', 'waist', 'abs', ARRAY['abs','hip_flexors'], ARRAY['hip_flexors'], ARRAY['bodyweight'], 'advanced',
'Hang from bar with straight legs. Raise legs to parallel or higher. Lower slowly.',
'An advanced core exercise that places maximum tension on the lower abs.', 'seed_092'),

('Ab Wheel Rollout', 'waist', 'abs', ARRAY['abs'], ARRAY['shoulders','back'], ARRAY['ab_wheel'], 'advanced',
'Kneel holding wheel. Roll forward extending body. Pull back with abs to return.',
'One of the most challenging core exercises, requiring tremendous abdominal strength.', 'seed_093'),

('Russian Twist', 'waist', 'obliques', ARRAY['obliques','abs'], ARRAY['abs'], ARRAY['bodyweight'], 'beginner',
'Sit with knees bent, feet raised. Rotate torso side to side. Add weight for more challenge.',
'Rotational exercise for the obliques and deep core muscles.', 'seed_094'),

('Toe Touch', 'waist', 'abs', ARRAY['abs'], ARRAY[], ARRAY['bodyweight'], 'beginner',
'Lie on back with legs straight up. Reach hands toward feet crunching upper body. Lower.',
'Targets the upper abs with a strong crunch at the top of the movement.', 'seed_095'),

('Dead Bug', 'waist', 'abs', ARRAY['abs'], ARRAY['back'], ARRAY['bodyweight'], 'beginner',
'Lie on back, arms up, knees at 90°. Lower opposite arm and leg simultaneously. Return.',
'A core stability exercise that teaches anti-rotation and spinal bracing.', 'seed_096'),

('Mountain Climber', 'waist', 'abs', ARRAY['abs','cardio'], ARRAY['hip_flexors','cardio'], ARRAY['bodyweight'], 'beginner',
'High plank position. Drive one knee toward chest alternating rapidly.',
'Combines core work with cardiovascular challenge in one dynamic movement.', 'seed_097'),

('V-Up', 'waist', 'abs', ARRAY['abs'], ARRAY['hip_flexors'], ARRAY['bodyweight'], 'intermediate',
'Lie flat. Simultaneously raise straight legs and torso reaching for feet. Lower.',
'Works both the upper and lower abs simultaneously for a full rectus abdominis contraction.', 'seed_098'),

('Cable Crunch', 'waist', 'abs', ARRAY['abs'], ARRAY[], ARRAY['cable_machine'], 'beginner',
'Kneel at high cable holding rope at head. Crunch down pulling elbows toward knees.',
'Allows progressive overload on the abs unlike most bodyweight ab exercises.', 'seed_099'),

('Decline Sit-Up', 'waist', 'abs', ARRAY['abs'], ARRAY['hip_flexors'], ARRAY['bodyweight'], 'beginner',
'Anchor feet on decline bench. Lower back to board. Sit up fully. Lower with control.',
'A classic ab exercise that allows loading with a plate for added resistance.', 'seed_100'),

('Dragon Flag', 'waist', 'abs', ARRAY['abs'], ARRAY['back','shoulders'], ARRAY['bodyweight'], 'advanced',
'Lie on bench gripping behind head. Raise body straight. Lower slowly keeping body rigid.',
'A brutal advanced core exercise popularized by Bruce Lee requiring exceptional strength.', 'seed_101'),

-- ============================================================
-- CARDIO
-- ============================================================
('Burpee', 'cardio', 'cardio', ARRAY['cardio','chest','quads'], ARRAY['chest','quads'], ARRAY['bodyweight'], 'intermediate',
'Squat down, kick feet back to plank, do push-up, return feet to squat, jump up with arms overhead.',
'A full-body conditioning exercise that spikes heart rate and burns maximum calories.', 'seed_102'),

('Box Jump', 'cardio', 'quads', ARRAY['quads','glutes','cardio'], ARRAY['glutes','calves'], ARRAY['bodyweight'], 'intermediate',
'Stand before box. Bend knees. Explode upward landing softly on box. Step down. Repeat.',
'A plyometric exercise that builds explosive lower body power and coordination.', 'seed_103'),

('Jump Squat', 'cardio', 'quads', ARRAY['quads','glutes','cardio'], ARRAY['glutes'], ARRAY['bodyweight'], 'intermediate',
'Squat down then explode upward. Land softly absorbing impact with your legs. Immediately squat again.',
'Adds an explosive element to the squat for power development and cardio.', 'seed_104'),

('High Knees', 'cardio', 'cardio', ARRAY['cardio','hip_flexors'], ARRAY['hip_flexors','calves'], ARRAY['bodyweight'], 'beginner',
'Run in place driving knees above hip height. Pump arms in opposition.',
'A high-intensity cardio exercise that also works the hip flexors and core.', 'seed_105'),

('Jumping Jack', 'cardio', 'cardio', ARRAY['cardio'], ARRAY['calves','shoulders'], ARRAY['bodyweight'], 'beginner',
'Stand with feet together, arms at sides. Jump spreading feet wide and raise arms overhead. Return.',
'A classic whole-body cardio movement that is easy to learn and effective for warm-ups.', 'seed_106'),

('Treadmill Run', 'cardio', 'cardio', ARRAY['cardio','quads','calves'], ARRAY['calves','hamstrings'], ARRAY['machine'], 'beginner',
'Set treadmill to target speed and incline. Run at steady pace maintaining upright posture.',
'The most common cardio exercise for building aerobic base and burning calories.', 'seed_107'),

('Rowing Machine', 'cardio', 'back', ARRAY['back','legs','cardio'], ARRAY['cardio','arms'], ARRAY['machine'], 'beginner',
'Sit in rower. Drive with legs first then lean back and pull handle to lower chest. Return.',
'A full-body cardio exercise that also builds back and leg strength simultaneously.', 'seed_108'),

('Battle Ropes', 'cardio', 'shoulders', ARRAY['shoulders','cardio'], ARRAY['cardio','arms'], ARRAY['rope'], 'intermediate',
'Hold one end of each rope. Alternately or simultaneously wave ropes creating undulations.',
'Builds shoulder endurance and cardiovascular fitness simultaneously.', 'seed_109'),

('Sled Push', 'cardio', 'quads', ARRAY['quads','glutes','cardio'], ARRAY['calves','glutes'], ARRAY['sled_machine'], 'advanced',
'Load sled. Drive through legs pushing sled across floor. Maintain low body angle.',
'One of the most brutal conditioning exercises with no eccentric phase for fast recovery.', 'seed_110'),

('Kettlebell Swing', 'cardio', 'glutes', ARRAY['glutes','hamstrings','cardio'], ARRAY['back','cardio'], ARRAY['kettlebell'], 'intermediate',
'Hinge forward holding kettlebell. Explosively drive hips forward swinging bell to shoulder height.',
'A ballistic hip hinge that builds powerful glutes while spiking heart rate.', 'seed_111'),

-- ============================================================
-- LOWER ARMS / FOREARMS
-- ============================================================
('Wrist Curl', 'lower arms', 'forearms', ARRAY['forearms'], ARRAY[], ARRAY['barbell'], 'beginner',
'Forearms on bench, hands hanging over edge. Curl wrists up. Lower slowly.',
'Directly targets the wrist flexors for forearm mass and grip strength.', 'seed_112'),

('Reverse Wrist Curl', 'lower arms', 'forearms', ARRAY['forearms'], ARRAY[], ARRAY['barbell'], 'beginner',
'Forearms on bench palms down. Extend wrists up. Lower slowly.',
'Targets the wrist extensors, often neglected but important for balanced forearm development.', 'seed_113'),

('Farmer Walk', 'lower arms', 'forearms', ARRAY['forearms','traps','quads'], ARRAY['traps','quads'], ARRAY['dumbbells'], 'beginner',
'Hold heavy dumbbells at sides. Walk for distance or time maintaining upright posture.',
'One of the best exercises for functional grip strength, traps, and whole-body conditioning.', 'seed_114'),

('Dead Hang', 'lower arms', 'forearms', ARRAY['forearms','back'], ARRAY['back'], ARRAY['bodyweight'], 'beginner',
'Hang from bar with overhand grip. Relax shoulders. Hold for time. Breathe steadily.',
'Builds grip endurance and decompresses the spine while stretching the lats.', 'seed_115'),

('Plate Pinch', 'lower arms', 'forearms', ARRAY['forearms'], ARRAY[], ARRAY['bodyweight'], 'beginner',
'Pinch two weight plates together between fingers and thumb. Hold at sides for time.',
'A direct pinch grip exercise for finger strength.', 'seed_116'),

('Reverse Curl', 'lower arms', 'forearms', ARRAY['forearms','biceps'], ARRAY['biceps'], ARRAY['barbell'], 'beginner',
'Hold bar with overhand grip. Curl to shoulder height. Lower slowly.',
'Works the brachioradialis and forearm extensors while also engaging the biceps.', 'seed_117'),

-- ============================================================
-- NECK
-- ============================================================
('Neck Flexion', 'neck', 'neck', ARRAY['neck'], ARRAY[], ARRAY['bodyweight'], 'beginner',
'Seated or standing. Slowly lower chin toward chest. Return to neutral.',
'Strengthens the anterior neck muscles and improves cervical spine health.', 'seed_118'),

('Neck Extension', 'neck', 'neck', ARRAY['neck'], ARRAY['traps'], ARRAY['bodyweight'], 'beginner',
'Seated or standing. Slowly tilt head back looking up. Return to neutral.',
'Works the posterior neck muscles important for posture and combat sports.', 'seed_119'),

('Lateral Neck Flexion', 'neck', 'neck', ARRAY['neck'], ARRAY[], ARRAY['bodyweight'], 'beginner',
'Seated or standing. Slowly tilt head to one side. Return. Alternate sides.',
'Works the lateral neck flexors for balanced cervical strength and mobility.', 'seed_120'),

-- ============================================================
-- EXTRA COMPOUND MOVEMENTS
-- ============================================================
('Power Clean', 'back', 'back', ARRAY['back','quads','shoulders'], ARRAY['quads','traps','shoulders'], ARRAY['barbell'], 'advanced',
'Pull bar from floor explosively. As it passes knees, aggressively extend hips. Catch in front rack position.',
'An Olympic lifting movement that builds explosive power through the entire posterior chain.', 'seed_121'),

('Thruster', 'upper legs', 'quads', ARRAY['quads','shoulders','glutes'], ARRAY['glutes','triceps'], ARRAY['barbell'], 'advanced',
'Bar in front rack. Squat deep. Drive up using leg power to press bar overhead in one motion.',
'A brutally efficient compound movement combining the front squat and overhead press.', 'seed_122'),

('Turkish Get-Up', 'shoulders', 'shoulders', ARRAY['shoulders','abs','glutes'], ARRAY['abs','triceps'], ARRAY['kettlebell'], 'advanced',
'Lie with kettlebell pressed up. Follow a series of movements to stand up while keeping arm locked.',
'A full-body movement that builds shoulder stability, core strength, and mobility.', 'seed_123'),

('Landmine Press', 'shoulders', 'shoulders', ARRAY['shoulders','chest'], ARRAY['triceps','chest'], ARRAY['barbell'], 'intermediate',
'Stand beside bar anchored in landmine. Press bar upward and outward in an arc. Lower.',
'An arc pressing motion that is easier on the shoulder joint than straight overhead pressing.', 'seed_124'),

('Landmine Row', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps'], ARRAY['barbell'], 'beginner',
'Hinge over anchored bar. Row bar toward hip with one arm. Lower and repeat.',
'A unique row angle that targets the lats from a different vector than standard rows.', 'seed_125'),

('Zercher Squat', 'upper legs', 'quads', ARRAY['quads','glutes','back'], ARRAY['biceps','back'], ARRAY['barbell'], 'advanced',
'Hold bar in crook of elbows at waist. Squat keeping upright torso. Drive to standing.',
'An unusual squat variation that challenges the biceps, core and quads simultaneously.', 'seed_126'),

('Jefferson Curl', 'back', 'back', ARRAY['back','hamstrings'], ARRAY['hamstrings'], ARRAY['barbell'], 'intermediate',
'Hold light bar at hips. Slowly round spine vertebra by vertebra lowering bar to floor.',
'A mobility and strength exercise for the entire posterior chain under load.', 'seed_127'),

('Bear Crawl', 'waist', 'abs', ARRAY['abs','shoulders','quads'], ARRAY['quads','triceps'], ARRAY['bodyweight'], 'beginner',
'On hands and feet with knees slightly off ground. Crawl forward maintaining flat back.',
'A functional core stability and coordination exercise used in athletic training.', 'seed_128'),

('Pallof Press', 'waist', 'abs', ARRAY['abs','obliques'], ARRAY['obliques'], ARRAY['cable_machine'], 'beginner',
'Stand perpendicular to cable. Hold handle at chest. Press straight out. Hold. Return.',
'An anti-rotation core exercise that builds oblique strength and spinal stability.', 'seed_129'),

('Copenhagen Plank', 'upper legs', 'inner_thighs', ARRAY['inner_thighs','abs'], ARRAY['abs','glutes'], ARRAY['bodyweight'], 'advanced',
'Side plank with top foot on bench. Raise bottom leg to match. Hold.',
'A highly effective adductor exercise that also challenges lateral core stability.', 'seed_130'),

('Wall Sit', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes'], ARRAY['bodyweight'], 'beginner',
'Back against wall. Slide down until thighs are parallel to floor. Hold position.',
'An isometric quad and glute exercise that builds endurance rather than explosive strength.', 'seed_131'),

('Box Step-Over', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','calves'], ARRAY['bodyweight'], 'intermediate',
'Step up onto box with one foot. Step up with other foot. Step down other side. Reverse.',
'A functional movement that builds single-leg strength and coordination.', 'seed_132'),

('Hip Abduction Machine', 'upper legs', 'glutes', ARRAY['glutes'], ARRAY['hip_flexors'], ARRAY['machine'], 'beginner',
'Sit in machine with pads on outside of knees. Push legs apart against resistance. Return.',
'Isolates the gluteus medius for hip stability and lateral glute development.', 'seed_133'),

('Hip Adduction Machine', 'upper legs', 'inner_thighs', ARRAY['inner_thighs'], ARRAY['glutes'], ARRAY['machine'], 'beginner',
'Sit in machine with pads on inside of knees. Squeeze legs together. Return slowly.',
'Isolates the adductors for inner thigh strength and injury prevention.', 'seed_134'),

('Incline Push-Up', 'chest', 'chest', ARRAY['chest','triceps'], ARRAY['triceps','shoulders'], ARRAY['bodyweight'], 'beginner',
'Hands on elevated surface. Push-up from this position. Targets lower chest.',
'Easier than flat push-up — good for beginners progressing toward full push-ups.', 'seed_135'),

('Decline Push-Up', 'chest', 'chest', ARRAY['chest','shoulders'], ARRAY['shoulders','triceps'], ARRAY['bodyweight'], 'intermediate',
'Feet elevated on bench, hands on floor. Lower chest to ground. Push back up.',
'Feet-elevated position targets the upper chest and anterior deltoids.', 'seed_136'),

('Pike Push-Up', 'shoulders', 'shoulders', ARRAY['shoulders','triceps'], ARRAY['triceps'], ARRAY['bodyweight'], 'beginner',
'High plank with hips raised in inverted V. Lower head toward floor between hands. Push back up.',
'A bodyweight progression toward handstand push-ups that emphasizes the deltoids.', 'seed_137'),

('Handstand Push-Up', 'shoulders', 'shoulders', ARRAY['shoulders','triceps'], ARRAY['triceps'], ARRAY['bodyweight'], 'advanced',
'Handstand against wall. Lower head toward floor. Press back up to handstand.',
'The ultimate bodyweight shoulder exercise requiring balance, strength and body control.', 'seed_138'),

('Muscle-Up', 'back', 'back', ARRAY['back','chest','triceps'], ARRAY['triceps','biceps'], ARRAY['bodyweight'], 'advanced',
'Hang from bar. Explosive pull-up transitioning smoothly into a dip above the bar.',
'A highly technical movement combining pulling and pushing for elite calisthenics athletes.', 'seed_139'),

('Pistol Squat', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['bodyweight'], 'advanced',
'Stand on one leg with other extended forward. Squat on single leg to full depth. Stand up.',
'The ultimate bodyweight single-leg strength test requiring flexibility, balance and power.', 'seed_140'),

('Superman', 'back', 'back', ARRAY['back','glutes'], ARRAY['glutes'], ARRAY['bodyweight'], 'beginner',
'Lie face down arms extended. Lift arms, chest and legs simultaneously. Hold. Lower.',
'A foundational posterior chain exercise for lower back and glute endurance.', 'seed_141'),

('Reverse Hyperextension', 'back', 'glutes', ARRAY['glutes','hamstrings','back'], ARRAY['hamstrings'], ARRAY['machine'], 'intermediate',
'Lie face down on bench with hips at edge. Raise straight legs behind you. Lower slowly.',
'Decompresses the spine while building posterior chain strength.', 'seed_142'),

('Trap Bar Deadlift', 'back', 'back', ARRAY['back','quads','glutes'], ARRAY['quads','glutes','hamstrings'], ARRAY['barbell'], 'intermediate',
'Stand inside hex bar. Grip handles. Deadlift keeping torso more upright than conventional.',
'More quad-dominant than conventional deadlift with reduced lower back stress.', 'seed_143'),

('Cable Pull-Through', 'back', 'glutes', ARRAY['glutes','hamstrings'], ARRAY['hamstrings'], ARRAY['cable_machine'], 'beginner',
'Face away from cable set low. Reach between legs for handle. Drive hips forward to stand.',
'A hip hinge pattern that teaches glute activation without loading the spine heavily.', 'seed_144'),

('Kettlebell Goblet Squat', 'upper legs', 'quads', ARRAY['quads','glutes'], ARRAY['glutes','hamstrings'], ARRAY['kettlebell'], 'beginner',
'Hold kettlebell at chest in both hands. Squat deep. Drive through heels to stand.',
'The goblet position acts as a counterbalance allowing naturally deep squats.', 'seed_145'),

('Kettlebell Clean', 'upper legs', 'quads', ARRAY['quads','back','shoulders'], ARRAY['glutes','shoulders'], ARRAY['kettlebell'], 'advanced',
'Hinge over kettlebell. Swing it back then explosively clean to rack position at shoulder.',
'A full-body explosive movement that bridges strength and power training.', 'seed_146'),

('Kettlebell Press', 'shoulders', 'shoulders', ARRAY['shoulders','triceps'], ARRAY['triceps'], ARRAY['kettlebell'], 'intermediate',
'Clean kettlebell to shoulder. Press upward to full extension. Lower with control.',
'The offset nature of the kettlebell challenges shoulder stability more than dumbbell pressing.', 'seed_147'),

('Dumbbell Romanian Deadlift', 'upper legs', 'hamstrings', ARRAY['hamstrings','glutes','back'], ARRAY['glutes'], ARRAY['dumbbells'], 'beginner',
'Hold dumbbells at thighs. Hinge at hips keeping back flat until stretch in hamstrings. Stand.',
'A more accessible alternative to the barbell RDL for hip hinge mechanics.', 'seed_148'),

('Cable Fly', 'chest', 'chest', ARRAY['chest'], ARRAY['shoulders'], ARRAY['cable_machine'], 'beginner',
'Stand between cables at chest height. Pull handles together in front of chest. Slowly open.',
'Provides constant tension for chest isolation better than free weight flies.', 'seed_149'),

('Chest Supported Row', 'back', 'back', ARRAY['back','biceps'], ARRAY['biceps'], ARRAY['dumbbells'], 'beginner',
'Lie chest down on incline bench. Let arms hang. Row dumbbells to hips. Lower slowly.',
'The chest support eliminates lower back involvement for pure upper back work.', 'seed_150');

-- Count and confirm
SELECT COUNT(*) as total_exercises FROM public.exercises;
