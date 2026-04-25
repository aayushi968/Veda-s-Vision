import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';
import { getAssessmentHistory } from '../services/api';

const DOSHA_EMOJI = { vata: '🌬️', pitta: '🔥', kapha: '🌱' };

const DOSHA_DATA = {
  vata: {
    nature: 'Light, dry, cold, mobile, subtle, rough, and quick.',
    strengths: ['Creative and imaginative', 'Fast learner', 'Highly adaptable', 'Enthusiastic and energetic', 'Quick to respond'],
    imbalanceSigns: ['Anxiety and worry', 'Dry skin and hair', 'Irregular digestion and bloating', 'Insomnia or light sleep', 'Restlessness and scattered focus'],
    diseases: [
      'Anxiety disorders and panic attacks',
      'Insomnia and sleep disturbances',
      'Irritable bowel syndrome (IBS) and bloating',
      'Constipation and dry colon',
      'Arthritis and joint pain (dry, cracking joints)',
      'Nervous system disorders and tremors',
      'Chronic fatigue and low stamina',
      'Dry skin conditions and eczema',
      'Lower back pain',
      'Osteoporosis risk with age',
    ],
    dietFavor: [
      'Warm, freshly cooked meals — avoid cold or raw food',
      'Ghee, sesame oil, and healthy fats to lubricate the body',
      'Moong dal, red lentils, and well-cooked legumes',
      'Basmati rice, oats, and wheat (warm preparations)',
      'Root vegetables: sweet potato, carrot, beet, parsnip',
      'Sweet fruits: banana, mango, avocado, stewed apple',
      'Warm spiced milk with cardamom or ashwagandha at night',
      'Ginger, cumin, cinnamon, and fennel as digestive spices',
      'Warm herbal teas: ginger, licorice, chamomile',
      'Soups, stews, and porridges — moist and grounding foods',
    ],
    dietLimit: [
      'Cold, raw salads and uncooked vegetables',
      'Dry foods: crackers, chips, popcorn, dry cereals',
      'Carbonated drinks and cold water',
      'Skipping meals or fasting for long periods',
      'Bitter and astringent foods in excess (raw kale, raw broccoli)',
      'Caffeine and stimulants that increase anxiety',
      'Processed and packaged foods',
      'Excess beans and legumes without proper cooking',
    ],
    routine: [
      '6:00 AM — Wake at the same time daily. Avoid irregular sleep cycles.',
      '6:15 AM — Drink a glass of warm water with a pinch of ginger.',
      '6:30 AM — Abhyanga: self-massage with warm sesame oil for 10 minutes.',
      '7:00 AM — Gentle yoga, pranayama (Nadi Shodhana), or a slow walk.',
      '8:00 AM — Warm, nourishing breakfast. Never skip it.',
      '12:30 PM — Lunch as the main meal. Eat slowly and without distraction.',
      '3:00 PM — Short rest or a warm herbal tea break.',
      '6:30 PM — Light, warm dinner. Avoid eating after 8 PM.',
      '9:00 PM — Wind down: no screens, dim lights, light reading.',
      '10:00 PM — Sleep. Consistent bedtime is essential for Vata.',
    ],
    exercise: [
      'Gentle Hatha yoga and restorative yoga',
      'Slow morning walks in nature (20–30 min)',
      'Tai chi and Qigong for grounding',
      'Light swimming in warm water',
      'Pranayama: Nadi Shodhana and Bhramari breathing',
      'Avoid intense cardio, high-impact sports, and overexertion',
      'Exercise at a moderate, consistent pace — not in bursts',
    ],
    precautions: [
      'Maintain a strict daily routine — irregular schedules aggravate Vata severely.',
      'Stay warm at all times; cold weather and wind worsen Vata imbalance.',
      'Never skip meals; low blood sugar destabilizes Vata quickly.',
      'Limit travel and overstimulation — too much movement depletes Vata.',
      'Protect joints with oil massage and avoid excessive physical strain.',
      'Manage stress actively; Vata types are prone to anxiety spirals.',
      'Avoid excessive talking, multitasking, and screen time before bed.',
      'Stay hydrated with warm fluids throughout the day.',
    ],
    herbs: ['Ashwagandha', 'Shatavari', 'Triphala', 'Brahmi', 'Bala', 'Licorice root'],
    tip: 'Warmth, oil, routine, and stillness are the pillars of Vata balance.',
    summary: 'Vata is governed by air and space. You are naturally creative, quick-thinking, and adaptable — but when out of balance, anxiety, dryness, irregular digestion, and restlessness arise. Grounding, warmth, and routine are your medicine.',
  },
  pitta: {
    nature: 'Hot, sharp, light, oily, liquid, spreading, and intense.',
    strengths: ['Sharp intellect and focus', 'Strong digestion and metabolism', 'Natural leadership', 'Goal-oriented and decisive', 'Courageous and confident'],
    imbalanceSigns: ['Anger, irritability, and impatience', 'Acid reflux and heartburn', 'Skin rashes, acne, and inflammation', 'Excessive body heat and sweating', 'Perfectionism and burnout'],
    diseases: [
      'Acid reflux, GERD, and peptic ulcers',
      'Inflammatory skin conditions: acne, rosacea, psoriasis',
      'Hypertension and cardiovascular inflammation',
      'Liver and gallbladder disorders',
      'Migraines and tension headaches',
      'Inflammatory bowel disease (Crohn\'s, colitis)',
      'Eye inflammation and sensitivity to light',
      'Autoimmune conditions driven by excess inflammation',
      'Burnout and adrenal fatigue',
      'Fever-prone and infection-prone due to excess heat',
    ],
    dietFavor: [
      'Cooling vegetables: cucumber, zucchini, asparagus, leafy greens',
      'Sweet fruits: pomegranate, pear, melon, coconut, sweet grapes',
      'Basmati rice, oats, barley, and wheat',
      'Moong dal, chickpeas, and well-cooked legumes',
      'Coconut water, fresh lime water, and cooling herbal teas',
      'Coriander, fennel, cardamom, and mint as cooling spices',
      'Ghee in moderation — cooling and anti-inflammatory',
      'Dairy: milk, butter, and fresh yogurt (not sour)',
      'Aloe vera juice for internal cooling',
      'Rose water and hibiscus tea',
    ],
    dietLimit: [
      'Very spicy food: chilli, hot peppers, mustard in excess',
      'Sour and fermented foods: vinegar, sour cream, aged cheese',
      'Deep-fried and oily foods',
      'Red meat and heavy proteins',
      'Alcohol and excess coffee or black tea',
      'Salt in excess',
      'Tomatoes, onions, and garlic in large quantities',
      'Skipping meals — Pitta hunger is intense and must be respected',
    ],
    routine: [
      '6:00 AM — Wake before sunrise. Splash cool water on face and eyes.',
      '6:15 AM — Drink a glass of cool (not cold) water or coconut water.',
      '6:30 AM — Moderate yoga, moon salutations, or a calm morning walk.',
      '7:30 AM — Light, cooling breakfast. Avoid heavy or spicy morning food.',
      '12:00 PM — Lunch is the most important meal. Eat the largest meal now.',
      '2:00 PM — Short rest or a cooling herbal tea (mint, fennel, coriander).',
      '5:00 PM — Light physical activity or a walk in cool air.',
      '7:00 PM — Light dinner. Avoid heavy, spicy, or late meals.',
      '9:30 PM — Wind down with cooling activities: reading, light music.',
      '10:30 PM — Sleep. Pitta types must protect sleep to prevent burnout.',
    ],
    exercise: [
      'Moderate walking and hiking in cool environments',
      'Swimming — the best exercise for Pitta (cooling and non-competitive)',
      'Evening yoga and moon salutations',
      'Cycling at a moderate pace',
      'Non-competitive team sports for fun',
      'Avoid intense midday exercise in heat',
      'Avoid competitive sports that trigger aggression',
      'Cooling pranayama: Sheetali and Sheetkari breathing',
    ],
    precautions: [
      'Avoid overheating: stay out of direct sun during peak hours.',
      'Do not skip meals — Pitta hunger turns to irritability and acidity quickly.',
      'Manage anger and frustration actively; unprocessed emotions inflame Pitta.',
      'Avoid overworking and perfectionism — schedule rest as seriously as work.',
      'Limit alcohol and spicy food, especially in summer.',
      'Protect the liver: avoid excess medication, alcohol, and processed food.',
      'Take cooling breaks during intense mental work.',
      'Avoid arguments and high-stress environments when possible.',
    ],
    herbs: ['Shatavari', 'Brahmi', 'Amalaki (Amla)', 'Neem', 'Guduchi', 'Manjistha', 'Licorice'],
    tip: 'Cooling food, a calmer pace, and protecting sleep keep Pitta in balance.',
    summary: 'Pitta is governed by fire and water. You are sharp, focused, driven, and naturally strong in digestion and leadership. When out of balance, excess heat manifests as inflammation, irritability, skin issues, and burnout. Cooling and moderation are your medicine.',
  },
  kapha: {
    nature: 'Heavy, slow, cool, oily, smooth, dense, soft, and stable.',
    strengths: ['Calm and stable under pressure', 'Strong physical endurance', 'Loyal and compassionate', 'Excellent long-term memory', 'Steady and reliable'],
    imbalanceSigns: ['Weight gain and water retention', 'Sluggish digestion and slow metabolism', 'Congestion, mucus, and respiratory issues', 'Lethargy and oversleeping', 'Emotional attachment and depression'],
    diseases: [
      'Obesity and metabolic syndrome',
      'Type 2 diabetes and insulin resistance',
      'Hypothyroidism and slow metabolism',
      'Chronic respiratory conditions: asthma, bronchitis, sinusitis',
      'High cholesterol and cardiovascular disease',
      'Depression and emotional stagnation',
      'Oedema and water retention',
      'Polycystic ovary syndrome (PCOS)',
      'Chronic fatigue and low motivation',
      'Allergies and excess mucus production',
    ],
    dietFavor: [
      'Light, warm, and dry foods — avoid heavy and oily meals',
      'Spices: ginger, black pepper, turmeric, mustard, cayenne',
      'Lentils, mung beans, chickpeas, and legumes',
      'Barley, millet, corn, and rye (lighter grains)',
      'Vegetables: leafy greens, broccoli, cauliflower, cabbage, radish',
      'Astringent fruits: apple, pear, pomegranate, cranberry',
      'Honey (raw, not heated) as a sweetener',
      'Warm herbal teas: ginger, cinnamon, tulsi, black pepper',
      'Smaller, regular meals — avoid large portions',
      'Dry cooking methods: baking, grilling, roasting',
    ],
    dietLimit: [
      'Heavy, oily, and fried foods',
      'Dairy in excess: cheese, ice cream, yogurt, butter',
      'Sweets and refined sugar',
      'Cold and refrigerated foods and drinks',
      'Wheat and heavy grains in excess',
      'Red meat and fatty proteins',
      'Late-night eating and large dinners',
      'Excess salt which causes water retention',
    ],
    routine: [
      '5:30 AM — Wake early before sunrise. Kapha accumulates with oversleeping.',
      '5:45 AM — Dry brush the body (garshana) to stimulate circulation.',
      '6:00 AM — Drink warm water with ginger and lemon to ignite digestion.',
      '6:15 AM — Vigorous exercise: brisk walk, cardio, or dynamic yoga.',
      '7:30 AM — Light, warm breakfast. Avoid heavy or sweet morning food.',
      '12:30 PM — Moderate lunch. Avoid overeating.',
      '3:00 PM — Active break: walk, stretch, or do light movement.',
      '6:30 PM — Light, early dinner. Finish eating by 7 PM.',
      '8:00 PM — Stimulating evening activity: reading, learning, socialising.',
      '10:00 PM — Sleep. Avoid sleeping more than 7–8 hours.',
    ],
    exercise: [
      'Brisk walking and jogging (30–45 min daily)',
      'Cardio: cycling, aerobics, dancing',
      'Dynamic and vigorous yoga: Sun Salutations, Power yoga',
      'Strength training and resistance exercise',
      'Swimming (vigorous, not leisurely)',
      'Kapha needs daily vigorous exercise — this is non-negotiable',
      'Avoid long rest periods between sets',
      'Stimulating pranayama: Kapalabhati and Bhastrika breathing',
    ],
    precautions: [
      'Never oversleep — more than 8 hours increases Kapha heaviness.',
      'Avoid sedentary lifestyle; Kapha must move every day.',
      'Do not overeat, especially heavy, sweet, or oily foods.',
      'Avoid cold and damp environments which worsen Kapha.',
      'Watch for emotional eating and attachment patterns.',
      'Stimulate the mind with new learning and social activity.',
      'Monitor weight and blood sugar regularly.',
      'Avoid daytime napping which increases sluggishness.',
    ],
    herbs: ['Trikatu (ginger, black pepper, long pepper)', 'Guggulu', 'Triphala', 'Tulsi', 'Punarnava', 'Chitrak'],
    tip: 'Lightness, stimulation, warmth, and daily vigorous movement keep Kapha balanced.',
    summary: 'Kapha is governed by earth and water. You are naturally stable, loyal, calm, and enduring. When out of balance, heaviness, sluggishness, weight gain, congestion, and emotional attachment arise. Movement, stimulation, and lightness are your medicine.',
  },
};

