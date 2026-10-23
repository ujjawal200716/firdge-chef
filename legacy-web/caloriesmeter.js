// ================= CONFIGURATION =================
const API_BASE_URL = 'http://localhost:5000/api';
const USER_ID = 'user_123'; // Matches your server setup

// ================= DOM ELEMENTS =================
const caloriesInEl = document.getElementById('caloriesIn');
const caloriesOutEl = document.getElementById('caloriesOut');
const netCaloriesEl = document.getElementById('netCalories');
const dailyGoalEl = document.getElementById('dailyGoal');
const remainingCaloriesEl = document.getElementById('remainingCalories');
const goalStatusEl = document.getElementById('goalStatus');
const progressPercentEl = document.getElementById('progressPercent');
const foodsListEl = document.getElementById('foodsList');
const activitiesListEl = document.getElementById('activitiesList');
const currentDateEl = document.getElementById('currentDate');

// Buttons
const addFoodBtn = document.getElementById('addFoodBtn');
const addActivityBtn = document.getElementById('addActivityBtn');
const editGoalBtn = document.getElementById('editGoalBtn'); // Ensure this ID exists in HTML
const saveGoalBtn = document.getElementById('saveGoalBtn'); // Ensure this ID exists in HTML
const goalModal = document.getElementById('goalModal'); // Ensure this ID exists in HTML

// Inputs
const foodNameInput = document.getElementById('foodName');
const foodCaloriesInput = document.getElementById('foodCalories');
const activityTypeSelect = document.getElementById('activityType');
const activityDurationInput = document.getElementById('activityDuration');
const newDailyGoalInput = document.getElementById('newDailyGoal'); // Ensure this ID exists in HTML

// Charts
let progressChart;
let weeklyChart;

// Data State
let dailyData = {
    caloriesIn: 0,
    caloriesOut: 0,
    foods: [],
    activities: [],
    dailyGoal: 2000
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    setupCharts();
    setupEventListeners();
    fetchData(); // Load data from Server
});

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if(currentDateEl) currentDateEl.textContent = now.toLocaleDateString('en-US', options);
}

// ================= API FUNCTIONS =================

// 1. GET DATA (Replaces loadData)
async function fetchData() {
    try {
        const res = await fetch(`${API_BASE_URL}/dashboard/${USER_ID}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        
        // Filter for Today (Client-side filtering for safety)
        const isToday = (dateStr) => {
            const d = new Date(dateStr);
            const today = new Date();
            return d.getDate() === today.getDate() && 
                   d.getMonth() === today.getMonth() && 
                   d.getFullYear() === today.getFullYear();
        };

        const todayFoods = (data.foods || []).filter(f => isToday(f.timestamp));
        const todayActivities = (data.activities || []).filter(a => isToday(a.timestamp));

        // Calculate Totals
        const totalIn = todayFoods.reduce((sum, item) => sum + item.calories, 0);
        const totalOut = todayActivities.reduce((sum, item) => sum + item.calories, 0);

        // Update State
        dailyData = {
            dailyGoal: data.dailyGoal || 2000,
            foods: todayFoods,
            activities: todayActivities,
            caloriesIn: totalIn,
            caloriesOut: totalOut
        };

        updateDisplay();

    } catch (err) {
        console.error("Error loading data:", err);
    }
}

// 2. ADD FOOD (Replaces local push)
async function addFood() {
    const name = foodNameInput.value.trim();
    const calories = parseInt(foodCaloriesInput.value);

    if (!name || isNaN(calories) || calories <= 0) {
        alert('Please enter valid food name and calories');
        return;
    }

    try {
        await fetch(`${API_BASE_URL}/food`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: USER_ID,
                name: name,
                calories: calories,
                timestamp: new Date().toISOString()
            })
        });

        // Clear Inputs
        foodNameInput.value = '';
        foodCaloriesInput.value = '';

        // Refresh Data
        await fetchData();

    } catch (err) {
        console.error("Error adding food:", err);
        alert("Failed to save food");
    }
}

// 3. ADD ACTIVITY (Replaces local push)
async function addActivity() {
    const type = activityTypeSelect.value;
    const duration = parseInt(activityDurationInput.value);

    if (isNaN(duration) || duration <= 0) {
        alert('Please enter valid duration');
        return;
    }

    try {
        await fetch(`${API_BASE_URL}/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: USER_ID,
                type: type,
                duration: duration,
                timestamp: new Date().toISOString()
            })
        });

        // Clear Inputs
        activityDurationInput.value = '';

        // Refresh Data
        await fetchData();

    } catch (err) {
        console.error("Error adding activity:", err);
        alert("Failed to save activity");
    }
}

