// DOM Elements
const ingredientSearch = document.getElementById('ingredientSearch');
const searchAlternativeBtn = document.getElementById('searchAlternativeBtn');
const exampleTags = document.querySelectorAll('.example-tag');
const alternativeResults = document.getElementById('alternativeResults');
const alternativeDetails = document.getElementById('alternativeDetails');
const currentIngredient = document.getElementById('currentIngredient');
const ingredientCategory = document.getElementById('ingredientCategory');
const ingredientDiet = document.getElementById('ingredientDiet');
const alternativeGrid = document.getElementById('alternativeGrid');
const tipsContent = document.getElementById('tipsContent');
const nutritionComparison = document.getElementById('nutritionComparison');
const popularCards = document.querySelectorAll('.popular-card');
const filterButtons = document.querySelectorAll('.filter-btn');
const alternativeModal = document.getElementById('alternativeModal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalSave = document.getElementById('modalSave');
const modalIngredientName = document.getElementById('modalIngredientName');
const modalIngredientTags = document.getElementById('modalIngredientTags');
const alternativeHighlight = document.getElementById('alternativeHighlight');
const substitutionRatio = document.getElementById('substitutionRatio');
const bestForTags = document.getElementById('bestForTags');
const modalNotes = document.getElementById('modalNotes');

// Ingredient Database
const ingredientDatabase = {
    'eggs': {
        name: 'Eggs',
        category: 'Dairy & Eggs',
        diet: 'Vegetarian',
        alternatives: [
            {
                name: 'Applesauce',
                match: 'high',
                tags: ['Vegan', 'Low Calorie', 'Baking'],
                description: 'Great for baking, adds moisture and natural sweetness.',
                ratio: '¼ cup per egg',
                bestFor: ['Cakes', 'Muffins', 'Quick Breads'],
                nutrition: { calories: 90, protein: 0.5, carbs: 24, fat: 0.3 }
            },
            {
                name: 'Banana',
                match: 'high',
                tags: ['Vegan', 'Natural', 'Baking'],
                description: 'Mashed banana works well in sweet baked goods.',
                ratio: '½ mashed banana per egg',
                bestFor: ['Pancakes', 'Brownies', 'Cakes'],
                nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 }
            },
            {
                name: 'Chia Seeds',
                match: 'medium',
                tags: ['Vegan', 'Gluten-Free', 'Healthy'],
                description: 'Chia gel works as a binder in recipes.',
                ratio: '1 tbsp chia + 3 tbsp water per egg',
                bestFor: ['Vegan Baking', 'Binding'],
                nutrition: { calories: 486, protein: 16, carbs: 42, fat: 31 }
            },
            {
                name: 'Silken Tofu',
                match: 'medium',
                tags: ['Vegan', 'High Protein', 'Savory'],
                description: 'Perfect for quiches, scrambles, and creamy dishes.',
                ratio: '¼ cup blended tofu per egg',
                bestFor: ['Quiches', 'Scrambles', 'Creamy Sauces'],
                nutrition: { calories: 62, protein: 7, carbs: 2, fat: 4 }
            },
            {
                name: 'Yogurt',
                match: 'low',
                tags: ['Vegetarian', 'Probiotic', 'Moist'],
                description: 'Adds moisture and tang to baked goods.',
                ratio: '¼ cup per egg',
                bestFor: ['Cakes', 'Muffins'],
                nutrition: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }
            }
        ],
        tips: [
            {
                title: 'For Binding',
                content: 'Use chia seeds or flax seeds for binding in burgers or meatballs.'
            },
            {
                title: 'For Leavening',
                content: 'Combine vinegar and baking soda for leavening in cakes.'
            },
            {
                title: 'For Color',
                content: 'Add turmeric to tofu scramble for egg-like yellow color.'
            }
        ],
        nutrition: { calories: 155, protein: 13, carbs: 1.1, fat: 11 }
    },
    'milk': {
        name: 'Milk',
        category: 'Dairy',
        diet: 'Vegetarian',
        alternatives: [
            {
                name: 'Almond Milk',
                match: 'high',
                tags: ['Vegan', 'Low Calorie', 'Nutty'],
                description: 'Light, nutty flavor, works in most recipes.',
                ratio: '1:1 ratio',
                bestFor: ['Cereal', 'Smoothies', 'Baking'],
                nutrition: { calories: 17, protein: 0.6, carbs: 0.6, fat: 1.5 }
            },
            {
                name: 'Oat Milk',
                match: 'high',
                tags: ['Vegan', 'Creamy', 'Sustainable'],
                description: 'Naturally sweet and creamy, great for coffee.',
                ratio: '1:1 ratio',
                bestFor: ['Coffee', 'Baking', 'Soups'],
                nutrition: { calories: 50, protein: 1, carbs: 9, fat: 2.5 }
            },
            {
                name: 'Soy Milk',
                match: 'high',
                tags: ['Vegan', 'High Protein', 'Versatile'],
                description: 'Highest protein content among plant milks.',
                ratio: '1:1 ratio',
                bestFor: ['Cooking', 'Baking', 'Protein Drinks'],
                nutrition: { calories: 80, protein: 7, carbs: 4, fat: 4 }
            },
            {
                name: 'Coconut Milk',
                match: 'medium',
                tags: ['Vegan', 'Creamy', 'Tropical'],
                description: 'Rich and creamy, adds tropical flavor.',
                ratio: '1:1 ratio (dilute for drinking)',
                bestFor: ['Curries', 'Desserts', 'Smoothies'],
                nutrition: { calories: 230, protein: 2, carbs: 6, fat: 24 }
            }
        ],
        tips: [
            {
                title: 'For Creaminess',
                content: 'Use cashew milk for the creamiest texture in sauces.'
            },
            {
                title: 'For Neutral Taste',
                content: 'Rice milk has the most neutral flavor profile.'
            },
            {
                title: 'For Foaming',
                content: 'Oat milk and soy milk foam best for lattes.'
            }
        ],
        nutrition: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 }
    },
    'flour': {
        name: 'Wheat Flour',
        category: 'Grains',
        diet: 'Vegetarian',
        alternatives: [
            {
                name: 'Almond Flour',
                match: 'high',
                tags: ['Gluten-Free', 'Low Carb', 'Nutty'],
                description: 'Nutty flavor, great for low-carb baking.',
                ratio: '1:1 ratio (may need extra egg)',
                bestFor: ['Cookies', 'Cakes', 'Breading'],
                nutrition: { calories: 579, protein: 21, carbs: 22, fat: 50 }
            },
            {
                name: 'Coconut Flour',
                match: 'medium',
                tags: ['Gluten-Free', 'High Fiber', 'Sweet'],
                description: 'Highly absorbent, adds natural sweetness.',
                ratio: '¼ cup per 1 cup wheat flour',
                bestFor: ['Muffins', 'Pancakes', 'Dense Bakes'],
                nutrition: { calories: 400, protein: 16, carbs: 60, fat: 13 }
            },
            {
                name: 'Oat Flour',
                match: 'high',
                tags: ['Gluten-Free', 'Whole Grain', 'Mild'],
                description: 'Mild flavor, great for healthy baking.',
                ratio: '1⅓ cup per 1 cup wheat flour',
                bestFor: ['Cookies', 'Muffins', 'Bread'],
                nutrition: { calories: 404, protein: 15, carbs: 65, fat: 9 }
            },
            {
                name: 'Rice Flour',
                match: 'medium',
                tags: ['Gluten-Free', 'Neutral', 'Versatile'],
                description: 'Neutral flavor, good for all-purpose use.',
                ratio: '1:1 ratio',
                bestFor: ['Thickening', 'Baking', 'Coating'],
                nutrition: { calories: 366, protein: 6, carbs: 80, fat: 1.4 }
            }
        ],
        tips: [
            {
                title: 'For Structure',
                content: 'Add xanthan gum when using gluten-free flours for better structure.'
            },
            {
                title: 'For Rising',
                content: 'Increase baking powder when using dense flours.'
            },
            {
                title: 'For Blending',
                content: 'Combine multiple gluten-free flours for best results.'
            }
        ],
        nutrition: { calories: 364, protein: 10, carbs: 76, fat: 1 }
    },
    'butter': {
        name: 'Butter',
        category: 'Dairy',
        diet: 'Vegetarian',
        alternatives: [
            {
                name: 'Coconut Oil',
                match: 'high',
                tags: ['Vegan', 'Dairy-Free', 'Tropical'],
                description: 'Solid at room temperature, great for baking.',
                ratio: '1:1 ratio',
                bestFor: ['Baking', 'Sauteing', 'Spreads'],
                nutrition: { calories: 862, protein: 0, carbs: 0, fat: 100 }
            },
            {
                name: 'Avocado',
                match: 'medium',
                tags: ['Vegan', 'Healthy Fats', 'Creamy'],
                description: 'Mashed avocado adds creaminess and healthy fats.',
                ratio: '1:1 ratio',
                bestFor: ['Brownies', 'Quick Breads', 'Spreads'],
                nutrition: { calories: 160, protein: 2, carbs: 9, fat: 15 }
            },
            {
                name: 'Olive Oil',
                match: 'medium',
                tags: ['Vegan', 'Heart Healthy', 'Savory'],
                description: 'Best for savory dishes, adds fruity flavor.',
                ratio: '¾ cup per 1 cup butter',
                bestFor: ['Sauteing', 'Roasting', 'Salad Dressings'],
                nutrition: { calories: 884, protein: 0, carbs: 0, fat: 100 }
            },
            {
                name: 'Greek Yogurt',
                match: 'low',
                tags: ['Vegetarian', 'High Protein', 'Tangy'],
                description: 'Adds moisture and protein while reducing fat.',
                ratio: '½ cup per 1 cup butter',
                bestFor: ['Cakes', 'Muffins', 'Frostings'],
                nutrition: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }
            }
        ],
        tips: [
            {
                title: 'For Flakiness',
                content: 'Use cold coconut oil for flaky pie crusts.'
            },
            {
                title: 'For Browning',
                content: 'Add a pinch of salt when using oil for better browning.'
            },
            {
                title: 'For Flavor',
                content: 'Use cultured vegan butter for best buttery flavor.'
            }
        ],
        nutrition: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 }
    },
    'sugar': {
        name: 'Sugar',
        category: 'Sweeteners',
        diet: 'Vegan',
        alternatives: [
            {
                name: 'Honey',
                match: 'high',
                tags: ['Natural', 'Antioxidants', 'Liquid'],
                description: 'Natural sweetener with health benefits.',
                ratio: '¾ cup per 1 cup sugar (reduce liquid)',
                bestFor: ['Tea', 'Baking', 'Glazes'],
                nutrition: { calories: 304, protein: 0.3, carbs: 82, fat: 0 }
            },
            {
                name: 'Maple Syrup',
                match: 'high',
                tags: ['Natural', 'Mineral-rich', 'Liquid'],
                description: 'Rich flavor with minerals like manganese.',
                ratio: '¾ cup per 1 cup sugar (reduce liquid)',
                bestFor: ['Pancakes', 'Baking', 'Marinades'],
                nutrition: { calories: 260, protein: 0, carbs: 67, fat: 0.1 }
            },
            {
                name: 'Stevia',
                match: 'medium',
                tags: ['Zero Calorie', 'Plant-based', 'Sweet'],
                description: 'Extremely sweet, calorie-free alternative.',
                ratio: '1 tsp per 1 cup sugar',
                bestFor: ['Beverages', 'Low-Cal Baking', 'Diabetic'],
                nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
            },
            {
                name: 'Coconut Sugar',
                match: 'high',
                tags: ['Low GI', 'Natural', 'Caramel'],
                description: 'Low glycemic index, caramel-like flavor.',
                ratio: '1:1 ratio',
                bestFor: ['Baking', 'Coffee', 'Desserts'],
                nutrition: { calories: 375, protein: 0, carbs: 100, fat: 0 }
            }
        ],
        tips: [
            {
                title: 'For Browning',
                content: 'Use honey or maple syrup for better browning in baked goods.'
            },
            {
                title: 'For Volume',
                content: 'When using liquid sweeteners, reduce other liquids by ¼.'
            },
            {
                title: 'For Diabetics',
                content: 'Stevia and monk fruit are best for blood sugar control.'
            }
        ],
        nutrition: { calories: 387, protein: 0, carbs: 100, fat: 0 }
    }
};

