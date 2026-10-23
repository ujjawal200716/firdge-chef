document.addEventListener('DOMContentLoaded', function() {
    // Initialize App
    initializeApp();
    setupEventListeners();
    setupExampleTags();
});

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your actual server URL
const USE_SERVER = true; // Set to false to fall back to LocalStorage (for testing without server)

// --- DOM ELEMENTS ---
const ingredientInput = document.getElementById('ingredientInput');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const ingredientsTags = document.getElementById('ingredientsTags');
const clearIngredientsBtn = document.getElementById('clearIngredientsBtn');
const generateRecipesBtn = document.getElementById('generateRecipesBtn');
const recipeResults = document.getElementById('recipeResults');
const filterBtns = document.querySelectorAll('.filter-btn');
const popularRecipesGrid = document.getElementById('popularRecipesGrid');

// Modals
const recipeModal = document.getElementById('recipeModal');
const scanModal = document.getElementById('scanModal');
const recipeModalClose = document.getElementById('recipeModalClose');
const scanModalClose = document.getElementById('scanModalClose');
const closeRecipeBtn = document.getElementById('closeRecipeBtn');
const closeScanBtn = document.getElementById('closeScanBtn');

// Scan Modal Elements
const scanFridgeBtn = document.getElementById('scanFridgeBtn');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const scanBarcodeBtn = document.getElementById('scanBarcodeBtn');
const manualItemInput = document.getElementById('manualItemInput');
const addManualItemBtn = document.getElementById('addManualItemBtn');
const useScannedItemsBtn = document.getElementById('useScannedItemsBtn');
const scannedTags = document.getElementById('scannedTags');

// --- STATE MANAGEMENT ---
let selectedIngredients = [];
let scannedItems = [];
let currentRecipes = [];
let currentDietFilter = 'all';

// --- API SERVICES ---

const serverApi = {
    // Tracker (Ingredients)
    async getIngredients() {
        if (!USE_SERVER) return JSON.parse(localStorage.getItem('myFridge') || '[]');
        try {
            const res = await fetch(`${API_BASE_URL}/fridge`);
            return await res.json();
        } catch (e) { console.error("Server Error", e); return []; }
    },

    async addIngredient(item) {
        if (!USE_SERVER) return; // LocalStorage handled in main logic if server off
        try {
            await fetch(`${API_BASE_URL}/fridge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item })
            });
        } catch (e) { console.error("Save Error", e); }
    },

    async removeIngredient(item) {
        if (!USE_SERVER) return;
        try {
            await fetch(`${API_BASE_URL}/fridge/${item}`, { method: 'DELETE' });
        } catch (e) { console.error("Delete Error", e); }
    },

    async clearFridge() {
        if (!USE_SERVER) return;
        try {
            await fetch(`${API_BASE_URL}/fridge/clear`, { method: 'POST' });
        } catch (e) { console.error("Clear Error", e); }
    },

    // Saved Recipes
    async saveRecipe(recipe) {
        if (!USE_SERVER) {
            let saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
            if (!saved.some(r => r.id === recipe.id)) {
                saved.push(recipe);
                localStorage.setItem('savedRecipes', JSON.stringify(saved));
                return true;
            }
            return false;
        }
        
        try {
            const res = await fetch(`${API_BASE_URL}/saved-recipes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe)
            });
            return res.ok;
        } catch (e) { console.error("Save Recipe Error", e); return false; }
    }
};

// --- WIKIPEDIA API ---
async function getWikiImage(query) {
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=600&origin=*&titles=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pageId === "-1" || !pages[pageId].thumbnail) return defaultImage;
        return pages[pageId].thumbnail.source;
    } catch (error) {
        return defaultImage;
    }
}

// --- CORE FUNCTIONS ---

async function initializeApp() {
    // Load ingredients from server or local storage
    selectedIngredients = await serverApi.getIngredients();
    updateIngredientsDisplay();
    loadPopularRecipes();
}

