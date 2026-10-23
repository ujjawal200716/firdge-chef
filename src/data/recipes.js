export const INITIAL_RECIPES = [
  {
    id: 'r1',
    title: 'Honey Soy Glazed Salmon Bowl',
    description: 'Pan-seared glazed salmon over fluffy jasmine rice with sliced avocado, steamed edamame, and pickled cucumber ribbons.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
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
      'Heat a non-stick skillet over medium-high heat with olive oil. Sear salmon skin-side down for 4 minutes.',
      'Flip the salmon, pour in the honey soy glaze, and simmer for 3 minutes until caramelized and cooked through.',
      'Assemble bowls: base of warm rice, glazed salmon, avocado slices, edamame, and cucumber ribbons. Drizzle remaining pan glaze and enjoy!'
    ]
  },
  {
    id: 'r2',
    title: '15-Min Chili Crisp Garlic Noodles',
    description: 'Chewy noodles tossed in a sizzling garlic, scallion, and chili oil emulsion, crowned with a jammy ramen egg.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
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
      'Bring a pot of salted water to boil. Cook noodles and baby bok choy for 4 minutes until al dente. Drain and reserve 2 tbsp pasta water.',
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
      'Heat an oven-safe skillet over medium-high heat with olive oil. Place chicken skin-side down and sear undisturbed for 8 minutes until skin is deeply golden and crackling.',
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
    tags: ['Under 30 Mins', 'Comfort Food', 'Vegan'],
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
      'Cook fettuccine in heavily salted water until al dente. Reserve 1/2 cup pasta water.',
      'Melt butter in a large skillet over high heat. Add sliced mushrooms and cook without moving for 3 minutes until caramelized.',
      'Add minced garlic and sauté for 1 minute until fragrant.',
      'Pour in heavy cream and 1/4 cup reserved pasta water. Simmer gently for 2 minutes to thicken.',
      'Toss in cooked pasta and freshly grated parmesan, tossing continuously until a glossy sauce clings to the noodles.',
      'Remove from heat, drizzle with white truffle oil, and garnish with fresh parsley and flaky sea salt.'
    ]
  },
  {
    id: 'r5',
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