// Current State
let currentIngredientData = null;
let currentFilter = 'all';
let savedAlternatives = JSON.parse(localStorage.getItem('fridgePlannerSavedAlternatives')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadPopularAlternatives();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search button
    if (searchAlternativeBtn) {
        searchAlternativeBtn.addEventListener('click', searchIngredient);
    }
    
    // Enter key in search
    if (ingredientSearch) {
        ingredientSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchIngredient();
            }
        });
    }
    
    // Example tags
    exampleTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const ingredient = tag.dataset.ingredient;
            ingredientSearch.value = ingredient;
            searchIngredient(ingredient);
        });
    });
    
    // Popular cards
    popularCards.forEach(card => {
        card.addEventListener('click', () => {
            const ingredient = card.dataset.ingredient;
            ingredientSearch.value = ingredient;
            searchIngredient(ingredient);
        });
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            if (currentIngredientData) {
                renderAlternatives(currentIngredientData);
            }
        });
    });
    
    // Modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    if (modalSave) {
        modalSave.addEventListener('click', saveAlternative);
    }
}

// Search for ingredient alternatives
function searchIngredient(inputIngredient = null) {
    const searchTerm = inputIngredient || ingredientSearch.value.trim().toLowerCase();
    
    if (!searchTerm) {
        showNotification('Please enter an ingredient to search!', 'error');
        return;
    }
    
    // Find ingredient in database
    let ingredientData = null;
    for (const [key, data] of Object.entries(ingredientDatabase)) {
        if (key.includes(searchTerm) || data.name.toLowerCase().includes(searchTerm)) {
            ingredientData = { ...data, key };
            break;
        }
    }
    
    if (!ingredientData) {
        showNotification(`No alternatives found for "${searchTerm}". Try eggs, milk, flour, butter, or sugar.`, 'error');
        return;
    }
    
    currentIngredientData = ingredientData;
    
    // Update UI
    currentIngredient.textContent = ingredientData.name;
    ingredientCategory.textContent = ingredientData.category;
    ingredientDiet.textContent = ingredientData.diet;
    
    // Show results
    alternativeResults.style.display = 'none';
    alternativeDetails.style.display = 'block';
    
    // Render alternatives
    renderAlternatives(ingredientData);
    
    // Render tips
    renderTips(ingredientData.tips);
    
    // Render nutrition comparison
    renderNutritionComparison(ingredientData);
    
    // Scroll to results
    alternativeDetails.scrollIntoView({ behavior: 'smooth' });
    
    showNotification(`Found ${ingredientData.alternatives.length} alternatives for ${ingredientData.name}!`, 'success');
}

