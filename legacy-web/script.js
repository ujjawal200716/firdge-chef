// ==========================================
// 0. SUPABASE CONFIGURATION
// ==========================================
const SUPABASE_URL = 'https://dzdrduqwkfdznkqtjuai.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eHdGsaJOPDvhoUL_1sipWw_RxFvhAy2';

let supabaseClient;
try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase initialized.");
    } else {
        console.warn('Supabase SDK not loaded.');
    }
} catch (e) {
    console.error("Supabase init error:", e);
}

// Global Auth State
let currentUser = null;
let isLoginMode = true;

// ==========================================
// 1. INITIALIZATION (Main Entry Point)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log("App Initializing...");

    // 1. Setup All UI Listeners (Auth + Dashboard)
    setupAuthListeners();
    setupProfileDropdown();
    setupDashboardModals(); // Moved from top of file to here

    // 2. Check Session
    if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        updateAuthUI(session);

        supabaseClient.auth.onAuthStateChange((_event, session) => {
            updateAuthUI(session);
        });
    }
});

// ==========================================
// 2. DASHBOARD MODALS (Saved & Plan)
// ==========================================
function setupDashboardModals() {
    // Saved Recipes Logic
    const openSavedBtn = document.getElementById('openSavedBtn');
    const savedModal = document.getElementById('savedModal');
    const closeSavedModal = document.getElementById('closeSavedModal');
    const profileDropdown = document.getElementById('profileDropdown');

    if (openSavedBtn && savedModal) {
        openSavedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            savedModal.classList.add('open');
            if(profileDropdown) profileDropdown.classList.remove('show'); // Close menu
        });
    }
    if (closeSavedModal && savedModal) {
        closeSavedModal.addEventListener('click', () => {
            savedModal.classList.remove('open');
        });
    }

    // Weekly Plan Logic
    const openPlanBtn = document.getElementById('openPlanBtn');
    const planModal = document.getElementById('planModal');
    const closePlanModal = document.getElementById('closePlanModal');

    if (openPlanBtn && planModal) {
        openPlanBtn.addEventListener('click', (e) => {
            e.preventDefault();
            planModal.classList.add('open');
            if(profileDropdown) profileDropdown.classList.remove('show'); // Close menu
        });
    }
    if (closePlanModal && planModal) {
        closePlanModal.addEventListener('click', () => {
            planModal.classList.remove('open');
        });
    }

    // Global Close (Clicking outside modals)
    window.addEventListener('click', (e) => {
        if (savedModal && e.target === savedModal) savedModal.classList.remove('open');
        if (planModal && e.target === planModal) planModal.classList.remove('open');
    });
}

// ==========================================
// 3. PROFILE DROPDOWN
// ==========================================
function setupProfileDropdown() {
    const profileToggleBtn = document.getElementById('profileToggleBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileToggleBtn && profileDropdown) {
        // Toggle Menu
        profileToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevents window click from firing immediately
            profileDropdown.classList.toggle('show');
        });

        // Close when clicking anywhere else
        window.addEventListener('click', function(e) {
            if (!profileToggleBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }
}

// ==========================================
// 4. AUTH LISTENERS & LOGIC
// ==========================================
function setupAuthListeners() {
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navSignOutBtn = document.getElementById('navSignOutBtn');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const authForm = document.getElementById('authForm');
    const authModal = document.getElementById('authModal');

    // Open Modal
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal();
        });
    }

    // Sign Out
    if (navSignOutBtn) {
        navSignOutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Close Modal
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', closeAuthModalFunc);
    }

    // Click Outside Modal to Close
    if (authModal) {
        window.addEventListener('click', (e) => {
            if (e.target === authModal) closeAuthModalFunc();
        });
    }

    // Toggle Login/Signup
    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            updateModalMode();
        });
    }

    // Submit Form
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
}

