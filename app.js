// ==========================================================
// 1. Supabase Client Initialization
// ==========================================================

// તમારા આપેલા Supabase ક્રેડેન્શિયલ્સ
const SUPABASE_URL = 'https://bhmycvrbucmbbrpzeane.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YKcxL1DwwxPBLtnUZZzIAA_BwsFqgYv';

// સુનિશ્ચિત કરો કે તમે તમારા HTML માં Supabase CDN લિંક કરી છે.
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// નેવિગેશન ફંક્શન
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// ==========================================================
// 2. રજીસ્ટ્રેશન લોજિક (Registration Logic)
// ==========================================================

async function handleRegistration(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    messageDiv.textContent = 'રજીસ્ટર થઈ રહ્યું છે...';
    messageDiv.style.color = '#000';

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        messageDiv.textContent = `ભૂલ: ${error.message}`;
        messageDiv.style.color = 'red';
    } else if (data.user) {
        messageDiv.textContent = 'રજીસ્ટ્રેશન સફળ! કૃપા કરીને તમારા ઇમેઇલની પુષ્ટિ કરો અને પછી લોગિન કરો.';
        messageDiv.style.color = 'green';
        setTimeout(() => {
            navigateTo('login');
        }, 3000);
    } else {
         // આ ત્યારે થાય છે જ્યારે ઇમેઇલ કન્ફર્મેશન જરૂરી હોય
         messageDiv.textContent = 'કૃપા કરીને તમારા ઇમેઇલની પુષ્ટિ કરો. કન્ફર્મેશન લિંક મોકલી દેવામાં આવી છે.';
         messageDiv.style.color = '#ff8c00'; 
    }
}

// ==========================================================
// 3. લોગિન લોજિક (Login Logic)
// ==========================================================

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    messageDiv.textContent = 'લોગિન થઈ રહ્યું છે...';
    messageDiv.style.color = '#000';

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        messageDiv.textContent = `ભૂલ: ${error.message}`;
        messageDiv.style.color = 'red';
    } else {
        messageDiv.textContent = 'લોગિન સફળ! હોમ પેજ પર રીડાયરેક્ટ કરી રહ્યાં છીએ...';
        messageDiv.style.color = 'green';
        setTimeout(() => {
            navigateTo('home');
        }, 1000);
    }
}

// ==========================================================
// 4. હોમ પેજ લોજિક (Home Page Logic)
// ==========================================================

async function checkSession() {
    const userInfoDiv = document.getElementById('user-info');
    
    // સત્ર તપાસો
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        // જો યુઝર લોગિન ન હોય, તો લોગિન પેજ પર મોકલો
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 'તમે લોગિન નથી. રીડાયરેક્ટ કરી રહ્યાં છીએ...';
        }
        setTimeout(() => {
            navigateTo('login');
        }, 1000);
        return null;
    } else {
        // જો યુઝર લોગિન હોય, તો માહિતી દર્શાવો
        if (userInfoDiv) {
            userInfoDiv.innerHTML = `**યુઝર ID:** ${user.id}<br>**ઇમેઇલ:** ${user.email}`;
        }
        return user;
    }
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        alert('લોગઆઉટમાં ભૂલ થઈ: ' + error.message);
    } else {
        alert('તમે સફળતાપૂર્વક લોગઆઉટ કર્યું છે.');
        navigateTo('login');
    }
}

// ==========================================================
// 5. ઇવેન્ટ લિસનર્સ (Page Initialization)
// ==========================================================

// DOM લોડ થયા પછી ઇવેન્ટ લિસનર્સ સેટ કરો
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('registration.html')) {
        const form = document.getElementById('registration-form');
        if (form) form.addEventListener('submit', handleRegistration);
    } 
    
    else if (path.includes('login.html')) {
        const form = document.getElementById('login-form');
        if (form) form.addEventListener('submit', handleLogin);
    } 
    
    else if (path.includes('home.html')) {
        // હોમ પેજ પર સત્ર ચકાસો અને લોગઆઉટ બટન સેટ કરો
        checkSession();
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    }
});

// ==========================================================
// 1. Supabase Client Initialization
// ==========================================================
// Please use your actual Supabase credentials
const SUPABASE_URL = 'https://bhmycvrbucmbbrpzeane.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YKcxL1wwxPBLtnUZZzIAA_BwsFqgYv';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Navigation Function
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// ==========================================================
// 2. Registration Logic
// ==========================================================