// Render alternatives
function renderAlternatives(ingredientData) {
    alternativeGrid.innerHTML = '';
    
    let filteredAlternatives = [...ingredientData.alternatives];
    
    // Apply filter
    if (currentFilter !== 'all') {
        filteredAlternatives = filteredAlternatives.filter(alt => 
            alt.tags.some(tag => tag.toLowerCase().includes(currentFilter.toLowerCase()))
        );
    }
    
    if (filteredAlternatives.length === 0) {
        alternativeGrid.innerHTML = `
            <div class="no-alternatives">
                <i class="fas fa-search"></i>
                <h4>No alternatives match your filter</h4>
                <p>Try changing your filter criteria to see more options.</p>
            </div>
        `;
        return;
    }
    
    filteredAlternatives.forEach((alt, index) => {
        const isBestChoice = index === 0; // First alternative is best choice
        
        const altCard = document.createElement('div');
        altCard.className = `alternative-card ${isBestChoice ? 'best-choice' : ''}`;
        altCard.innerHTML = `
            <div class="alternative-header">
                <h4>${alt.name}</h4>
                <span class="match-score ${alt.match}">${alt.match === 'high' ? '95%' : alt.match === 'medium' ? '75%' : '60%'} Match</span>
            </div>
            
            <div class="alternative-tags">
                ${alt.tags.map(tag => `<span class="alternative-tag">${tag}</span>`).join('')}
            </div>
            
            <p class="alternative-description">${alt.description}</p>
            
            <div class="substitution-ratio">
                <strong>Substitution:</strong> ${alt.ratio}
            </div>
            
            <div class="alternative-actions">
                <button class="btn-small view-details" data-alt='${JSON.stringify(alt).replace(/'/g, "&#39;")}'>
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button class="btn-small save-alt" data-alt='${JSON.stringify(alt).replace(/'/g, "&#39;")}'>
                    <i class="far fa-bookmark"></i> Save
                </button>
            </div>
        `;
        
        alternativeGrid.appendChild(altCard);
        
        // Add event listeners
        const viewBtn = altCard.querySelector('.view-details');
        const saveBtn = altCard.querySelector('.save-alt');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => openAlternativeModal(alt, ingredientData));
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => saveAlternativeToCollection(alt, ingredientData));
        }
    });
}