const ANSWER_INSIGHTS = {
  'Body type?': {
    vata: { insight: 'A thin frame means your body burns energy quickly and struggles to retain warmth and weight. Your joints and bones need extra nourishment.', tip: 'Eat calorie-dense, oily foods like ghee and avocado daily. Do oil massage (abhyanga) 3x a week to nourish tissues.' },
    pitta: { insight: 'A medium, muscular build shows strong metabolism and good tissue formation. You build and lose weight relatively easily.', tip: 'Maintain weight with cooling, moderate-protein meals. Avoid crash diets — your metabolism is sensitive to extremes.' },
    kapha: { insight: 'A heavier frame means your body holds onto weight, water, and energy reserves. Sluggish metabolism is a key risk.', tip: 'Prioritise daily vigorous exercise and light meals. Avoid heavy dinners and daytime napping.' },
  },
  'Skin type?': {
    vata: { insight: 'Dry skin signals low moisture and oil in your body. This can lead to premature ageing, cracking, and sensitivity to cold.', tip: 'Apply warm sesame oil to skin before bathing daily. Drink warm water with a pinch of ghee in the morning.' },
    pitta: { insight: 'Sensitive skin means your body runs hot and reacts easily to heat, spice, and stress with rashes or redness.', tip: 'Use cooling aloe vera gel on skin. Avoid spicy food and direct sun between 11am–3pm.' },
    kapha: { insight: 'Oily skin reflects excess earth and water in your constitution. Prone to clogged pores, dullness, and congestion.', tip: 'Use dry brushing before shower. Wash face with warm water and mild herbal cleanser. Avoid heavy creams.' },
  },
  'Hair texture?': {
    vata: { insight: 'Fine, dry hair shows Vata dryness reaching the scalp. Prone to split ends, breakage, and hair fall.', tip: 'Oil your scalp with warm sesame or coconut oil twice a week. Avoid heat styling and harsh shampoos.' },
    pitta: { insight: 'Straight, moderate hair with a tendency toward early greying or thinning due to excess heat in the scalp.', tip: 'Use cooling oils like coconut or brahmi oil. Avoid hot showers on the scalp and reduce stress.' },
    kapha: { insight: 'Thick, heavy hair is a Kapha strength — but excess oil and scalp congestion can cause dandruff and buildup.', tip: 'Wash hair regularly with a light herbal shampoo. Use dry shampoo between washes if needed.' },
  },
  'Appetite?': {
    vata: { insight: 'Irregular appetite means your digestive fire is variable — sometimes strong, sometimes absent. This leads to bloating and gas.', tip: 'Eat at fixed times every day even if not very hungry. Ginger tea before meals helps kindle digestion.' },
    pitta: { insight: 'Strong, intense appetite means your digestive fire is powerful. Skipping meals causes acidity, irritability, and headaches.', tip: 'Never skip meals. Keep healthy snacks available. Eat lunch as your largest meal when digestion peaks.' },
    kapha: { insight: 'Slow appetite means your digestion is sluggish. You may not feel hungry but still gain weight from small amounts.', tip: 'Eat only when genuinely hungry. Start meals with ginger and lemon to stimulate digestion.' },
  },
  'Digestion?': {
    vata: { insight: 'Variable digestion means you experience bloating, gas, and constipation alternating with normal days. Air in the gut is the cause.', tip: 'Eat warm, cooked, easy-to-digest foods. Avoid raw salads, beans without spices, and cold drinks with meals.' },
    pitta: { insight: 'Hot, sharp digestion means you digest quickly but are prone to acid reflux, heartburn, and loose stools under stress.', tip: 'Avoid spicy, sour, and fried food. Eat cooling foods like cucumber and coconut. Do not eat when angry.' },
    kapha: { insight: 'Slow, steady digestion means food sits in your gut longer. You feel heavy after meals and are prone to weight gain.', tip: 'Eat smaller portions. Add digestive spices like ginger, black pepper, and cumin to every meal.' },
  },
  'Sleep type?': {
    vata: { insight: 'Light sleep means your nervous system stays alert even at rest. You wake easily, have vivid dreams, and feel unrefreshed.', tip: 'Follow a strict 10pm bedtime. Drink warm milk with nutmeg before bed. Avoid screens after 9pm.' },
    pitta: { insight: 'Moderate sleep with a tendency to wake between 1–3am due to heat or mental activity. Dreams are often intense.', tip: 'Sleep before 10:30pm. Keep the bedroom cool. Avoid working or problem-solving in the hour before bed.' },
    kapha: { insight: 'Deep, heavy sleep is a Kapha trait. You sleep long but wake feeling groggy and slow to start the day.', tip: 'Set a firm wake time of 5:30–6am. Do not snooze. Morning exercise immediately after waking clears Kapha heaviness.' },
  },
  'Energy pattern?': {
    vata: { insight: 'Bursty energy means you have intense periods of activity followed by crashes. Inconsistent output leads to exhaustion.', tip: 'Pace yourself throughout the day. Take short breaks every 90 minutes. Avoid overcommitting in high-energy phases.' },
    pitta: { insight: 'Focused, sustained energy with a tendency to push too hard and ignore fatigue signals until burnout hits.', tip: 'Schedule mandatory rest breaks. Stop work by 9pm. Protect weekends from work to prevent adrenal fatigue.' },
    kapha: { insight: 'Steady but slow energy — you take time to warm up but can sustain effort for long periods once going.', tip: 'Start your day with vigorous movement to ignite energy. Avoid sitting for more than 45 minutes at a stretch.' },
  },
  'Mood swings?': {
    vata: { insight: 'Anxiety and worry are your stress response. Your nervous system is sensitive and easily overwhelmed by change or uncertainty.', tip: 'Practice Nadi Shodhana (alternate nostril breathing) for 5 minutes daily. Reduce news and social media consumption.' },
    pitta: { insight: 'Irritability under stress shows excess fire in the mind. Anger, criticism, and impatience are your warning signs.', tip: 'Take a 10-minute walk when frustrated. Practice cooling breath (Sheetali). Avoid caffeine when stressed.' },
    kapha: { insight: 'Withdrawal and emotional heaviness under stress. You tend to hold onto feelings and avoid confrontation.', tip: 'Talk to someone you trust when feeling low. Physical movement is the fastest mood lifter for Kapha types.' },
  },
  'Natural body temperature?': {
    vata: { insight: 'Feeling cold most of the time means your circulation is poor and your body lacks the fire to generate warmth.', tip: 'Wear layers, especially around the abdomen and lower back. Drink warm fluids all day. Avoid air conditioning.' },
    pitta: { insight: 'Running warm means your metabolic fire is high. You overheat easily and are sensitive to hot weather and spicy food.', tip: 'Stay in cool environments during summer. Drink coconut water daily. Avoid hot yoga and midday sun.' },
    kapha: { insight: 'Cool body temperature with low metabolic heat. You feel comfortable in warmth but sluggish in cold, damp weather.', tip: 'Exercise vigorously to generate internal heat. Eat warming spices. Avoid cold drinks and refrigerated food.' },
  },
  'Memory style?': {
    vata: { insight: 'Quick to learn but quick to forget — your mind grasps things fast but needs repetition and calm to retain them.', tip: 'Review important information before sleep. Use written notes and reminders. Meditation improves Vata memory retention.' },
    pitta: { insight: 'Sharp, detailed memory with strong recall. You remember facts well but can become rigid or critical when wrong.', tip: 'Practice letting go of minor errors. Journaling helps process and organise the sharp Pitta mind constructively.' },
    kapha: { insight: 'Slow to learn but excellent long-term retention. Once something is in your memory, it stays permanently.', tip: 'Give yourself extra time to learn new things without pressure. Teach others what you know — it reinforces memory.' },
  },
  'Speech speed?': {
    vata: { insight: 'Fast speech reflects a quick, scattered mind. You may talk over others, lose your train of thought, or speak before thinking.', tip: 'Pause before responding. Practice speaking slowly and deliberately. This also calms the nervous system.' },
    pitta: { insight: 'Direct, precise speech shows a sharp, goal-oriented mind. Can come across as blunt or critical to others.', tip: 'Soften your delivery with warmth. Ask questions before giving opinions. Avoid debating when emotionally heated.' },
    kapha: { insight: 'Slow, measured speech reflects a calm, thoughtful mind. You choose words carefully but may be slow to express needs.', tip: 'Speak up earlier in conversations. Practice assertiveness — your calm voice is a strength, use it confidently.' },
  },
  'Stress response?': {
    vata: { insight: 'Worry and overthinking are your stress pattern. Your mind loops on problems and struggles to find stillness.', tip: 'Ground yourself with physical touch — hold a warm cup, walk barefoot on grass. Routine is your best stress medicine.' },
    pitta: { insight: 'Anger and frustration are your stress outlet. You push harder under pressure until the body or mind breaks down.', tip: 'Identify your anger triggers early. Cold water on the face, a walk, or 5 deep breaths interrupt the Pitta stress cycle.' },
    kapha: { insight: 'Withdrawal and emotional eating are your stress patterns. You retreat inward and may use food or sleep as comfort.', tip: 'Create a social support plan for stressful times. Call a friend, go for a walk, or do 10 minutes of dance.' },
  },
  'Physical stamina?': {
    vata: { insight: 'Variable stamina means you tire quickly and need more recovery time than others. Overexertion leads to long fatigue.', tip: 'Exercise for 20–30 minutes at moderate intensity. Rest fully between sessions. Prioritise sleep for recovery.' },
    pitta: { insight: 'High stamina with a tendency to ignore fatigue and push through. Risk of inflammation and injury from overtraining.', tip: 'Include 2 rest days per week. Stretch and cool down after every session. Listen to pain signals — do not override them.' },
    kapha: { insight: 'Enduring stamina once warmed up — you can sustain effort for long periods but are slow to start and motivate.', tip: 'Commit to a fixed daily exercise time. Having a workout partner helps Kapha types stay accountable and motivated.' },
  },
  'Thirst levels?': {
    vata: { insight: 'Low thirst means you often forget to drink water, leading to dehydration, dry skin, constipation, and brain fog.', tip: 'Set hourly reminders to drink warm water. Keep a thermos of herbal tea at your desk. Aim for 6–8 cups daily.' },
    pitta: { insight: 'High thirst reflects your body burning hot and needing constant cooling. You dehydrate faster than other types.', tip: 'Drink coconut water, cucumber water, or rose water through the day. Avoid caffeinated drinks which increase heat.' },
    kapha: { insight: 'Moderate thirst with a tendency to retain water rather than flush it. Excess fluid intake can increase heaviness.', tip: 'Drink warm water with ginger or lemon. Avoid cold drinks. Do not drink large amounts with meals.' },
  },
  'Preferred climate?': {
    vata: { insight: 'Preference for warm, dry climates shows your body craves the opposite of its cold, dry nature to feel balanced.', tip: 'In cold or windy weather, cover your ears and neck. Use a humidifier indoors. Avoid excessive air conditioning.' },
    pitta: { insight: 'Preference for cool, moderate climates shows your body seeking relief from its internal heat.', tip: 'Spend time near water — rivers, lakes, or the sea. Avoid hot, humid environments. Keep your home well-ventilated.' },
    kapha: { insight: 'Preference for warm, damp climates reflects Kapha comfort — but this environment also increases Kapha imbalance.', tip: 'Seek dry, warm climates. Avoid damp basements or cold, wet weather. Morning sun exposure helps stimulate Kapha energy.' },
  },
  'Skin quality?': {
    vata: { insight: 'Thin, rough skin shows low collagen, poor circulation, and dryness reaching the tissue level.', tip: 'Massage warm sesame oil into skin before bathing. Eat healthy fats daily. Stay hydrated with warm fluids.' },
    pitta: { insight: 'Soft, warm skin with a tendency toward redness, sensitivity, and breakouts when internal heat rises.', tip: 'Use cooling rose water toner. Avoid harsh exfoliants. Eat anti-inflammatory foods like turmeric and leafy greens.' },
    kapha: { insight: 'Thick, oily skin is resilient but prone to congestion, enlarged pores, and dullness without regular cleansing.', tip: 'Exfoliate twice a week with a dry brush or gentle scrub. Use light, non-comedogenic moisturisers only.' },
  },
  'Breathing pattern?': {
    vata: { insight: 'Shallow breathing means your body is in a low-grade stress state. Less oxygen reaches tissues, increasing anxiety.', tip: 'Practice diaphragmatic breathing for 5 minutes daily. Inhale for 4 counts, hold for 4, exhale for 6.' },
    pitta: { insight: 'Rapid breathing under stress or exertion shows the Pitta tendency to accelerate everything, including the breath.', tip: 'Practice Sheetali (cooling breath) — inhale through a rolled tongue, exhale through the nose. Do 10 rounds daily.' },
    kapha: { insight: 'Slow, deep breathing is a Kapha strength but can become laboured with congestion or excess mucus.', tip: 'Practice Kapalabhati (skull-shining breath) — 30 rapid exhales each morning to clear airways and energise the mind.' },
  },
  'Daily routine preference?': {
    vata: { insight: 'Preference for flexibility reflects Vata nature — but too much flexibility leads to chaos, missed meals, and poor sleep.', tip: 'Build a non-negotiable skeleton routine: fixed wake time, meal times, and sleep time. Keep everything else flexible.' },
    pitta: { insight: 'Preference for structure shows Pitta discipline — but rigid schedules can become a source of stress when disrupted.', tip: 'Build buffer time into your schedule. Practice adapting when plans change — flexibility is a Pitta growth area.' },
    kapha: { insight: 'Preference for steady, unchanging routine reflects Kapha comfort with the familiar — but stagnation is the risk.', tip: 'Introduce one new activity or experience each week. Novelty and variety are medicine for the Kapha mind.' },
  },
};

