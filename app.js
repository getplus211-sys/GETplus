// ==========================================================
// 1. Supabase Client Initialization
// ==========================================================
// IMPORTANT: Please replace these with your actual Supabase credentials!
// Failure to replace these placeholders will cause the application to fail.
const SUPABASE_URL = 'https://bhmycvrbucmbbrpzeane.supabase.co'; // REPLACE THIS
const SUPABASE_ANON_KEY = 'sb_publishable_YKcxL1DwwxPBLtnUZZzIAA_BwsFqgYv'; // REPLACE THIS

// Initialize Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Navigation utility function
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// ==========================================================
// 2. Registration Logic
// ==========================================================

async function handleRegistration(e) {
    e.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tncChecked = document.getElementById('tnc').checked;
    
    const messageDiv = document.getElementById('message');
    
    if (!tncChecked) {
         messageDiv.textContent = 'Please accept the Terms & Conditions.';
         messageDiv.style.color = 'red';
         return;
    }

    messageDiv.textContent = 'Registering user...';
    messageDiv.style.color = '#000';

    // Supabase Registration API Call
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: document.getElementById('name').value + ' ' + document.getElementById('surname').value,
            }
        }
    });

    if (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = 'red';
    } else if (data.user) {
        
        if (data.session) {
            // Registration successful with immediate sign-in
            messageDiv.textContent = 'Registration successful! Redirecting to Home...';
            messageDiv.style.color = 'green';
            setTimeout(() => {
                navigateTo('home'); 
            }, 1000);
        } else {
             // Email confirmation is required
             messageDiv.textContent = 'Registration successful! Please confirm your email before logging in.';
             messageDiv.style.color = '#ff8c00'; // Orange
             setTimeout(() => {
                navigateTo('login');
            }, 3000);
        }
    } else {
         messageDiv.textContent = 'Registration complete. Check your email for verification link.';
         messageDiv.style.color = '#ff8c00'; 
    }
}


// ==========================================================
// 3. Login Logic
// ==========================================================

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    messageDiv.textContent = 'Logging in...';
    messageDiv.style.color = '#000';

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = 'red';
    } else {
        // Successful Login REDIRECT TO HOME.HTML
        messageDiv.textContent = 'Login successful! Redirecting to Home...';
        messageDiv.style.color = 'green';
        setTimeout(() => {
            navigateTo('home');
        }, 1000);
    }
}

// ==========================================================
// 4. Forgot Password Logic (For Modal/Popup)
// ==========================================================

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const popupMessage = document.getElementById('forgot-popup-message');
    const popupForm = document.getElementById('forgot-password-form');
    const popupContent = document.getElementById('forgot-password-content');
    
    popupMessage.textContent = 'Sending reset link...';
    popupMessage.style.color = '#000';

    // Supabase API call to send reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // IMPORTANT: Change this URL to your actual hosted URL path for password reset
        redirectTo: window.location.origin + '/reset-password.html', 
    });

    if (error) {
        popupMessage.textContent = `Error: ${error.message}`;
        popupMessage.style.color = 'red';
    } else {
        // Success message and 30-second timer
        
        // Hide form fields and show success message
        popupForm.style.display = 'none'; 
        
        popupContent.innerHTML = `
            <div style="text-align:center; padding: 20px;">
                <i class="fas fa-envelope-open-text" style="color:#764ba2; font-size:3em; margin-bottom:15px;"></i>
                <h3 style="color:#764ba2;">Email Sent</h3>
                <p>Please check your email inbox for the password reset link.</p>
                <p style="margin-top:10px; font-weight:bold;">This message will close in 30 seconds.</p>
                <button id="forgot-popup-back-btn" style="width:auto; margin-top:20px; padding:10px 20px; background: #667eea;">
                   Back
                </button>
            </div>
        `;

        const backBtn = document.getElementById('forgot-popup-back-btn');
        if (backBtn) backBtn.addEventListener('click', closeForgotPasswordPopup);
        
        // Close the popup after 30 seconds (30000 milliseconds)
        setTimeout(closeForgotPasswordPopup, 30000); 
    }
}

function closeForgotPasswordPopup() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.style.display = 'none';
    
    // Reset the popup content back to the input form
    const popupContent = document.getElementById('forgot-password-content');
    if (popupContent) {
        // Rebuild the input form structure
        popupContent.innerHTML = `
            <h3>Forgot Password?</h3>
            <p>Enter the email address associated with your account.</p>
            <form id="forgot-password-form">
                <input type="email" id="forgot-email" placeholder="Email" required>
                <div id="forgot-popup-message" style="margin-bottom:15px; font-weight:bold; font-size: 0.9em;"></div>
                <button type="submit" id="send-link-btn" style="width: 100%; background: linear-gradient(90deg, #667eea, #764ba2);">Send Link</button>
            </form>
        `;
    }

    // Re-attach the form submission listener for the newly created form
    const newForm = document.getElementById('forgot-password-form');
    if (newForm) newForm.addEventListener('submit', handleForgotPassword);
}

function openForgotPasswordPopup(e) {
    if(e) e.preventDefault();
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.style.display = 'flex';
    closeForgotPasswordPopup(); // Ensure the popup starts in the form state
}


// ==========================================================
// 5. Home Page Logic (Session Check and Logout)
// ==========================================================

async function checkSession() {
    // Check if the user is logged in
    const userInfoDiv = document.getElementById('user-info');
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 'You are not logged in. Redirecting to Login...'; 
        }
        setTimeout(() => {
            navigateTo('login');
        }, 1000);
        return null;
    } else {
        if (userInfoDiv) {
            // Display user info
            const userName = user.user_metadata?.full_name || user.email;
            userInfoDiv.innerHTML = `👋 Welcome, **${userName}**!<br>You are successfully logged in.`;
        }
        return user;
    }
}

async function handleLogout() {
    // Log out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Logout Error:', error.message);
    } else {
        // Redirect to login page after successful logout
        navigateTo('login');
    }
}


// ==========================================================
// 6. Event Listeners (Page Initialization)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // Check which page we are on and attach corresponding listeners
    
    if (path.includes('registration.html')) {
        const form = document.getElementById('registration-form');
        if (form) form.addEventListener('submit', handleRegistration); 
    } 
    
    else if (path.includes('login.html')) {
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        
        const forgotLink = document.getElementById('forgot-password-link');
        if (forgotLink) forgotLink.addEventListener('click', openForgotPasswordPopup);
        
        // This listener ensures the initial form in the modal works
        const forgotForm = document.getElementById('forgot-password-form');
        if (forgotForm) forgotForm.addEventListener('submit', handleForgotPassword);
    } 
    
    else if (path.includes('home.html')) {
        checkSession();
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    }
});