// Render tips
function renderTips(tips) {
    tipsContent.innerHTML = '';
    
    tips.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = 'tip-item';
        tipItem.innerHTML = `
            <h5>${tip.title}</h5>
            <p>${tip.content}</p>
        `;
        tipsContent.appendChild(tipItem);
    });
}

// Render nutrition comparison
function renderNutritionComparison(ingredientData) {
    if (!ingredientData.alternatives[0]) return;
    
    const original = ingredientData.nutrition;
    const alternative = ingredientData.alternatives[0].nutrition;
    
    // Create nutrition chart
    const nutrients = [
        { name: 'Calories', original: original.calories, alternative: alternative.calories, max: Math.max(original.calories, alternative.calories) * 1.2 },
        { name: 'Protein', original: original.protein, alternative: alternative.protein, max: Math.max(original.protein, alternative.protein) * 1.2 },
        { name: 'Carbs', original: original.carbs, alternative: alternative.carbs, max: Math.max(original.carbs, alternative.carbs) * 1.2 },
        { name: 'Fat', original: original.fat, alternative: alternative.fat, max: Math.max(original.fat, alternative.fat) * 1.2 }
    ];
    
    const chartBars = nutritionComparison.querySelector('.chart-bars');
    chartBars.innerHTML = '';
    
    nutrients.forEach(nutrient => {
        const originalPercent = (nutrient.original / nutrient.max) * 100;
        const alternativePercent = (nutrient.alternative / nutrient.max) * 100;
        
        const chartItem = document.createElement('div');
        chartItem.className = 'chart-item';
        chartItem.innerHTML = `
            <div class="chart-label">
                <span>${nutrient.name}</span>
                <span>${nutrient.original} vs ${nutrient.alternative}</span>
            </div>
            <div class="chart-bar-container">
                <div class="chart-bar original" style="width: ${originalPercent}%"></div>
                <div class="chart-bar alternative" style="width: ${alternativePercent}%"></div>
            </div>
        `;
        chartBars.appendChild(chartItem);
    });
}

