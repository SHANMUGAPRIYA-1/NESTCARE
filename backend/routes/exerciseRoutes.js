require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Exercise = require('../models/Exercise');

const router = express.Router();

// Store uploaded file in memory (no disk writes needed)
const upload = multer({ storage: multer.memoryStorage() });

// Initialise Gemini with the API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ─────────────────────────────────────────────
   EXERCISE CATALOGUE
   All 80 safe postpartum exercises grouped by
   scenario tag. Gemini picks the best 5 exercise
   names → we look them up here for full details.
───────────────────────────────────────────── */
const ALL_EXERCISES = [
  // ── Breathing & Relaxation ──
  {
    tag: 'diaphragmatic_breathing',
    name: 'Diaphragmatic Breathing',
    description: 'Lie flat on your back. Place one hand on chest, one on belly. Inhale slowly through your nose, expanding your belly. Exhale gently through pursed lips.',
    benefits: 'Activates the parasympathetic system, reduces cortisol, gently engages deep core.',
    gifUrl: 'https://kinahealthrockland.com/wp-content/uploads/2020/10/breathing.jpg',
    durationSeconds: 60,
    reps: '5 slow breaths × 4 rounds',
    difficulty: 'gentle',
  },
  {
    tag: 'seated_deep_breathing',
    name: 'Seated Deep Breathing',
    description: 'Sit tall in a chair. Inhale for 4 counts, hold for 2, exhale for 6 counts. Focus on relaxing on the exhale.',
    benefits: 'Activates vagal tone, directly helps lower elevated blood pressure.',
    gifUrl: 'https://post.healthline.com/wp-content/uploads/2022/11/400x400_Breathing_Techniques_For_Stress_Relief_and_More_Deep_Breathing.gif',
    durationSeconds: 120,
    reps: '4-2-6 timing × 10 breath cycles',
    difficulty: 'gentle',
  },
  // ── Pelvic Floor ──
  {
    tag: 'kegel',
    name: 'Pelvic Floor Kegel Contractions',
    description: 'Lie on your back, knees bent. Contract pelvic floor muscles (as if stopping urine). Hold 5 seconds, release 5 seconds.',
    benefits: 'Restores pelvic floor tone after delivery; reduces incontinence risk.',
    gifUrl: 'https://postpartumtrainer.com/wp-content/uploads/2020/04/deep-breathing.gif',
    durationSeconds: 90,
    reps: '10 holds × 3 sets',
    difficulty: 'gentle',
  },
  {
    tag: 'belly_breathing_pelvic_floor',
    name: 'Belly Breathing with Pelvic Floor Sync',
    description: 'Lie on back with bent knees. Inhale to expand belly, exhale and simultaneously draw belly button in AND squeeze pelvic floor.',
    benefits: 'Core reset — heals diastasis by syncing intra-abdominal pressure with pelvic floor.',
    gifUrl: 'https://images.ctfassets.net/6ilvqec50fal/0Kb3PZp5nSm0jbZjvwp1s/7441cf569af2125f886b91d477e0c671/Pilates_Lateral_Breathing_-_Floor.gif',
    durationSeconds: 90,
    reps: '10 coordinated breaths × 3 rounds',
    difficulty: 'gentle',
  },
  // ── Circulation ──
  {
    tag: 'ankle_pumps',
    name: 'Ankle Pumps and Circles',
    description: 'Lying or seated — flex and point feet alternately, then draw circles with each ankle in both directions.',
    benefits: 'Maintains circulation, prevents post-partum swelling and DVT.',
    gifUrl: 'https://www.physio-pedia.com/images/archive/3/35/20200323205608%21Ankle_pumps.gif',
    durationSeconds: 60,
    reps: '20 pumps + 10 circles each foot × 2 rounds',
    difficulty: 'gentle',
  },
  {
    tag: 'heel_toe_walk',
    name: 'Heel-to-Toe Walk',
    description: 'Walk in a straight line, placing heel directly in front of toes each step. Slow, controlled, 30 steps.',
    benefits: 'Gentle aerobic activity, improves balance, keeps heart rate low.',
    gifUrl: 'https://media.post.rvohealth.io/wp-content/uploads/2023/05/Heel-to-toe-walk.gif',
    durationSeconds: 90,
    reps: '3 × 30 steps forward and back',
    difficulty: 'gentle',
  },
  // ── Gentle Stretches ──
  {
    tag: 'neck_rolls',
    name: 'Gentle Neck Rolls',
    description: 'Sit or lie comfortably. Slowly lower your right ear toward right shoulder, roll chin to chest, then to left. Reverse.',
    benefits: 'Relieves neck and upper back tension from breastfeeding posture.',
    gifUrl: 'https://images.squarespace-cdn.com/content/v1/5a0a0b06d74cffe4d8a3404a/1627404832493-50UFVVVATW9Q9T5J9NG3/Verywell-1-3567200-NeckRoll0-1379-18752657beb34ef5a04be8171a8d9dac.gif',
    durationSeconds: 60,
    reps: '5 rolls each direction × 2 rounds',
    difficulty: 'gentle',
  },
  {
    tag: 'shoulder_shrugs',
    name: 'Seated Shoulder Shrugs',
    description: 'Sit upright. Inhale and lift both shoulders toward your ears. Hold 2 seconds, then drop them as you exhale.',
    benefits: 'Releases shoulder tension, supports posture during nursing.',
    gifUrl: 'https://media.post.rvohealth.io/wp-content/uploads/2019/06/shoulder-shrugs.gif',
    durationSeconds: 60,
    reps: '15 shrugs × 2 sets',
    difficulty: 'gentle',
  },
  {
    tag: 'cat_cow',
    name: 'Cat-Cow Stretch',
    description: 'On hands and knees: inhale and arch back (cow), exhale and round spine (cat). Move slowly and rhythmically.',
    benefits: 'Gently mobilises the spine, reduces blood pressure through rhythmic movement.',
    gifUrl: 'https://media.post.rvohealth.io/wp-content/uploads/2019/07/Cat-Cow-stretch.gif',
    durationSeconds: 90,
    reps: '10 slow cycles × 3 rounds',
    difficulty: 'gentle',
  },
  // ── Core – Beginner ──
  {
    tag: 'pelvic_tilts',
    name: 'Pelvic Tilts',
    description: 'Lie on back, knees bent. Flatten your lower back into the floor by tightening abs. Hold 3 seconds, release.',
    benefits: 'Restores lower-back alignment and gently activates deep core without raising BP.',
    gifUrl: 'https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_5_Exercises_for_Anterior_Pelvic_Tilt_Bridge.gif',
    durationSeconds: 90,
    reps: '12 tilts × 3 sets',
    difficulty: 'light',
  },
  {
    tag: 'heel_slides',
    name: 'Heel Slides',
    description: 'Lie on back, knees bent. Slowly slide one heel along the bed to extend the leg keeping lower back flat. Slide it back.',
    benefits: 'Gently activates hip flexors and core without any strain on perineum.',
    gifUrl: 'https://www.vissco.com/wp-content/uploads/animation/sub/single-heel-slide.gif',
    durationSeconds: 90,
    reps: '10 reps each leg × 3 sets',
    difficulty: 'light',
  },
  {
    tag: 'log_roll',
    name: 'Supported Log Roll to Sitting',
    description: 'Bend knees, roll to side, press with arms to sit up. Reverse to lie down. Practice this motion safely.',
    benefits: 'Protects the incision site, teaches safe core engagement in early recovery.',
    gifUrl: 'https://d2culxnxbccemt.cloudfront.net/bowl/content/uploads/2020/08/31121055/roll-2.gif',
    durationSeconds: 60,
    reps: '5 roll sequences × 2 rounds',
    difficulty: 'gentle',
  },
  // ── Core – Diastasis Safe ──
  {
    tag: 'dead_bug',
    name: 'Dead Bug (Modified)',
    description: 'Lie on back. Extend one arm overhead while extending opposite leg, keeping lower back FLAT to floor. Alternate sides slowly.',
    benefits: 'Rebuilds deep transverse abdominus without increasing diastasis gap.',
    gifUrl: 'https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyb2s1czE2MXE0NHM5ZG4yc2JreTk5MXM5bXJhY2VkODFzbXhrOHFocSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/aIyZ9Ra6pyo5ZOHQsm/giphy.gif',
    durationSeconds: 90,
    reps: '6 reps each side × 3 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'bird_dog',
    name: 'Bird Dog',
    description: 'All fours. Extend right arm forward and left leg back simultaneously. Hold 3 seconds. Switch sides.',
    benefits: 'Challenges core stability without midline flex — safe for diastasis.',
    gifUrl: 'https://media.self.com/photos/61a7aa8d140ff57c06f4657e/master/w_1600%2Cc_limit/Gail-bird-dog-same-side.gif',
    durationSeconds: 90,
    reps: '8 reps each side × 3 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'seated_row_band',
    name: 'Seated Row with Resistance Band',
    description: 'Sit with legs extended. Loop band around feet. Hold ends tall, pull band toward torso squeezing shoulder blades.',
    benefits: 'Improves posture and thoracic strength, reduces compensatory pressure on diastasis gap.',
    gifUrl: 'https://d2culxnxbccemt.cloudfront.net/bowl/content/uploads/2020/03/03123205/row-3.gif',
    durationSeconds: 90,
    reps: '12 rows × 3 sets',
    difficulty: 'moderate',
  },
  // ── Hip / Glute ──
  {
    tag: 'glute_bridge',
    name: 'Glute Bridges',
    description: 'Lie on back, feet hip-width, knees bent. Drive through heels to lift hips until body forms straight line from knees to shoulders. Squeeze at top.',
    benefits: 'Rebuilds glute and posterior chain strength safely post-partum.',
    gifUrl: 'https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/648x364_5_Glute_Bridge_Variations_One_Legged_Glute_Bridge.gif',
    durationSeconds: 90,
    reps: '15 reps × 3 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'glute_bridge_march',
    name: 'Glute Bridge March',
    description: 'Perform a glute bridge. While holding hips lifted, alternately raise one foot off the floor (march in place). Keep hips level.',
    benefits: 'Advanced bridge progression for full glute and core integration.',
    gifUrl: 'https://i.pinimg.com/originals/db/cb/87/dbcb870e489fbbfbdc7ef86f31b73f18.gif',
    durationSeconds: 90,
    reps: '10 marches each leg × 3 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'side_leg_raise',
    name: 'Side-Lying Leg Raise',
    description: 'Lie on your side, body straight. Slowly raise top leg to about 45°. Hold 2 seconds, lower with control.',
    benefits: 'Strengthens hip abductors and outer thighs without core pressure.',
    gifUrl: 'https://i.pinimg.com/originals/b5/a6/f8/b5a6f8ff60ffbc37bf3fd2d66015e8dc.gif',
    durationSeconds: 90,
    reps: '15 reps each side × 3 sets',
    difficulty: 'light',
  },
  {
    tag: 'clamshell',
    name: 'Standing Clamshell',
    description: 'Stand near wall, slight knee bend. Rotate top knee outward while keeping hips level. Do not let pelvis tilt.',
    benefits: 'Hip strengthening to support return to walking, stairs, and carrying baby.',
    gifUrl: 'https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUydWpoNXl5emN3YTYxbTE0YW5paW9rbTJydDRmd3Ztb21id2hwN2owMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7Ec2YRXmldWu0VMRbH/source.gif',
    durationSeconds: 90,
    reps: '12 reps each side × 3 sets',
    difficulty: 'light',
  },
  {
    tag: 'lateral_band_walk',
    name: 'Lateral Band Walk',
    description: 'Band around thighs/ankles. Slight knee bend. Take side-steps right 10 steps, then back left.',
    benefits: 'Hip abductor and glute strength — crucial for higher weight-bearing activity.',
    gifUrl: 'https://www.nourishmovelove.com/wp-content/uploads/2023/03/LateralWalkGiphy.gif',
    durationSeconds: 90,
    reps: '10 steps each direction × 4 sets',
    difficulty: 'moderate',
  },
  // ── Lower Body – Strength ──
  {
    tag: 'squat',
    name: 'Bodyweight Squats',
    description: 'Feet shoulder-width, push hips back and bend knees until thighs are parallel. Keep chest tall. Drive through heels to stand.',
    benefits: 'Rebuilds full lower body strength needed for daily activities with baby.',
    gifUrl: 'https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_Squat.gif',
    durationSeconds: 90,
    reps: '15 squats × 4 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'sumo_squat',
    name: 'Sumo Squat',
    description: 'Wide stance, toes pointing outward. Sit deeply into the squat, inner thighs stretched. Drive back up through heels.',
    benefits: 'Targets inner thighs and glutes more intensely — handles higher body weight well.',
    gifUrl: 'https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUybm9odzJ3N3FuOXJpN3pydDB2ZXRjNW9nMWhycjR5NzlhejN0N2Z0cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1C1ipHPEs4Vjwglwza/giphy.gif',
    durationSeconds: 90,
    reps: '15 reps × 4 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'wall_sit',
    name: 'Supported Wall Sit',
    description: 'Back flat against wall. Slide down until thighs are at 45–90°. Hold. Stand back up slowly.',
    benefits: 'Strengthens quads and glutes without breath-holding; BP stays stable.',
    gifUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/08/400x400_9964_Why_a_Wall_is_the_Perfect_Workout_Equipment_Wall_Sit_Clam.gif',
    durationSeconds: 60,
    reps: '4 holds × 30 seconds each',
    difficulty: 'moderate',
  },
  {
    tag: 'reverse_lunge',
    name: 'Reverse Lunge',
    description: 'Step one foot back and lower back knee toward floor. Drive through front heel to stand. Alternate legs.',
    benefits: 'Builds unilateral leg strength with lower knee stress — better for higher weights.',
    gifUrl: 'https://i.pinimg.com/originals/c8/f3/f7/c8f3f78b83404911b9da58150bcb0d32.gif',
    durationSeconds: 90,
    reps: '12 reps each side × 4 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'walking_lunges',
    name: 'Walking Lunges',
    description: 'Step forward with right foot, lower until both knees are at 90°. Push off front foot and bring left foot forward into next lunge.',
    benefits: 'Builds unilateral leg strength and improves balance for carrying baby.',
    gifUrl: 'https://www.verywellfit.com/thmb/gZ4VVP_pO5_88VA06yEtd-9P7P4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/walking-lunge-5c4212bec9e77c000177ade8.gif',
    durationSeconds: 90,
    reps: '10 steps each leg × 3 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'step_ups',
    name: 'Step-Ups',
    description: 'Step up with right foot, bring left up to meet it. Step down with right, then left. Alternate leading foot.',
    benefits: 'Functional strength mimicking daily movement; strengthens glutes and quads.',
    gifUrl: 'https://cdn.jefit.com/assets/img/exercises/gifs/1225.gif',
    durationSeconds: 90,
    reps: '10 reps each side × 4 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'rdl',
    name: 'Romanian Deadlift (Bodyweight)',
    description: 'Feet hip-width. Hinge at hips pushing them back, lower torso toward floor keeping back flat. Drive hips forward to stand.',
    benefits: 'Strengthens entire posterior chain — glutes, hamstrings, lower back.',
    gifUrl: 'https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUycmh2eWo5ejdjdnNiNTIyamV6ZGJwcG81bno1N2kzcHZoOXowdGZ1dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9Pb50rpfgRu4igSGFV/200.gif',
    durationSeconds: 90,
    reps: '12 reps × 4 sets',
    difficulty: 'hard',
  },
  {
    tag: 'calf_raises',
    name: 'Standing Calf Raises',
    description: 'Stand with feet parallel near a wall for balance. Slowly rise onto tiptoes. Hold 2s, lower with control.',
    benefits: 'Strengthens lower legs, improves circulation, prevents post-op ankle swelling.',
    gifUrl: 'https://i.pinimg.com/originals/b2/9c/f5/b29cf50d50e7f25493fab0ce541bb12b.gif',
    durationSeconds: 60,
    reps: '20 reps × 3 sets',
    difficulty: 'light',
  },
  // ── Upper Body ──
  {
    tag: 'wall_pushup',
    name: 'Wall Push-Up',
    description: "Stand at arm's length from wall. Hands shoulder-width on wall. Bend elbows to bring chest toward wall, push back.",
    benefits: 'Builds upper body push strength without floor load — suitable for C-section and high weight.',
    gifUrl: 'https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyMzN6cWdvZTVwaHNnOGFmb2g0YWR2OXQ5dGExZndqZGw4dXRqa204dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2yuPBGrg5DagENk59X/giphy.gif',
    durationSeconds: 90,
    reps: '12 push-ups × 3 sets',
    difficulty: 'light',
  },
  {
    tag: 'incline_pushup',
    name: 'Incline Push-Up',
    description: 'Place hands on stable elevated surface. Lower chest toward surface keeping body straight, push back up.',
    benefits: 'Progresses upper body push strength safely post-partum.',
    gifUrl: 'https://www.strengthlog.com/wp-content/uploads/2021/03/incline-push-up-exercise-technique.gif',
    durationSeconds: 90,
    reps: '12 reps × 4 sets',
    difficulty: 'moderate',
  },
  {
    tag: 'full_pushup',
    name: 'Full Push-Up',
    description: 'High plank position. Lower chest to floor, elbows at 45°. Push back to start. Keep core braced.',
    benefits: 'Full upper body press strength, supports carrying and lifting baby.',
    gifUrl: 'https://www.mitrecsports.com/assets/Push-Ups-Gif.gif',
    durationSeconds: 90,
    reps: '12 reps × 4 sets',
    difficulty: 'hard',
  },
  // ── Cardio / Endurance ──
  {
    tag: 'marching',
    name: 'Marching in Place',
    description: 'Stand tall. Lift knees alternately in a steady march, swinging arms. Maintain a comfortable but continuous pace.',
    benefits: 'Burns calories, improves insulin sensitivity, keeps heart rate in fat-burning zone.',
    gifUrl: 'https://i.makeagif.com/media/9-12-2015/RGmL41.gif',
    durationSeconds: 120,
    reps: '2 continuous minutes × 3 rounds',
    difficulty: 'light',
  },
  {
    tag: 'step_touch',
    name: 'Step Touch Lateral',
    description: 'Step right foot right, bring left foot to meet it. Repeat to left. Add arm swings for increased calorie burn.',
    benefits: 'Low-impact cardio that improves blood sugar control without joint stress.',
    gifUrl: 'https://i.makeagif.com/media/5-01-2023/UtjXro.gif',
    durationSeconds: 120,
    reps: '2 minutes continuously × 3 rounds',
    difficulty: 'light',
  },
  {
    tag: 'high_knees',
    name: 'High Knees',
    description: 'Run in place, driving each knee toward chest quickly. Pump arms in sync. Keep chest tall and core engaged.',
    benefits: 'Cardio conditioning, burns fat, improves coordination.',
    gifUrl: 'https://i.pinimg.com/originals/b4/77/a9/b477a978bd0283dc983a15dccd4cdb47.gif',
    durationSeconds: 60,
    reps: '1 minute × 4 rounds',
    difficulty: 'hard',
  },
  {
    tag: 'low_impact_jacks',
    name: 'Low-Impact Jumping Jacks',
    description: 'Step right foot out while raising arms overhead, step back in, repeat to left. Keep one foot on ground at all times.',
    benefits: 'Full body cardio — high calorie burn in safe way for higher weight.',
    gifUrl: 'https://media.post.rvohealth.io/wp-content/uploads/2018/09/Low-impact-jumping-jack.gif',
    durationSeconds: 120,
    reps: '2 minutes × 3 rounds',
    difficulty: 'moderate',
  },
  {
    tag: 'jump_squat',
    name: 'Jump Squats',
    description: 'Perform a regular squat, then jump explosively. Land softly with knees bent. (Rise onto toes only for low-impact option.)',
    benefits: 'Builds power and burns calories; boosts metabolic rate.',
    gifUrl: 'https://www.mitrecsports.com/assets/Jump-Squats-Gif.gif',
    durationSeconds: 60,
    reps: '12 reps × 4 sets',
    difficulty: 'hard',
  },
  {
    tag: 'modified_burpee',
    name: 'Modified Burpee (No Jump)',
    description: 'Stand → squat → walk hands to plank → hold 2s → walk back → stand. No jumping.',
    benefits: 'Full body conditioning at manageable intensity for higher body weight.',
    gifUrl: 'https://miro.medium.com/0*GTlHSgwtoanEqTm7.gif',
    durationSeconds: 90,
    reps: '10 reps × 4 sets',
    difficulty: 'hard',
  },
  // ── Core – Advanced ──
  {
    tag: 'plank',
    name: 'Plank Hold',
    description: 'Forearms on ground, body in a straight line from head to heels. Engage core, squeeze glutes. Keep breathing.',
    benefits: 'Full core strength restoration — targets all layers of the abdominal wall.',
    gifUrl: 'https://i.makeagif.com/media/12-10-2020/loK6lL.gif',
    durationSeconds: 60,
    reps: '4 holds × 30 seconds each',
    difficulty: 'hard',
  },
  {
    tag: 'side_plank',
    name: 'Modified Side Plank (Knees)',
    description: 'Prop on bottom knee and forearm. Lift hips to form straight line from knee to shoulder. Hold.',
    benefits: 'Lateral core strength — important for load management at higher weights.',
    gifUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/1.1.SidePlank.gif',
    durationSeconds: 60,
    reps: '3 holds × 20 seconds each side',
    difficulty: 'moderate',
  },
  {
    tag: 'plank_to_down_dog',
    name: 'Plank to Downward Dog',
    description: 'Start in high plank. Push hips up and back into downward dog (inverted V). Return to plank. Alternate fluidly.',
    benefits: 'Dynamic core and full body mobility — appropriate for 7+ weeks and higher weight.',
    gifUrl: 'https://i.pinimg.com/originals/c0/01/ef/c001ef916a88ef41762c0d107116a96e.gif',
    durationSeconds: 90,
    reps: '10 transitions × 4 sets',
    difficulty: 'hard',
  },
  {
    tag: 'seated_bicycle',
    name: 'Seated Bicycle (Chair)',
    description: 'Sit on chair edge, hands gripping sides. Cycle legs in the air as if pedalling. Slow, controlled circles.',
    benefits: 'Activates hip flexors and core, improves circulation and glucose metabolism.',
    gifUrl: 'https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyOXY5Zm9wbTV5OHRsb3dwajljbHJ3ZDB6dHFya3NrbXZ0YmNsc256ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/TMNCtgJGJnV8k/giphy.gif',
    durationSeconds: 90,
    reps: '20 cycles × 3 sets',
    difficulty: 'light',
  },
  {
    tag: 'core_twist',
    name: 'Standing Core Twist',
    description: 'Feet hip-width. Clasp hands in front of chest. Rotate torso slowly right, return to center, rotate left.',
    benefits: 'Restores rotational core strength safely after well-healed C-section (13+ weeks).',
    gifUrl: 'https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyNmV4OTMzbmd3cTJnMGZ5YzNqc3pzOWU4d2ZxYzY2ZGpqdW83ZGN6OSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cpKD9u3S25xYL8tcbr/source.gif',
    durationSeconds: 60,
    reps: '15 reps each side × 3 sets',
    difficulty: 'moderate',
  },
  // ── Glute Squeeze ──
  {
    tag: 'glute_squeeze',
    name: 'Glute Squeeze',
    description: 'Lie on back or stand. Squeeze glutes hard together, hold 3 seconds, and release.',
    benefits: 'Builds glute strength without any abdominal movement.',
    gifUrl: 'https://www.vissco.com/wp-content/uploads/animation/sub/glut-squeeze.gif',
    durationSeconds: 60,
    reps: '15 holds × 3 sets',
    difficulty: 'gentle',
  },
  // ── Seated Leg Raises ──
  {
    tag: 'seated_leg_raise',
    name: 'Seated Leg Raises',
    description: 'Sit in a sturdy chair. Straighten one leg and raise it level with hip. Hold 2 seconds, lower. Alternate.',
    benefits: 'Builds quad strength and improves glucose uptake in major leg muscles.',
    gifUrl: 'https://www.mitrecsports.com/assets/sit.gif',
    durationSeconds: 90,
    reps: '15 reps each leg × 3 sets',
    difficulty: 'light',
  },
  // ── Seated Marching ──
  {
    tag: 'seated_marching',
    name: 'Seated Marching',
    description: 'Sit on chair with good posture. Alternately lift each knee upward in a marching motion. Keep back straight.',
    benefits: 'Activates hip flexors and core without pressure on healing incision.',
    gifUrl: 'https://media.post.rvohealth.io/wp-content/uploads/2023/05/Hip-marching.gif',
    durationSeconds: 90,
    reps: '20 marches each side × 3 sets',
    difficulty: 'gentle',
  },
  // ── Hip Circles ──
  {
    tag: 'hip_circles',
    name: 'Standing Hip Circles',
    description: 'Stand feet hip-width, hands on hips. Make large slow circles with hips — clockwise then anti-clockwise.',
    benefits: 'Restores hip mobility and pelvic floor coordination.',
    gifUrl: 'https://media.post.rvohealth.io/wp-content/uploads/2018/06/Hip-Circles.gif',
    durationSeconds: 60,
    reps: '10 circles each direction × 3 rounds',
    difficulty: 'light',
  },
];

