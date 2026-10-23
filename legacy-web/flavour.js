// DOM Elements
const ingredient1Select = document.getElementById('ingredient1');
const ingredient2Select = document.getElementById('ingredient2');
const ingredient3Select = document.getElementById('ingredient3');
const cuisineTags = document.querySelectorAll('.cuisine-tag');
const combineFlavoursBtn = document.getElementById('combineFlavours');
const randomFlavoursBtn = document.getElementById('randomFlavours');
const selectedIngredientsDiv = document.getElementById('selectedIngredients');
const combinationCardsDiv = document.querySelector('.combination-cards');
const flavourOutputDiv = document.getElementById('flavourOutput');
const flavourWheelDiv = document.getElementById('flavourWheel');
const profileStatsDiv = document.getElementById('profileStats');
const intensityFill = document.getElementById('intensityFill');
const intensityLabel = document.getElementById('intensityLabel');
const spiceGridDiv = document.getElementById('spiceGrid');
const pairingCards = document.querySelectorAll('.pairing-card');
const recipeModal = document.getElementById('recipeModal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const saveRecipeBtn = document.getElementById('saveRecipeIdea');
const recipeTitle = document.getElementById('recipeTitle');
const recipeTime = document.getElementById('recipeTime');
const recipeCalories = document.getElementById('recipeCalories');
const recipeServings = document.getElementById('recipeServings');
const recipeIngredients = document.getElementById('recipeIngredients');
const recipeInstructions = document.getElementById('recipeInstructions');
const recipeTips = document.getElementById('recipeTips');
const recipeFlavourTags = document.getElementById('recipeFlavourTags');

// Flavour Database
const flavourDatabase = {
    ingredients: {
        chicken: {
            name: 'Chicken',
            category: 'protein',
            flavours: ['savory', 'umami'],
            intensity: 'medium',
            pairings: ['lemon', 'garlic', 'thyme', 'rosemary', 'paprika'],
            cuisines: ['mediterranean', 'american', 'asian']
        },
        salmon: {
            name: 'Salmon',
            category: 'protein',
            flavours: ['savory', 'umami', 'rich'],
            intensity: 'medium',
            pairings: ['dill', 'lemon', 'garlic', 'honey', 'soy'],
            cuisines: ['scandinavian', 'asian', 'mediterranean']
        },
        beef: {
            name: 'Beef',
            category: 'protein',
            flavours: ['savory', 'umami', 'rich'],
            intensity: 'high',
            pairings: ['garlic', 'thyme', 'red wine', 'mushroom', 'pepper'],
            cuisines: ['american', 'french', 'italian']
        },
        tofu: {
            name: 'Tofu',
            category: 'protein',
            flavours: ['neutral', 'savory'],
            intensity: 'low',
            pairings: ['ginger', 'garlic', 'soy', 'sesame', 'chili'],
            cuisines: ['asian', 'vegetarian', 'vegan']
        },
        eggs: {
            name: 'Eggs',
            category: 'protein',
            flavours: ['savory', 'rich'],
            intensity: 'medium',
            pairings: ['cheese', 'herbs', 'tomato', 'onion', 'pepper'],
            cuisines: ['french', 'american', 'mediterranean']
        },
        broccoli: {
            name: 'Broccoli',
            category: 'vegetable',
            flavours: ['bitter', 'savory'],
            intensity: 'medium',
            pairings: ['garlic', 'lemon', 'cheese', 'soy', 'ginger'],
            cuisines: ['asian', 'italian', 'american']
        },
        tomato: {
            name: 'Tomato',
            category: 'vegetable',
            flavours: ['sweet', 'sour', 'umami'],
            intensity: 'medium',
            pairings: ['basil', 'garlic', 'onion', 'oregano', 'cheese'],
            cuisines: ['italian', 'mediterranean', 'mexican']
        },
        potato: {
            name: 'Potato',
            category: 'vegetable',
            flavours: ['neutral', 'savory'],
            intensity: 'low',
            pairings: ['rosemary', 'garlic', 'thyme', 'cheese', 'dill'],
            cuisines: ['american', 'french', 'german']
        },
        spinach: {
            name: 'Spinach',
            category: 'vegetable',
            flavours: ['bitter', 'savory'],
            intensity: 'low',
            pairings: ['garlic', 'lemon', 'nutmeg', 'cream', 'cheese'],
            cuisines: ['french', 'italian', 'indian']
        },
        mushroom: {
            name: 'Mushroom',
            category: 'vegetable',
            flavours: ['umami', 'earthy', 'savory'],
            intensity: 'medium',
            pairings: ['garlic', 'thyme', 'wine', 'cream', 'butter'],
            cuisines: ['french', 'italian', 'asian']
        },
        garlic: {
            name: 'Garlic',
            category: 'aromatic',
            flavours: ['savory', 'pungent', 'aromatic'],
            intensity: 'high',
            pairings: ['onion', 'ginger', 'herbs', 'lemon', 'butter'],
            cuisines: ['all']
        },
        ginger: {
            name: 'Ginger',
            category: 'aromatic',
            flavours: ['spicy', 'sweet', 'aromatic'],
            intensity: 'high',
            pairings: ['garlic', 'soy', 'honey', 'lime', 'chili'],
            cuisines: ['asian', 'indian', 'middle eastern']
        },
        lemon: {
            name: 'Lemon',
            category: 'citrus',
            flavours: ['sour', 'bright', 'fresh'],
            intensity: 'high',
            pairings: ['herbs', 'garlic', 'honey', 'butter', 'seafood'],
            cuisines: ['mediterranean', 'middle eastern', 'american']
        },
        cheese: {
            name: 'Cheese',
            category: 'dairy',
            flavours: ['savory', 'umami', 'rich'],
            intensity: 'medium',
            pairings: ['tomato', 'herbs', 'wine', 'fruit', 'nuts'],
            cuisines: ['italian', 'french', 'american']
        },
        cream: {
            name: 'Cream',
            category: 'dairy',
            flavours: ['rich', 'neutral', 'sweet'],
            intensity: 'low',
            pairings: ['herbs', 'garlic', 'mushroom', 'wine', 'vanilla'],
            cuisines: ['french', 'italian', 'american']
        }
    },
    
    combinations: {
        'chicken,lemon,thyme': {
            name: 'Mediterranean Chicken',
            cuisine: 'mediterranean',
            match: 'high',
            description: 'A classic combination that brings bright citrus notes balanced with earthy herbs.',
            profile: { savory: 80, sweet: 20, sour: 70, bitter: 10, umami: 60 },
            spices: ['Thyme', 'Rosemary', 'Oregano', 'Paprika', 'Garlic Powder'],
            recipe: {
                title: 'Lemon Herb Roasted Chicken',
                time: '60 mins',
                calories: '450 cal',
                servings: '4',
                ingredients: [
                    '4 chicken breasts',
                    '2 lemons',
                    'Fresh thyme sprigs',
                    '4 garlic cloves',
                    '2 tbsp olive oil',
                    'Salt and pepper'
                ],
                instructions: [
                    'Preheat oven to 400°F (200°C).',
                    'Rub chicken with olive oil, salt, and pepper.',
                    'Place chicken in baking dish with lemon slices and thyme.',
                    'Roast for 45-50 minutes until golden brown.',
                    'Serve with roasted vegetables.'
                ],
                tips: 'Marinate chicken for 2 hours for deeper flavor.',
                flavours: ['Citrusy', 'Herbal', 'Savory', 'Light']
            }
        },
        'beef,garlic,mushroom': {
            name: 'Beef & Mushroom Saute',
            cuisine: 'french',
            match: 'high',
            description: 'Rich umami flavors with earthy mushrooms and aromatic garlic.',
            profile: { savory: 90, sweet: 10, sour: 20, bitter: 30, umami: 95 },
            spices: ['Thyme', 'Black Pepper', 'Bay Leaf', 'Parsley', 'Red Wine'],
            recipe: {
                title: 'Garlic Mushroom Beef Stew',
                time: '90 mins',
                calories: '520 cal',
                servings: '4',
                ingredients: [
                    '1.5 lbs beef stew meat',
                    '1 lb mushrooms',
                    '6 garlic cloves',
                    '1 onion',
                    '2 cups beef broth',
                    '2 tbsp flour'
                ],
                instructions: [
                    'Brown beef in a large pot.',
                    'Add chopped garlic and mushrooms, cook for 5 mins.',
                    'Sprinkle flour and cook for 1 minute.',
                    'Add beef broth and simmer for 1 hour.',
                    'Season with herbs and serve.'
                ],
                tips: 'Use a dry red wine for deglazing for extra flavor.',
                flavours: ['Umami', 'Earthy', 'Savory', 'Rich']
            }
        },
        'salmon,dill,lemon': {
            name: 'Scandinavian Salmon',
            cuisine: 'scandinavian',
            match: 'high',
            description: 'Fresh dill and bright lemon complement the rich salmon perfectly.',
            profile: { savory: 70, sweet: 15, sour: 75, bitter: 20, umami: 65 },
            spices: ['Dill', 'Lemon Zest', 'Black Pepper', 'Mustard', 'Honey'],
            recipe: {
                title: 'Dill & Lemon Baked Salmon',
                time: '25 mins',
                calories: '380 cal',
                servings: '2',
                ingredients: [
                    '2 salmon fillets',
                    'Fresh dill bunch',
                    '1 lemon',
                    '2 tbsp olive oil',
                    'Salt and pepper',
                    'Honey (optional)'
                ],
                instructions: [
                    'Preheat oven to 375°F (190°C).',
                    'Place salmon on baking sheet.',
                    'Top with dill and lemon slices.',
                    'Drizzle with olive oil and honey.',
                    'Bake for 15-18 minutes.'
                ],
                tips: 'Add a touch of honey for caramelization.',
                flavours: ['Fresh', 'Herbal', 'Citrusy', 'Light']
            }
        },
        'tofu,ginger,soy': {
            name: 'Asian Tofu Stir-fry',
            cuisine: 'asian',
            match: 'high',
            description: 'Ginger and soy create a perfect umami base for tofu.',
            profile: { savory: 85, sweet: 40, sour: 30, bitter: 20, umami: 90 },
            spices: ['Ginger', 'Garlic', 'Soy Sauce', 'Sesame', 'Chili'],
            recipe: {
                title: 'Ginger Soy Tofu Stir-fry',
                time: '30 mins',
                calories: '320 cal',
                servings: '2',
                ingredients: [
                    '1 block firm tofu',
                    '2 tbsp fresh ginger',
                    '3 tbsp soy sauce',
                    '2 garlic cloves',
                    '1 bell pepper',
                    '1 tbsp sesame oil'
                ],
                instructions: [
                    'Press tofu for 15 minutes, then cube.',
                    'Stir-fry tofu until golden.',
                    'Add ginger and garlic, cook for 1 min.',
                    'Add vegetables and soy sauce.',
                    'Cook for 5-7 minutes until tender.'
                ],
                tips: 'Press tofu well for better texture.',
                flavours: ['Umami', 'Spicy', 'Savory', 'Aromatic']
            }
        }
    },
    
    spices: [
        { name: 'Thyme', type: 'Herb', flavour: 'Earthy, Minty', icon: 'fas fa-leaf' },
        { name: 'Rosemary', type: 'Herb', flavour: 'Pine-like, Peppery', icon: 'fas fa-tree' },
        { name: 'Paprika', type: 'Spice', flavour: 'Sweet, Smoky', icon: 'fas fa-pepper-hot' },
        { name: 'Cumin', type: 'Spice', flavour: 'Earthy, Nutty', icon: 'fas fa-seedling' },
        { name: 'Coriander', type: 'Spice', flavour: 'Citrusy, Nutty', icon: 'fas fa-circle' },
        { name: 'Turmeric', type: 'Spice', flavour: 'Earthy, Bitter', icon: 'fas fa-root' },
        { name: 'Cinnamon', type: 'Spice', flavour: 'Sweet, Woody', icon: 'fas fa-stick' },
        { name: 'Nutmeg', type: 'Spice', flavour: 'Sweet, Nutty', icon: 'fas fa-circle-nodes' },
        { name: 'Basil', type: 'Herb', flavour: 'Sweet, Peppery', icon: 'fas fa-leaf' },
        { name: 'Oregano', type: 'Herb', flavour: 'Pungent, Bitter', icon: 'fas fa-leaf' },
        { name: 'Dill', type: 'Herb', flavour: 'Fresh, Anise-like', icon: 'fas fa-feather' },
        { name: 'Ginger', type: 'Root', flavour: 'Spicy, Sweet', icon: 'fas fa-root' }
    ]
};

// Current State
let selectedIngredients = [];
let currentCuisine = 'all';
let savedRecipes = JSON.parse(localStorage.getItem('fridgePlannerFlavourRecipes')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadSpiceRecommendations();
});