function buildReportPatch(dominantDosha, scores, answers) {
  const d = DOSHA_DATA[dominantDosha] || DOSHA_DATA.vata;
  const total = (scores.vata || 0) + (scores.pitta || 0) + (scores.kapha || 0) || 1;
  const fmt = (v) => `${Math.round(((scores[v] || 0) / total) * 100)}%`;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const secKey = sorted[1]?.[0];
  const sec = secKey ? DOSHA_DATA[secKey] : null;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    nature: d.nature,
    summary: `Your answers point most strongly to ${cap(dominantDosha)} (${fmt(dominantDosha)}). ${d.summary}${sec ? ` You also carry a notable ${cap(secKey)} influence (${fmt(secKey)}), which shapes your secondary traits.` : ''}`,
    strengths: d.strengths,
    imbalanceSigns: d.imbalanceSigns,
    diseases: d.diseases,
    focusAreas: d.focusAreas || [],
    diet: { favor: d.dietFavor, limit: d.dietLimit, notes: d.tip },
    routine: d.routine,
    exercise: d.exercise,
    precautions: d.precautions,
    herbs: d.herbs,
    profileBreakdown: { vata: fmt('vata'), pitta: fmt('pitta'), kapha: fmt('kapha') },
    secondaryDosha: secKey || null,
    secondaryInfluence: sec ? {
      dosha: cap(secKey), key: secKey, percent: fmt(secKey), tip: sec.tip,
      dietFavor: sec.dietFavor.slice(0, 3), dietLimit: sec.dietLimit.slice(0, 3),
    } : null,
    answerInsights: answers.map((item) => {
      const lookup = ANSWER_INSIGHTS[item.question]?.[item.value];
      const src = DOSHA_DATA[item.value] || DOSHA_DATA.vata;
      const label = item.label || item.value;
      return {
        question: item.question,
        answer: label,
        insight: lookup?.insight || `Your answer reflects a ${cap(item.value)} tendency in this area.`,
        tip: lookup?.tip || src.tip,
      };
    }),
  };
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-neem/20 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-herbal/10 pb-3">
      <span className="text-lg">{icon}</span>
      <h3 className="font-semibold text-herbal">{title}</h3>
    </div>
  );
}

