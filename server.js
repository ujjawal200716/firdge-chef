require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const Groq = require('groq-sdk'); 

// --- 1. CONFIGURATION ---
const MONGO_URI = "mongodb+srv://user:12345@cluster0.gcridcr.mongodb.net/?appName=Cluster0";
const SUPABASE_URL = 'https://dzdrduqwkfdznkqtjuai.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_eHdGsaJOPDvhoUL_1sipWw_RxFvhAy2';

// ⚠️ REPLACE WITH YOUR ACTUAL KEY OR SET GROQ_API_KEY ENV
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_YOUR_GROQ_API_KEY_HERE'; 
const PORT = 5000;

const app = express();
const groq = new Groq({ apiKey: GROQ_API_KEY });

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 3. MONGODB CONNECTION ---
process.on('uncaughtException', (err) => {
    console.error('⚠️ Uncaught Exception intercepted:', err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error('⚠️ Unhandled Rejection intercepted:', reason);
});

mongoose.connection.on('error', err => {
    console.error('❌ MongoDB Connection Error (Offline Mode):', err.message);
});

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Error (App continuing in standalone mode):', err.message));

// --- 4. DATABASE SCHEMA ---
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    supabaseId: { type: String, required: true },
    
    dailyGoal: { type: Number, default: 2200 },

    calorieLogs: [{
        date: { type: String }, // Format: "YYYY-MM-DD"
        foods: [{ 
            name: String, 
            calories: Number,
            protein: Number,
            timestamp: { type: Date, default: Date.now }
        }],
        manualEntries: [{ // For homepage "Quick Add"
            amount: Number,
            timestamp: { type: Date, default: Date.now }
        }],
        activities: [{ 
            activityType: String,
            duration: Number,
            calories: Number,
            timestamp: { type: Date, default: Date.now }
        }]
    }],

    savedRecipes: [{
        title: String,
        image: String,
        calories: Number,
        ingredients: [String], 
        instructions: [String], 
        savedAt: { type: Date, default: Date.now }
    }],

    weeklyPlan: [{
        day: { type: String }, 
        morning: { type: String, default: "" },
        afternoon: { type: String, default: "" },
        evening: { type: String, default: "" }
    }],

    inventory: {
        vegetables: [String],
        proteins: [String],
        fruits: [String],
        grains: [String],
        general: [String]
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// --- 5. MIDDLEWARE: VERIFY SUPABASE TOKEN ---
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (!error && user) {
                req.user = user;
                return next();
            }
        }
        return res.status(401).json({ error: "Unauthorized: Please log in." });
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ error: "Unauthorized" });
    }
};

// --- 6. API ROUTES ---

// =======================
// A. DASHBOARD & GOALS
// =======================