// Setup Event Listeners
function setupEventListeners() {
    // Combine flavours button
    if (combineFlavoursBtn) {
        combineFlavoursBtn.addEventListener('click', combineFlavours);
    }
    
    // Random flavours button
    if (randomFlavoursBtn) {
        randomFlavoursBtn.addEventListener('click', generateRandomCombination);
    }
    
    // Cuisine tags
    cuisineTags.forEach(tag => {
        tag.addEventListener('click', () => {
            cuisineTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentCuisine = tag.dataset.cuisine;
            if (selectedIngredients.length > 0) {
                combineFlavours();
            }
        });
    });
    
    // Popular pairing cards
    pairingCards.forEach(card => {
        card.addEventListener('click', () => {
            const ingredients = card.dataset.ingredients.split(',');
            ingredient1Select.value = ingredients[0];
            ingredient2Select.value = ingredients[1];
            ingredient3Select.value = ingredients[2] || '';
            combineFlavours();
        });
    });
    
    // Modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeRecipeModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeRecipeModal);
    }
    
    if (saveRecipeBtn) {
        saveRecipeBtn.addEventListener('click', saveRecipeIdea);
    }
}

// Combine flavours
function combineFlavours() {
    const ing1 = ingredient1Select.value;
    const ing2 = ingredient2Select.value;
    const ing3 = ingredient3Select.value;
    
    selectedIngredients = [ing1, ing2, ing3].filter(ing => ing);
    
    if (selectedIngredients.length < 2) {
        showNotification('Please select at least 2 ingredients!', 'error');
        return;
    }
    
    // Display selected ingredients
    displaySelectedIngredients();
    
    // Find combinations
    const combinations = findCombinations(selectedIngredients);
    
    if (combinations.length === 0) {
        showNotification('No flavour combinations found. Try different ingredients!', 'error');
        return;
    }
    
    // Display combinations
    displayCombinations(combinations);
    
    // Update flavour profile
    updateFlavourProfile(selectedIngredients);
    
    // Show results
    flavourOutputDiv.style.display = 'block';
    flavourOutputDiv.scrollIntoView({ behavior: 'smooth' });
    
    showNotification(`Found ${combinations.length} flavour combinations!`, 'success');
}