// Open alternative modal
function openAlternativeModal(alternative, ingredientData) {
    modalIngredientName.textContent = `${alternative.name} for ${ingredientData.name}`;
    
    // Render tags
    modalIngredientTags.innerHTML = '';
    alternative.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'alternative-tag';
        tagSpan.textContent = tag;
        modalIngredientTags.appendChild(tagSpan);
    });
    
    // Set best alternative
    alternativeHighlight.innerHTML = `
        <h5>${alternative.name}</h5>
        <p>${alternative.description}</p>
        <div class="alternative-tags">
            ${alternative.tags.map(tag => `<span class="alternative-tag">${tag}</span>`).join('')}
        </div>
    `;
    
    // Set substitution ratio
    substitutionRatio.textContent = alternative.ratio;
    
    // Set best for tags
    bestForTags.innerHTML = '';
    alternative.bestFor.forEach(item => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'alternative-tag';
        tagSpan.textContent = item;
        bestForTags.appendChild(tagSpan);
    });
    
    // Set notes
    modalNotes.textContent = `Best used in ${alternative.bestFor.join(', ')}. ${alternative.description}`;
    
    // Update nutrition values
    const nutritionValues = alternativeHighlight.parentElement.nextElementSibling.nextElementSibling.querySelector('.nutrition-values');
    if (nutritionValues) {
        const originalValues = nutritionValues.querySelectorAll('.original-value');
        const alternativeValues = nutritionValues.querySelectorAll('.alternative-value');
        
        if (originalValues[0] && ingredientData.nutrition) {
            originalValues[0].textContent = ingredientData.nutrition.calories;
        }
        if (alternativeValues[0] && alternative.nutrition) {
            alternativeValues[0].textContent = alternative.nutrition.calories;
        }
        if (originalValues[1] && ingredientData.nutrition) {
            originalValues[1].textContent = `${ingredientData.nutrition.protein}g`;
        }
        if (alternativeValues[1] && alternative.nutrition) {
            alternativeValues[1].textContent = `${alternative.nutrition.protein}g`;
        }
    }
    
    // Store current alternative for saving
    window.currentAlternative = { alternative, ingredient: ingredientData };
    
    // Show modal
    alternativeModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    alternativeModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    window.currentAlternative = null;
}

// Save alternative to collection
function saveAlternativeToCollection(alternative, ingredientData) {
    const saveData = {
        id: Date.now(),
        ingredient: ingredientData.name,
        alternative: alternative.name,
        ratio: alternative.ratio,
        tags: alternative.tags,
        savedAt: new Date().toISOString()
    };
    
    // Check if already saved
    const existingIndex = savedAlternatives.findIndex(item => 
        item.ingredient === saveData.ingredient && item.alternative === saveData.alternative
    );
    
    if (existingIndex !== -1) {
        showNotification('This alternative is already saved!', 'error');
        return;
    }
    
    savedAlternatives.push(saveData);
    localStorage.setItem('fridgePlannerSavedAlternatives', JSON.stringify(savedAlternatives));
    
    showNotification(`Saved ${alternative.name} as alternative for ${ingredientData.name}!`, 'success');
}

// Save alternative from modal
function saveAlternative() {
    if (!window.currentAlternative) return;
    
    saveAlternativeToCollection(
        window.currentAlternative.alternative,
        window.currentAlternative.ingredient
    );
    
    closeModal();
}

// Load popular alternatives
function loadPopularAlternatives() {
    // This function can be expanded to load dynamic data
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}