// Build a quick lookup map: tag → exercise object
const EXERCISE_MAP = {};
ALL_EXERCISES.forEach(ex => { EXERCISE_MAP[ex.tag] = ex; });

// List of all tags for the Gemini prompt
const ALL_TAGS = ALL_EXERCISES.map(ex => `${ex.tag} (${ex.difficulty})`).join(', ');

/* ─────────────────────────────────────────────
   GEMINI LLM — parses PDF text and selects
   the 5 best exercises from the catalogue.
───────────────────────────────────────────── */
async function getExercisesFromGemini(reportText) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
You are a certified postpartum physiotherapist AI assistant.

A patient has uploaded a postpartum medical report. Your job is to:
1. Extract the following health parameters from the report text (use defaults if not found):
   - deliveryType: "normal" or "cesarean" (default: "normal")
   - postpartumWeek: "1-2", "3-6", "7-12", or "13+" (default: "1-2")
   - hasBP: true/false (hypertension/elevated blood pressure — default: false)
   - hasDiabetes: true/false (diabetes or GDM — default: false)
   - hasDiastasis: true/false (diastasis recti / abdominal separation — default: false)
   - weight: "normal" or "high" (high if BMI >= 30, weight >= 80 kg, or "obese" mentioned — default: "normal")
   - painLevel: "low", "medium", or "high" (default: "low")