async function handleRegistration(e) {
    e.preventDefault();
    
    // Get required fields from the new form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tncChecked = document.getElementById('tnc').checked;
    
    const messageDiv = document.getElementById('message');
    
    if (!tncChecked) {
         messageDiv.textContent = 'Please accept the T&C to register.';
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
            messageDiv.textContent = 'Registration successful! Redirecting to home page...';
            messageDiv.style.color = 'green';
            setTimeout(() => {
                navigateTo('home'); // Redirect to home.html
            }, 1000);
        } else {
             // Email confirmation is required
             messageDiv.textContent = 'Registration successful! Please confirm your email and then log in.';
             messageDiv.style.color = '#ff8c00'; // Orange
             setTimeout(() => {
                navigateTo('login');
            }, 3000);
        }
    } else {
         messageDiv.textContent = 'Registration process complete. Please check your email for verification.';
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
        messageDiv.textContent = 'Login successful! Redirecting to home page...';
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
        redirectTo: 'http://localhost:5500/reset-password.html', // Update your actual reset URL
    });

    if (error) {
        popupMessage.textContent = `Error: ${error.message}`;
        popupMessage.style.color = 'red';
    } else {
        // Success message and 30-second timer
        popupForm.style.display = 'none'; // Hide the form
        
        popupContent.innerHTML = `
            <div style="text-align:center;">
                <i class="fas fa-check-circle" style="color:green; font-size:3em; margin-bottom:15px;"></i>
                <h3 style="color:#764ba2;">Email Sent</h3>
                <p>Please check your email inbox for the password reset link.</p>
                <p>Email sent to: <strong>${email}</strong></p>
                <p style="margin-top:10px;">This message will close in 30 seconds.</p>
                <button id="forgot-popup-back-btn" style="width:auto; margin-top:20px; padding:10px 20px;">
                   Back
                </button>
            </div>
        `;

        const backBtn = document.getElementById('forgot-popup-back-btn');
        if (backBtn) backBtn.addEventListener('click', closeForgotPasswordPopup);
        
        // Close the popup after 30 seconds
        setTimeout(closeForgotPasswordPopup, 30000); 
    }
}

function closeForgotPasswordPopup() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.style.display = 'none';
    
    // Reset the form to its original state
    const popupContent = document.getElementById('forgot-password-content');
    if (popupContent) {
        popupContent.innerHTML = `
            <h3>Forgot Password?</h3>
            <p>Enter the email address associated with your account.</p>
            <form id="forgot-password-form">
                <input type="email" id="forgot-email" placeholder="Email" required>
                <div id="forgot-popup-message" style="margin-bottom:15px; font-weight:bold;"></div>
                <button type="submit" id="send-link-btn">Send Link</button>
            </form>
        `;
    }

    // Re-attach the form submission listener
    const newForm = document.getElementById('forgot-password-form');
    if (newForm) newForm.addEventListener('submit', handleForgotPassword);
}

function openForgotPasswordPopup() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.style.display = 'flex';
}


// ==========================================================
// 5. Home Page Logic (Session Check and Logout)
// ==========================================================

async function checkSession() {
    // This checks if the user is logged in on the home page.
    const userInfoDiv = document.getElementById('user-info');
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 'You are not logged in. Redirecting...';
        }
        // Redirect to login page if no active session
        setTimeout(() => {
            navigateTo('login');
        }, 1000);
        return null;
    } else {
        if (userInfoDiv) {
            // Display user name/email
            const userName = user.user_metadata?.full_name || user.email;
            userInfoDiv.innerHTML = `👋 Welcome, **${userName}**!<br>You are successfully logged in.`;
        }
        return user;
    }
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        alert('Error during logout: ' + error.message);
    } else {
        alert('You have been successfully logged out.');
        navigateTo('login');
    }
}


// ==========================================================
// 6. Event Listeners (Page Initialization)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // Registration Form Listener
    if (path.includes('registration.html')) {
        const form = document.getElementById('registration-form');
        if (form) form.addEventListener('submit', handleRegistration); 
    } 
    
    // Login Form Listener
    else if (path.includes('login.html')) {
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        
        // Forgot Password Link Listener
        const forgotLink = document.getElementById('forgot-password-link');
        if (forgotLink) forgotLink.addEventListener('click', openForgotPasswordPopup);
        
        // Forgot Password Popup Form Listener (for initial state)
        const forgotForm = document.getElementById('forgot-password-form');
        if (forgotForm) forgotForm.addEventListener('submit', handleForgotPassword);
    } 
    
    // Home Page Listeners
    else if (path.includes('home.html')) {
        checkSession();
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    }
});
