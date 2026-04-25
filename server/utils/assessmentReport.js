const DOSHA_PROFILES = {
  vata: {
    title: 'Vata',
    emoji: '🌬️',
    summary:
      'Vata is governed by air and space. You are naturally creative, quick-thinking, and adaptable — but when out of balance, anxiety, dryness, irregular digestion, and restlessness arise. Grounding, warmth, and routine are your medicine.',
    nature: 'Light, dry, cold, mobile, subtle, rough, and quick.',
    strengths: ['Creative and imaginative', 'Fast learner', 'Highly adaptable', 'Enthusiastic and energetic', 'Quick to respond'],
    imbalanceSigns: ['Anxiety and worry', 'Dry skin and hair', 'Irregular digestion and bloating', 'Insomnia or light sleep', 'Restlessness and scattered focus'],
    diseases: [
      'Anxiety disorders and panic attacks',
      'Insomnia and sleep disturbances',
      'Irritable bowel syndrome (IBS) and bloating',
      'Constipation and dry colon',
      'Arthritis and joint pain (especially dry, cracking joints)',
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
  },

  pitta: {
    title: 'Pitta',
    emoji: '🔥',
    summary:
      'Pitta is governed by fire and water. You are sharp, focused, driven, and naturally strong in digestion and leadership. When out of balance, excess heat manifests as inflammation, irritability, skin issues, and burnout. Cooling and moderation are your medicine.',
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
  },

  kapha: {
    title: 'Kapha',
    emoji: '🌱',
    summary:
      'Kapha is governed by earth and water. You are naturally stable, loyal, calm, and enduring. When out of balance, heaviness, sluggishness, weight gain, congestion, and emotional attachment arise. Movement, stimulation, and lightness are your medicine.',
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
  },
};

// Per question+answer: unique insight and maintenance tip
const ANSWER_INSIGHTS = {
  'Body type?': {
    vata: {
      insight: 'A thin frame means your body burns energy quickly and struggles to retain warmth and weight. Your joints and bones need extra nourishment.',
      tip: 'Eat calorie-dense, oily foods like ghee and avocado daily. Do oil massage (abhyanga) 3x a week to nourish tissues.',
    },
    pitta: {
      insight: 'A medium, muscular build shows strong metabolism and good tissue formation. You build and lose weight relatively easily.',
      tip: 'Maintain weight with cooling, moderate-protein meals. Avoid crash diets — your metabolism is sensitive to extremes.',
    },
    kapha: {
      insight: 'A heavier frame means your body holds onto weight, water, and energy reserves. Sluggish metabolism is a key risk.',
      tip: 'Prioritise daily vigorous exercise and light meals. Avoid heavy dinners and daytime napping.',
    },
  },
  'Skin type?': {
    vata: {
      insight: 'Dry skin signals low moisture and oil in your body. This can lead to premature ageing, cracking, and sensitivity to cold.',
      tip: 'Apply warm sesame oil to skin before bathing daily. Drink warm water with a pinch of ghee in the morning.',
    },
    pitta: {
      insight: 'Sensitive skin means your body runs hot and reacts easily to heat, spice, and stress with rashes or redness.',
      tip: 'Use cooling aloe vera gel on skin. Avoid spicy food and direct sun between 11am–3pm.',
    },
    kapha: {
      insight: 'Oily skin reflects excess earth and water in your constitution. Prone to clogged pores, dullness, and congestion.',
      tip: 'Use dry brushing before shower. Wash face with warm water and mild herbal cleanser. Avoid heavy creams.',
    },
  },
  'Hair texture?': {
    vata: {
      insight: 'Fine, dry hair shows Vata dryness reaching the scalp. Prone to split ends, breakage, and hair fall.',
      tip: 'Oil your scalp with warm sesame or coconut oil twice a week. Avoid heat styling and harsh shampoos.',
    },
    pitta: {
      insight: 'Straight, moderate hair with a tendency toward early greying or thinning due to excess heat in the scalp.',
      tip: 'Use cooling oils like coconut or brahmi oil. Avoid hot showers on the scalp and reduce stress.',
    },
    kapha: {
      insight: 'Thick, heavy hair is a Kapha strength — but excess oil and scalp congestion can cause dandruff and buildup.',
      tip: 'Wash hair regularly with a light herbal shampoo. Use dry shampoo between washes if needed.',
    },
  },
  'Appetite?': {
    vata: {
      insight: 'Irregular appetite means your digestive fire (agni) is variable — sometimes strong, sometimes absent. This leads to bloating and gas.',
      tip: 'Eat at fixed times every day even if not very hungry. Ginger tea before meals helps kindle digestion.',
    },
    pitta: {
      insight: 'Strong, intense appetite means your digestive fire is powerful. Skipping meals causes acidity, irritability, and headaches.',
      tip: 'Never skip meals. Keep healthy snacks available. Eat lunch as your largest meal when digestion peaks.',
    },
    kapha: {
      insight: 'Slow appetite means your digestion is sluggish. You may not feel hungry but still gain weight from small amounts.',
      tip: 'Eat only when genuinely hungry. Start meals with ginger and lemon to stimulate digestion.',
    },
  },
  'Digestion?': {
    vata: {
      insight: 'Variable digestion means you experience bloating, gas, and constipation alternating with normal days. Air in the gut is the cause.',
      tip: 'Eat warm, cooked, easy-to-digest foods. Avoid raw salads, beans without spices, and cold drinks with meals.',
    },
    pitta: {
      insight: 'Hot, sharp digestion means you digest quickly but are prone to acid reflux, heartburn, and loose stools under stress.',
      tip: 'Avoid spicy, sour, and fried food. Eat cooling foods like cucumber and coconut. Do not eat when angry.',
    },
    kapha: {
      insight: 'Slow, steady digestion means food sits in your gut longer. You feel heavy after meals and are prone to weight gain.',
      tip: 'Eat smaller portions. Add digestive spices like ginger, black pepper, and cumin to every meal.',
    },
  },
  'Sleep type?': {
    vata: {
      insight: 'Light sleep means your nervous system stays alert even at rest. You wake easily, have vivid dreams, and feel unrefreshed.',
      tip: 'Follow a strict 10pm bedtime. Drink warm milk with nutmeg before bed. Avoid screens after 9pm.',
    },
    pitta: {
      insight: 'Moderate sleep with a tendency to wake between 1–3am due to heat or mental activity. Dreams are often intense.',
      tip: 'Sleep before 10:30pm. Keep the bedroom cool. Avoid working or problem-solving in the hour before bed.',
    },
    kapha: {
      insight: 'Deep, heavy sleep is a Kapha trait. You sleep long but wake feeling groggy and slow to start the day.',
      tip: 'Set a firm wake time of 5:30–6am. Do not snooze. Morning exercise immediately after waking clears Kapha heaviness.',
    },
  },
  'Energy pattern?': {
    vata: {
      insight: 'Bursty energy means you have intense periods of activity followed by crashes. Inconsistent output leads to exhaustion.',
      tip: 'Pace yourself throughout the day. Take short breaks every 90 minutes. Avoid overcommitting in high-energy phases.',
    },
    pitta: {
      insight: 'Focused, sustained energy with a tendency to push too hard and ignore fatigue signals until burnout hits.',
      tip: 'Schedule mandatory rest breaks. Stop work by 9pm. Protect weekends from work to prevent adrenal fatigue.',
    },
    kapha: {
      insight: 'Steady but slow energy — you take time to warm up but can sustain effort for long periods once going.',
      tip: 'Start your day with vigorous movement to ignite energy. Avoid sitting for more than 45 minutes at a stretch.',
    },
  },
  'Mood swings?': {
    vata: {
      insight: 'Anxiety and worry are your stress response. Your nervous system is sensitive and easily overwhelmed by change or uncertainty.',
      tip: 'Practice Nadi Shodhana (alternate nostril breathing) for 5 minutes daily. Reduce news and social media consumption.',
    },
    pitta: {
      insight: 'Irritability under stress shows excess fire in the mind. Anger, criticism, and impatience are your warning signs.',
      tip: 'Take a 10-minute walk when frustrated. Practice cooling breath (Sheetali). Avoid caffeine when stressed.',
    },
    kapha: {
      insight: 'Withdrawal and emotional heaviness under stress. You tend to hold onto feelings and avoid confrontation.',
      tip: 'Talk to someone you trust when feeling low. Physical movement is the fastest mood lifter for Kapha types.',
    },
  },
  'Natural body temperature?': {
    vata: {
      insight: 'Feeling cold most of the time means your circulation is poor and your body lacks the fire to generate warmth.',
      tip: 'Wear layers, especially around the abdomen and lower back. Drink warm fluids all day. Avoid air conditioning.',
    },
    pitta: {
      insight: 'Running warm means your metabolic fire is high. You overheat easily and are sensitive to hot weather and spicy food.',
      tip: 'Stay in cool environments during summer. Drink coconut water daily. Avoid hot yoga and midday sun.',
    },
    kapha: {
      insight: 'Cool body temperature with low metabolic heat. You feel comfortable in warmth but sluggish in cold, damp weather.',
      tip: 'Exercise vigorously to generate internal heat. Eat warming spices. Avoid cold drinks and refrigerated food.',
    },
  },
  'Memory style?': {
    vata: {
      insight: 'Quick to learn but quick to forget — your mind grasps things fast but needs repetition and calm to retain them.',
      tip: 'Review important information before sleep. Use written notes and reminders. Meditation improves Vata memory retention.',
    },
    pitta: {
      insight: 'Sharp, detailed memory with strong recall. You remember facts well but can become rigid or critical when wrong.',
      tip: 'Practice letting go of minor errors. Journaling helps process and organise the sharp Pitta mind constructively.',
    },
    kapha: {
      insight: 'Slow to learn but excellent long-term retention. Once something is in your memory, it stays permanently.',
      tip: 'Give yourself extra time to learn new things without pressure. Teach others what you know — it reinforces memory.',
    },
  },
  'Speech speed?': {
    vata: {
      insight: 'Fast speech reflects a quick, scattered mind. You may talk over others, lose your train of thought, or speak before thinking.',
      tip: 'Pause before responding. Practice speaking slowly and deliberately. This also calms the nervous system.',
    },
    pitta: {
      insight: 'Direct, precise speech shows a sharp, goal-oriented mind. Can come across as blunt or critical to others.',
      tip: 'Soften your delivery with warmth. Ask questions before giving opinions. Avoid debating when emotionally heated.',
    },
    kapha: {
      insight: 'Slow, measured speech reflects a calm, thoughtful mind. You choose words carefully but may be slow to express needs.',
      tip: 'Speak up earlier in conversations. Practice assertiveness — your calm voice is a strength, use it confidently.',
    },
  },
  'Stress response?': {
    vata: {
      insight: 'Worry and overthinking are your stress pattern. Your mind loops on problems and struggles to find stillness.',
      tip: 'Ground yourself with physical touch — hold a warm cup, walk barefoot on grass. Routine is your best stress medicine.',
    },
    pitta: {
      insight: 'Anger and frustration are your stress outlet. You push harder under pressure until the body or mind breaks down.',
      tip: 'Identify your anger triggers early. Cold water on the face, a walk, or 5 deep breaths interrupt the Pitta stress cycle.',
    },
    kapha: {
      insight: 'Withdrawal and emotional eating are your stress patterns. You retreat inward and may use food or sleep as comfort.',
      tip: 'Create a social support plan for stressful times. Call a friend, go for a walk, or do 10 minutes of dance.',
    },
  },
  'Physical stamina?': {
    vata: {
      insight: 'Variable stamina means you tire quickly and need more recovery time than others. Overexertion leads to long fatigue.',
      tip: 'Exercise for 20–30 minutes at moderate intensity. Rest fully between sessions. Prioritise sleep for recovery.',
    },
    pitta: {
      insight: 'High stamina with a tendency to ignore fatigue and push through. Risk of inflammation and injury from overtraining.',
      tip: 'Include 2 rest days per week. Stretch and cool down after every session. Listen to pain signals — do not override them.',
    },
    kapha: {
      insight: 'Enduring stamina once warmed up — you can sustain effort for long periods but are slow to start and motivate.',
      tip: 'Commit to a fixed daily exercise time. Having a workout partner helps Kapha types stay accountable and motivated.',
    },
  },
  'Thirst levels?': {
    vata: {
      insight: 'Low thirst means you often forget to drink water, leading to dehydration, dry skin, constipation, and brain fog.',
      tip: 'Set hourly reminders to drink warm water. Keep a thermos of herbal tea at your desk. Aim for 6–8 cups daily.',
    },
    pitta: {
      insight: 'High thirst reflects your body burning hot and needing constant cooling. You dehydrate faster than other types.',
      tip: 'Drink coconut water, cucumber water, or rose water through the day. Avoid caffeinated drinks which increase heat.',
    },
    kapha: {
      insight: 'Moderate thirst with a tendency to retain water rather than flush it. Excess fluid intake can increase heaviness.',
      tip: 'Drink warm water with ginger or lemon. Avoid cold drinks. Do not drink large amounts with meals.',
    },
  },
  'Preferred climate?': {
    vata: {
      insight: 'Preference for warm, dry climates shows your body craves the opposite of its cold, dry nature to feel balanced.',
      tip: 'In cold or windy weather, cover your ears and neck. Use a humidifier indoors. Avoid excessive air conditioning.',
    },
    pitta: {
      insight: 'Preference for cool, moderate climates shows your body seeking relief from its internal heat.',
      tip: 'Spend time near water — rivers, lakes, or the sea. Avoid hot, humid environments. Keep your home well-ventilated.',
    },
    kapha: {
      insight: 'Preference for warm, damp climates reflects Kapha comfort — but this environment also increases Kapha imbalance.',
      tip: 'Seek dry, warm climates. Avoid damp basements or cold, wet weather. Morning sun exposure helps stimulate Kapha energy.',
    },
  },
  'Skin quality?': {
    vata: {
      insight: 'Thin, rough skin shows low collagen, poor circulation, and dryness reaching the tissue level.',
      tip: 'Massage warm sesame oil into skin before bathing. Eat healthy fats daily. Stay hydrated with warm fluids.',
    },
    pitta: {
      insight: 'Soft, warm skin with a tendency toward redness, sensitivity, and breakouts when internal heat rises.',
      tip: 'Use cooling rose water toner. Avoid harsh exfoliants. Eat anti-inflammatory foods like turmeric and leafy greens.',
    },
    kapha: {
      insight: 'Thick, oily skin is resilient but prone to congestion, enlarged pores, and dullness without regular cleansing.',
      tip: 'Exfoliate twice a week with a dry brush or gentle scrub. Use light, non-comedogenic moisturisers only.',
    },
  },
  'Breathing pattern?': {
    vata: {
      insight: 'Shallow breathing means your body is in a low-grade stress state. Less oxygen reaches tissues, increasing anxiety.',
      tip: 'Practice diaphragmatic breathing for 5 minutes daily. Inhale for 4 counts, hold for 4, exhale for 6.',
    },
    pitta: {
      insight: 'Rapid breathing under stress or exertion shows the Pitta tendency to accelerate everything, including the breath.',
      tip: 'Practice Sheetali (cooling breath) — inhale through a rolled tongue, exhale through the nose. Do 10 rounds daily.',
    },
    kapha: {
      insight: 'Slow, deep breathing is a Kapha strength but can become laboured with congestion or excess mucus.',
      tip: 'Practice Kapalabhati (skull-shining breath) — 30 rapid exhales each morning to clear airways and energise the mind.',
    },
  },
  'Daily routine preference?': {
    vata: {
      insight: 'Preference for flexibility reflects Vata nature — but too much flexibility leads to chaos, missed meals, and poor sleep.',
      tip: 'Build a non-negotiable skeleton routine: fixed wake time, meal times, and sleep time. Keep everything else flexible.',
    },
    pitta: {
      insight: 'Preference for structure shows Pitta discipline — but rigid schedules can become a source of stress when disrupted.',
      tip: 'Build buffer time into your schedule. Practice adapting when plans change — flexibility is a Pitta growth area.',
    },
    kapha: {
      insight: 'Preference for steady, unchanging routine reflects Kapha comfort with the familiar — but stagnation is the risk.',
      tip: 'Introduce one new activity or experience each week. Novelty and variety are medicine for the Kapha mind.',
    },
  },
};

function getProfile(value) {
  return DOSHA_PROFILES[value] || DOSHA_PROFILES.vata;
}

function formatPercent(score, total) {
  if (!total) return '0%';
  return `${Math.round((score / total) * 100)}%`;
}

export function buildAssessmentReport({ answers = [], scores = {}, dominantDosha }) {
  const totalScore = Object.values(scores).reduce((sum, v) => sum + Number(v || 0), 0) || answers.length || 1;
  const dominant = getProfile(dominantDosha);

  // Secondary dosha — the second highest score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const secondaryKey = sorted[1]?.[0] || null;
  const secondary = secondaryKey ? getProfile(secondaryKey) : null;

  const profileBreakdown = {
    vata: formatPercent(scores.vata || 0, totalScore),
    pitta: formatPercent(scores.pitta || 0, totalScore),
    kapha: formatPercent(scores.kapha || 0, totalScore),
  };

  const answerInsights = answers.map((item) => {
    const displayLabel = item.label || item.value;
    const lookup = ANSWER_INSIGHTS[item.question]?.[item.value];
    const sourceProfile = getProfile(item.value);
    return {
      question: item.question,
      answer: displayLabel,
      label: displayLabel,
      insight: lookup?.insight || `Your answer reflects a ${sourceProfile.title} tendency in this area.`,
      tip: lookup?.tip || sourceProfile.tip,
    };
  });

  const summary = `Your answers point most strongly to ${dominant.title} (${profileBreakdown[dominantDosha]}). ${dominant.summary}${secondary ? ` You also carry a notable ${secondary.title} influence (${profileBreakdown[secondaryKey]}), which shapes your secondary traits.` : ''}`;

  const recommendations = [
    summary,
    `Key focus: ${(dominant.focusAreas || []).join(', ')}.`,
    `Diet: ${(dominant.dietFavor || []).join(', ')}.`,
    `Avoid: ${(dominant.dietLimit || []).join(', ')}.`,
    `Routine: ${(dominant.routine || []).join(' ')}`,
    `Exercise: ${(dominant.exercise || []).join(', ')}.`,
    `Precautions: ${(dominant.precautions || []).join(' ')}`,
  ].join('\n\n');

  return {
    dominantDosha: dominant.title.toLowerCase(),
    secondaryDosha: secondary ? secondary.title.toLowerCase() : null,
    summary,
    nature: dominant.nature,
    profileBreakdown,
    strengths: dominant.strengths,
    imbalanceSigns: dominant.imbalanceSigns,
    focusAreas: dominant.focusAreas,
    diet: {
      favor: dominant.dietFavor,
      limit: dominant.dietLimit,
      notes: dominant.tip,
    },
    routine: dominant.routine,
    exercise: dominant.exercise,
    precautions: dominant.precautions,
    diseases: dominant.diseases,
    herbs: dominant.herbs,
    secondaryInfluence: secondary
      ? {
          dosha: secondary.title,
          key: secondaryKey,
          percent: profileBreakdown[secondaryKey],
          tip: secondary.tip,
          focusAreas: secondary.focusAreas,
          dietFavor: secondary.dietFavor.slice(0, 3),
          dietLimit: secondary.dietLimit.slice(0, 3),
        }
      : null,
    answerInsights,
    topSignals: answerInsights.slice(0, 6).map((i) => i.insight),
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}