2. Using those parameters, select EXACTLY 5 exercise tags from this approved catalogue that are
   safest and most beneficial for this specific patient profile. Be scientifically sound.
   
   CATALOGUE TAGS: ${ALL_TAGS}
   
   RULES:
   - If painLevel is "high" → choose only "gentle" difficulty exercises.
   - If deliveryType is "cesarean" AND postpartumWeek is "1-2" → choose only "gentle" exercises.
   - If hasBP is true → avoid hard intensity; no inversions.
   - If hasDiastasis is true → avoid full push-ups, crunches, sit-ups. Prefer core-reset exercises.
   - If hasDiabetes or weight is "high" → prefer endurance/cardio and functional exercises.
   - Progress difficulty appropriately by postpartumWeek:
     Week 1-2 → gentle only
     Week 3-6 → gentle to light
     Week 7-12 → light to moderate
     Week 13+ → moderate to hard (if no contraindications)

3. Return ONLY a valid JSON object in this exact format (no extra text, no markdown):
{
  "deliveryType": "normal",
  "postpartumWeek": "7-12",
  "hasBP": false,
  "hasDiabetes": false,
  "hasDiastasis": false,
  "weight": "normal",
  "painLevel": "low",
  "selectedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "reasoning": "Brief clinical justification for these exercise choices."
}