function updateIngredientsDisplay() {
    if (!USE_SERVER) localStorage.setItem('myFridge', JSON.stringify(selectedIngredients));

    if (selectedIngredients.length === 0) {
        ingredientsTags.innerHTML = `
            <div class="empty-ingredient-state">
                <i class="fas fa-carrot"></i>
                <p>No ingredients added yet. Start by adding ingredients from your fridge!</p>
            </div>
        `;
        return;
    }
    
    ingredientsTags.innerHTML = selectedIngredients.map(ingredient => `
        <div class="ingredient-tag">
            ${ingredient}
            <i class="fas fa-times" data-ingredient="${ingredient}"></i>
        </div>
    `).join('');
    
    ingredientsTags.querySelectorAll('.ingredient-tag i').forEach(btn => {
        btn.addEventListener('click', function() {
            const ingredient = this.getAttribute('data-ingredient');
            removeIngredient(ingredient);
        });
    });
}

async function addIngredient(ingredient) {
    if (!ingredient) return;
    
    if (selectedIngredients.includes(ingredient)) {
        showNotification(`${ingredient} is already added`, 'error');
        return;
    }
    
    selectedIngredients.push(ingredient);
    updateIngredientsDisplay();
    
    // Sync with Server
    await serverApi.addIngredient(ingredient);
    
    showNotification(`Added: ${ingredient}`, 'success');
}

async function removeIngredient(ingredient) {
    selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
    updateIngredientsDisplay();
    
    // Sync with Server
    await serverApi.removeIngredient(ingredient);
    
    showNotification(`Removed: ${ingredient}`, 'success');
}

// --- RECIPE GENERATION & DISPLAY ---

async function generateRecipes() {
    if (selectedIngredients.length === 0) {
        showNotification('Please add some ingredients first', 'error');
        return;
    }
    
    recipeResults.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> searching recipes...</div>';

    // Filter recipes based on ingredients match
    currentRecipes = recipes.filter(recipe => {
        const matchingIngredients = recipe.ingredients.filter(ing => 
            selectedIngredients.some(selected => 
                selected.toLowerCase().includes(ing.toLowerCase()) || 
                ing.toLowerCase().includes(selected.toLowerCase())
            )
        ).length;
        
        recipe.match = Math.min(Math.round((matchingIngredients / recipe.ingredients.length) * 100), 100);
        return recipe.match >= 30; // Lowered threshold for demo purposes
    });
    
    currentRecipes.sort((a, b) => b.match - a.match);
    
    await displayRecipes();
}

async function displayRecipes() {
    if (currentRecipes.length === 0) {
        renderEmptyState();
        return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'recipe-grid';
    grid.id = 'recipesGrid';

    // Process recipes (Fetch images from Wiki)
    for (const recipe of currentRecipes) {
        // Decide if we show this based on filter
        if (!checkDietFilter(recipe)) continue;

        const imageUrl = await getWikiImage(recipe.wikiSearch || recipe.name);
        
        const card = document.createElement('div');
        card.className = `recipe-card ${recipe.featured ? 'featured' : ''}`;
        card.setAttribute('data-id', recipe.id);
        
        card.innerHTML = `
            <div class="recipe-image-container" style="height: 180px; overflow: hidden; border-radius: 12px 12px 0 0;">
                <img src="${imageUrl}" alt="${recipe.name}" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="recipe-match ${recipe.match >= 85 ? 'high' : recipe.match >= 70 ? 'medium' : ''}">
                    ${recipe.match}% Match
                </div>
            </div>
            <div class="recipe-content" style="padding: 15px;">
                <div class="recipe-header">
                    <h4>${recipe.name}</h4>
                </div>
                
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                </div>
                
                <p class="recipe-description">${recipe.description}</p>
                
                <div class="recipe-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${recipe.prepTime + recipe.cookTime}</span>
                        <small>min</small>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-fire"></i>
                        <span>${recipe.calories}</span>
                        <small>kcal</small>
                    </div>
                </div>
                
                <div class="recipe-actions">
                    <button class="btn-small view-recipe-btn">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-small save-recipe-btn">
                        <i class="far fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        `;

        // Event Listeners for this specific card
        card.querySelector('.view-recipe-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showRecipeModal(recipe.id);
        });

        card.querySelector('.save-recipe-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            saveRecipe(recipe.id);
        });

        grid.appendChild(card);
    }
    
    recipeResults.innerHTML = '';
    recipeResults.appendChild(grid);
}

