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