function ScoreBar({ label, emoji, pct, score, total, active }) {
  return (
    <div className={`rounded-xl p-3 ${active ? 'bg-herbal/8 ring-1 ring-herbal/30' : 'bg-ivory'}`}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-semibold text-charcoal">{emoji} {label}</span>
        <span className="text-xs font-bold text-herbal">{score}/{total} &nbsp;<span className="text-slate-400 font-normal">({pct})</span></span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-herbal/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-herbal to-neem transition-all duration-700"
          style={{ width: pct }}
        />
      </div>
      {active && <p className="mt-1.5 text-xs font-medium text-herbal">★ Dominant dosha</p>}
    </div>
  );
}

// Highlights key parts of a list item string:
// - "TIME — rest" splits time as bold herbal badge
// - "Key: examples" splits label as bold, examples as italic turmeric
// - Avoid/Never/Do not → bold red warning prefix
// - Parenthetical (text) → italic slate
function RichItem({ text }) {
  // Time-prefixed routine items: "6:00 AM — Do something"
  const timeMatch = text.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))\s*—\s*(.+)$/);
  if (timeMatch) {
    return (
      <span>
        <span className="mr-2 inline-block rounded-md bg-herbal/15 px-2 py-0.5 text-xs font-bold text-herbal">{timeMatch[1]}</span>
        <RichSentence text={timeMatch[2]} />
      </span>
    );
  }
  // "Label: detail" pattern
  const colonMatch = text.match(/^([^:]{3,35}):\s*(.+)$/);
  if (colonMatch) {
    return (
      <span>
        <span className="font-semibold text-charcoal">{colonMatch[1]}: </span>
        <span className="italic text-turmeric">{colonMatch[2]}</span>
      </span>
    );
  }
  // "Main — note" pattern
  const dashMatch = text.match(/^(.+?)\s*—\s*(.+)$/);
  if (dashMatch) {
    return (
      <span>
        <span className="font-semibold text-charcoal">{dashMatch[1]}</span>
        <span className="text-slate-500"> — </span>
        <span className="italic text-slate-600">{dashMatch[2]}</span>
      </span>
    );
  }
  return <RichSentence text={text} />;
}

