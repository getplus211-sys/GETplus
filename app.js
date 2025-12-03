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
// કૃપા કરીને તમારા વાસ્તવિક ક્રેડેન્શિયલ્સનો ઉપયોગ કરો
const SUPABASE_URL = 'https://bhmycvrbucmbbrpzeane.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YKcxL1wwxPBLtnUZZzIAA_BwsFqgYv';

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
    
    // તમારા નવા ફોર્મમાંથી માત્ર જરૂરી ફીલ્ડ્સ (ઈમેલ અને પાસવર્ડ) મેળવો.
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // T&C ચેકબોક્સ તપાસો (જો જરૂરી હોય તો)
    const tncChecked = document.getElementById('tnc').checked;
    
    const messageDiv = document.getElementById('message');
    
    if (!tncChecked) {
         messageDiv.textContent = 'કૃપા કરીને T&C સ્વીકારો.';
         messageDiv.style.color = 'red';
         return;
    }

    messageDiv.textContent = 'રજીસ્ટર થઈ રહ્યું છે...';
    messageDiv.style.color = '#000';

    // Supabase રજીસ્ટ્રેશન API કોલ
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        // જો તમે નામ અને અટક (Name, Surname) Supabase માં સ્ટોર કરવા માંગો છો
        options: {
            data: {
                full_name: document.getElementById('name').value + ' ' + document.getElementById('surname').value,
            }
        }
    });

    if (error) {
        messageDiv.textContent = `ભૂલ: ${error.message}`;
        messageDiv.style.color = 'red';
    } else if (data.user) {
        // રજીસ્ટ્રેશન સફળ - home.html પર રીડાયરેક્ટ કરો
        messageDiv.textContent = 'રજીસ્ટ્રેશન સફળ! home page પર રીડાયરેક્ટ થઈ રહ્યું છે...';
        messageDiv.style.color = 'green';
        
        // Supabase સામાન્ય રીતે ઈમેલ કન્ફર્મેશન મોકલે છે.
        // જો તમે ઈમેલ કન્ફર્મેશન બંધ કર્યું હોય, તો સીધું રીડાયરેક્ટ કરો.
        // જો ચાલુ હોય, તો નીચેનો કોડ વાપરો:
        if (data.session) {
            // જો સત્ર તરત જ બને (કોઈ ઈમેલ કન્ફર્મેશન નહીં)
            setTimeout(() => {
                navigateTo('home');
            }, 1000);
        } else {
             // ઈમેલ કન્ફર્મેશન જરૂરી છે
             messageDiv.textContent = 'રજીસ્ટ્રેશન સફળ! કૃપા કરીને તમારા ઇમેઇલની પુષ્ટિ કરો અને પછી લોગિન કરો.';
             messageDiv.style.color = '#ff8c00'; // Orange
             setTimeout(() => {
                navigateTo('login');
            }, 3000);
        }
    } else {
         messageDiv.textContent = 'રજીસ્ટ્રેશન પ્રક્રિયા પૂર્ણ. ઇમેઇલ ચકાસો.';
         messageDiv.style.color = '#ff8c00'; 
    }
}


// ==========================================================
// 3. લોગિન લોજિક (Login Logic) - (કોઈ ફેરફાર નથી)
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
// 4. હોમ પેજ લોજિક (Home Page Logic) - (કોઈ ફેરફાર નથી)
// ==========================================================

async function checkSession() {
    // આ કોડ હોમ પેજમાં યુઝર લોગિન છે કે નહીં તે તપાસે છે.
    const userInfoDiv = document.getElementById('user-info');
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 'તમે લોગિન નથી. રીડાયરેક્ટ કરી રહ્યાં છીએ...';
        }
        setTimeout(() => {
            navigateTo('login');
        }, 1000);
        return null;
    } else {
        if (userInfoDiv) {
            // જો user_metadata માં full_name હોય તો તે દર્શાવો
            const userName = user.user_metadata?.full_name || user.email;
            userInfoDiv.innerHTML = `👋 સ્વાગત છે, **${userName}**!<br>તમે સફળતાપૂર્વક લોગિન કર્યું છે.`;
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
        checkSession();
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    }
});