REPORT TEXT:
"""
${reportText.substring(0, 3000)}
"""
`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps in ```json
  const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(jsonText);
}

/* ─────────────────────────────────────────────
   ROUTE: POST /api/exercise/suggest
   Accepts multipart/form-data with a 'report'
   file (.pdf or .txt) and optional userId.
───────────────────────────────────────────── */
router.post('/suggest', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No report file uploaded. Please upload a PDF or TXT file.' });
    }

    // ------- 1. Extract text from uploaded file -------
    let rawText = '';
    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf');

    if (isPdf) {
      const parser = new PDFParse({ data: req.file.buffer });
      const pdfData = await parser.getText();
      rawText = pdfData.text;
      await parser.destroy();
    } else {
      rawText = req.file.buffer.toString('utf-8');
    }

    // ------- 2. Send to Gemini LLM -------
    let geminiResult;
    try {
      geminiResult = await getExercisesFromGemini(rawText || 'No readable text found in report.');
    } catch (llmErr) {
      console.error('Gemini LLM error:', llmErr.message);
      return res.status(502).json({
        error: 'Could not analyse the report with the AI model. Check your GEMINI_API_KEY and try again.',
        details: llmErr.message,
      });
    }

    const { deliveryType, postpartumWeek, hasBP, hasDiabetes, hasDiastasis, weight, painLevel,
      selectedTags, reasoning } = geminiResult;

    // ------- 3. Look up full exercise objects from catalogue -------
    const exercises = (selectedTags || [])
      .slice(0, 5)
      .map(tag => EXERCISE_MAP[tag])
      .filter(Boolean); // drop any tag that doesn't exist in our map

    if (exercises.length === 0) {
      return res.status(500).json({ error: 'AI returned no valid exercise tags. Please try again.' });
    }

    // ------- 4. Save session to MongoDB -------
    const userId = req.body.userId || 'guest';
    const session = new Exercise({
      userId, deliveryType, postpartumWeek,
      hasBP, hasDiabetes, hasDiastasis, weight, painLevel, exercises,
    });
    await session.save();

    // ------- 5. Respond -------
    res.status(200).json({
      success: true,
      extractedParams: { deliveryType, postpartumWeek, hasBP, hasDiabetes, hasDiastasis, weight, painLevel },
      reasoning,
      exercises,
      sessionId: session._id,
    });

  } catch (err) {
    console.error('Exercise suggest error:', err);
    res.status(500).json({ error: 'Failed to process the report. Please try again.' });
  }
});

/* ─────────────────────────────────────────────
   ROUTE: GET /api/exercise/history/:userId
   Returns all past exercise sessions for the user.
───────────────────────────────────────────── */
router.get('/history/:userId', async (req, res) => {
  try {
    const sessions = await Exercise.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.status(200).json({ sessions });
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

module.exports = router;