// Display selected ingredients
function displaySelectedIngredients() {
    selectedIngredientsDiv.innerHTML = '';
    
    selectedIngredients.forEach(ing => {
        const ingData = flavourDatabase.ingredients[ing];
        if (ingData) {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.className = 'selected-ingredient';
            ingredientDiv.innerHTML = `
                ${ingData.name}
                <i class="fas fa-times remove-ingredient" data-ingredient="${ing}"></i>
            `;
            selectedIngredientsDiv.appendChild(ingredientDiv);
            
            // Add event listener to remove button
            ingredientDiv.querySelector('.remove-ingredient').addEventListener('click', (e) => {
                const ingredientToRemove = e.target.dataset.ingredient;
                removeIngredient(ingredientToRemove);
            });
        }
    });
}

// Remove ingredient
function removeIngredient(ingredient) {
    // Clear the corresponding select
    if (ingredient1Select.value === ingredient) {
        ingredient1Select.value = '';
    } else if (ingredient2Select.value === ingredient) {
        ingredient2Select.value = '';
    } else if (ingredient3Select.value === ingredient) {
        ingredient3Select.value = '';
    }
    
    // Re-run combination
    combineFlavours();
}

// Find combinations
function findCombinations(ingredients) {
    const combinations = [];
    const ingredientKeys = ingredients.sort().join(',');
    
    // Check exact match
    if (flavourDatabase.combinations[ingredientKeys]) {
        combinations.push({
            ...flavourDatabase.combinations[ingredientKeys],
            key: ingredientKeys,
            isExact: true
        });
    }
    
    // Check partial matches (any 2 of the selected)
    if (ingredients.length >= 2) {
        for (const [key, combo] of Object.entries(flavourDatabase.combinations)) {
            const comboIngredients = key.split(',');
            const matchCount = comboIngredients.filter(ci => ingredients.includes(ci)).length;
            
            if (matchCount >= 2 && key !== ingredientKeys) {
                combinations.push({
                    ...combo,
                    key,
                    isExact: false,
                    matchCount
                });
            }
        }
    }
    
    // Sort by exact match first, then match count
    combinations.sort((a, b) => {
        if (a.isExact && !b.isExact) return -1;
        if (!a.isExact && b.isExact) return 1;
        if (a.matchCount && b.matchCount) {
            return b.matchCount - a.matchCount;
        }
        return 0;
    });
    
    // Filter by cuisine if not "all"
    if (currentCuisine !== 'all') {
        return combinations.filter(combo => 
            combo.cuisine.toLowerCase() === currentCuisine.toLowerCase()
        );
    }
    
    return combinations.slice(0, 6); // Return top 6 combinations
}