// Inline sentence highlighter: bold red for warnings, italic for parentheticals
function RichSentence({ text }) {
  const warningMatch = text.match(/^((?:Avoid|Never|Do not|Do not)[^.;,]*[.;,]?)\s*(.*)$/i);
  if (warningMatch) {
    return (
      <span>
        <span className="font-bold text-red-500">{warningMatch[1]}</span>
        {warningMatch[2] ? <span className="text-slate-600"> {warningMatch[2]}</span> : null}
      </span>
    );
  }
  // Replace (parenthetical) with italic slate
  const parts = text.split(/\(([^)]+)\)/);
  if (parts.length > 1) {
    return (
      <span>
        {parts.map((part, i) =>
          i % 2 === 0
            ? <span key={i}>{part}</span>
            : <span key={i} className="italic text-slate-500">({part})</span>
        )}
      </span>
    );
  }
  return <span>{text}</span>;
}

function ListItems({ items, bullet = '●', bulletClass = 'text-herbal' }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
          <span className={`mt-1 shrink-0 text-xs ${bulletClass}`}>{bullet}</span>
          <RichItem text={item} />
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-herbal/15 text-xs font-bold text-herbal">{i + 1}</span>
          <RichItem text={item} />
        </li>
      ))}
    </ol>
  );
}