function checkDietFilter(recipe) {
    if (currentDietFilter === 'all') return true;
    switch(currentDietFilter) {
        case 'vegetarian': return recipe.tags.includes('Vegetarian');
        case 'vegan': return recipe.tags.includes('Vegan');
        case 'gluten-free': return recipe.tags.includes('Gluten Free');
        case 'low-carb': return recipe.calories < 300;
        case 'dairy-free': return !recipe.ingredients.some(i => ['milk', 'cheese', 'cream', 'butter', 'yogurt'].includes(i.toLowerCase()));
        case 'quick': return (recipe.prepTime + recipe.cookTime) <= 30;
        case 'healthy': return recipe.tags.includes('Healthy');
        default: return true;
    }
}

async function saveRecipe(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const success = await serverApi.saveRecipe(recipe);
    
    if (success) {
        showNotification(`Saved "${recipe.name}" to your collection!`, 'success');
    } else {
        showNotification(`"${recipe.name}" is already saved!`, 'error');
    }
}

function renderEmptyState() {
    recipeResults.innerHTML = `
        <div class="empty-recipe-state">
            <div class="empty-icon"><i class="fas fa-utensils"></i></div>
            <h3>No Recipes Found</h3>
            <p>Try adding more ingredients (e.g., eggs, rice, chicken) or adjust filters.</p>
        </div>
    `;
}

// --- MODAL & EVENT HANDLING ---

function showRecipeModal(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    document.getElementById('modalRecipeTitle').textContent = recipe.name;
    document.getElementById('modalRecipeTags').innerHTML = recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('');
    
    document.getElementById('modalPrepTime').textContent = recipe.prepTime + ' min';
    document.getElementById('modalCookTime').textContent = recipe.cookTime + ' min';
    document.getElementById('modalServings').textContent = recipe.servings;
    document.getElementById('modalCalories').textContent = recipe.calories;
    document.getElementById('modalDifficulty').textContent = recipe.difficulty;
    
    document.getElementById('modalIngredientsList').innerHTML = recipe.ingredients.map(ing => `<li><i class="fas fa-check"></i> ${ing}</li>`).join('');
    document.getElementById('modalInstructionsList').innerHTML = recipe.instructions.map(step => `<li>${step}</li>`).join('');
    document.getElementById('modalRecipeTips').textContent = recipe.tips;
    
    // Nutrition
    document.getElementById('modalNutritionFacts').innerHTML = `
        <div class="nutrition-item"><span>Protein</span><span class="nutrition-value">${recipe.nutrition.protein}</span></div>
        <div class="nutrition-item"><span>Carbs</span><span class="nutrition-value">${recipe.nutrition.carbs}</span></div>
        <div class="nutrition-item"><span>Fat</span><span class="nutrition-value">${recipe.nutrition.fat}</span></div>
    `;
    
    // Wire up buttons inside modal
    const saveBtn = document.getElementById('saveRecipeBtn');
    // Remove old listeners by cloning
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    newSaveBtn.addEventListener('click', () => saveRecipe(recipeId));
    
    recipeModal.style.display = 'flex';
}

function setupEventListeners() {
    addIngredientBtn.addEventListener('click', () => {
        const val = ingredientInput.value.trim().toLowerCase();
        if(val) { addIngredient(val); ingredientInput.value = ''; }
    });
    
    ingredientInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = ingredientInput.value.trim().toLowerCase();
            if(val) { addIngredient(val); ingredientInput.value = ''; }
        }
    });

    clearIngredientsBtn.addEventListener('click', async () => {
        if (selectedIngredients.length > 0 && confirm('Clear all ingredients?')) {
            selectedIngredients = [];
            updateIngredientsDisplay();
            await serverApi.clearFridge();
            showNotification('All ingredients cleared', 'success');
        }
    });

    generateRecipesBtn.addEventListener('click', generateRecipes);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDietFilter = this.getAttribute('data-diet');
            displayRecipes(); // Redisplay with new filter
        });
    });

    // Modal Closing Logic
    const closeModals = () => {
        recipeModal.style.display = 'none';
        scanModal.style.display = 'none';
    };
    
    recipeModalClose.addEventListener('click', closeModals);
    scanModalClose.addEventListener('click', closeModals);
    closeRecipeBtn.addEventListener('click', closeModals);
    closeScanBtn.addEventListener('click', closeModals);
    window.addEventListener('click', (e) => {
        if (e.target === recipeModal || e.target === scanModal) closeModals();
    });

    // Scan Button
    scanFridgeBtn.addEventListener('click', () => { scanModal.style.display = 'flex'; });
    
    // Use Scanned Items
    useScannedItemsBtn.addEventListener('click', async () => {
        for(let item of scannedItems) {
            if(!selectedIngredients.includes(item)) {
                await addIngredient(item);
            }
        }
        scanModal.style.display = 'none';
        scannedItems = [];
        updateScannedTags();
    });
}

