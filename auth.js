const adminAuth = {
  isLoggedIn() {
    const local = localStorage.getItem('gh_admin_auth');
    const session = sessionStorage.getItem('gh_admin_auth');
    const valid = ['firebase-session', 'demo-session', 'true'];
    return valid.includes(local) || valid.includes(session) || Boolean(window.firebaseAuthService?.currentUser());
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('gh_admin_user') || sessionStorage.getItem('gh_admin_user') || '{}');
    } catch {
      return {};
    }
  },
  logout() {
    localStorage.removeItem('gh_admin_auth');
    sessionStorage.removeItem('gh_admin_auth');
    localStorage.removeItem('gh_admin_user');
    sessionStorage.removeItem('gh_admin_user');
    try {
      window.firebaseAuthService?.signOut();
    } catch (e) {}
    location.href = 'login.html';
  },
  guard() {
    if (!this.isLoggedIn()) {
      location.href = 'login.html';
    }
  }
};

function loadFirebaseClient() {
  if (window.firebaseAuthService) return Promise.resolve();
  const files = [
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
    '../Firebase/firebase-config.js',
    '../Firebase/auth-service.js',
    '../Firebase/firestore-service.js',
    '../Firebase/cms-service.js'
  ];
  return files.reduce((chain, src) => chain.then(() => new Promise(resolve => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => resolve(); // continue gracefully even if network is restricted
    document.head.append(script);
  })), Promise.resolve()).then(() => {
    if (window.firebase && !firebase.apps.length && window.ghanshyamFirebaseConfig) {
      try {
        firebase.initializeApp(window.ghanshyamFirebaseConfig);
      } catch (e) {
        console.warn('Firebase init notice:', e);
      }
    }
  }).catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
  // Guard protected admin pages
  if (document.body.dataset.public !== 'true') {
    adminAuth.guard();
  }

  // Pre-load Firebase client in the background
  loadFirebaseClient();

  // Populate remembered email if available
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    const savedEmail = localStorage.getItem('gh_remember_email');
    if (savedEmail && loginForm.email) {
      loginForm.email.value = savedEmail;
    }
  }

  // Handle Login submission
  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const button = loginForm.querySelector('button');
    const errorBox = document.querySelector('#login-error');
    button.disabled = true;
    button.textContent = 'SIGNING IN...';
    errorBox.textContent = '';

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;
    const remember = Boolean(loginForm.remember?.checked);

    if (remember) {
      localStorage.setItem('gh_remember_email', email);
    } else {
      localStorage.removeItem('gh_remember_email');
    }

    const DEMO_EMAIL = 'admin@ghanshyamoli.com';
    const DEMO_PASS = 'admin123';
    const isDemo = (email.toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASS);

    await loadFirebaseClient();

    if (isDemo) {
      // Demo credentials match! Attempt Firebase auth in background if user exists, else establish demo session.
      let authType = 'demo-session';
      if (window.firebaseAuthService?.isAvailable()) {
        try {
          await firebaseAuthService.signIn(email, password, remember);
          authType = 'firebase-session';
        } catch (fbErr) {
          // Account not pre-created in Firebase Console; seamlessly proceed with demo admin
        }
      }
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('gh_admin_auth', authType);
      storage.setItem('gh_admin_user', JSON.stringify({
        email: DEMO_EMAIL,
        name: 'GHANSHYAM OLI (Admin)',
        role: 'admin'
      }));
      location.href = 'dashboard.html';
      return;
    }

    // Attempt Firebase Email/Password Authentication (Spark / Free Plan)
    try {
      if (!window.firebaseAuthService?.isAvailable()) {
        throw new Error('Firebase Auth service is unavailable. Check your internet connection or use the demo credentials: admin@ghanshyamoli.com / admin123');
      }
      await firebaseAuthService.signIn(email, password, remember);
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('gh_admin_auth', 'firebase-session');
      const currentUser = firebase.auth().currentUser;
      storage.setItem('gh_admin_user', JSON.stringify({
        email: currentUser?.email || email,
        uid: currentUser?.uid,
        name: currentUser?.displayName || 'Admin User',
        role: 'admin'
      }));
      location.href = 'dashboard.html';
    } catch (error) {
      button.disabled = false;
      button.textContent = 'LOGIN';
      const messages = {
        'auth/invalid-credential': 'Email or password is incorrect. Use your Firebase account or the demo credentials.',
        'auth/user-not-found': 'No Firebase user found with this email. You can sign in using demo credentials: admin@ghanshyamoli.com / admin123',
        'auth/wrong-password': 'The Firebase password is incorrect.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/user-disabled': 'This Firebase account has been disabled.',
        'auth/network-request-failed': 'Network connection issue. You can sign in using demo credentials: admin@ghanshyamoli.com / admin123'
      };
      errorBox.textContent = messages[error.code] || error.message || 'Login failed. Use a Firebase account or the clearly marked demo credentials.';
    }
  });

  // Attach logout handler to all logout elements
  document.querySelectorAll('[data-logout]').forEach(x => {
    x.addEventListener('click', () => adminAuth.logout());
  });
});