function Dashboard() {
  const { user, loading, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [latestAssessment, setLatestAssessment] = useState(location.state || null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state) { setLatestAssessment(location.state); return; }
    if (!loading && user && !latestAssessment) {
      setFetching(true);
      getAssessmentHistory(user.uid)
        .then((res) => setLatestAssessment(res.history?.[0] || null))
        .catch((err) => setError(err?.response?.data?.error || 'Unable to load the latest report.'))
        .finally(() => setFetching(false));
    }
  }, [location.state, loading, user, latestAssessment]);

  const assessment = useMemo(() => {
    if (!latestAssessment) return null;
    const report = latestAssessment.report || {};
    const dominantDosha = (latestAssessment.dominantDosha || report.dominantDosha || 'vata').toLowerCase();
    // If report is missing new fields (old cached state), patch them from DOSHA_DATA
    const fullReport = report.diseases?.length ? report : { ...report, ...buildReportPatch(dominantDosha, latestAssessment.scores || {}, latestAssessment.answers || []) };
    return {
      dominantDosha,
      scores: latestAssessment.scores || {},
      answers: latestAssessment.answers || [],
      report: fullReport,
      createdAt: latestAssessment.createdAt,
    };
  }, [latestAssessment]);

  if (loading || fetching) return <div className="p-10 text-center text-charcoal/70">Loading your report...</div>;

  if (!user) return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">

      {/* ── Preview hero ── */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-marigold/40 bg-gradient-to-br from-herbal via-neem to-sage p-7 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-marigold/20 blur-3xl" />
        <div className="absolute -bottom-12 left-16 h-48 w-48 rounded-full bg-turmeric/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-marigold">Your Prakriti Report — Preview</p>
            <h1 className="mt-2 text-4xl font-bold">🌬️ Vata · 🔥 Pitta · 🌱 Kapha</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-ivory/85">
              After completing the 18-question Prakriti assessment, your personalised report will appear here — with your dominant dosha, scores, diet plan, daily routine, exercise guide, health risks, and more.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 lg:items-end">
            <button onClick={() => navigate('/?auth=signup&modal=1')} className="rounded-2xl bg-turmeric/90 px-5 py-2.5 text-sm font-bold text-charcoal transition hover:bg-turmeric">
              Sign up &amp; Take Assessment
            </button>
            <button onClick={() => navigate('/?auth=signin&modal=1')} className="rounded-2xl border border-white/40 bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/25">
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>

      {/* ── Blurred preview banner ── */}
      <div className="mb-6 rounded-2xl border border-herbal/20 bg-herbal/5 px-5 py-4 text-center">
        <p className="text-sm font-semibold text-herbal">🔒 Sign in to unlock your full personalised report</p>
        <p className="mt-1 text-xs text-slate-500">The sections below show you exactly what your report will contain after you complete the assessment.</p>
      </div>

      {/* ── Dosha score preview ── */}
      <Card className="mb-6">
        <SectionTitle icon="📊" title="Your Dosha Breakdown" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[{key:'vata',emoji:'🌬️',label:'Vata'},{key:'pitta',emoji:'🔥',label:'Pitta'},{key:'kapha',emoji:'🌱',label:'Kapha'}].map(({key,emoji,label}) => (
            <div key={key} className="rounded-xl bg-ivory p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-semibold text-charcoal">{emoji} {label}</span>
                <span className="text-xs font-bold text-slate-400">— / 18</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-herbal/10">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-herbal to-neem" />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400 italic">Your scores across all 18 questions will be shown here after assessment.</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">

          {/* Strengths preview */}
          <Card>
            <SectionTitle icon="💪" title="Your Natural Strengths" />
            <div className="flex flex-wrap gap-2">
              {['Creative thinking','Fast learner','Adaptability','Leadership','Calm under pressure'].map(s => (
                <span key={s} className="rounded-full border border-herbal/20 bg-herbal/5 px-3 py-1.5 text-sm text-slate-400">{s}</span>
              ))}
            </div>
            <p className="mt-3 text-xs italic text-slate-400">Your actual strengths based on your dominant dosha will appear here.</p>
          </Card>

          {/* Imbalance signs preview */}
          <Card>
            <SectionTitle icon="⚡" title="Signs of Imbalance to Watch" />
            <ul className="space-y-2">
              {['Anxiety and restlessness','Digestive issues','Skin sensitivity','Sleep disturbances','Low energy or fatigue'].map((s,i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-xs text-slate-300">▸</span>{s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs italic text-slate-400">Personalised imbalance signals for your Prakriti will be listed here.</p>
          </Card>

          {/* Diseases preview */}
          <Card>
            <SectionTitle icon="🏥" title="Health Conditions You Are Prone To" />
            <ul className="space-y-2">
              {['Digestive disorders','Inflammatory conditions','Respiratory issues','Joint and bone health','Metabolic conditions'].map((s,i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-xs text-slate-300">▸</span>{s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs italic text-slate-400">10 specific health risks based on your dominant dosha will be shown here.</p>
          </Card>

          {/* Precautions preview */}
          <Card>
            <SectionTitle icon="🛡️" title="Precautions & Lifestyle Warnings" />
            <ul className="space-y-2">
              {['Maintain a consistent daily routine','Avoid skipping meals','Manage stress proactively','Stay hydrated throughout the day','Protect sleep quality'].map((s,i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-xs text-slate-300">●</span>{s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs italic text-slate-400">Specific lifestyle warnings for your constitution will appear here.</p>
          </Card>

          {/* Herbs preview */}
          <Card>
            <SectionTitle icon="🌿" title="Beneficial Herbs & Supplements" />
            <div className="flex flex-wrap gap-2">
              {['Ashwagandha','Triphala','Brahmi','Shatavari','Tulsi','Guggulu'].map(h => (
                <span key={h} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400">{h}</span>
              ))}
            </div>
            <p className="mt-3 text-xs italic text-slate-400">Herbs matched to your specific dosha will be recommended here.</p>
          </Card>

          {/* Answer insights preview */}
          <Card>
            <SectionTitle icon="🔍" title="What Your Answers Reveal" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[['Body type?','Your answer'],['Skin type?','Your answer'],['Sleep type?','Your answer'],['Digestion?','Your answer']].map(([q,a],i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{q}</p>
                  <p className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-sm text-slate-400">{a}</p>
                  <p className="mt-2 text-xs text-slate-300">Insight about what this reveals about your constitution...</p>
                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <p className="text-xs text-slate-300 italic">💡 How to stay healthy tip will appear here.</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs italic text-slate-400">All 18 answers with personalised insights and health tips will be shown here.</p>
          </Card>
        </div>

        <div className="space-y-5">

          {/* Diet preview */}
          <Card>
            <SectionTitle icon="🥗" title="Foods to Favor" />
            <ul className="space-y-2">
              {['Warm, freshly cooked meals','Healthy fats and oils','Well-cooked legumes','Root vegetables','Herbal teas and warm drinks'].map((s,i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-xs text-slate-300">✓</span>{s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs italic text-slate-400">10 specific foods tailored to your dosha will be listed here.</p>
          </Card>

          <Card>
            <SectionTitle icon="🚫" title="Foods to Avoid" />
            <ul className="space-y-2">
              {['Cold and raw foods','Processed snacks','Excess caffeine','Heavy fried foods','Late-night eating'].map((s,i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-xs text-slate-300">✗</span>{s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs italic text-slate-400">Foods that aggravate your specific dosha will be listed here.</p>
          </Card>

          {/* Routine preview */}
          <Card>
            <SectionTitle icon="🌅" title="Recommended Daily Routine" />
            <ol className="space-y-3">
              {['Wake up at a consistent time','Morning warm water ritual','Yoga or light movement','Nourishing breakfast','Lunch as the main meal','Evening wind-down routine'].map((s,i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">{i+1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs italic text-slate-400">A full timestamped daily routine from 5:30 AM to 10 PM will be generated for you.</p>
          </Card>

          {/* Exercise preview */}
          <Card>
            <SectionTitle icon="🏃" title="Exercise & Movement Plan" />
            <ul className="space-y-2">
              {['Yoga suited to your dosha','Walking recommendations','Breathing exercises','Cardio or strength guidance','Rest and recovery advice'].map((s,i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-xs text-slate-300">●</span>{s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs italic text-slate-400">A personalised movement plan based on your Prakriti will appear here.</p>
          </Card>

          {/* CTA */}
          <div className="rounded-2xl border border-herbal/30 bg-gradient-to-br from-herbal/5 to-turmeric/5 p-6 text-center">
            <p className="text-lg font-bold text-herbal">Ready to see your real report?</p>
            <p className="mt-2 text-sm text-slate-600">Complete the 18-question Prakriti assessment to unlock everything above — personalised just for you.</p>
            <button
              onClick={() => navigate('/?auth=signup&modal=1')}
              className="mt-4 rounded-2xl bg-gradient-to-r from-herbal to-neem px-6 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105"
            >
              🌿 Sign up &amp; Start Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!assessment) return (
    <div className="p-10 text-center">
      <p className="text-slate-600">No report found yet. Take the Prakriti assessment first.</p>
      <button onClick={() => navigate('/chat')} className="mt-4 rounded-2xl bg-herbal px-5 py-3 text-sm text-white">Take assessment</button>
    </div>
  );

  const { dominantDosha, scores, report } = assessment;
  const totalScore = (scores.vata || 0) + (scores.pitta || 0) + (scores.kapha || 0) || 1;
  const dateStr = assessment.createdAt
    ? new Date(((assessment.createdAt.seconds ?? assessment.createdAt._seconds) || 0) * 1000)
        .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recent';

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">

      {/* ── Hero header ── */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-marigold/40 bg-gradient-to-br from-herbal via-neem to-sage p-7 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-marigold/20 blur-3xl" />
        <div className="absolute -bottom-12 left-16 h-48 w-48 rounded-full bg-turmeric/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-marigold">Prakriti Report · {dateStr}</p>
            <h1 className="mt-2 text-4xl font-bold">
              {profile?.name && <span className="block text-lg font-semibold text-ivory/80 mb-1">{profile.name}</span>}
              {DOSHA_EMOJI[dominantDosha]} {cap(dominantDosha)} Dominant
            </h1>
            {report.nature && (
              <p className="mt-1 text-sm font-medium text-ivory/70">Nature: {report.nature}</p>
            )}
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ivory/85">
              {report.summary?.split(/\b(Vata|Pitta|Kapha|Grounding|Cooling|Lightness|warmth|routine|moderation|movement)\b/g).map((part, i) =>
                /^(Vata|Pitta|Kapha|Grounding|Cooling|Lightness|warmth|routine|moderation|movement)$/.test(part)
                  ? <strong key={i} className="font-bold text-marigold underline decoration-marigold/50">{part}</strong>
                  : <span key={i}>{part}</span>
              )}
            </p>
            {report.secondaryDosha && (
              <p className="mt-2 text-xs text-marigold">
                Secondary influence: {DOSHA_EMOJI[report.secondaryDosha]} {cap(report.secondaryDosha)} ({report.secondaryInfluence?.percent})
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 lg:items-end">
            <button onClick={() => navigate('/chat')} className="rounded-2xl border border-white/40 bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/25">
              Retake Assessment
            </button>
            <button onClick={() => navigate('/history')} className="rounded-2xl bg-turmeric/80 px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-turmeric">
              View History
            </button>
          </div>
        </div>
      </div>

      {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {/* ── Dosha score bars ── */}
      <Card className="mb-6">
        <SectionTitle icon="📊" title="Your Dosha Breakdown" />
        <div className="grid gap-3 sm:grid-cols-3">
          {['vata', 'pitta', 'kapha'].map((key) => (
            <ScoreBar
              key={key}
              label={cap(key)}
              emoji={DOSHA_EMOJI[key]}
              score={scores[key] || 0}
              total={totalScore}
              pct={report.profileBreakdown?.[key] || '0%'}
              active={key === dominantDosha}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Scores based on <strong className="text-charcoal">{totalScore} answered questions</strong>. The dosha with the <strong className="text-herbal">highest score</strong> is your dominant Prakriti.
        </p>
      </Card>

      {/* ── Main grid ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">

        {/* ── Left column ── */}
        <div className="space-y-5">

          {/* Strengths */}
          {report.strengths?.length > 0 && (
            <Card>
              <SectionTitle icon="💪" title="Your Natural Strengths" />
              <div className="flex flex-wrap gap-2">
                {report.strengths.map((s) => (
                  <span key={s} className="rounded-full border border-herbal/30 bg-herbal/10 px-3 py-1.5 text-sm font-medium text-herbal">{s}</span>
                ))}
              </div>
            </Card>
          )}

          {/* Imbalance signs */}
          {report.imbalanceSigns?.length > 0 && (
            <Card>
              <SectionTitle icon="⚡" title="Signs of Imbalance to Watch" />
              <ul className="space-y-2.5">
                {report.imbalanceSigns.map((sign, i) => {
                  const [main, ...rest] = sign.split(' and ');
                  return (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-6">
                      <span className="mt-1 shrink-0 text-xs text-turmeric">▸</span>
                      <span>
                        <span className="font-semibold text-turmeric">{main}</span>
                        {rest.length > 0 && <span className="text-slate-600"> and {rest.join(' and ')}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {/* Diseases prone to */}
          {report.diseases?.length > 0 && (
            <Card>
              <SectionTitle icon="🏥" title="Health Conditions You Are Prone To" />
              <p className="mb-3 text-xs text-slate-500">Based on your dominant <span className="font-semibold text-herbal">{cap(dominantDosha)}</span> Prakriti. <span className="italic">Awareness helps prevention.</span></p>
              <ul className="space-y-2.5">
                {report.diseases.map((disease, i) => {
                  const colonIdx = disease.indexOf(':');
                  const hasColon = colonIdx > -1;
                  return (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-6">
                      <span className="mt-1 shrink-0 text-xs text-red-400">▸</span>
                      {hasColon
                        ? <span><span className="font-semibold text-red-500">{disease.slice(0, colonIdx)}</span><span className="italic text-slate-500">{disease.slice(colonIdx)}</span></span>
                        : <span className="font-medium text-slate-700">{disease}</span>}
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {/* Precautions */}
          {report.precautions?.length > 0 && (
            <Card>
              <SectionTitle icon="🛡️" title="Precautions & Lifestyle Warnings" />
              <ListItems items={report.precautions} bullet="●" bulletClass="text-turmeric" />
            </Card>
          )}

          {/* Herbs */}
          {report.herbs?.length > 0 && (
            <Card>
              <SectionTitle icon="🌿" title="Beneficial Herbs & Supplements" />
              <div className="flex flex-wrap gap-2">
                {report.herbs.map((h) => (
                  <span key={h} className="rounded-full border border-neem/40 bg-ivory px-3 py-1.5 text-sm text-charcoal">{h}</span>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">Consult an Ayurvedic practitioner before starting any herbal supplement.</p>
            </Card>
          )}

          {/* Answer insights */}
          {report.answerInsights?.length > 0 && (
            <Card>
              <SectionTitle icon="🔍" title="What Your Answers Reveal" />
              <div className="grid gap-3 sm:grid-cols-2">
                {report.answerInsights.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-neem/15 bg-ivory p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neem">{item.question}</p>
                    <p className="mt-1 inline-block rounded-md bg-herbal/10 px-2 py-0.5 text-sm font-bold text-herbal">{item.answer}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-700">{item.insight}</p>
                    {item.tip && (
                      <div className="mt-2 border-t border-neem/15 pt-2">
                        <p className="text-xs font-semibold text-turmeric">💡 How to stay healthy</p>
                        <p className="mt-0.5 text-xs leading-5 italic text-slate-600">{item.tip}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Foods to favor */}
          <Card>
            <SectionTitle icon="🥗" title="Foods to Favor" />
            <ListItems items={report.diet?.favor || []} bullet="✓" bulletClass="text-herbal font-bold" />
            {report.diet?.notes && (
              <div className="mt-4 rounded-xl border border-herbal/20 bg-herbal/8 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-herbal">Key principle</p>
                <p className="mt-1 text-sm font-medium italic text-herbal">“{report.diet.notes}”</p>
              </div>
            )}
          </Card>

          {/* Foods to avoid */}
          <Card>
            <SectionTitle icon="🚫" title="Foods to Avoid" />
            <ListItems items={report.diet?.limit || []} bullet="✗" bulletClass="text-red-400 font-bold" />
          </Card>

          {/* Daily routine */}
          <Card>
            <SectionTitle icon="🌅" title="Recommended Daily Routine" />
            <NumberedList items={report.routine || []} />
          </Card>

          {/* Exercise */}
          <Card>
            <SectionTitle icon="🏃" title="Exercise & Movement Plan" />
            <ListItems items={report.exercise || []} bullet="●" bulletClass="text-neem" />
          </Card>

          {/* Secondary dosha influence */}
          {report.secondaryInfluence && (
            <Card className="border-turmeric/30 bg-gradient-to-br from-ivory to-turmeric/5">
              <SectionTitle icon={DOSHA_EMOJI[report.secondaryInfluence.key]} title={`Secondary ${report.secondaryInfluence.dosha} Influence (${report.secondaryInfluence.percent})`} />
              <p className="mb-3 text-xs text-slate-600">
                Your secondary dosha adds these traits to your constitution. Keep these in mind alongside your dominant {cap(dominantDosha)} guidance.
              </p>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neem">Also favor</p>
              <ListItems items={report.secondaryInfluence.dietFavor} bullet="✓" bulletClass="text-herbal" />
              <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-neem">Also limit</p>
              <ListItems items={report.secondaryInfluence.dietLimit} bullet="✗" bulletClass="text-red-400" />
              <div className="mt-4 rounded-xl bg-white px-3 py-2.5 text-xs italic text-slate-500 border border-turmeric/20">
                {report.secondaryInfluence.tip}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
