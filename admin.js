const adminStore = {
  get(k, f) {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? f;
    } catch {
      return f;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch {
      return false;
    }
  }
};

const adminIcons = {
  grid: '▦',
  post: '▤',
  course: '◈',
  download: '⇩',
  user: '◉',
  chart: '⌁',
  settings: '⚙',
  message: '✉',
  bell: '♢',
  menu: '☰',
  plus: '+',
  search: '⌕'
};

const adminNav = [
  ['Dashboard', 'dashboard.html', 'dashboard', 'grid'],
  ['Posts', 'posts.html', 'posts', 'post'],
  ['Categories', 'categories.html', 'categories', 'grid'],
  ['Comments', 'comments.html', 'comments', 'message'],
  ['Media', 'media.html', 'media', 'download'],
  ['Courses', 'courses.html', 'courses', 'course'],
  ['Lessons', 'lessons.html', 'lessons', 'post'],
  ['Students', 'students.html', 'students', 'user'],
  ['Users', 'users.html', 'users', 'user'],
  ['Downloads', 'downloads.html', 'downloads', 'download'],

  ['Newsletter', 'newsletter.html', 'newsletter', 'message'],
  ['Messages', 'messages.html', 'messages', 'message'],
  ['Analytics', 'analytics.html', 'analytics', 'chart'],
  ['Notifications', 'notifications.html', 'notifications', 'bell'],
  ['Activity Logs', 'activity-log.html', 'activity', 'chart'],
  ['Settings', 'settings.html', 'settings', 'settings'],
  ['Profile', 'profile.html', 'profile', 'user']
];

function adminToast(msg) {
  let t = document.querySelector('.admin-toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'admin-toast';
    document.body.append(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.adminToastTimer);
  window.adminToastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function adminShell() {
  const active = document.body.dataset.page || 'dashboard';
  return `<aside class="admin-sidebar">
    <div class="admin-brand">
      <span>GO</span>
      <div>
        <strong>GHANSHYAM OLI</strong>
        <small>ADMIN PANEL</small>
      </div>
    </div>
    <button class="sidebar-close" aria-label="Close menu">×</button>
    <nav class="admin-nav">
      <a class="nav-label">WORKSPACE</a>
      ${adminNav.map(([name, url, key, icon]) => `<a class="${active === key ? 'active' : ''}" href="${url}"><i>${adminIcons[icon]}</i><span>${name}</span></a>`).join('')}
    </nav>
    <button class="admin-logout" data-logout>⇥ <span>Logout</span></button>
  </aside>
  <div class="admin-overlay"></div>
  <header class="admin-header">
    <button class="sidebar-toggle" aria-label="Toggle sidebar">☰</button>
    <div class="admin-search">
      <span>⌕</span>
      <input id="global-admin-search" placeholder="Search anything..." aria-label="Global search">
      <kbd>Ctrl K</kbd>
    </div>
    <div class="header-tools">
      <button class="header-icon" title="Notifications">♢<b>3</b></button>
      <button class="header-icon" data-theme title="Toggle theme">◐</button>
      <div class="admin-avatar">GO</div>
      <div class="admin-user">
        <strong>Admin</strong>
        <small>GHANSHYAM OLI</small>
      </div>
    </div>
  </header>`;
}

function pageTitle(title, desc) {
  const buttonLabel = title.endsWith('s') ? title.slice(0, -1) : title;
  return `<div class="admin-page-title">
    <div>
      <div class="admin-kicker">Workspace / ${title}</div>
      <h1>${title}</h1>
      <p>${desc}</p>
    </div>
    <div class="page-actions">
      <button class="admin-button outline" data-export>Export</button>
      <button class="admin-button" data-new>+ New ${buttonLabel}</button>
    </div>
  </div>`;
}

function table(headers, rows) {
  return `<div class="table-wrap">
    <table>
      <thead>
        <tr>${headers.map(x => `<th>${x}</th>`).join('')}</tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function emptyState(label) {
  return `<div class="admin-empty">
    <span>◌</span>
    <strong>No ${label} yet</strong>
    <p>New ${label.toLowerCase()} will appear here.</p>
  </div>`;
}

function setupAdmin() {
  if (!document.querySelector('link[href="css/components.css"]')) {
    const componentStyles = document.createElement('link');
    componentStyles.rel = 'stylesheet';
    componentStyles.href = 'css/components.css';
    document.head.append(componentStyles);
  }

  const shellEl = document.querySelector('#admin-shell');
  if (shellEl) {
    shellEl.innerHTML = adminShell();
  }

  const sidebar = document.querySelector('.admin-sidebar');
  const toggle = () => {
    sidebar?.classList.toggle('open');
    document.querySelector('.admin-overlay')?.classList.toggle('show');
  };

  document.querySelector('.sidebar-toggle')?.addEventListener('click', toggle);
  document.querySelector('.sidebar-close')?.addEventListener('click', toggle);
  document.querySelector('.admin-overlay')?.addEventListener('click', toggle);

  document.querySelector('[data-theme]')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-admin');
    adminStore.set('adminTheme', document.body.classList.contains('dark-admin'));
  });

  if (adminStore.get('adminTheme', false)) {
    document.body.classList.add('dark-admin');
  }

  // Handle + New item buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-new]');
    if (!btn) return;
    const page = document.body.dataset.page;
    if (page === 'posts' || page === 'dashboard') {
      location.href = 'post-editor.html';
    } else if (page === 'courses') {
      location.href = 'course-editor.html';
    } else if (page === 'categories') {
      const name = prompt('Enter category name:');
      if (name?.trim()) {
        adminData.categories.push(name.trim());
        adminStore.set('adminCategories', adminData.categories);
        adminToast(`Category "${name.trim()}" added`);
        setTimeout(() => location.reload(), 500);
      }
    } else if (page === 'downloads') {
      const addBtn = document.querySelector('#btn-add-download');
      if (addBtn) addBtn.click();
      else adminToast('Downloads manager ready');
    } else if (page === 'users') {
      const addBtn = document.querySelector('#btn-add-user');
      if (addBtn) addBtn.click();
      else adminToast('User manager ready');
    } else {
      adminToast('Create item form ready');
    }
  });

  document.querySelector('[data-export]')?.addEventListener('click', () => {
    const page = document.body.dataset.page;
    if (page === 'users') {
      document.querySelector('#btn-export-users')?.click();
    } else if (page === 'downloads') {
      document.querySelector('#btn-export-downloads')?.click();
    } else {
      adminToast('CSV export downloaded');
    }
  });


  document.querySelector('#global-admin-search')?.addEventListener('input', e => {
    if (e.target.value.trim()) {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('tbody tr').forEach(row => {
        row.hidden = !row.textContent.toLowerCase().includes(q);
      });
    } else {
      document.querySelectorAll('tbody tr').forEach(row => {
        row.hidden = false;
      });
    }
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.querySelector('#global-admin-search')?.focus();
    }
    if (e.key === 'Escape') {
      sidebar?.classList.remove('open');
      document.querySelector('.admin-overlay')?.classList.remove('show');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupAdmin();
  document.querySelector('#admin-content')?.classList.add('ready');
  if (document.body.dataset.page === 'dashboard') {
    const script = document.createElement('script');
    script.src = 'js/dashboard.js';
    document.body.append(script);
  }
});