// Display combinations
function displayCombinations(combinations) {
    combinationCardsDiv.innerHTML = '';
    
    combinations.forEach((combo, index) => {
        const isFeatured = index === 0; // First one is featured
        
        const card = document.createElement('div');
        card.className = `combination-card ${isFeatured ? 'featured' : ''}`;
        card.innerHTML = `
            <div class="card-header">
                <h4>${combo.name}</h4>
                <span class="match-score ${combo.match}">${combo.match === 'high' ? '95%' : '75%'} Match</span>
            </div>
            
            <span class="card-cuisine">${combo.cuisine}</span>
            
            <div class="flavour-profile">
                <span class="profile-title">Flavour Profile</span>
                <div class="profile-bars">
                    ${Object.entries(combo.profile).map(([flavour, value]) => `
                        <div class="profile-bar">
                            <div class="bar-fill ${flavour}" style="width: ${value}%"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <p class="card-description">${combo.description}</p>
            
            <div class="recommended-spices">
                <span class="spices-title">Recommended Spices & Herbs</span>
                <div class="spice-tags">
                    ${combo.spices.slice(0, 3).map(spice => `
                        <span class="spice-tag">${spice}</span>
                    `).join('')}
                    ${combo.spices.length > 3 ? 
                        `<span class="spice-tag">+${combo.spices.length - 3}</span>` : ''}
                </div>
            </div>
            
            <div class="card-actions">
                <button class="btn-small view-recipe" data-key="${combo.key}">
                    <i class="fas fa-utensils"></i> Recipe Idea
                </button>
                <button class="btn-small save-combination" data-combo='${JSON.stringify(combo).replace(/'/g, "&#39;")}'>
                    <i class="far fa-bookmark"></i> Save
                </button>
            </div>
        `;
        
        combinationCardsDiv.appendChild(card);
        
        // Add event listeners
        const viewRecipeBtn = card.querySelector('.view-recipe');
        const saveComboBtn = card.querySelector('.save-combination');
        
        if (viewRecipeBtn) {
            viewRecipeBtn.addEventListener('click', () => openRecipeModal(combo));
        }
        
        if (saveComboBtn) {
            saveComboBtn.addEventListener('click', () => saveCombination(combo));
        }
    });
}

// Update flavour profile
function updateFlavourProfile(ingredients) {
    // Calculate average flavour profile
    const profiles = ingredients.map(ing => {
        const ingData = flavourDatabase.ingredients[ing];
        return ingData ? {
            savory: ingData.flavours.includes('savory') ? 70 : 20,
            sweet: ingData.flavours.includes('sweet') ? 70 : 20,
            sour: ingData.flavours.includes('sour') ? 70 : 20,
            bitter: ingData.flavours.includes('bitter') ? 70 : 20,
            umami: ingData.flavours.includes('umami') ? 70 : 20
        } : { savory: 0, sweet: 0, sour: 0, bitter: 0, umami: 0 };
    });
    
    const avgProfile = {
        savory: Math.round(profiles.reduce((sum, p) => sum + p.savory, 0) / profiles.length),
        sweet: Math.round(profiles.reduce((sum, p) => sum + p.sweet, 0) / profiles.length),
        sour: Math.round(profiles.reduce((sum, p) => sum + p.sour, 0) / profiles.length),
        bitter: Math.round(profiles.reduce((sum, p) => sum + p.bitter, 0) / profiles.length),
        umami: Math.round(profiles.reduce((sum, p) => sum + p.umami, 0) / profiles.length)
    };
    
    // Update profile stats
    profileStatsDiv.innerHTML = '';
    Object.entries(avgProfile).forEach(([flavour, value]) => {
        const statDiv = document.createElement('div');
        statDiv.className = 'profile-stat';
        statDiv.innerHTML = `
            <span class="stat-label">${flavour.charAt(0).toUpperCase() + flavour.slice(1)}</span>
            <span class="stat-value">${value}%</span>
        `;
        profileStatsDiv.appendChild(statDiv);
    });
    
    // Update intensity
    const avgIntensity = ingredients.reduce((sum, ing) => {
        const ingData = flavourDatabase.ingredients[ing];
        return sum + (ingData ? (ingData.intensity === 'high' ? 80 : ingData.intensity === 'medium' ? 50 : 20) : 0);
    }, 0) / ingredients.length;
    
    intensityFill.style.width = `${avgIntensity}%`;
    
    if (avgIntensity > 66) {
        intensityLabel.textContent = 'Strong';
    } else if (avgIntensity > 33) {
        intensityLabel.textContent = 'Medium';
    } else {
        intensityLabel.textContent = 'Mild';
    }
    
    // Create flavour wheel visualization
    createFlavourWheel(avgProfile);
}

// Create flavour wheel