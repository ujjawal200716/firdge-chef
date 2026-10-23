// DOM Elements
const savedRecipesContainer = document.getElementById('savedRecipesContainer');
const emptySavedState = document.getElementById('emptySavedState');
const searchSavedInput = document.getElementById('searchSaved');
const clearAllRecipesBtn = document.getElementById('clearAllRecipes');
const filterTags = document.querySelectorAll('.filter-tag');
const totalRecipesCount = document.getElementById('totalRecipesCount');
const totalCookingTime = document.getElementById('totalCookingTime');
const avgCalories = document.getElementById('avgCalories');
const favoriteCount = document.getElementById('favoriteCount');
const editRecipeModal = document.getElementById('editRecipeModal');
const modalClose = document.getElementById('modalClose');
const cancelEditBtn = document.getElementById('cancelEdit');
const saveEditBtn = document.getElementById('saveEdit');
const editRecipeCategory = document.getElementById('editRecipeCategory');
const editRecipeNotes = document.getElementById('editRecipeNotes');
const editTagInput = document.getElementById('editTagInput');
const addEditTagBtn = document.getElementById('addEditTagBtn');
const editTagsContainer = document.getElementById('editTagsContainer');
const editMarkAsFavorite = document.getElementById('editMarkAsFavorite');
const editStars = document.querySelectorAll('#editRecipeModal .star');

// Save Recipe State
let savedRecipes = JSON.parse(localStorage.getItem('fridgePlannerSavedRecipes')) || [];
let currentFilter = 'all';
let currentSearch = '';
let currentEditRecipeId = null;
let editRating = 0;
let editTags = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedRecipes();
    updateStats();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search saved recipes
    if (searchSavedInput) {
        searchSavedInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderSavedRecipes();
        });
    }
    
    // Clear all recipes
    if (clearAllRecipesBtn) {
        clearAllRecipesBtn.addEventListener('click', clearAllSavedRecipes);
    }
    
    // Filter tags
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentFilter = tag.dataset.filter;
            renderSavedRecipes();
        });
    });
    
    // Modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeEditModal);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditModal);
    }
    
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', saveRecipeEdit);
    }
    
    // Edit rating stars
    if (editStars) {
        editStars.forEach(star => {
            star.addEventListener('click', () => {
                editRating = parseInt(star.dataset.value);
                editStars.forEach(s => {
                    if (parseInt(s.dataset.value) <= editRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }
    
    // Edit tags management
    if (addEditTagBtn) {
        addEditTagBtn.addEventListener('click', () => {
            addEditTag();
        });
    }
    
    if (editTagInput) {
        editTagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addEditTag();
            }
        });
    }
}

// Load saved recipes
function loadSavedRecipes() {
    const saved = localStorage.getItem('fridgePlannerSavedRecipes');
    if (saved) {
        savedRecipes = JSON.parse(saved);
    }
    renderSavedRecipes();
}

// Render saved recipes
function renderSavedRecipes() {
    if (savedRecipes.length === 0) {
        savedRecipesContainer.innerHTML = emptySavedState.outerHTML;
        return;
    }
    
    // Filter recipes
    let filteredRecipes = [...savedRecipes];
    
    // Apply search filter
    if (currentSearch) {
        filteredRecipes = filteredRecipes.filter(recipe => {
            const searchText = `${recipe.title} ${recipe.description} ${recipe.ingredients?.join(' ') || ''} ${recipe.savedDetails?.tags?.join(' ') || ''}`.toLowerCase();
            return searchText.includes(currentSearch);
        });
    }
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filteredRecipes = filteredRecipes.filter(recipe => {
            if (currentFilter === 'favorites') {
                return recipe.savedDetails?.isFavorite;
            }
            return recipe.savedDetails?.category === currentFilter || 
                   recipe.diet?.toLowerCase() === currentFilter;
        });
    }
    
    if (filteredRecipes.length === 0) {
        savedRecipesContainer.innerHTML = `
            <div class="empty-saved-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No Recipes Found</h3>
                <p>No saved recipes match your search or filter criteria.</p>
                <button class="btn-primary" id="clearFilters">
                    <i class="fas fa-filter"></i> Clear Filters
                </button>
            </div>
        `;
        
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                currentSearch = '';
                currentFilter = 'all';
                if (searchSavedInput) searchSavedInput.value = '';
                filterTags.forEach(tag => {
                    tag.classList.remove('active');
                    if (tag.dataset.filter === 'all') {
                        tag.classList.add('active');
                    }
                });
                renderSavedRecipes();
            });
        }
        
        return;
    }
    
    // Create recipes grid
    const recipesGrid = document.createElement('div');
    recipesGrid.className = 'saved-recipes-grid';
    
    filteredRecipes.forEach((recipe, index) => {
        const recipeCard = createSavedRecipeCard(recipe);
        recipesGrid.appendChild(recipeCard);
    });
    
    savedRecipesContainer.innerHTML = '';
    savedRecipesContainer.appendChild(recipesGrid);
}