// Reuse existing helper functions
function setupExampleTags() {
    document.querySelectorAll('.example-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const ingredient = this.textContent.trim();
            addIngredient(ingredient);
        });
    });
}

function updateScannedTags() {
    if (scannedItems.length === 0) {
        scannedTags.innerHTML = '<p style="text-align: center;">No items scanned yet</p>';
        return;
    }
    scannedTags.innerHTML = scannedItems.map(item => `
        <div class="ingredient-tag">${item} <i class="fas fa-times" onclick="removeScanned('${item}')"></i></div>
    `).join('');
}

window.removeScanned = function(item) {
    scannedItems = scannedItems.filter(i => i !== item);
    updateScannedTags();
}

// Reuse Notification Logic
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> <span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 3000);
}

// --- RECIPE DATABASE (Enhanced with Wiki terms) ---
const recipes = [
    {
        id: 1,
        name: "Creamy Garlic Pasta",
        wikiSearch: "Pasta", 
        description: "A rich and creamy pasta with garlic, parmesan, and fresh herbs.",
        ingredients: ["pasta", "garlic", "cream", "parmesan", "butter", "herbs"],
        prepTime: 10, cookTime: 20, servings: 4, calories: 420, difficulty: "Easy",
        tags: ["Vegetarian", "Quick", "Comfort Food"],
        instructions: ["Cook pasta.", "Sauté garlic.", "Add cream and simmer.", "Stir in cheese.", "Combine."],
        tips: "Reserve pasta water.",
        nutrition: { protein: "15g", carbs: "45g", fat: "22g", fiber: "3g" },
        featured: true
    },
    {
        id: 2,
        name: "Chicken Stir Fry",
        wikiSearch: "Stir frying",
        description: "Quick and healthy stir fry with chicken and colorful vegetables.",
        ingredients: ["chicken", "bell peppers", "broccoli", "soy sauce", "garlic", "ginger"],
        prepTime: 15, cookTime: 15, servings: 3, calories: 320, difficulty: "Easy",
        tags: ["High Protein", "Healthy", "Quick"],
        instructions: ["Slice chicken.", "Stir-fry chicken.", "Add veggies.", "Add sauce.", "Serve."],
        tips: "Marinate chicken first.",
        nutrition: { protein: "28g", carbs: "18g", fat: "12g", fiber: "5g" },
        featured: false
    },
    {
        id: 3,
        name: "Vegetable Soup",
        wikiSearch: "Vegetable soup",
        description: "Hearty vegetable soup perfect for a healthy meal.",
        ingredients: ["carrots", "celery", "onion", "tomatoes", "potatoes", "vegetable broth"],
        prepTime: 20, cookTime: 40, servings: 6, calories: 180, difficulty: "Easy",
        tags: ["Vegan", "Healthy", "Comfort Food"],
        instructions: ["Sauté veg.", "Add broth.", "Simmer.", "Season."],
        tips: "Better the next day.",
        nutrition: { protein: "6g", carbs: "32g", fat: "4g", fiber: "8g" },
        featured: true
    }
    // Add more recipes here following this pattern...
];

function loadPopularRecipes() {
    // This function remains strictly UI based for now
    popularRecipesGrid.innerHTML = `
        <div class="popular-card" onclick="addIngredient('pasta')">
            <div class="popular-icon"><i class="fas fa-utensils"></i></div>
            <h4>Pasta Night</h4>
            <p>Classic Italian</p>
        </div>
        `;
}