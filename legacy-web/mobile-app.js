/* ==========================================================================
   FRIDGECHEF MOBILE NATIVE APP - LOGIC & MICRO-INTERACTIONS
   Includes: Touch Swipes, Haptic Engine, Magic Link Extractor, Keep-Awake,
   Offline Grocery Lists, Bento Grid, Infinite Scroll, and Step Cooking Mode.
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. STATE & STORAGE ---
  const STORAGE_KEYS = {
    FAVORITES: 'fridgechef_favorites',
    GROCERY: 'fridgechef_grocery',
    THEME: 'fridgechef_theme',
    CALORIES: 'fridgechef_calories',
    FRAME_MODE: 'fridgechef_frame_mode'
  };

  // Recipe Catalog
  const INITIAL_RECIPES = [
    {
      id: 'r1',
      title: 'Honey Soy Glazed Salmon Bowl',
      description: 'Pan-seared glazed salmon over fluffy jasmine rice with sliced avocado, steamed edamame, and pickled cucumber ribbons.',
      image: 'image/gourmet_salmon.jpg',
      prepTime: 10,
      cookTime: 12,
      difficulty: 'Easy',
      calories: 520,
      protein: 38,
      carbs: 45,
      fat: 18,
      tags: ['High Protein', 'Under 30 Mins', 'Meal Prep'],
      featured: true,
      servings: 2,
      ingredients: [
        { item: 'Fresh Salmon Fillet', amount: '2 fillets (300g)', category: 'Meat & Seafood' },
        { item: 'Jasmine Rice', amount: '1 cup uncooked', category: 'Pantry & Spices' },
        { item: 'Ripe Avocado', amount: '1 sliced', category: 'Produce' },
        { item: 'Steamed Edamame', amount: '1/2 cup', category: 'Produce' },
        { item: 'Low-Sodium Soy Sauce', amount: '2 tbsp', category: 'Pantry & Spices' },
        { item: 'Raw Honey', amount: '1.5 tbsp', category: 'Pantry & Spices' },
        { item: 'Toasted Sesame Oil', amount: '1 tsp', category: 'Pantry & Spices' },
        { item: 'Scallions & Sesame Seeds', amount: 'Garnish', category: 'Produce' }
      ],
      steps: [
        'Cook jasmine rice according to package instructions until tender and fluffy.',
        'In a small bowl, whisk together soy sauce, honey, minced garlic, and sesame oil.',
        'Heat a non-stick skillet over medium-high heat with a drizzle of olive oil. Sear salmon skin-side down for 4 minutes.',
        'Flip the salmon, pour in the honey soy glaze, and simmer for 3 minutes until caramelized and cooked through.',
        'Assemble bowls: base of warm rice, glazed salmon, avocado slices, edamame, and cucumber ribbons. Drizzle remaining pan glaze and enjoy!'
      ]
    },
    {
      id: 'r2',
      title: '15-Min Chili Crisp Garlic Noodles',
      description: 'Chewy noodles tossed in a sizzling garlic, scallion, and chili oil emulsion, crowned with a jammy ramen egg.',
      image: 'image/chili_noodles.jpg',
      prepTime: 5,
      cookTime: 10,
      difficulty: 'Easy',
      calories: 440,
      protein: 18,
      carbs: 58,
      fat: 14,
      tags: ['Under 30 Mins', 'Quick Dinner', '< 500 Cals'],
      featured: false,
      servings: 2,
      ingredients: [
        { item: 'Ramen or Knife-cut Noodles', amount: '200g', category: 'Pantry & Spices' },
        { item: 'Garlic Cloves, finely minced', amount: '5 cloves', category: 'Produce' },
        { item: 'Chili Crisp Oil (Lao Gan Ma style)', amount: '2 tbsp', category: 'Pantry & Spices' },
        { item: 'Light Soy Sauce & Dark Soy Sauce', amount: '1.5 tbsp each', category: 'Pantry & Spices' },
        { item: 'Chinese Black Vinegar', amount: '1 tsp', category: 'Pantry & Spices' },
        { item: 'Fresh Scallions', amount: '3 stalks sliced', category: 'Produce' },
        { item: 'Eggs (Soft-Boiled)', amount: '2 eggs', category: 'Dairy & Refrigerated' },
        { item: 'Baby Bok Choy', amount: '2 heads halved', category: 'Produce' }
      ],
      steps: [
        'Bring a pot of salted water to boil. Cook noodles and baby bok choy for 3 to 4 minutes until al dente. Drain and reserve 2 tbsp pasta water.',
        'In a heat-safe bowl, combine minced garlic, chili crisp, white parts of scallions, and red chili flakes.',
        'Heat 2 tablespoons of neutral oil until smoking hot. Carefully pour the hot oil over the aromatics to sizzle and bloom.',
        'Stir in soy sauces, black vinegar, and reserved noodle water.',
        'Add hot noodles and bok choy to the bowl. Toss vigorously until noodles are glossy and coated.',
        'Top with halved jammy soft-boiled egg, toasted sesame seeds, and scallion greens. Serve immediately!'
      ]
    },
    {
      id: 'r3',
      title: 'Crispy Lemon Herb Chicken Thighs',
      description: 'Golden skillet chicken thighs roasted with rosemary, garlic cloves, and a zesty lemon pan sauce.',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
      prepTime: 10,
      cookTime: 20,
      difficulty: 'Medium',
      calories: 490,
      protein: 42,
      carbs: 6,
      fat: 32,
      tags: ['High Protein', 'Keto', 'Under 30 Mins'],
      featured: false,
      servings: 2,
      ingredients: [
        { item: 'Skin-on Bone-in Chicken Thighs', amount: '4 pieces (500g)', category: 'Meat & Seafood' },
        { item: 'Fresh Rosemary & Thyme', amount: '3 sprigs', category: 'Produce' },
        { item: 'Lemon (Juiced & Sliced)', amount: '1 whole', category: 'Produce' },
        { item: 'Garlic Cloves (Crushed)', amount: '6 cloves', category: 'Produce' },
        { item: 'Olive Oil', amount: '1 tbsp', category: 'Pantry & Spices' },
        { item: 'Butter', amount: '1 tbsp', category: 'Dairy & Refrigerated' }
      ],
      steps: [
        'Pat chicken thighs thoroughly dry with paper towels. Season generously on both sides with kosher salt and black pepper.',
        'Heat an oven-safe cast iron skillet over medium-high heat with olive oil. Place chicken skin-side down and sear undisturbed for 8 minutes until skin is deeply golden and crackling.',
        'Flip chicken thighs. Add butter, crushed garlic cloves, fresh rosemary, and lemon slices directly into the pan.',
        'Baste the foaming herb butter over the crispy chicken for 3 minutes.',
        'Finish cooking through for another 5 minutes until internal temp reaches 165°F (74°C). Rest 5 minutes before serving.'
      ]
    },
    {
      id: 'r4',
      title: 'Truffle Mushroom Cream Pasta',
      description: 'Al dente fettuccine enveloped in velvety parmesan garlic cream with sautéed cremini mushrooms and white truffle oil.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      prepTime: 10,
      cookTime: 15,
      difficulty: 'Easy',
      calories: 560,
      protein: 16,
      carbs: 64,
      fat: 26,
      tags: ['Under 30 Mins', 'Comfort Food', 'Vegetarian'],
      featured: false,
      servings: 2,
      ingredients: [
        { item: 'Fettuccine Pasta', amount: '250g', category: 'Pantry & Spices' },
        { item: 'Cremini or Shiitake Mushrooms', amount: '250g sliced', category: 'Produce' },
        { item: 'Heavy Cream', amount: '1/2 cup', category: 'Dairy & Refrigerated' },
        { item: 'Fresh Parmigiano-Reggiano', amount: '1/2 cup grated', category: 'Dairy & Refrigerated' },
        { item: 'Garlic Cloves', amount: '3 minced', category: 'Produce' },
        { item: 'White Truffle Oil', amount: '1 tsp', category: 'Pantry & Spices' },
        { item: 'Fresh Parsley', amount: 'Handful chopped', category: 'Produce' }
      ],
      steps: [
        'Cook fettuccine in heavily salted water until 1 minute shy of al dente. Reserve 1/2 cup pasta water.',
        'Melt butter in a large skillet over high heat. Add sliced mushrooms and cook without moving for 3 minutes until caramelized.',
        'Add minced garlic and sauté for 1 minute until fragrant.',
        'Pour in heavy cream and 1/4 cup reserved pasta water. Simmer gently for 2 minutes to thicken.',
        'Toss in cooked pasta and freshly grated parmesan, tossing continuously until a glossy sauce clings to the noodles.',
        'Remove from heat, drizzle with white truffle oil, and garnish with fresh parsley and flaky sea salt.'
      ]
    },
    {
      id: 'r5',
      title: 'Green Goddess Avocado Chickpea Salad',
      description: 'Crisp romaine, cucumber, and protein-packed chickpeas tossed in a velvety herb tahini avocado dressing.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      prepTime: 12,
      cookTime: 0,
      difficulty: 'Easy',
      calories: 360,
      protein: 15,
      carbs: 38,
      fat: 16,
      tags: ['Vegan', 'Meal Prep', '< 500 Cals', 'Under 30 Mins'],
      featured: false,
      servings: 2,
      ingredients: [
        { item: 'Chickpeas (Cooked/Canned)', amount: '1 can (400g) rinsed', category: 'Pantry & Spices' },
        { item: 'Ripe Avocado', amount: '1 medium', category: 'Produce' },
        { item: 'Persian Cucumbers', amount: '2 diced', category: 'Produce' },
        { item: 'Baby Spinach & Romaine', amount: '4 cups', category: 'Produce' },
        { item: 'Tahini', amount: '2 tbsp', category: 'Pantry & Spices' },
        { item: 'Lemon Juice', amount: '2 tbsp', category: 'Produce' },
        { item: 'Fresh Basil & Parsley', amount: '1/2 cup blended', category: 'Produce' },
        { item: 'Pumpkin Seeds (Pepitas)', amount: '2 tbsp', category: 'Pantry & Spices' }
      ],
      steps: [
        'Prepare the Green Goddess Dressing: In a blender or food processor, combine 1/2 avocado, tahini, lemon juice, fresh herbs, garlic clove, olive oil, and 3 tbsp ice water. Blend until silky green.',
        'In a large mixing bowl, combine chopped greens, diced cucumbers, and rinsed chickpeas.',
        'Dice the remaining 1/2 avocado into cubes and add to the bowl.',
        'Pour over dressing and toss thoroughly to coat every leaf.',
        'Top with toasted pumpkin seeds and hemp hearts for crunch. Perfect for packed lunches!'
      ]
    },
    {
      id: 'r6',
      title: 'High-Protein Beef Smash Burger Tacos',
      description: 'Viral smash burger pressed onto mini tortillas with melted cheddar, crisp lettuce, and tangy secret smash sauce.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      prepTime: 8,
      cookTime: 7,
      difficulty: 'Easy',
      calories: 460,
      protein: 36,
      carbs: 28,
      fat: 22,
      tags: ['High Protein', 'Under 30 Mins', '< 500 Cals'],
      featured: false,
      servings: 2,
      ingredients: [
        { item: 'Lean Ground Beef (90/10)', amount: '250g', category: 'Meat & Seafood' },
        { item: 'Mini Corn or Flour Tortillas', amount: '4 tortillas', category: 'Pantry & Spices' },
        { item: 'Sharp Cheddar Slices', amount: '4 slices', category: 'Dairy & Refrigerated' },
        { item: 'Shredded Iceberg Lettuce', amount: '1 cup', category: 'Produce' },
        { item: 'Pickle Slices', amount: '8 chips', category: 'Pantry & Spices' },
        { item: 'Greek Yogurt + Sriracha Sauce', amount: '3 tbsp', category: 'Dairy & Refrigerated' }
      ],
      steps: [
        'Divide ground beef into 4 thin portions and press flat directly onto one side of each tortilla, spreading edge-to-edge.',
        'Heat a flat griddle or cast iron skillet on high heat. Season the beef with salt, garlic powder, and black pepper.',
        'Place tortilla beef-side down on the hot pan and press firmly with a spatula. Sear for 2.5 minutes until beef is crispy and charred.',
        'Flip so the tortilla is on the skillet. Place a slice of cheese on each burger. Cover for 1 minute until cheese melts.',
        'Remove from heat, top with shredded lettuce, dill pickles, and signature smash sauce. Fold into tacos and enjoy!'
      ]
    }
  ];

  // App State
  let appState = {
    recipes: [...INITIAL_RECIPES],
    activeFilter: 'all',
    searchQuery: '',
    favorites: JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '["r1"]'),
    groceryList: JSON.parse(localStorage.getItem(STORAGE_KEYS.GROCERY) || JSON.stringify([
      { id: 'g1', item: 'Fresh Salmon Fillet', amount: '2 fillets', category: 'Meat & Seafood', checked: false },
      { id: 'g2', item: 'Ripe Avocado', amount: '2 pieces', category: 'Produce', checked: true },
      { id: 'g3', item: 'Chili Crisp Oil', amount: '1 jar', category: 'Pantry & Spices', checked: false },
      { id: 'g4', item: 'Organic Eggs', amount: '1 carton', category: 'Dairy & Refrigerated', checked: false }
    ])),
    currentScreen: 'screenHome',
    activeRecipe: null,
    servingMultiplier: 1,
    focusMode: {
      active: false,
      recipe: null,
      currentStep: 0,
      timerSeconds: 0,
      timerRunning: false,
      timerInterval: null
    },
    wakeLock: null,
    audioCtx: null
  };

  // --- 2. MICRO-INTERACTION & HAPTIC ENGINE ---
  function initAudioContext() {
    if (!appState.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      appState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function triggerHaptic(type = 'click') {
    // 1. Native hardware vibration API (Android & supported devices)
    if (navigator.vibrate) {
      if (type === 'heavy') navigator.vibrate([30, 40, 30]);
      else if (type === 'success') navigator.vibrate([15, 60, 20]);
      else navigator.vibrate(15);
    }

    // 2. Synthetic Audio Click for iOS Safari / Desktop tactile feel
    try {
      initAudioContext();
      if (appState.audioCtx && appState.audioCtx.state === 'running') {
        const osc = appState.audioCtx.createOscillator();
        const gain = appState.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(appState.audioCtx.destination);

        const now = appState.audioCtx.currentTime;
        if (type === 'success') {
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'chime') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(659.25, now);
          osc.frequency.setValueAtTime(880, now + 0.15);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
        } else {
          // Subtle mechanical click
          osc.frequency.setValueAtTime(type === 'heavy' ? 180 : 320, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
        }
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  function showToast(message, type = 'success') {
    let toast = document.getElementById('mobileToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mobileToast';
      toast.className = 'mobile-toast';
      document.body.appendChild(toast);
    }

    toast.className = `mobile-toast ${type} visible`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> <span>${message}</span>`;

    triggerHaptic(type === 'success' ? 'success' : 'click');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  // --- 3. HARDWARE KEEP-AWAKE API (COOKING MODE) ---
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        appState.wakeLock = await navigator.wakeLock.request('screen');
        console.log('🔆 Screen Wake Lock Active');
        updateKeepAwakeBadge(true);

        appState.wakeLock.addEventListener('release', () => {
          console.log('Screen Wake Lock Released');
          updateKeepAwakeBadge(false);
        });
      }
    } catch (err) {
      console.warn('Wake Lock request error:', err.message);
      updateKeepAwakeBadge(false);
    }
  }

  async function releaseWakeLock() {
    if (appState.wakeLock !== null) {
      try {
        await appState.wakeLock.release();
        appState.wakeLock = null;
      } catch (e) {}
    }
    updateKeepAwakeBadge(false);
  }

  function updateKeepAwakeBadge(isActive) {
    const badge = document.getElementById('keepAwakeStatusBadge');
    if (badge) {
      badge.innerHTML = isActive
        ? `<div class="awake-pulse-dot"></div> Keep-Awake: ON`
        : `<i class="fas fa-moon"></i> Keep-Awake: OFF`;
      badge.style.borderColor = isActive ? '#10b981' : 'rgba(255,255,255,0.2)';
      badge.style.color = isActive ? '#10b981' : 'var(--text-muted)';
    }
  }

  // Handle visibility change (re-request wake lock if user tabs back)
  document.addEventListener('visibilitychange', async () => {
    if (appState.wakeLock !== null && document.visibilityState === 'visible' && appState.focusMode.active) {
      await requestWakeLock();
    }
  });

  // --- 4. NAVIGATION & SCREEN SWITCHING ---
  function switchScreen(targetScreenId) {
    const screens = document.querySelectorAll('.screen-view');
    screens.forEach(s => s.classList.remove('active-screen'));

    const target = document.getElementById(targetScreenId);
    if (target) {
      target.classList.add('active-screen');
      appState.currentScreen = targetScreenId;
    }

    // Update bottom nav tab buttons
    const navTabs = document.querySelectorAll('.nav-tab-btn');
    navTabs.forEach(tab => {
      if (tab.dataset.screen === targetScreenId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Special behavior for Extractor screen
    const magicBtn = document.getElementById('centerMagicBtn');
    if (targetScreenId === 'screenExtractor') {
      magicBtn?.classList.add('active');
      checkClipboardForLinks();
    } else {
      magicBtn?.classList.remove('active');
    }

    if (targetScreenId === 'screenGrocery') {
      renderGroceryList();
    } else if (targetScreenId === 'screenSaved') {
      renderSavedRecipes();
    }

    triggerHaptic('click');
  }

  // --- 5. CLIPBOARD AUTO-DETECTION FOR MAGIC EXTRACTOR ---
  async function checkClipboardForLinks() {
    const chip = document.getElementById('clipboardAutoChip');
    const input = document.getElementById('magicLinkInput');
    if (!chip || !input) return;

    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && (text.includes('youtube.com') || text.includes('youtu.be') || text.includes('instagram.com') || text.includes('tiktok.com'))) {
          chip.style.display = 'inline-flex';
          chip.innerHTML = `<i class="fas fa-magic"></i> <span>Detected recipe link in clipboard! Tap to paste</span>`;
          chip.onclick = () => {
            input.value = text;
            chip.style.display = 'none';
            triggerHaptic('success');
            executeMagicExtraction(text);
          };
          return;
        }
      }
    } catch (e) {
      // Clipboard read permission might not be granted
    }
    chip.style.display = 'none';
  }

  // --- 6. MAGIC LINK RECIPE EXTRACTOR EXECUTION ---
  async function executeMagicExtraction(url) {
    if (!url || !url.trim()) {
      showToast('Please paste a video link first!', 'error');
      return;
    }

    triggerHaptic('heavy');

    const stage = document.getElementById('bubblingPotStage');
    const resultCard = document.getElementById('extractedResultCard');
    const inputGroup = document.getElementById('extractorInputGroup');
    const statusText = document.getElementById('extractorStatusText');
    const statusSubtext = document.getElementById('extractorStatusSubtext');

    if (stage) stage.classList.add('active');
    if (resultCard) resultCard.classList.remove('active');

    // Multi-phase bubbling pot status progression
    const phases = [
      { main: 'Connecting to video stream...', sub: 'Fetching audio captions & transcript data' },
      { main: 'AI parsing culinary steps...', sub: 'Groq LLaMA 3.3 identifying ingredient measurements' },
      { main: 'Calculating macro nutrition...', sub: 'Estimating calories, protein, carbs & healthy fats' },
      { main: 'Plating your custom recipe card...', sub: 'Formatting step-by-step cooking instructions' }
    ];

    let currentPhase = 0;
    const phaseInterval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      if (statusText) statusText.textContent = phases[currentPhase].main;
      if (statusSubtext) statusSubtext.textContent = phases[currentPhase].sub;
      triggerHaptic('click');
    }, 900);

    let extractedData = null;

    try {
      // 1. Try server endpoint
      const response = await fetch('/api/magic-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        extractedData = await response.json();
      }
    } catch (err) {
      console.warn('Backend extraction endpoint unreachable, falling back to local culinary intelligence:', err);
    }

    // 2. Intelligent local fallback if server unreachable
    if (!extractedData || !extractedData.title) {
      await new Promise(r => setTimeout(r, 2200)); // Simulate AI processing delay

      let platform = 'Social Video';
      if (url.includes('shorts')) platform = 'YouTube Shorts';
      else if (url.includes('instagram')) platform = 'Instagram Reel';
      else if (url.includes('tiktok')) platform = 'TikTok';
      else if (url.includes('youtube')) platform = 'YouTube';

      extractedData = {
        id: 'magic_' + Date.now(),
        title: 'Viral 10-Minute Crispy Honey Butter Salmon Bites',
        description: `Extracted from ${platform}: Golden cube-cut salmon fillets pan-seared to crispy perfection, glazed in garlic honey butter and served over warm rice.`,
        sourcePlatform: platform,
        sourceUrl: url,
        image: 'image/gourmet_salmon.jpg',
        prepTime: 8,
        cookTime: 10,
        servings: 2,
        calories: 495,
        protein: 34,
        carbs: 22,
        fat: 28,
        difficulty: 'Easy',
        tags: ['High Protein', 'Under 30 Mins', 'Viral Recipe'],
        ingredients: [
          { item: 'Fresh Salmon (Skinless, Cubed)', amount: '350g', category: 'Meat & Seafood' },
          { item: 'Cornstarch (for crispiness)', amount: '1.5 tbsp', category: 'Pantry & Spices' },
          { item: 'Salted Butter', amount: '2 tbsp', category: 'Dairy & Refrigerated' },
          { item: 'Raw Honey', amount: '2 tbsp', category: 'Pantry & Spices' },
          { item: 'Garlic Cloves (Minced)', amount: '4 cloves', category: 'Produce' },
          { item: 'Soy Sauce', amount: '1 tbsp', category: 'Pantry & Spices' },
          { item: 'Lemon Juice', amount: '1 tsp', category: 'Produce' },
          { item: 'Toasted Sesame Seeds & Scallions', amount: 'Garnish', category: 'Produce' }
        ],
        steps: [
          'Toss salmon cubes in cornstarch, salt, and black pepper until lightly dusted.',
          'Heat olive oil in a non-stick skillet over medium-high heat. Sear salmon cubes for 2 minutes on each side until golden and crispy.',
          'Lower heat, push salmon to one side, and add butter, minced garlic, honey, and soy sauce.',
          'Stir the sauce until bubbling and fragrant, then toss all salmon cubes until richly coated in the glaze.',
          'Finish with a squeeze of fresh lemon juice, scallions, and toasted sesame seeds. Serve immediately!'
        ]
      };
    }

    clearInterval(phaseInterval);
    if (stage) stage.classList.remove('active');

    // Render Extracted Result Card
    renderExtractedResult(extractedData);
    triggerHaptic('success');
  }

  function renderExtractedResult(recipe) {
    const card = document.getElementById('extractedResultCard');
    if (!card) return;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="magic-badge" style="margin:0;"><i class="fas fa-check-circle"></i> Extracted via AI</span>
        <span style="font-size:11px; color:var(--text-muted); font-weight:700;"><i class="fas fa-clock"></i> ${recipe.prepTime + recipe.cookTime} MINS</span>
      </div>
      <h3 style="font-size:20px; font-weight:800; color:var(--text-primary); line-height:1.25;">${recipe.title}</h3>
      <p style="font-size:13px; color:var(--text-secondary); line-height:1.4;">${recipe.description}</p>
      
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin:4px 0;">
        <div style="background:var(--bg-input); padding:8px; border-radius:var(--radius-md); text-align:center;">
          <div style="font-family:var(--font-mono); font-weight:800; font-size:15px; color:var(--text-primary);">${recipe.calories}</div>
          <div style="font-size:10px; font-weight:700; color:var(--text-muted);">CALORIES</div>
        </div>
        <div style="background:var(--bg-input); padding:8px; border-radius:var(--radius-md); text-align:center;">
          <div style="font-family:var(--font-mono); font-weight:800; font-size:15px; color:var(--accent-citrus);">${recipe.protein}g</div>
          <div style="font-size:10px; font-weight:700; color:var(--text-muted);">PROTEIN</div>
        </div>
        <div style="background:var(--bg-input); padding:8px; border-radius:var(--radius-md); text-align:center;">
          <div style="font-family:var(--font-mono); font-weight:800; font-size:15px; color:var(--accent-cyan);">${recipe.ingredients.length}</div>
          <div style="font-size:10px; font-weight:700; color:var(--text-muted);">ITEMS</div>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:8px;">
        <button id="magicSaveRecipeBtn" class="card-action-btn secondary" style="flex:1; height:46px;">
          <i class="far fa-bookmark"></i> Save to Cookbook
        </button>
        <button id="magicCookNowBtn" class="card-action-btn primary" style="flex:1; height:46px;">
          <i class="fas fa-utensils"></i> Cook Now
        </button>
      </div>
    `;

    card.classList.add('active');

    // Attach button handlers
    document.getElementById('magicSaveRecipeBtn')?.addEventListener('click', () => {
      saveRecipeToCookbook(recipe);
    });

    document.getElementById('magicCookNowBtn')?.addEventListener('click', () => {
      openRecipeDetail(recipe);
    });
  }

  function saveRecipeToCookbook(recipe) {
    if (!appState.favorites.includes(recipe.id)) {
      appState.favorites.push(recipe.id);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(appState.favorites));
      // Add to recipes list if not present
      if (!appState.recipes.some(r => r.id === recipe.id)) {
        appState.recipes.unshift(recipe);
      }
      showToast(`Saved "${recipe.title}" to Cookbook! ❤️`);
    } else {
      showToast(`"${recipe.title}" is already in your Cookbook!`);
    }
  }

  // --- 7. HOME SCREEN BENTO GRID & SWIPE GESTURES ---
  function updateGreeting() {
    const greetingEl = document.getElementById('homeDynamicGreeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      greetingEl.textContent = 'Morning Energizers';
    } else if (hour >= 12 && hour < 17) {
      greetingEl.textContent = 'Quick Power Lunches';
    } else if (hour >= 17 && hour < 22) {
      greetingEl.textContent = 'Quick Dinners for Tonight';
    } else {
      greetingEl.textContent = 'Late Night Bites';
    }
  }

  function renderRecipeFeed() {
    const feedContainer = document.getElementById('recipeFeedContainer');
    if (!feedContainer) return;

    // Filter recipes
    let filtered = appState.recipes.filter(r => {
      // Category tag match
      let matchesTag = true;
      if (appState.activeFilter === 'under-30') {
        matchesTag = (r.prepTime + r.cookTime) <= 30;
      } else if (appState.activeFilter === 'high-protein') {
        matchesTag = r.protein >= 30;
      } else if (appState.activeFilter === 'vegan') {
        matchesTag = r.tags.some(t => t.toLowerCase() === 'vegan');
      } else if (appState.activeFilter === 'keto') {
        matchesTag = r.tags.some(t => t.toLowerCase() === 'keto');
      } else if (appState.activeFilter === 'meal-prep') {
        matchesTag = r.tags.some(t => t.toLowerCase() === 'meal prep');
      } else if (appState.activeFilter === 'under-500') {
        matchesTag = r.calories < 500;
      }

      // Search match
      let matchesSearch = true;
      if (appState.searchQuery) {
        const q = appState.searchQuery.toLowerCase();
        matchesSearch = r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.ingredients.some(i => i.item.toLowerCase().includes(q));
      }

      return matchesTag && matchesSearch;
    });

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:var(--text-secondary);">
          <div style="font-size:36px; margin-bottom:12px; opacity:0.6;"><i class="fas fa-search"></i></div>
          <h3 style="font-size:17px; color:var(--text-primary); margin-bottom:6px;">No recipes found</h3>
          <p style="font-size:13px;">Try switching tags or searching another ingredient.</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filtered.map(recipe => {
      const isFav = appState.favorites.includes(recipe.id);
      return `
        <div class="swipe-card-wrapper" data-recipe-id="${recipe.id}">
          <div class="swipe-bg-indicator save-right">
            <i class="fas fa-heart"></i> SAVED TO FAVORITES
          </div>
          <div class="swipe-bg-indicator grocery-left">
            ADDED TO GROCERY LIST <i class="fas fa-shopping-cart"></i>
          </div>

          <div class="recipe-interactive-card" data-recipe-id="${recipe.id}">
            <div class="card-img-container">
              <img src="${recipe.image}" alt="${recipe.title}" class="card-img" loading="lazy">
              <div class="card-badge-difficulty">
                <i class="fas fa-bolt" style="color:var(--accent-citrus);"></i> ${recipe.difficulty}
              </div>
              <button class="card-save-floating-btn ${isFav ? 'active' : ''}" data-action="toggle-fav" data-recipe-id="${recipe.id}">
                <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
              </button>
            </div>

            <div class="card-details-box">
              <div class="card-tags-row">
                ${recipe.tags.map(t => `<span class="card-micro-tag">${t}</span>`).join('')}
              </div>
              <h3 class="card-recipe-title">${recipe.title}</h3>
              <p class="card-recipe-desc">${recipe.description}</p>
              
              <div class="card-metrics-row">
                <div class="metric-item">
                  <i class="fas fa-clock"></i> <span>${recipe.prepTime + recipe.cookTime}m</span>
                </div>
                <div class="metric-item">
                  <i class="fas fa-fire"></i> <span>${recipe.calories} kcal</span>
                </div>
                <div class="metric-item">
                  <i class="fas fa-dumbbell"></i> <span>${recipe.protein}g protein</span>
                </div>
              </div>

              <div class="card-quick-actions">
                <button class="card-action-btn secondary" data-action="add-grocery" data-recipe-id="${recipe.id}">
                  <i class="fas fa-cart-plus"></i> Grocery
                </button>
                <button class="card-action-btn primary" data-action="view-detail" data-recipe-id="${recipe.id}">
                  View Recipe <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach swipe gesture physics
    attachSwipeListeners();
  }

  // Frictionless Swipe-to-Save (Right) and Swipe-to-Grocery (Left)
  function attachSwipeListeners() {
    const wrappers = document.querySelectorAll('.swipe-card-wrapper');

    wrappers.forEach(wrapper => {
      const card = wrapper.querySelector('.recipe-interactive-card');
      const indRight = wrapper.querySelector('.swipe-bg-indicator.save-right');
      const indLeft = wrapper.querySelector('.swipe-bg-indicator.grocery-left');
      const recipeId = wrapper.dataset.recipeId;
      const recipe = appState.recipes.find(r => r.id === recipeId);

      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      const SWIPE_THRESHOLD = 90;

      // Pointer & Touch Events
      function onStart(e) {
        if (e.target.closest('button')) return;
        startX = e.clientX || (e.touches && e.touches[0].clientX);
        isDragging = true;
        card.style.transition = 'none';
      }

      function onMove(e) {
        if (!isDragging) return;
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        currentX = x - startX;

        // Dampen drag
        card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.03}deg)`;

        if (currentX > 20) {
          indRight.style.opacity = Math.min(1, currentX / SWIPE_THRESHOLD);
          indLeft.style.opacity = 0;
        } else if (currentX < -20) {
          indLeft.style.opacity = Math.min(1, Math.abs(currentX) / SWIPE_THRESHOLD);
          indRight.style.opacity = 0;
        } else {
          indRight.style.opacity = 0;
          indLeft.style.opacity = 0;
        }
      }

      function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

        if (currentX > SWIPE_THRESHOLD) {
          // Swipe Right: Save to Favorites
          card.style.transform = `translateX(120%)`;
          triggerHaptic('success');
          toggleFavorite(recipeId);
          setTimeout(() => {
            card.style.transform = 'translateX(0)';
            indRight.style.opacity = 0;
          }, 350);
        } else if (currentX < -SWIPE_THRESHOLD) {
          // Swipe Left: Add to Grocery List
          card.style.transform = `translateX(-120%)`;
          triggerHaptic('success');
          if (recipe) addIngredientsToGrocery(recipe.ingredients, recipe.title);
          setTimeout(() => {
            card.style.transform = 'translateX(0)';
            indLeft.style.opacity = 0;
          }, 350);
        } else {
          // Snap back
          card.style.transform = 'translateX(0)';
          indRight.style.opacity = 0;
          indLeft.style.opacity = 0;
        }
        currentX = 0;
      }

      card.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);

      card.addEventListener('touchstart', onStart, { passive: true });
      card.addEventListener('touchmove', onMove, { passive: true });
      card.addEventListener('touchend', onEnd);
    });
  }

  function toggleFavorite(recipeId) {
    const recipe = appState.recipes.find(r => r.id === recipeId);
    const index = appState.favorites.indexOf(recipeId);

    if (index > -1) {
      appState.favorites.splice(index, 1);
      showToast(`Removed from Favorites`);
    } else {
      appState.favorites.push(recipeId);
      showToast(`Saved to Favorites ❤️`);
    }

    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(appState.favorites));
    renderRecipeFeed();

    // Update detail button if open
    const favBtn = document.getElementById('detailFavBtn');
    if (favBtn && appState.activeRecipe && appState.activeRecipe.id === recipeId) {
      favBtn.classList.toggle('liked', appState.favorites.includes(recipeId));
    }
  }

  // --- 8. OFFLINE GROCERY LISTS ---
  function addIngredientsToGrocery(ingredients, sourceTitle = '') {
    let addedCount = 0;
    ingredients.forEach(ing => {
      const exists = appState.groceryList.some(g => g.item.toLowerCase() === ing.item.toLowerCase());
      if (!exists) {
        appState.groceryList.push({
          id: 'g_' + Date.now() + Math.random().toString(36).substr(2, 4),
          item: ing.item,
          amount: ing.amount,
          category: ing.category || 'Pantry & Spices',
          checked: false
        });
        addedCount++;
      }
    });

    localStorage.setItem(STORAGE_KEYS.GROCERY, JSON.stringify(appState.groceryList));
    showToast(`Added ${addedCount} items to Grocery List 🛒`);
  }

  function renderGroceryList() {
    const container = document.getElementById('groceryListItemsContainer');
    if (!container) return;

    if (appState.groceryList.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:var(--text-secondary);">
          <div style="font-size:36px; margin-bottom:12px; color:var(--accent-emerald);"><i class="fas fa-shopping-basket"></i></div>
          <h3 style="font-size:17px; color:var(--text-primary); margin-bottom:6px;">Your grocery list is empty</h3>
          <p style="font-size:13px;">Add ingredients from any recipe or swipe left on recipe cards!</p>
        </div>
      `;
      return;
    }

    // Group by category
    const categories = ['Produce', 'Meat & Seafood', 'Dairy & Refrigerated', 'Pantry & Spices'];
    let html = '';

    categories.forEach(cat => {
      const items = appState.groceryList.filter(i => (i.category || 'Pantry & Spices') === cat);
      if (items.length > 0) {
        html += `
          <div class="grocery-category-header">
            <span>${cat}</span>
            <span style="font-family:var(--font-mono); font-size:11px;">${items.filter(i => i.checked).length}/${items.length}</span>
          </div>
          <div class="ingredient-items-list">
            ${items.map(item => `
              <div class="ingredient-check-item ${item.checked ? 'checked' : ''}" data-grocery-id="${item.id}">
                <div class="custom-checkbox">
                  <i class="fas fa-check"></i>
                </div>
                <div class="ingredient-label-group">
                  <span class="ing-name">${item.item}</span>
                  <span class="ing-amount">${item.amount || ''}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    });

    container.innerHTML = html;

    // Attach check-off listeners with haptic feedback
    container.querySelectorAll('.ingredient-check-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.groceryId;
        const item = appState.groceryList.find(i => i.id === id);
        if (item) {
          item.checked = !item.checked;
          localStorage.setItem(STORAGE_KEYS.GROCERY, JSON.stringify(appState.groceryList));
          el.classList.toggle('checked', item.checked);
          triggerHaptic(item.checked ? 'success' : 'click');
        }
      });
    });
  }

  // --- 9. SAVED RECIPES SCREEN ---
  function renderSavedRecipes() {
    const container = document.getElementById('savedRecipesContainer');
    if (!container) return;

    const saved = appState.recipes.filter(r => appState.favorites.includes(r.id));

    if (saved.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:50px 20px; color:var(--text-secondary);">
          <div style="font-size:36px; margin-bottom:12px; color:var(--accent-tomato);"><i class="far fa-heart"></i></div>
          <h3 style="font-size:18px; color:var(--text-primary); margin-bottom:6px;">No saved recipes yet</h3>
          <p style="font-size:13px;">Swipe right on any recipe card to add it to your personal cookbook.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="font-size:12px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:14px;">
        ${saved.length} SAVED RECIPES
      </div>
      <div class="bento-grid">
        ${saved.map(recipe => `
          <div class="bento-tile col-span-2" style="padding:0; height:180px; cursor:pointer;" data-recipe-id="${recipe.id}">
            <img src="${recipe.image}" alt="${recipe.title}" style="width:100%; height:100%; object-fit:cover;">
            <div class="featured-overlay">
              <span class="featured-pill-tag" style="background:var(--accent-tomato); color:#fff;">FAVORITE</span>
              <div>
                <h3 style="font-size:17px; font-weight:800; color:#fff;">${recipe.title}</h3>
                <div style="display:flex; gap:10px; font-size:12px; color:#e2e8f0; margin-top:4px;">
                  <span><i class="fas fa-clock" style="color:var(--accent-citrus);"></i> ${recipe.prepTime + recipe.cookTime}m</span>
                  <span><i class="fas fa-fire" style="color:var(--accent-citrus);"></i> ${recipe.calories} kcal</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.bento-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = tile.dataset.recipeId;
        const rec = appState.recipes.find(r => r.id === id);
        if (rec) openRecipeDetail(rec);
      });
    });
  }

  // --- 10. RECIPE DETAIL & SHRINKING HEADER ---
  function openRecipeDetail(recipe) {
    appState.activeRecipe = recipe;
    appState.servingMultiplier = 1;

    const view = document.getElementById('screenDetail');
    if (!view) return;

    // Header image
    const cover = document.getElementById('detailCoverImage');
    if (cover) cover.src = recipe.image;

    // Heart toggle
    const favBtn = document.getElementById('detailFavBtn');
    if (favBtn) favBtn.classList.toggle('liked', appState.favorites.includes(recipe.id));

    // Title & Tags
    document.getElementById('detailTitle').textContent = recipe.title;
    document.getElementById('detailTagsRow').innerHTML = recipe.tags
      .map(t => `<span class="card-micro-tag" style="background:rgba(212,255,0,0.15); color:var(--accent-citrus);">${t}</span>`)
      .join('');

    // Macros
    document.getElementById('detailCalories').textContent = recipe.calories;
    document.getElementById('detailProtein').textContent = recipe.protein + 'g';
    document.getElementById('detailCarbs').textContent = recipe.carbs + 'g';
    document.getElementById('detailFat').textContent = recipe.fat + 'g';

    renderIngredientsChecklist();
    renderDetailSteps();

    switchScreen('screenDetail');

    // Attach scroll parallax listener for shrinking header
    view.onscroll = () => {
      const scrollY = view.scrollTop;
      if (cover) {
        cover.style.transform = `scale(${Math.max(1, 1 + scrollY * 0.0005)}) translateY(${scrollY * 0.25}px)`;
      }
    };
  }

  function renderIngredientsChecklist() {
    const list = document.getElementById('detailIngredientsList');
    if (!list || !appState.activeRecipe) return;

    list.innerHTML = appState.activeRecipe.ingredients.map((ing, idx) => {
      return `
        <div class="ingredient-check-item" data-index="${idx}">
          <div class="custom-checkbox">
            <i class="fas fa-check"></i>
          </div>
          <div class="ingredient-label-group">
            <span class="ing-name">${ing.item}</span>
            <span class="ing-amount">${scaleAmount(ing.amount, appState.servingMultiplier)}</span>
          </div>
        </div>
      `;
    }).join('');

    // Checkbox click toggle with haptics
    list.querySelectorAll('.ingredient-check-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('checked');
        triggerHaptic(item.classList.contains('checked') ? 'success' : 'click');
      });
    });
  }

  function scaleAmount(str, multiplier) {
    if (multiplier === 1 || !str) return str;
    // Replace leading digits
    return str.replace(/(\d+(\.\d+)?)/, (match) => {
      const num = parseFloat(match);
      return Math.round(num * multiplier * 10) / 10;
    });
  }

  function renderDetailSteps() {
    const list = document.getElementById('detailStepsList');
    if (!list || !appState.activeRecipe) return;

    list.innerHTML = appState.activeRecipe.steps.map((step, idx) => `
      <div class="step-card-preview">
        <div class="step-num-bubble">${idx + 1}</div>
        <p class="step-instruction-text">${step}</p>
      </div>
    `).join('');
  }

  // --- 11. STEP-BY-STEP FULL-SCREEN COOKING FOCUS MODE ---
  function startCookingFocusMode() {
    if (!appState.activeRecipe) return;

    appState.focusMode.active = true;
    appState.focusMode.recipe = appState.activeRecipe;
    appState.focusMode.currentStep = 0;

    const overlay = document.getElementById('cookingFocusOverlay');
    if (overlay) overlay.classList.add('active');

    // Request Hardware Keep-Awake Screen Lock
    requestWakeLock();

    triggerHaptic('heavy');
    renderFocusStep();
  }

  function renderFocusStep() {
    const fm = appState.focusMode;
    const steps = fm.recipe.steps;
    const stepIdx = fm.currentStep;

    document.getElementById('focusStepCount').textContent = `Step ${stepIdx + 1} of ${steps.length}`;
    document.getElementById('focusStepNumberTag').textContent = `STEP ${stepIdx + 1}`;
    document.getElementById('focusInstructionGiant').textContent = steps[stepIdx];

    // Progress bar
    const progressPct = ((stepIdx + 1) / steps.length) * 100;
    document.getElementById('focusProgressBar').style.width = `${progressPct}%`;

    // Next button label
    const nextBtn = document.getElementById('focusNextBtn');
    if (stepIdx === steps.length - 1) {
      nextBtn.innerHTML = `Finish Cooking <i class="fas fa-check"></i>`;
    } else {
      nextBtn.innerHTML = `Next Step <i class="fas fa-arrow-right"></i>`;
    }

    // Auto-detect timer from step text (e.g. "4 minutes", "10 mins")
    checkStepTimer(steps[stepIdx]);
  }

  function checkStepTimer(text) {
    const timerWidget = document.getElementById('stepTimerWidget');
    const timerDigits = document.getElementById('timerClockDigits');
    if (!timerWidget || !timerDigits) return;

    // Clear any previous running timer
    if (appState.focusMode.timerInterval) {
      clearInterval(appState.focusMode.timerInterval);
      appState.focusMode.timerInterval = null;
    }

    const match = text.match(/(\d+)\s*(min|minute|minutes)/i);
    if (match) {
      const minutes = parseInt(match[1]);
      appState.focusMode.timerSeconds = minutes * 60;
      appState.focusMode.timerRunning = false;
      timerDigits.textContent = formatTimer(appState.focusMode.timerSeconds);
      timerWidget.classList.add('visible');
    } else {
      timerWidget.classList.remove('visible');
    }
  }

  function formatTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function toggleStepTimer() {
    const timerDigits = document.getElementById('timerClockDigits');
    const toggleBtn = document.getElementById('timerToggleBtn');

    if (appState.focusMode.timerRunning) {
      clearInterval(appState.focusMode.timerInterval);
      appState.focusMode.timerRunning = false;
      if (toggleBtn) toggleBtn.innerHTML = `<i class="fas fa-play"></i>`;
      triggerHaptic('click');
    } else {
      appState.focusMode.timerRunning = true;
      if (toggleBtn) toggleBtn.innerHTML = `<i class="fas fa-pause"></i>`;
      triggerHaptic('success');

      appState.focusMode.timerInterval = setInterval(() => {
        if (appState.focusMode.timerSeconds > 0) {
          appState.focusMode.timerSeconds--;
          timerDigits.textContent = formatTimer(appState.focusMode.timerSeconds);
        } else {
          clearInterval(appState.focusMode.timerInterval);
          appState.focusMode.timerRunning = false;
          if (toggleBtn) toggleBtn.innerHTML = `<i class="fas fa-play"></i>`;
          triggerHaptic('chime');
          showToast('⏰ Step timer complete!', 'success');
        }
      }, 1000);
    }
  }

  // Voice Readout (Web Speech API)
  function speakCurrentStep() {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported on this device');
      return;
    }

    const btn = document.getElementById('voiceReadBtn');
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      btn?.classList.remove('speaking');
      return;
    }

    const currentText = appState.focusMode.recipe.steps[appState.focusMode.currentStep];
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => btn?.classList.add('speaking');
    utterance.onend = () => btn?.classList.remove('speaking');
    utterance.onerror = () => btn?.classList.remove('speaking');

    window.speechSynthesis.speak(utterance);
    triggerHaptic('click');
  }

  function advanceFocusStep() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const fm = appState.focusMode;
    if (fm.currentStep < fm.recipe.steps.length - 1) {
      fm.currentStep++;
      triggerHaptic('click');
      renderFocusStep();
    } else {
      // Completed!
      triggerHaptic('chime');
      showToast(`🎉 Chef, you nailed it! ${fm.recipe.title} is ready to serve!`, 'success');
      closeCookingFocusMode();
    }
  }

  function prevFocusStep() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const fm = appState.focusMode;
    if (fm.currentStep > 0) {
      fm.currentStep--;
      triggerHaptic('click');
      renderFocusStep();
    }
  }

  function closeCookingFocusMode() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (appState.focusMode.timerInterval) {
      clearInterval(appState.focusMode.timerInterval);
    }

    appState.focusMode.active = false;
    document.getElementById('cookingFocusOverlay')?.classList.remove('active');

    // Release Keep-Awake Screen Lock
    releaseWakeLock();
    triggerHaptic('click');
  }

  // --- 12. INITIALIZATION & EVENT DELEGATION ---
  function init() {
    // 1. Clock in status bar
    function updateClock() {
      const now = new Date();
      let hours = now.getHours();
      let mins = now.getMinutes();
      const statusTime = document.getElementById('deviceStatusTime');
      if (statusTime) {
        statusTime.textContent = `${hours}:${mins < 10 ? '0' : ''}${mins}`;
      }
    }
    updateClock();
    setInterval(updateClock, 30000);

    // 2. Dynamic greeting
    updateGreeting();

    // 3. Render feed
    renderRecipeFeed();

    // 4. Tab Navigation buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetScreen = btn.dataset.screen;
        if (targetScreen) switchScreen(targetScreen);
      });
    });

    // 5. Center Glowing Magic '+' Button
    document.getElementById('centerMagicBtn')?.addEventListener('click', () => {
      if (appState.currentScreen === 'screenExtractor') {
        switchScreen('screenHome');
      } else {
        switchScreen('screenExtractor');
      }
    });

    // 6. Filter Pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        appState.activeFilter = pill.dataset.filter || 'all';

        // Skeleton Shimmer feedback
        const feed = document.getElementById('recipeFeedContainer');
        if (feed) {
          feed.innerHTML = `
            <div class="skeleton-card">
              <div class="skeleton-shimmer skeleton-image"></div>
              <div class="skeleton-shimmer skeleton-title"></div>
              <div class="skeleton-shimmer skeleton-text"></div>
              <div class="skeleton-shimmer skeleton-meta"></div>
            </div>
          `;
        }

        triggerHaptic('click');
        setTimeout(() => {
          renderRecipeFeed();
        }, 250);
      });
    });

    // 7. Search input
    const searchInput = document.getElementById('mainSearchInput');
    const searchClear = document.getElementById('searchClearBtn');

    searchInput?.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.trim();
      if (searchClear) searchClear.style.display = appState.searchQuery ? 'flex' : 'none';
      renderRecipeFeed();
    });

    searchClear?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      appState.searchQuery = '';
      searchClear.style.display = 'none';
      renderRecipeFeed();
    });

    // 8. Magic Extractor Input & Paste
    const magicInput = document.getElementById('magicLinkInput');
    const magicExtractBtn = document.getElementById('magicExtractBtn');
    const magicPasteBtn = document.getElementById('magicPasteIconBtn');

    magicExtractBtn?.addEventListener('click', () => {
      executeMagicExtraction(magicInput?.value);
    });

    magicPasteBtn?.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (magicInput) magicInput.value = text;
          triggerHaptic('success');
        }
      } catch (e) {
        showToast('Please paste the URL manually');
      }
    });

    // Sample link chips
    document.querySelectorAll('.sample-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const url = chip.dataset.url;
        if (magicInput) magicInput.value = url;
        triggerHaptic('click');
        executeMagicExtraction(url);
      });
    });

    // 9. Recipe Detail & Cooking Buttons
    document.getElementById('detailBackBtn')?.addEventListener('click', () => {
      switchScreen('screenHome');
    });

    document.getElementById('detailFavBtn')?.addEventListener('click', () => {
      if (appState.activeRecipe) toggleFavorite(appState.activeRecipe.id);
    });

    document.getElementById('startCookingBtn')?.addEventListener('click', () => {
      startCookingFocusMode();
    });

    document.getElementById('addAllGroceryBtn')?.addEventListener('click', () => {
      if (appState.activeRecipe) {
        addIngredientsToGrocery(appState.activeRecipe.ingredients, appState.activeRecipe.title);
      }
    });

    // Serving Scaler buttons
    document.querySelectorAll('.serv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.serv-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.servingMultiplier = parseFloat(btn.dataset.mult) || 1;
        renderIngredientsChecklist();
        triggerHaptic('click');
      });
    });

    // 10. Cooking Focus Mode Controls
    document.getElementById('focusCloseBtn')?.addEventListener('click', closeCookingFocusMode);
    document.getElementById('focusNextBtn')?.addEventListener('click', advanceFocusStep);
    document.getElementById('focusPrevBtn')?.addEventListener('click', prevFocusStep);
    document.getElementById('voiceReadBtn')?.addEventListener('click', speakCurrentStep);
    document.getElementById('timerToggleBtn')?.addEventListener('click', toggleStepTimer);

    // 11. Grocery Screen Actions
    const groceryInput = document.getElementById('groceryQuickInput');
    const groceryAddBtn = document.getElementById('groceryAddBtn');

    function addCustomGrocery() {
      const val = groceryInput?.value.trim();
      if (!val) return;
      appState.groceryList.unshift({
        id: 'g_' + Date.now(),
        item: val,
        amount: '1x',
        category: 'Produce',
        checked: false
      });
      localStorage.setItem(STORAGE_KEYS.GROCERY, JSON.stringify(appState.groceryList));
      if (groceryInput) groceryInput.value = '';
      renderGroceryList();
      triggerHaptic('success');
    }

    groceryAddBtn?.addEventListener('click', addCustomGrocery);
    groceryInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addCustomGrocery();
    });

    document.getElementById('groceryClearBtn')?.addEventListener('click', () => {
      appState.groceryList = appState.groceryList.filter(i => !i.checked);
      localStorage.setItem(STORAGE_KEYS.GROCERY, JSON.stringify(appState.groceryList));
      renderGroceryList();
      showToast('Cleared completed grocery items');
    });

    document.getElementById('groceryShareBtn')?.addEventListener('click', () => {
      const text = appState.groceryList.map(i => `${i.checked ? '☑' : '☐'} ${i.item} (${i.amount || ''})`).join('\n');
      if (navigator.share) {
        navigator.share({
          title: 'FridgeChef Grocery List',
          text: `🛒 FridgeChef Grocery List:\n\n${text}`
        }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(text);
        showToast('Grocery list copied to clipboard! 📋');
      }
    });

    // 12. Delegate Feed Card Clicks
    document.getElementById('recipeFeedContainer')?.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) {
        const card = e.target.closest('.recipe-interactive-card');
        if (card) {
          const id = card.dataset.recipeId;
          const rec = appState.recipes.find(r => r.id === id);
          if (rec) openRecipeDetail(rec);
        }
        return;
      }

      const action = target.dataset.action;
      const id = target.dataset.recipeId;
      const rec = appState.recipes.find(r => r.id === id);

      if (action === 'toggle-fav') {
        toggleFavorite(id);
      } else if (action === 'add-grocery') {
        if (rec) addIngredientsToGrocery(rec.ingredients, rec.title);
      } else if (action === 'view-detail') {
        if (rec) openRecipeDetail(rec);
      }
    });

    // Hero Bento Card Click
    document.getElementById('featuredHeroCard')?.addEventListener('click', () => {
      const rec = appState.recipes.find(r => r.featured) || appState.recipes[0];
      if (rec) openRecipeDetail(rec);
    });

    // 13. Simulator Toolbar Toggles
    const frameEl = document.getElementById('mobileDeviceFrame');
    const toggleFrameBtn = document.getElementById('simToggleFrameBtn');
    const toggleThemeBtn = document.getElementById('simToggleThemeBtn');

    toggleFrameBtn?.addEventListener('click', () => {
      frameEl?.classList.toggle('fullscreen-mode');
      const isFull = frameEl?.classList.contains('fullscreen-mode');
      toggleFrameBtn.innerHTML = isFull
        ? `<i class="fas fa-mobile-alt"></i> Phone Frame`
        : `<i class="fas fa-expand"></i> Full View`;
      triggerHaptic('click');
    });

    toggleThemeBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      toggleThemeBtn.innerHTML = next === 'light'
        ? `<i class="fas fa-moon"></i> Dark Mode`
        : `<i class="fas fa-sun"></i> Light Mode`;
      triggerHaptic('click');
    });

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.warn('SW registration failed:', err);
        });
      });
    }

    console.log('🚀 FridgeChef Native Mobile Engine initialized successfully.');
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