// Create saved recipe card
function createSavedRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'saved-recipe-card';
    card.dataset.id = recipe.id;
    
    // Format saved date
    const savedDate = recipe.savedDetails?.savedAt ? 
        new Date(recipe.savedDetails.savedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) : 'Recently';
    
    // Get image URL
    const imageUrl = recipe.imageUrl || 
                     `https://picsum.photos/seed/${recipe.title}${recipe.id}/400/300`;
    
    // Create card HTML
    card.innerHTML = `
        <div class="saved-recipe-image">
            <img src="${imageUrl}" alt="${recipe.title}" loading="lazy">
            <span class="saved-recipe-badge">${recipe.savedDetails?.category || 'Recipe'}</span>
            ${recipe.savedDetails?.isFavorite ? 
                '<div class="favorite-badge"><i class="fas fa-star"></i></div>' : ''}
        </div>
        <div class="saved-recipe-content">
            <div class="saved-recipe-header">
                <h3>${recipe.title}</h3>
                <span class="saved-recipe-category">${recipe.difficulty || 'Easy'}</span>
            </div>
            
            <p class="saved-recipe-description">${recipe.description}</p>
            
            <div class="saved-recipe-meta">
                <span><i class="fas fa-clock"></i> ${recipe.time || '30 mins'}</span>
                <span><i class="fas fa-fire"></i> ${recipe.calories || '350 cal'}</span>
                <span><i class="fas fa-user-friends"></i> ${recipe.servings || '2 servings'}</span>
            </div>
            
            ${recipe.savedDetails?.rating ? `
                <div class="saved-recipe-rating">
                    ${'★'.repeat(recipe.savedDetails.rating)}${'☆'.repeat(5 - recipe.savedDetails.rating)}
                </div>
            ` : ''}
            
            ${recipe.savedDetails?.tags?.length ? `
                <div class="saved-recipe-tags">
                    ${recipe.savedDetails.tags.slice(0, 3).map(tag => 
                        `<span class="saved-recipe-tag">${tag}</span>`
                    ).join('')}
                    ${recipe.savedDetails.tags.length > 3 ? 
                        `<span class="saved-recipe-tag">+${recipe.savedDetails.tags.length - 3}</span>` : ''}
                </div>
            ` : ''}
            
            ${recipe.savedDetails?.notes ? `
                <div class="saved-recipe-notes">
                    <p><i class="fas fa-sticky-note"></i> ${recipe.savedDetails.notes.substring(0, 100)}${recipe.savedDetails.notes.length > 100 ? '...' : ''}</p>
                </div>
            ` : ''}
            
            <div class="saved-recipe-actions">
                <button class="btn-small edit-saved-recipe" data-id="${recipe.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-small delete-saved-recipe" data-id="${recipe.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
            
            <div class="saved-recipe-footer">
                <small><i class="far fa-calendar"></i> Saved ${savedDate}</small>
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    const editBtn = card.querySelector('.edit-saved-recipe');
    const deleteBtn = card.querySelector('.delete-saved-recipe');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => openEditModal(recipe.id));
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteSavedRecipe(recipe.id));
    }
    
    return card;
}

// Open edit modal
function openEditModal(recipeId) {
    const recipe = savedRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    currentEditRecipeId = recipeId;
    
    // Fill form with existing details
    editRecipeCategory.value = recipe.savedDetails?.category || 'main-course';
    editRecipeNotes.value = recipe.savedDetails?.notes || '';
    editRating = recipe.savedDetails?.rating || 0;
    editTags = [...(recipe.savedDetails?.tags || [])];
    editMarkAsFavorite.checked = recipe.savedDetails?.isFavorite || false;
    
    // Update rating stars
    editStars.forEach(star => {
        if (parseInt(star.dataset.value) <= editRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Render tags
    renderEditTags();
    
    // Show modal
    editRecipeModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close edit modal
function closeEditModal() {
    editRecipeModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentEditRecipeId = null;
    editRating = 0;
    editTags = [];
}

// Add tag in edit modal
function addEditTag() {
    const tagText = editTagInput.value.trim();
    if (tagText && !editTags.includes(tagText)) {
        editTags.push(tagText);
        renderEditTags();
        editTagInput.value = '';
    }
}

// Remove tag in edit modal
function removeEditTag(tagToRemove) {
    editTags = editTags.filter(tag => tag !== tagToRemove);
    renderEditTags();
}

// Render tags in edit modal
function renderEditTags() {
    editTagsContainer.innerHTML = '';
    editTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <span class="tag-remove" data-tag="${tag}">&times;</span>
        `;
        editTagsContainer.appendChild(tagElement);
        
        // Add event listener to remove button
        tagElement.querySelector('.tag-remove').addEventListener('click', (e) => {
            removeEditTag(e.target.dataset.tag);
        });
    });
}