// ==========================================
// 5. AUTH ACTIONS
// ==========================================
async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('submitAuthBtn');
    const msg = document.getElementById('authMessage');
    
    // Dynamically get name input (only exists in Signup mode)
    const fullNameInput = document.getElementById('fullName');

    btn.disabled = true;
    btn.textContent = 'Processing...';
    msg.textContent = '';

    try {
        if (!supabaseClient) throw new Error("Supabase not connected.");

        if (isLoginMode) {
            // LOGIN
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            
            closeAuthModalFunc();
            showNotification('Successfully Logged In!');
        } else {
            // SIGN UP
            const fullName = fullNameInput ? fullNameInput.value : '';
            
            const { error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { 
                    data: { full_name: fullName } 
                }
            });
            
            if (error) throw error;
            
            msg.textContent = "Check your email to confirm!";
            msg.style.color = "green";
        }
    } catch (err) {
        console.error(err);
        msg.textContent = err.message || "An error occurred";
        msg.style.color = "red";
    } finally {
        btn.disabled = false;
        btn.textContent = isLoginMode ? 'Log In' : 'Sign Up';
    }
}

async function handleLogout() {
    if (supabaseClient) {
        await supabaseClient.auth.signOut();
        showNotification('Logged out successfully.');
        // UI updates automatically via onAuthStateChange
    }
}

// ==========================================
// 6. UI UPDATES
// ==========================================
function updateAuthUI(session) {
    const loginLi = document.getElementById('loginLi');
    const profileLi = document.getElementById('profileLi');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userAvatar = document.getElementById('userAvatar');
    const userEmailDisplay = document.querySelector('.user-email');

    if (session) {
        // --- LOGGED IN ---
        currentUser = session.user;
        
        if(loginLi) loginLi.classList.add('hidden');
        if(profileLi) profileLi.classList.remove('hidden');

        const email = session.user.email;
        // Safety check using optional chaining (?.)
        const metaName = session.user.user_metadata?.full_name;
        const displayName = metaName || email.split('@')[0];

        if(userNameDisplay) userNameDisplay.textContent = displayName;
        if(userEmailDisplay) userEmailDisplay.textContent = email;

        if(userAvatar) {
            userAvatar.src = `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff`;
        }
    } else {
        // --- LOGGED OUT ---
        currentUser = null;

        if(loginLi) loginLi.classList.remove('hidden');
        if(profileLi) profileLi.classList.add('hidden');
        
        const dropdown = document.getElementById('profileDropdown');
        if(dropdown) dropdown.classList.remove('show');
    }
}

// ==========================================
// 7. HELPER UTILITIES
// ==========================================
function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
        // Small delay to allow CSS transition to catch the display change
        setTimeout(() => modal.classList.add('open'), 10);
    }
}

function closeAuthModalFunc() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => {
            modal.style.display = 'none';
            document.getElementById('authForm').reset();
            const msg = document.getElementById('authMessage');
            if(msg) msg.textContent = '';
        }, 300);
    }
}

function updateModalMode() {
    const title = document.getElementById('authTitle');
    const btn = document.getElementById('submitAuthBtn');
    const toggleText = document.getElementById('toggleAuthMode');
    const form = document.getElementById('authForm');
    
    const existingName = document.getElementById('nameInputGroup');
    if(existingName) existingName.remove();

    if (isLoginMode) {
        title.textContent = "Welcome Back";
        btn.textContent = "Log In";
        toggleText.innerHTML = `Don't have an account? <b>Create one</b>`;
    } else {
        title.textContent = "Create Account";
        btn.textContent = "Sign Up";
        
        // Add Name Field
        const nameGroup = document.createElement('div');
        nameGroup.className = 'input-group';
        nameGroup.id = 'nameInputGroup';
        nameGroup.innerHTML = `<input type="text" id="fullName" placeholder="Full Name" required style="width:100%; margin-bottom:10px; padding:10px;">`;
        // Insert before email (assuming email is the first .input-group)
        const firstInput = form.querySelector('.input-group');
        form.insertBefore(nameGroup, firstInput); 
        
        toggleText.innerHTML = `Already have an account? <b>Log In</b>`;
    }
}

function showNotification(msg) {
    alert(msg); 
}