// 1. GET FULL DASHBOARD (Used by Calorie Page)
app.get('/api/dashboard', verifyToken, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.user.email });
        if (!user) {
            user = new User({ email: req.user.email, supabaseId: req.user.id });
            await user.save();
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const todayLog = user.calorieLogs.find(l => l.date === todayStr);

        // Merge "foods" and "manualEntries" for the dashboard display if needed
        // Or send them separately. The provided frontend expects 'foods' and 'activities'.
        // We will map manual entries as simple food items to ensure they show up in the list.
        
        let foods = todayLog ? todayLog.foods : [];
        const manual = todayLog ? todayLog.manualEntries : [];
        
        // Convert manual entries to look like food items for the frontend list
        const manualAsFood = manual.map(m => ({
            _id: m._id,
            name: "Quick Add",
            calories: m.amount,
            type: "food",
            timestamp: m.timestamp
        }));

        res.json({
            dailyGoal: user.dailyGoal,
            foods: [...foods, ...manualAsFood], 
            activities: todayLog ? todayLog.activities : []
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. SET DAILY GOAL (Used by Calorie Page)
app.post('/api/goal', verifyToken, async (req, res) => {
    try {
        const { goal } = req.body;
        await User.findOneAndUpdate(
            { email: req.user.email },
            { $set: { dailyGoal: Number(goal) } }
        );
        res.json({ success: true, dailyGoal: Number(goal) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =======================
// B. TRACKING (Food & Activity)
// =======================

// 3. ADD FOOD (Detailed)
app.post('/api/food', verifyToken, async (req, res) => {
    try {
        const { name, calories, protein, timestamp } = req.body;
        const dateObj = timestamp ? new Date(timestamp) : new Date();
        const dateStr = dateObj.toISOString().split('T')[0];

        let user = await User.findOne({ email: req.user.email });
        let logIndex = user.calorieLogs.findIndex(l => l.date === dateStr);

        if (logIndex === -1) {
            user.calorieLogs.push({ date: dateStr, foods: [], manualEntries: [], activities: [] });
            logIndex = user.calorieLogs.length - 1;
        }

        user.calorieLogs[logIndex].foods.push({
            name, 
            calories: Number(calories),
            protein: Number(protein || 0),
            timestamp: dateObj
        });

        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ADD ACTIVITY
app.post('/api/activity', verifyToken, async (req, res) => {
    try {
        const { type, duration, timestamp } = req.body;
        const dateObj = timestamp ? new Date(timestamp) : new Date();
        const dateStr = dateObj.toISOString().split('T')[0];

        // Simple Calorie Burn Calculation
        const rates = { running: 12, walking: 4, cycling: 8, weights: 6, yoga: 3, swimming: 10 };
        const burnRate = rates[type.toLowerCase()] || 5;
        const calories = Math.round(burnRate * Number(duration));

        let user = await User.findOne({ email: req.user.email });
        let logIndex = user.calorieLogs.findIndex(l => l.date === dateStr);

        if (logIndex === -1) {
            user.calorieLogs.push({ date: dateStr, foods: [], manualEntries: [], activities: [] });
            logIndex = user.calorieLogs.length - 1;
        }

        user.calorieLogs[logIndex].activities.push({
            activityType: type,
            duration: Number(duration),
            calories,
            timestamp: dateObj
        });

        await user.save();
        res.json({ success: true, calories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. QUICK ADD CALORIES (Used by Homepage Widget)
app.post('/api/calories/add', verifyToken, async (req, res) => {
    try {
        const { amount } = req.body;
        const todayStr = new Date().toISOString().split('T')[0];
        let user = await User.findOne({ email: req.user.email });
        
        if (!user) user = new User({ email: req.user.email, supabaseId: req.user.id });

        let logIndex = user.calorieLogs.findIndex(l => l.date === todayStr);
        if (logIndex === -1) {
            user.calorieLogs.push({ date: todayStr, foods: [], manualEntries: [], activities: [] });
            logIndex = user.calorieLogs.length - 1;
        }

        user.calorieLogs[logIndex].manualEntries.push({
            amount: Number(amount),
            timestamp: new Date()
        });

        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. GET TODAY'S TOTAL (Used by Homepage Widget)
app.get('/api/calories/today', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.json({ totalCalories: 0, goal: 2200 });

        const todayStr = new Date().toISOString().split('T')[0];
        const log = user.calorieLogs.find(l => l.date === todayStr);

        let total = 0;
        if (log) {
            const food = log.foods.reduce((sum, i) => sum + i.calories, 0);
            const manual = log.manualEntries.reduce((sum, i) => sum + i.amount, 0);
            const burned = log.activities.reduce((sum, i) => sum + i.calories, 0);
            total = (food + manual) - burned;
        }

        res.json({ totalCalories: Math.max(0, total), goal: user.dailyGoal });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. DELETE ITEM (Used by Calorie Page)
app.post('/api/delete', verifyToken, async (req, res) => {
    try {
        const { itemId, type } = req.body; // type: 'food' or 'activity'
        const todayStr = new Date().toISOString().split('T')[0];

        // Note: The frontend sends 'type' as 'food' or 'activity'. 
        // We need to check foods, manualEntries, and activities.
        
        const update = {};
        if (type === 'food') {
            // Try removing from both foods array and manualEntries array
            // It's safer to pull from both since frontend might not distinguish cleanly
            update.$pull = { 
                "calorieLogs.$.foods": { _id: itemId },
                "calorieLogs.$.manualEntries": { _id: itemId } 
            };
        } else {
            update.$pull = { "calorieLogs.$.activities": { _id: itemId } };
        }

        await User.updateOne(
            { email: req.user.email, "calorieLogs.date": todayStr },
            update
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =======================
// C. RECIPES & AI (Groq)
// =======================

app.post('/api/generate-recipe', async (req, res) => {
    try {
        const { query } = req.body;
        console.log("🤖 AI Request:", query);

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a chef. Return ONLY valid JSON with keys: 'ingredients' (array of strings) and 'instructions' (array of strings)." },
                { role: "user", content: `Recipe for: ${query}` }
            ],
            model: "openai/gpt-oss-120b",
            temperature: 0.5,
        });

        const jsonStr = completion.choices[0]?.message?.content.replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(jsonStr));
    } catch (err) {
        console.error("Groq Error:", err);
        res.status(500).json({ ingredients: ["Error"], instructions: ["Please try again."] });
    }
});

// 🪄 MAGIC LINK RECIPE EXTRACTOR (YouTube, Shorts, Instagram Reels, TikTok)
app.post('/api/magic-extract', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "No URL provided" });
        console.log("🪄 Magic Extractor Request:", url);

        let platform = "Social Video";
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            platform = url.includes("/shorts/") ? "YouTube Shorts" : "YouTube";
        } else if (url.includes("instagram.com")) {
            platform = "Instagram Reel";
        } else if (url.includes("tiktok.com")) {
            platform = "TikTok";
        }

        const prompt = `You are a world-class culinary AI and social media recipe extractor.
The user pasted this social video link: "${url}".
Analyze this URL, deduce the viral dish/cooking video it represents or craft a top-trending viral culinary recipe that fits the slug/context of this link.
Return ONLY raw, valid JSON (no markdown formatting, no code fences, no extra text) with this exact schema:
{
  "title": "Short, punchy recipe title",
  "description": "Engaging 1-2 sentence description of the dish and flavor profile.",
  "sourcePlatform": "${platform}",
  "sourceUrl": "${url}",
  "prepTime": 10,
  "cookTime": 15,
  "servings": 2,
  "calories": 480,
  "protein": 24,
  "carbs": 52,
  "fat": 16,
  "difficulty": "Easy",
  "tags": ["High Protein", "Under 20 Mins", "Meal Prep"],
  "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "ingredients": [
    { "item": "Ingredient name", "amount": "Quantity", "category": "Produce" }
  ],
  "steps": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "tips": "Pro chef tip for maximum flavor"
}`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an expert chef AI that returns ONLY valid JSON. Never enclose in backticks or markdown." },
                { role: "user", content: prompt }
            ],
            model: "openai/gpt-oss-120b",
            temperature: 0.3,
        });

        let jsonStr = completion.choices[0]?.message?.content || '{}';
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const recipeData = JSON.parse(jsonStr);
        res.json(recipeData);
    } catch (err) {
        console.error("Magic Extractor Error:", err);
        res.status(500).json({ error: "Failed to extract recipe: " + err.message });
    }
});

// 🤖 GROQ CLOUD CHEF ASSISTANT (Answers any culinary question)
app.post('/api/ask-chef', async (req, res) => {
    try {
        const { question, recipeTitle, ingredients } = req.body;
        if (!question) return res.status(400).json({ error: "No question provided" });
        console.log("👨‍🍳 Groq Chef Question:", question);

        let contextPrompt = "";
        if (recipeTitle) {
            contextPrompt = `\nThe user is currently cooking or viewing this dish: "${recipeTitle}".`;
            if (ingredients && ingredients.length > 0) {
                const ingStr = Array.isArray(ingredients) 
                    ? ingredients.map(i => (typeof i === 'object' ? `${i.amount || ''} ${i.item || ''}` : i)).join(', ')
                    : ingredients;
                contextPrompt += ` Ingredients list: ${ingStr}.`;
            }
        }

        const messages = [
            {
                role: "system",
                content: `You are Chef Auguste, an elite master chef and friendly AI culinary advisor for the FridgeChef mobile app powered by Groq Cloud.
Provide helpful, concise, mouth-watering cooking advice.
Guidelines:
- Answer directly and with culinary precision.
- For ingredient substitutions, specify exact ratio, flavor difference, and texture impact.
- For techniques, give actionable pro-tips.
- If user asks what to cook with ingredients, give 2 creative dish ideas.
- Format with short bullet points and emojis for easy reading on mobile screens.`
            },
            {
                role: "user",
                content: `${contextPrompt}\n\nQuestion: ${question}`
            }
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: "openai/gpt-oss-120b",
            temperature: 0.6,
            max_tokens: 500
        });

        const answer = completion.choices[0]?.message?.content || "I am currently adjusting my kitchen timers. Please try asking again!";
        res.json({ success: true, answer, question });
    } catch (err) {
        console.error("Groq Ask Chef Error:", err);
        res.status(500).json({ error: "Failed to answer question: " + err.message });
    }
});

// 🖼️ RECIPE IMAGE API (Fetches real food photos via Wikipedia PageImages & Unsplash)
app.get('/api/recipe-image', async (req, res) => {
    try {
        const query = req.query.query || 'gourmet food';
        const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=800&origin=*&titles=${encodeURIComponent(query)}`;
        const response = await fetch(wikiUrl);
        const data = await response.json();
        const pages = data.query?.pages;

        let imageUrl = defaultImage;
        if (pages) {
            const pageId = Object.keys(pages)[0];
            if (pageId !== "-1" && pages[pageId].thumbnail?.source) {
                imageUrl = pages[pageId].thumbnail.source;
            }
        }

        res.json({ query, imageUrl, success: true });
    } catch (err) {
        console.error("Recipe Image Error:", err);
        res.json({ query: req.query.query, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', success: false });
    }
});

// Standard Recipe Routes
app.get('/api/recipes', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        res.json(user ? user.savedRecipes : []);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/recipes/save', verifyToken, async (req, res) => {
    try {
        const { recipe } = req.body; 
        const user = await User.findOne({ email: req.user.email });
        if(user) {
            user.savedRecipes.push(recipe);
            await user.save();
            res.json(user.savedRecipes);
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/recipes/delete', verifyToken, async (req, res) => {
    try {
        const { recipeId } = req.body;
        const user = await User.findOneAndUpdate(
            { email: req.user.email },
            { $pull: { savedRecipes: { _id: recipeId } } },
            { new: true }
        );
        res.json(user.savedRecipes);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// =======================
// D. PLANNER & INVENTORY
// =======================

app.get('/api/plan', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        res.json(user ? user.weeklyPlan : []);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/plan', verifyToken, async (req, res) => {
    try {
        const { day, morning, afternoon, evening } = req.body;
        const user = await User.findOne({ email: req.user.email });
        const dayIndex = user.weeklyPlan.findIndex(p => p.day === day);
        if (dayIndex > -1) {
            user.weeklyPlan[dayIndex].morning = morning;
            user.weeklyPlan[dayIndex].afternoon = afternoon;
            user.weeklyPlan[dayIndex].evening = evening;
        } else {
            user.weeklyPlan.push({ day, morning, afternoon, evening });
        }
        await user.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/inventory', verifyToken, async (req, res) => {
    try {
        const { inventory } = req.body;
        const user = await User.findOneAndUpdate(
            { email: req.user.email }, 
            { $set: { inventory } }, 
            { new: true, upsert: true }
        );
        res.json(user.inventory);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));