// 4. UPDATE GOAL (Replaces saveGoal)
async function saveGoal() {
    const newGoal = parseInt(newDailyGoalInput.value);

    if (isNaN(newGoal) || newGoal < 500) {
        alert('Please enter a valid goal (min 500)');
        return;
    }

    try {
        await fetch(`${API_BASE_URL}/goal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: USER_ID,
                goal: newGoal
            })
        });

        if(goalModal) goalModal.style.display = 'none';
        await fetchData();

    } catch (err) {
        console.error("Error saving goal:", err);
    }
}

// ================= UI UPDATE FUNCTIONS =================

function updateDisplay() {
    // Update numbers
    if(caloriesInEl) caloriesInEl.textContent = dailyData.caloriesIn;
    if(caloriesOutEl) caloriesOutEl.textContent = dailyData.caloriesOut;
    
    // Net Calories = In - Out
    const net = dailyData.caloriesIn - dailyData.caloriesOut;
    if(netCaloriesEl) netCaloriesEl.textContent = net;
    
    if(dailyGoalEl) dailyGoalEl.textContent = dailyData.dailyGoal;
    
    // Remaining = Goal - Net
    // (If you burn calories, you "earn" more budget)
    const remaining = dailyData.dailyGoal - net;
    if(remainingCaloriesEl) remainingCaloriesEl.textContent = remaining;
    
    // Progress %
    const progress = dailyData.dailyGoal > 0 ? Math.min((net / dailyData.dailyGoal) * 100, 100) : 0;
    if(progressPercentEl) progressPercentEl.textContent = Math.round(progress) + '%';
    
    // Status Logic
    updateStatus(progress);
    
    // Charts & Lists
    updateProgressChart(progress);
    updateFoodsList();
    updateActivitiesList();
}

function updateStatus(progress) {
    if(!goalStatusEl) return;

    let status = 'On Track';
    let statusColor = '#4CAF50'; // Green

    if (progress >= 90 && progress < 100) {
        status = 'Almost There';
        statusColor = '#FF9800'; // Orange
    } else if (progress >= 100) {
        status = 'Limit Reached';
        statusColor = '#F44336'; // Red
    }
    
    goalStatusEl.textContent = status;
    goalStatusEl.style.background = statusColor;
}

function updateFoodsList() {
    if(!foodsListEl) return;
    
    if (dailyData.foods.length === 0) {
        foodsListEl.innerHTML = `<div style="padding:15px; text-align:center; color:#888;">No food added today.</div>`;
        return;
    }
    
    foodsListEl.innerHTML = dailyData.foods.map(food => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <div>
                <strong>${food.name}</strong><br>
                <small style="color:#888">${new Date(food.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</small>
            </div>
            <div style="color:#C87D87; font-weight:bold;">${food.calories} kcal</div>
        </div>
    `).join('');
}

function updateActivitiesList() {
    if(!activitiesListEl) return;

    if (dailyData.activities.length === 0) {
        activitiesListEl.innerHTML = `<div style="padding:15px; text-align:center; color:#888;">No activity today.</div>`;
        return;
    }
    
    activitiesListEl.innerHTML = dailyData.activities.map(activity => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <div>
                <strong>${activity.activityType || activity.type}</strong><br>
                <small style="color:#888">${activity.duration} mins</small>
            </div>
            <div style="color:#556040; font-weight:bold;">-${activity.calories} kcal</div>
        </div>
    `).join('');
}

// ================= CHART CONFIGURATION =================

function setupCharts() {
    const ctx = document.getElementById('calorieProgressChart');
    if(!ctx) return;

    progressChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#4CAF50', '#eee'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { tooltip: { enabled: false } } 
        }
    });
}

function updateProgressChart(progress) {
    if(!progressChart) return;
    
    const remaining = Math.max(0, 100 - progress);
    const color = progress > 100 ? '#F44336' : (progress > 85 ? '#FF9800' : '#4CAF50');

    progressChart.data.datasets[0].data = [progress, remaining];
    progressChart.data.datasets[0].backgroundColor = [color, '#eee'];
    progressChart.update();
}

// ================= EVENT LISTENERS =================

function setupEventListeners() {
    if(addFoodBtn) addFoodBtn.addEventListener('click', addFood);
    
    if(addActivityBtn) addActivityBtn.addEventListener('click', addActivity);
    
    if(editGoalBtn && goalModal) {
        editGoalBtn.addEventListener('click', () => {
            if(newDailyGoalInput) newDailyGoalInput.value = dailyData.dailyGoal;
            goalModal.style.display = 'flex';
        });
    }

    if(saveGoalBtn) saveGoalBtn.addEventListener('click', saveGoal);
    
    // Close Modal Logic (Optional)
    window.onclick = function(event) {
        if (event.target == goalModal) {
            goalModal.style.display = "none";
        }
    }
}