// Save recipe edit
function saveRecipeEdit() {
    if (!currentEditRecipeId) return;
    
    const recipeIndex = savedRecipes.findIndex(r => r.id === currentEditRecipeId);
    if (recipeIndex === -1) return;
    
    // Update recipe details
    if (!savedRecipes[recipeIndex].savedDetails) {
        savedRecipes[recipeIndex].savedDetails = {};
    }
    
    savedRecipes[recipeIndex].savedDetails.category = editRecipeCategory.value;
    savedRecipes[recipeIndex].savedDetails.notes = editRecipeNotes.value;
    savedRecipes[recipeIndex].savedDetails.rating = editRating;
    savedRecipes[recipeIndex].savedDetails.tags = [...editTags];
    savedRecipes[recipeIndex].savedDetails.isFavorite = editMarkAsFavorite.checked;
    
    // Save to localStorage
    localStorage.setItem('fridgePlannerSavedRecipes', JSON.stringify(savedRecipes));
    
    // Update UI
    updateStats();
    renderSavedRecipes();
    
    // Show success message
    showNotification('Recipe updated successfully!', 'success');
    
    // Close modal
    closeEditModal();
}

// Delete saved recipe
function deleteSavedRecipe(recipeId) {
    if (confirm('Are you sure you want to delete this saved recipe?')) {
        savedRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);
        localStorage.setItem('fridgePlannerSavedRecipes', JSON.stringify(savedRecipes));
        updateStats();
        renderSavedRecipes();
        showNotification('Recipe deleted');
    }
}

// Clear all saved recipes
function clearAllSavedRecipes() {
    if (savedRecipes.length === 0) return;
    
    if (confirm('Are you sure you want to delete ALL saved recipes? This action cannot be undone.')) {
        savedRecipes = [];
        localStorage.setItem('fridgePlannerSavedRecipes', JSON.stringify(savedRecipes));
        updateStats();
        renderSavedRecipes();
        showNotification('All saved recipes deleted');
    }
}

// Update statistics
function updateStats() {
    totalRecipesCount.textContent = savedRecipes.length;
    
    // Calculate total cooking time
    const totalTime = savedRecipes.reduce((sum, recipe) => {
        const timeMatch = recipe.time?.match(/\d+/);
        const time = timeMatch ? parseInt(timeMatch[0]) : 30;
        return sum + time;
    }, 0);
    totalCookingTime.textContent = `${totalTime} mins`;
    
    // Calculate average calories
    const totalCalories = savedRecipes.reduce((sum, recipe) => {
        const caloriesMatch = recipe.calories?.match(/\d+/);
        const calories = caloriesMatch ? parseInt(caloriesMatch[0]) : 350;
        return sum + calories;
    }, 0);
    const averageCalories = savedRecipes.length > 0 ? 
        Math.round(totalCalories / savedRecipes.length) : 0;
    avgCalories.textContent = `${averageCalories} cal`;
    
    // Count favorites
    const favorites = savedRecipes.filter(recipe => recipe.savedDetails?.isFavorite);
    favoriteCount.textContent = favorites.length;
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