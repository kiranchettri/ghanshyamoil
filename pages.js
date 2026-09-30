function renderManager() {
  const root = document.querySelector('#manager');
  if (!root) return;
  const page = document.body.dataset.page;

  if (page === 'posts') {
    renderPostsManager(root);
    return;
  }

  if (page === 'users') {
    renderUsersManager(root);
    return;
  }

  if (page === 'downloads') {
    renderDownloadsManager(root);
    return;
  }

  if (page === 'notifications') {
    renderNotificationsManager(root);
    return;
  }

  const config = {
    categories: [
      'Categories', 'Organize your editorial library.',
      ['Name', 'Slug', 'Posts', 'Status', 'Actions'],
      adminData.categories.map((x, i) => `<tr>
        <td><strong>${x}</strong></td>
        <td>${x.toLowerCase().replaceAll(' ', '-')}</td>
        <td>${18 - i}</td>
        <td><span class="status">Active</span></td>
        <td class="row-actions"><button>Edit</button><button>Delete</button></td>
      </tr>`)
    ],
    comments: [
      'Comments', 'Review and moderate community feedback.',
      ['User', 'Comment', 'Post', 'Date', 'Status', 'Actions'],
      adminData.comments.map(x => `<tr>
        <td><strong>${x.user}</strong></td>
        <td>${x.comment}</td>
        <td>${x.post}</td>
        <td>${x.date}</td>
        <td><span class="status ${x.status}">${x.status}</span></td>
        <td class="row-actions"><button>Approve</button><button>Reply</button></td>
      </tr>`)
    ],
    courses: [
      'Courses', 'Manage curriculum, students, and revenue.',
      ['Course', 'Category', 'Students', 'Lessons', 'Status', 'Rating', 'Revenue', 'Actions'],
      adminData.courses.map(x => `<tr>
        <td><strong>${x.title}</strong></td>
        <td>${x.category}</td>
        <td>${x.students}</td>
        <td>${x.lessons}</td>
        <td><span class="status ${x.status}">${x.status}</span></td>
        <td>${x.rating}</td>
        <td>${x.revenue}</td>
        <td class="row-actions"><button>Edit</button><button>Delete</button></td>
      </tr>`)
    ],
    downloads: [
      'Downloads', 'Manage files, templates, and resources.',
      ['File', 'Type', 'Size', 'Downloads', 'Status', 'Date', 'Actions'],
      adminData.downloads.map(x => `<tr>
        <td><strong>${x.name}</strong></td>
        <td>${x.type}</td>
        <td>${x.size}</td>
        <td>${x.downloads}</td>
        <td><span class="status ${x.status}">${x.status}</span></td>
        <td>${x.date}</td>
        <td class="row-actions"><button>Edit</button><button>Delete</button></td>
      </tr>`)
    ],
    users: [
      'Users', 'Manage roles, access, and account status.',
      ['Name', 'Email', 'Role', 'Status', 'Joined', 'Last login', 'Actions'],
      adminData.users.map(x => `<tr>
        <td><strong>${x.name}</strong></td>
        <td>${x.email}</td>
        <td>${x.role}</td>
        <td><span class="status ${x.status}">${x.status}</span></td>
        <td>${x.joined}</td>
        <td>${x.last}</td>
        <td class="row-actions"><button>View</button><button>Block</button></td>
      </tr>`)
    ],
    messages: [
      'Messages', 'Keep up with contact and collaboration requests.',
      ['Name', 'Subject', 'Email', 'Date', 'Status', 'Actions'],
      adminData.messages.map(x => `<tr>
        <td><strong>${x.name}</strong></td>
        <td>${x.subject}</td>
        <td>${x.email}</td>
        <td>${x.date}</td>
        <td><span class="status ${x.status}">${x.status}</span></td>
        <td class="row-actions"><button>Reply</button><button>Archive</button></td>
      </tr>`)
    ],
    newsletter: [
      'Newsletter', 'Manage subscribers and campaigns.',
      ['Email', 'Name', 'Status', 'Subscribed', 'Actions'],
      ['alex@example.com', 'maya@example.com', 'rohan@example.com'].map((x, i) => `<tr>
        <td><strong>${x}</strong></td>
        <td>${['Alex', 'Maya', 'Rohan'][i]}</td>
        <td><span class="status">Active</span></td>
        <td>Sep ${18 - i}, 2026</td>
        <td class="row-actions"><button>Unsubscribe</button><button>Delete</button></td>
      </tr>`)
    ],
    lessons: [
      'Lessons', 'Manage lessons across every course.',
      ['Lesson', 'Course', 'Module', 'Duration', 'Status', 'Views', 'Actions'],
      ['What is Candlestick?', 'Open High Low Close', 'Support', 'Resistance'].map((x, i) => `<tr>
        <td><strong>${x}</strong></td>
        <td>Candlestick Mastery</td>
        <td>Module 0${i < 2 ? 1 : 2}</td>
        <td>${12 + i * 3} min</td>
        <td><span class="status">Published</span></td>
        <td>${410 - i * 44}</td>
        <td class="row-actions"><button>Edit</button><button>Preview</button></td>
      </tr>`)
    ],
    media: [
      'Media library', 'Manage images, videos, and documents.',
      ['File', 'Type', 'Size', 'Uploaded', 'Actions'],
      ['candlestick.jpg', 'Image', '1.8 MB', 'Sep 20, 2026', 'website-cover.jpg', 'Image', '2.1 MB', 'Sep 18, 2026', 'planner.pdf', 'Document', '860 KB', 'Sep 08, 2026'].reduce((a, x, i) => {
        if (i % 4 === 0) a.push([x]);
        else a[a.length - 1].push(x);
        return a;
      }, []).map(x => `<tr>
        <td><strong>${x[0]}</strong></td>
        <td>${x[1]}</td>
        <td>${x[2]}</td>
        <td>${x[3]}</td>
        <td class="row-actions"><button>Copy URL</button><button>Delete</button></td>
      </tr>`)
    ]
  };

  const c = config[page] || config.categories;
  root.innerHTML = pageTitle(c[0], c[1]) +
    `<div class="toolbar">
      <input class="admin-table-search" placeholder="Search ${c[0].toLowerCase()}..." aria-label="Search">
      <select>
        <option>All status</option>
        <option>Published</option>
        <option>Draft</option>
        <option>Pending</option>
      </select>
    </div>` +
    table(c[2], c[3].join(''));

  root.querySelector('.admin-table-search')?.addEventListener('input', e => {
    const val = e.target.value.toLowerCase();
    root.querySelectorAll('tbody tr').forEach(row => {
      row.hidden = !row.textContent.toLowerCase().includes(val);
    });
  });

  root.querySelectorAll('.row-actions button').forEach(b => {
    b.onclick = () => adminToast(`${b.textContent} action completed`);
  });
}

// DEDICATED POSTS MANAGER RENDERER
function renderPostsManager(root) {
  const allPosts = window.ghPostManager ? window.ghPostManager.getAll() : (adminData.posts || []);

  const drawTable = (filteredList) => {
    if (!filteredList.length) {
      return `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No articles match your search or filter criteria.</td></tr>`;
    }
    return filteredList.map(p => {
      const views = Number(p.views || 0).toLocaleString();
      const status = p.status || 'Published';
      return `<tr data-status="${status}">
        <td>
          <a href="post-editor.html?id=${p.id}" style="font-weight:700;color:inherit;" title="Edit article">
            ${p.title}
          </a>
        </td>
        <td><span class="tag-pill">${p.category || 'General'}</span></td>
        <td>${p.author || 'GHANSHYAM OLI'}</td>
        <td>${views}</td>
        <td><span class="status ${status}">${status}</span></td>
        <td>${p.date || 'Today'}</td>
        <td class="row-actions">
          <a href="post-editor.html?id=${p.id}" class="action-btn" title="Edit article">Edit</a>
          <button class="action-btn delete-btn" data-delete-id="${p.id}" data-delete-title="${encodeURIComponent(p.title)}" title="Delete article">Delete</button>
          <a href="../article.html?id=${p.id}" target="_blank" class="action-btn view-btn" title="View published article on public site">View ↗</a>
        </td>
      </tr>`;
    }).join('');
  };

  root.innerHTML = `
    <div class="admin-page-title">
      <div>
        <div class="admin-kicker">Workspace / Articles</div>
        <h1>Posts</h1>
        <p>Manage your articles, drafts, and publishing workflow across the website and Firestore.</p>
      </div>
      <div class="page-actions">
        <a href="../blog.html" target="_blank" class="admin-button outline">View Blog ↗</a>
        <a href="post-editor.html" class="admin-button">+ New Post</a>
      </div>
    </div>
    <div class="toolbar">
      <input class="admin-table-search" id="posts-search-input" placeholder="Search posts by title, author, or category..." aria-label="Search posts">
      <select id="posts-status-filter">
        <option value="All">All status (${allPosts.length})</option>
        <option value="Published">Published (${allPosts.filter(p => (p.status || 'Published') === 'Published').length})</option>
        <option value="Draft">Draft (${allPosts.filter(p => p.status === 'Draft').length})</option>
        <option value="Scheduled">Scheduled (${allPosts.filter(p => p.status === 'Scheduled').length})</option>
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Views</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="posts-table-body">
          ${drawTable(allPosts)}
        </tbody>
      </table>
    </div>
  `;

  // Search & Filter event listeners
  const searchInput = root.querySelector('#posts-search-input');
  const statusFilter = root.querySelector('#posts-status-filter');
  const tbody = root.querySelector('#posts-table-body');

  const filterPosts = () => {
    const q = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const currentList = window.ghPostManager ? window.ghPostManager.getAll() : (adminData.posts || []);
    const filtered = currentList.filter(p => {
      const matchStatus = (status === 'All') || ((p.status || 'Published') === status);
      const matchQuery = !q || `${p.title} ${p.category} ${p.author} ${p.excerpt || ''}`.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
    tbody.innerHTML = drawTable(filtered);
    bindDeleteButtons();
  };

  searchInput?.addEventListener('input', filterPosts);
  statusFilter?.addEventListener('change', filterPosts);

  // Bind Delete buttons
  const bindDeleteButtons = () => {
    root.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.deleteId;
        const title = decodeURIComponent(btn.dataset.deleteTitle || 'this post');
        if (!confirm(`Are you sure you want to delete "${title}"?\n\nThis will remove the post from the website and Firestore.`)) {
          return;
        }
        btn.disabled = true;
        btn.textContent = 'Deleting...';
        if (window.ghPostManager?.delete) {
          await window.ghPostManager.delete(id);
        }
        adminToast(`Post "${title}" deleted successfully.`);
        filterPosts();
      };
    });
  };

  bindDeleteButtons();
}

// =========================================================
// DEDICATED USERS MANAGER RENDERER
// =========================================================
function renderUsersManager(root) {
  const userManager = window.ghUserManager;
  if (!userManager) return;

  const escapeHtml = (str) => {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  const getInitials = (name) => {
    const parts = String(name || 'User').trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (parts[0].slice(0, 2)).toUpperCase();
  };

  const renderStatsHtml = (currentUsers) => {
    const total = currentUsers.length;
    const active = currentUsers.filter(u => u.status === 'Active').length;
    const staff = currentUsers.filter(u => ['Admin', 'Editor'].includes(u.role)).length;
    const students = currentUsers.filter(u => ['Student', 'User'].includes(u.role)).length;

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">◉</div>
          <strong>${total}</strong>
          <span>Total Users</span>
          <div class="stat-change" style="color:var(--accent)">+14% month</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#16a36a;background:#e9f8f1">✓</div>
          <strong>${active}</strong>
          <span>Active Accounts</span>
          <div class="stat-change" style="color:#16a36a">Live</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#ef4444;background:#fee2e2">★</div>
          <strong>${staff}</strong>
          <span>Admins & Editors</span>
          <div class="stat-change" style="color:var(--muted)">Staff</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#8b5cf6;background:#ede9fe">◈</div>
          <strong>${students}</strong>
          <span>Students & Members</span>
          <div class="stat-change" style="color:var(--muted)">Community</div>
        </div>
      </div>
    `;
  };

  const drawTable = (filteredList) => {
    if (!filteredList.length) {
      return `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--muted)">
        <div style="font-size:26px;margin-bottom:8px">🔍</div>
        <strong>No users match your criteria</strong>
        <p style="font-size:12px;margin:4px 0 0">Try changing your search keywords or filter options.</p>
      </td></tr>`;
    }

    return filteredList.map(u => {
      const roleClass = (u.role || 'user').toLowerCase();
      const statusClass = (u.status || 'active').toLowerCase();
      const initials = getInitials(u.name);
      return `
        <tr data-user-id="${u.id}">
          <td>
            <div class="user-cell">
              <div class="user-avatar role-${roleClass}">${initials}</div>
              <div class="user-meta">
                <span class="user-name">${escapeHtml(u.name)}</span>
                <div class="user-email-wrap">
                  <span>${escapeHtml(u.email)}</span>
                  <button class="copy-mini-btn" data-copy-email="${escapeHtml(u.email)}" title="Copy email address">📋</button>
                </div>
              </div>
            </div>
          </td>
          <td><span class="role-badge ${roleClass}">${escapeHtml(u.role)}</span></td>
          <td><span class="status-pill ${statusClass}">${escapeHtml(u.status)}</span></td>
          <td><span class="date-chip">📅 ${escapeHtml(u.joined || 'Recent')}</span></td>
          <td style="color:var(--muted);font-size:11px">${escapeHtml(u.last || 'Today')}</td>
          <td class="row-actions">
            <button class="action-btn edit-btn" data-edit-user="${u.id}" title="Edit user">Edit</button>
            <button class="action-btn toggle-btn" data-toggle-user="${u.id}" title="${u.status === 'Active' ? 'Block account' : 'Activate account'}">
              ${u.status === 'Active' ? 'Block' : 'Activate'}
            </button>
            <button class="action-btn delete-btn" data-delete-user="${u.id}" data-user-name="${escapeHtml(u.name)}" title="Delete user">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const users = userManager.getAll();

  root.innerHTML = `
    <div class="admin-page-title">
      <div>
        <div class="admin-kicker">Workspace / Community & Access</div>
        <h1>User Management</h1>
        <p>Manage member accounts, administrative roles, access status, and user activity.</p>
      </div>
      <div class="page-actions">
        <button class="admin-button outline" id="btn-export-users">Export CSV</button>
        <button class="admin-button" id="btn-add-user">+ New User</button>
      </div>
    </div>

    <div id="users-stats-container">
      ${renderStatsHtml(users)}
    </div>

    <div class="toolbar">
      <input class="admin-table-search" id="users-search-input" placeholder="Search by name, email, or role..." aria-label="Search users">
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <select id="users-role-filter" aria-label="Filter by role">
          <option value="All">All Roles (${users.length})</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Student">Student</option>
          <option value="User">User</option>
        </select>
        <select id="users-status-filter" aria-label="Filter by status">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>User Account</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Last Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="users-table-body">
          ${drawTable(users)}
        </tbody>
      </table>
    </div>

    <!-- USER MODAL (ADD / EDIT) -->
    <div class="admin-modal-backdrop" id="user-modal-backdrop">
      <div class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
        <div class="admin-modal-header">
          <div>
            <h3 class="admin-modal-title" id="user-modal-title">Create New User</h3>
            <p class="admin-modal-subtitle" id="user-modal-subtitle">Add a member account with custom role and status.</p>
          </div>
          <button class="admin-modal-close" id="user-modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <form id="user-modal-form">
          <input type="hidden" id="user-form-id">
          <div class="admin-modal-body">
            <div class="modal-field">
              <label for="user-form-name">Full Name *</label>
              <input type="text" id="user-form-name" required placeholder="e.g. Aarav Sharma">
            </div>
            <div class="modal-field">
              <label for="user-form-email">Email Address *</label>
              <input type="email" id="user-form-email" required placeholder="e.g. aarav@example.com">
            </div>
            <div class="modal-field-row">
              <div class="modal-field">
                <label for="user-form-role">Role</label>
                <select id="user-form-role">
                  <option value="Student">Student</option>
                  <option value="User">User</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div class="modal-field">
                <label for="user-form-status">Status</label>
                <select id="user-form-status">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div class="modal-field">
              <label for="user-form-joined">
                <span>Joined Date (Auto)</span>
                <button type="button" class="auto-date-badge" id="btn-user-auto-date">⚡ Set to Today</button>
              </label>
              <input type="text" id="user-form-joined" placeholder="e.g. Sep 21, 2026">
            </div>
            <div class="modal-field">
              <label for="user-form-bio">Notes / Bio</label>
              <textarea id="user-form-bio" placeholder="Optional background or notes about this user..."></textarea>
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="admin-button outline" id="user-modal-cancel">Cancel</button>
            <button type="submit" class="admin-button" id="user-modal-submit">Save Account</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Elements
  const searchInput = root.querySelector('#users-search-input');
  const roleFilter = root.querySelector('#users-role-filter');
  const statusFilter = root.querySelector('#users-status-filter');
  const tbody = root.querySelector('#users-table-body');
  const statsContainer = root.querySelector('#users-stats-container');
  const modalBackdrop = root.querySelector('#user-modal-backdrop');
  const modalForm = root.querySelector('#user-modal-form');
  const modalClose = root.querySelector('#user-modal-close');
  const modalCancel = root.querySelector('#user-modal-cancel');
  const autoDateBtn = root.querySelector('#btn-user-auto-date');

  // Filtering function
  const filterUsers = () => {
    const q = searchInput.value.trim().toLowerCase();
    const role = roleFilter.value;
    const status = statusFilter.value;
    const currentList = userManager.getAll();

    const filtered = currentList.filter(u => {
      const matchRole = (role === 'All') || (u.role === role);
      const matchStatus = (status === 'All') || (u.status === status);
      const matchQuery = !q || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q);
      return matchRole && matchStatus && matchQuery;
    });

    tbody.innerHTML = drawTable(filtered);
    statsContainer.innerHTML = renderStatsHtml(currentList);
    bindTableActions();
  };

  // Modal helpers
  const openUserModal = (userToEdit = null) => {
    const titleEl = root.querySelector('#user-modal-title');
    const subtitleEl = root.querySelector('#user-modal-subtitle');
    const submitBtn = root.querySelector('#user-modal-submit');

    if (userToEdit) {
      titleEl.textContent = 'Edit User Account';
      subtitleEl.textContent = `Update credentials and permissions for "${userToEdit.name}"`;
      submitBtn.textContent = 'Save Changes';

      root.querySelector('#user-form-id').value = userToEdit.id;
      root.querySelector('#user-form-name').value = userToEdit.name || '';
      root.querySelector('#user-form-email').value = userToEdit.email || '';
      root.querySelector('#user-form-role').value = userToEdit.role || 'Student';
      root.querySelector('#user-form-status').value = userToEdit.status || 'Active';
      root.querySelector('#user-form-joined').value = userToEdit.joined || userManager.getFormattedToday();
      root.querySelector('#user-form-bio').value = userToEdit.bio || '';
    } else {
      titleEl.textContent = 'Create New User';
      subtitleEl.textContent = 'Add a member account with custom role and status.';
      submitBtn.textContent = 'Create User';

      modalForm.reset();
      root.querySelector('#user-form-id').value = '';
      root.querySelector('#user-form-joined').value = userManager.getFormattedToday();
    }

    modalBackdrop.classList.add('show');
    root.querySelector('#user-form-name').focus();
  };

  const closeUserModal = () => {
    modalBackdrop.classList.remove('show');
  };

  // Event Listeners
  searchInput?.addEventListener('input', filterUsers);
  roleFilter?.addEventListener('change', filterUsers);
  statusFilter?.addEventListener('change', filterUsers);

  root.querySelector('#btn-add-user')?.addEventListener('click', () => openUserModal());
  modalClose?.addEventListener('click', closeUserModal);
  modalCancel?.addEventListener('click', closeUserModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeUserModal();
  });

  autoDateBtn?.addEventListener('click', () => {
    root.querySelector('#user-form-joined').value = userManager.getFormattedToday();
    adminToast('Date auto-set to today: ' + userManager.getFormattedToday());
  });

  // Form Submit
  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = root.querySelector('#user-form-id').value;
    const name = root.querySelector('#user-form-name').value.trim();
    const email = root.querySelector('#user-form-email').value.trim();
    const role = root.querySelector('#user-form-role').value;
    const status = root.querySelector('#user-form-status').value;
    const joined = root.querySelector('#user-form-joined').value.trim() || userManager.getFormattedToday();
    const bio = root.querySelector('#user-form-bio').value.trim();

    if (!name || !email) {
      adminToast('Please fill in required fields');
      return;
    }

    userManager.save({
      id: id || undefined,
      name,
      email,
      role,
      status,
      joined,
      bio
    });

    closeUserModal();
    adminToast(id ? `User "${name}" updated!` : `User "${name}" created!`);
    filterUsers();
  });

  // Bind Table Buttons
  const bindTableActions = () => {
    // Copy email buttons
    root.querySelectorAll('[data-copy-email]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const email = btn.dataset.copyEmail;
        navigator.clipboard?.writeText(email).then(() => {
          adminToast(`Email copied: ${email}`);
        }).catch(() => {
          adminToast(`Email: ${email}`);
        });
      };
    });

    // Edit user buttons
    root.querySelectorAll('[data-edit-user]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.editUser;
        const user = userManager.getById(id);
        if (user) openUserModal(user);
      };
    });

    // Toggle status (Active / Blocked)
    root.querySelectorAll('[data-toggle-user]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.toggleUser;
        const user = userManager.toggleStatus(id);
        if (user) {
          adminToast(`Account "${user.name}" status set to ${user.status}`);
          filterUsers();
        }
      };
    });

    // Delete user
    root.querySelectorAll('[data-delete-user]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.deleteUser;
        const name = btn.dataset.userName || 'this user';
        if (confirm(`Are you sure you want to delete user "${name}"?\n\nThis action cannot be undone.`)) {
          userManager.delete(id);
          adminToast(`User "${name}" removed.`);
          filterUsers();
        }
      };
    });
  };

  // Export CSV
  root.querySelector('#btn-export-users')?.addEventListener('click', () => {
    const all = userManager.getAll();
    if (!all.length) {
      adminToast('No users to export');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Joined', 'Last Active'];
    const rows = all.map(u => [
      u.id,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      u.role,
      u.status,
      `"${u.joined || ''}"`,
      `"${u.last || ''}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    adminToast('User list exported to CSV');
  });

  bindTableActions();
}

// =========================================================
// DEDICATED DOWNLOADS MANAGER RENDERER
// =========================================================
function renderDownloadsManager(root) {
  const downloadManager = window.ghDownloadManager;
  if (!downloadManager) return;

  const escapeHtml = (str) => {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  const renderStatsHtml = (currentList) => {
    const total = currentList.length;
    const published = currentList.filter(d => (d.status || 'Published') === 'Published').length;
    const totalClicks = currentList.reduce((acc, d) => acc + (Number(d.downloads) || 0), 0);
    const drafts = currentList.filter(d => d.status === 'Draft').length;

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⇩</div>
          <strong>${total}</strong>
          <span>Total Resources</span>
          <div class="stat-change" style="color:var(--accent)">Shelf</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#16a36a;background:#e9f8f1">✓</div>
          <strong>${published}</strong>
          <span>Published Files</span>
          <div class="stat-change" style="color:#16a36a">Live</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#3b82f6;background:#eff6ff">⚡</div>
          <strong>${totalClicks.toLocaleString()}</strong>
          <span>Total Downloads</span>
          <div class="stat-change" style="color:#3b82f6">Clicks</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#e7a227;background:#fff6df">✎</div>
          <strong>${drafts}</strong>
          <span>Draft Resources</span>
          <div class="stat-change" style="color:var(--muted)">Pending</div>
        </div>
      </div>
    `;
  };

  const drawTable = (filteredList) => {
    if (!filteredList.length) {
      return `<tr><td colspan="8" style="text-align:center;padding:48px;color:var(--muted)">
        <div style="font-size:26px;margin-bottom:8px">📂</div>
        <strong>No download resources found</strong>
        <p style="font-size:12px;margin:4px 0 0">Click "+ New Download" to add files or adjust your search filters.</p>
      </td></tr>`;
    }

    return filteredList.map(d => {
      const type = (d.type || 'PDF').toUpperCase();
      const typeClass = type.toLowerCase();
      const statusClass = (d.status || 'Published').toLowerCase();
      const title = d.title || d.name || 'Untitled Resource';
      const url = d.url || '#';
      const shortUrl = url.length > 28 ? url.slice(0, 26) + '...' : url;

      // Render logo thumbnail
      let logoHtml = '';
      if (d.logo && (d.logo.startsWith('http') || d.logo.startsWith('data:') || d.logo.startsWith('assets/'))) {
        logoHtml = `<img src="${escapeHtml(d.logo)}" alt="logo" style="width:38px;height:38px;border-radius:9px;object-fit:cover;border:1px solid var(--line);background:var(--paper);flex-shrink:0;">`;
      } else if (d.logo === 'android' || type === 'APK') {
        logoHtml = `<span style="width:38px;height:38px;border-radius:9px;background:#e9f8f1;border:1px solid #c2ebd7;display:grid;place-items:center;font-size:20px;flex-shrink:0;" title="Android APK">🤖</span>`;
      } else if (d.logo === 'windows' || type === 'EXE' || type === 'SOFTWARE') {
        logoHtml = `<span style="width:38px;height:38px;border-radius:9px;background:#eff6ff;border:1px solid #bfdbfe;display:grid;place-items:center;font-size:20px;flex-shrink:0;" title="Windows Software">💻</span>`;
      } else if (d.logo === 'mac') {
        logoHtml = `<span style="width:38px;height:38px;border-radius:9px;background:#f9fafb;border:1px solid #e5e7eb;display:grid;place-items:center;font-size:20px;flex-shrink:0;" title="macOS App">🍎</span>`;
      } else if (type === 'XLSX') {
        logoHtml = `<span style="width:38px;height:38px;border-radius:9px;background:#ecfdf5;border:1px solid #a7f3d0;display:grid;place-items:center;font-size:20px;flex-shrink:0;" title="Excel Sheet">📊</span>`;
      } else if (type === 'ZIP') {
        logoHtml = `<span style="width:38px;height:38px;border-radius:9px;background:#fefce8;border:1px solid #fef08a;display:grid;place-items:center;font-size:20px;flex-shrink:0;" title="ZIP Archive">📦</span>`;
      } else {
        logoHtml = `<span style="width:38px;height:38px;border-radius:9px;background:#fef2f2;border:1px solid #fecaca;display:grid;place-items:center;font-size:20px;flex-shrink:0;" title="Document">📄</span>`;
      }

      return `
        <tr data-download-id="${d.id}">
          <td>
            <div style="display:flex;align-items:center;gap:12px">
              ${logoHtml}
              <div class="download-title-cell">
                <strong>${escapeHtml(title)} ${d.version ? `<span class="tag-pill" style="margin-left:4px;color:var(--accent);font-size:10px">${escapeHtml(d.version)}</span>` : ''}</strong>
                ${d.description ? `<small>${escapeHtml(d.description)}</small>` : ''}
              </div>
            </div>
          </td>
          <td>
            <a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="url-chip" title="Test / Open download URL: ${escapeHtml(url)}">
              🔗 ${escapeHtml(shortUrl)} ↗
            </a>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <span class="file-type-pill ${typeClass}">${escapeHtml(type)}</span>
              <span class="tag-pill">${escapeHtml(d.category || 'Notes')}</span>
            </div>
          </td>
          <td><strong style="font-size:11px">${escapeHtml(d.size || '1.0 MB')}</strong></td>
          <td><span style="font-weight:700;color:var(--ink)">${Number(d.downloads || 0).toLocaleString()}</span></td>
          <td><span class="status-pill ${statusClass}">${escapeHtml(d.status || 'Published')}</span></td>
          <td><span class="date-chip">📅 ${escapeHtml(d.date || 'Auto')}</span></td>
          <td class="row-actions">
            <a href="${escapeHtml(url)}" target="_blank" class="action-btn view-btn" title="Open or test download link">Test Link ↗</a>
            <button class="action-btn edit-btn" data-edit-download="${d.id}" title="Edit download resource">Edit</button>
            <button class="action-btn delete-btn" data-delete-download="${d.id}" data-download-title="${escapeHtml(title)}" title="Delete download">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const downloads = downloadManager.getAll();

  root.innerHTML = `
    <div class="admin-page-title">
      <div>
        <div class="admin-kicker">Workspace / Resource Shelf</div>
        <h1>Downloads & Software</h1>
        <p>Manage APKs, desktop softwares, files, templates, custom logos, direct download URLs, and status.</p>
      </div>
      <div class="page-actions">
        <a href="../downloads.html" target="_blank" class="admin-button outline">View Public Page ↗</a>
        <button class="admin-button outline" id="btn-export-downloads">Export CSV</button>
        <button class="admin-button" id="btn-add-download">+ New Download</button>
      </div>
    </div>

    <div id="downloads-stats-container">
      ${renderStatsHtml(downloads)}
    </div>

    <div class="toolbar">
      <input class="admin-table-search" id="downloads-search-input" placeholder="Search by title, category, APK, software, or URL..." aria-label="Search downloads">
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <select id="downloads-status-filter" aria-label="Filter by status">
          <option value="All">All Status (${downloads.length})</option>
          <option value="Published">Published (${downloads.filter(d => (d.status || 'Published') === 'Published').length})</option>
          <option value="Draft">Draft (${downloads.filter(d => d.status === 'Draft').length})</option>
        </select>
        <select id="downloads-type-filter" aria-label="Filter by type">
          <option value="All">All Types</option>
          <option value="APK">Android APK (.apk)</option>
          <option value="SOFTWARE">Software / App</option>
          <option value="PDF">PDF</option>
          <option value="XLSX">XLSX</option>
          <option value="ZIP">ZIP</option>
          <option value="TOOLS">Tools</option>
        </select>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Resource & Logo</th>
            <th>Download URL</th>
            <th>Format / Category</th>
            <th>Size</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="downloads-table-body">
          ${drawTable(downloads)}
        </tbody>
      </table>
    </div>

    <!-- ADD / EDIT DOWNLOAD MODAL -->
    <div class="admin-modal-backdrop" id="download-modal-backdrop">
      <div class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="download-modal-title">
        <div class="admin-modal-header">
          <div>
            <h3 class="admin-modal-title" id="download-modal-title">Add Download Resource</h3>
            <p class="admin-modal-subtitle" id="download-modal-subtitle">Configure software/APK, custom logo, direct download link, and specs.</p>
          </div>
          <button class="admin-modal-close" id="download-modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <form id="download-modal-form">
          <input type="hidden" id="download-form-id">
          <div class="admin-modal-body">
            <div class="modal-field">
              <label for="download-form-title">Resource / App Title *</label>
              <input type="text" id="download-form-title" required placeholder="e.g. Ghanshyam Oli Trading Mobile App (APK)">
            </div>
            
            <!-- APP / SOFTWARE LOGO SELECTOR -->
            <div class="modal-field">
              <label>
                <span>App / Software Logo or Icon</span>
                <span class="label-hint">Upload logo image, paste URL, or click a preset</span>
              </label>
              <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px">
                <div id="download-logo-preview" style="width:48px;height:48px;border-radius:10px;border:1px dashed var(--line);display:grid;place-items:center;background:var(--paper);overflow:hidden;flex-shrink:0;font-size:24px;">🤖</div>
                <div style="flex:1;display:flex;flex-direction:column;gap:6px">
                  <input type="text" id="download-form-logo" placeholder="Logo image URL (or upload below)">
                  <div style="display:flex;gap:8px;align-items:center">
                    <label class="action-btn" style="cursor:pointer;margin:0;font-size:11px">
                      📁 Upload Logo File
                      <input type="file" id="download-form-logo-file" accept="image/*" style="display:none">
                    </label>
                    <button type="button" class="action-btn" id="btn-clear-logo" style="font-size:11px">Reset</button>
                  </div>
                </div>
              </div>
              <div class="preset-logos-row" style="display:flex;gap:6px;flex-wrap:wrap">
                <span style="font-size:10px;color:var(--muted);align-self:center">Preset Logos:</span>
                <button type="button" class="preset-logo-chip" data-preset="android">🤖 Android APK</button>
                <button type="button" class="preset-logo-chip" data-preset="windows">💻 Windows Software</button>
                <button type="button" class="preset-logo-chip" data-preset="mac">🍎 Mac App</button>
                <button type="button" class="preset-logo-chip" data-preset="tool">⚡ Tool</button>
                <button type="button" class="preset-logo-chip" data-preset="pdf">📄 PDF</button>
                <button type="button" class="preset-logo-chip" data-preset="xls">📊 Excel</button>
                <button type="button" class="preset-logo-chip" data-preset="zip">📦 ZIP</button>
              </div>
            </div>

            <div class="modal-field">
              <label for="download-form-url">
                <span>Download URL / File Link *</span>
                <span class="label-hint">Direct APK/EXE link, Google Drive, or CDN</span>
              </label>
              <input type="url" id="download-form-url" required placeholder="https://example.com/files/app-release.apk">
            </div>

            <div class="modal-field-row">
              <div class="modal-field">
                <label for="download-form-category">Category</label>
                <select id="download-form-category">
                  <option value="Software">Software & Apps</option>
                  <option value="Notes">Notes</option>
                  <option value="Templates">Templates</option>
                  <option value="Ebook">Ebook</option>
                  <option value="Tools">Tools</option>
                  <option value="Cheatsheets">Cheatsheets</option>
                </select>
              </div>
              <div class="modal-field">
                <label for="download-form-type">File Type</label>
                <select id="download-form-type">
                  <option value="APK">Android APK (.apk)</option>
                  <option value="SOFTWARE">Software / Desktop App</option>
                  <option value="EXE">Windows Software (.exe)</option>
                  <option value="PDF">PDF Document</option>
                  <option value="XLSX">Excel / Spreadsheet (XLSX)</option>
                  <option value="ZIP">Archive (ZIP)</option>
                  <option value="DOCX">Word Document</option>
                  <option value="TOOLS">Interactive Tool</option>
                </select>
              </div>
            </div>

            <div class="modal-field-row">
              <div class="modal-field">
                <label for="download-form-version">Version (Optional)</label>
                <input type="text" id="download-form-version" placeholder="e.g. v2.5.0 (Latest)">
              </div>
              <div class="modal-field">
                <label for="download-form-size">File Size</label>
                <input type="text" id="download-form-size" placeholder="e.g. 18.5 MB or 1.2 MB">
              </div>
            </div>

            <div class="modal-field-row">
              <div class="modal-field">
                <label for="download-form-status">Status</label>
                <select id="download-form-status">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div class="modal-field">
                <label for="download-form-date">
                  <span>Date (Auto-generated)</span>
                  <button type="button" class="auto-date-badge" id="btn-download-auto-date">⚡ Set to Today</button>
                </label>
                <input type="text" id="download-form-date" placeholder="e.g. Sep 30, 2026">
              </div>
            </div>

            <div class="modal-field">
              <label for="download-form-desc">Summary / Description</label>
              <textarea id="download-form-desc" placeholder="Brief explanation of features, compatibility (e.g. Android 8.0+ / Windows 10+), and changelog..."></textarea>
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="admin-button outline" id="download-modal-cancel">Cancel</button>
            <button type="submit" class="admin-button" id="download-modal-submit">Save Resource</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Elements
  const searchInput = root.querySelector('#downloads-search-input');
  const statusFilter = root.querySelector('#downloads-status-filter');
  const typeFilter = root.querySelector('#downloads-type-filter');
  const tbody = root.querySelector('#downloads-table-body');
  const statsContainer = root.querySelector('#downloads-stats-container');
  const modalBackdrop = root.querySelector('#download-modal-backdrop');
  const modalForm = root.querySelector('#download-modal-form');
  const modalClose = root.querySelector('#download-modal-close');
  const modalCancel = root.querySelector('#download-modal-cancel');
  const autoDateBtn = root.querySelector('#btn-download-auto-date');
  const logoInput = root.querySelector('#download-form-logo');
  const logoFileInput = root.querySelector('#download-form-logo-file');
  const logoPreview = root.querySelector('#download-logo-preview');
  const clearLogoBtn = root.querySelector('#btn-clear-logo');
  const presetChips = root.querySelectorAll('.preset-logo-chip');

  // Update logo preview helper
  const updateLogoPreview = (val) => {
    if (!val) {
      const type = root.querySelector('#download-form-type')?.value;
      logoPreview.innerHTML = type === 'APK' ? '🤖' : (type === 'SOFTWARE' || type === 'EXE' ? '💻' : '📄');
      return;
    }
    if (val.startsWith('http') || val.startsWith('data:') || val.startsWith('assets/')) {
      logoPreview.innerHTML = `<img src="${val}" style="width:100%;height:100%;object-fit:cover" alt="preview">`;
    } else {
      const map = { android: '🤖', windows: '💻', mac: '🍎', tool: '⚡', pdf: '📄', xls: '📊', zip: '📦' };
      logoPreview.innerHTML = map[val] || '🤖';
    }
  };

  logoInput?.addEventListener('input', () => updateLogoPreview(logoInput.value.trim()));

  logoFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result;
      if (dataUrl) {
        logoInput.value = dataUrl;
        updateLogoPreview(dataUrl);
        adminToast('Logo image loaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  });

  presetChips.forEach(chip => {
    chip.onclick = () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const preset = chip.dataset.preset;
      logoInput.value = preset;
      updateLogoPreview(preset);
      if (preset === 'android') {
        root.querySelector('#download-form-type').value = 'APK';
        root.querySelector('#download-form-category').value = 'Software';
      } else if (preset === 'windows') {
        root.querySelector('#download-form-type').value = 'SOFTWARE';
        root.querySelector('#download-form-category').value = 'Software';
      }
    };
  });

  if (clearLogoBtn) {
    clearLogoBtn.onclick = () => {
      logoInput.value = '';
      presetChips.forEach(c => c.classList.remove('active'));
      updateLogoPreview('');
    };
  }

  // Filter & Render
  const filterDownloads = () => {
    const q = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const type = typeFilter.value;
    const currentList = downloadManager.getAll();

    const filtered = currentList.filter(d => {
      const matchStatus = (status === 'All') || ((d.status || 'Published') === status);
      const matchType = (type === 'All') || ((d.type || 'PDF').toUpperCase() === type);
      const matchQuery = !q || `${d.title || d.name} ${d.category} ${d.type} ${d.version || ''} ${d.description || ''} ${d.url || ''}`.toLowerCase().includes(q);
      return matchStatus && matchType && matchQuery;
    });

    tbody.innerHTML = drawTable(filtered);
    statsContainer.innerHTML = renderStatsHtml(currentList);
    bindTableActions();
  };

  // Modal helpers
  const openDownloadModal = (itemToEdit = null) => {
    const titleEl = root.querySelector('#download-modal-title');
    const subtitleEl = root.querySelector('#download-modal-subtitle');
    const submitBtn = root.querySelector('#download-modal-submit');

    if (itemToEdit) {
      titleEl.textContent = 'Edit Download Resource';
      subtitleEl.textContent = `Modify details for "${itemToEdit.title || itemToEdit.name}"`;
      submitBtn.textContent = 'Save Changes';

      root.querySelector('#download-form-id').value = itemToEdit.id;
      root.querySelector('#download-form-title').value = itemToEdit.title || itemToEdit.name || '';
      root.querySelector('#download-form-url').value = itemToEdit.url || '';
      root.querySelector('#download-form-category').value = itemToEdit.category || 'Notes';
      root.querySelector('#download-form-type').value = (itemToEdit.type || 'PDF').toUpperCase();
      root.querySelector('#download-form-size').value = itemToEdit.size || '1.0 MB';
      root.querySelector('#download-form-version').value = itemToEdit.version || '';
      root.querySelector('#download-form-logo').value = itemToEdit.logo || '';
      root.querySelector('#download-form-status').value = itemToEdit.status || 'Published';
      root.querySelector('#download-form-date').value = itemToEdit.date || downloadManager.getFormattedToday();
      root.querySelector('#download-form-desc').value = itemToEdit.description || '';
      updateLogoPreview(itemToEdit.logo || (itemToEdit.type === 'APK' ? 'android' : ''));
    } else {
      titleEl.textContent = 'Add Download Resource';
      subtitleEl.textContent = 'Configure software/APK, custom logo, direct download link, and specs.';
      submitBtn.textContent = 'Publish Download';

      modalForm.reset();
      root.querySelector('#download-form-id').value = '';
      root.querySelector('#download-form-date').value = downloadManager.getFormattedToday();
      root.querySelector('#download-form-size').value = '1.0 MB';
      root.querySelector('#download-form-logo').value = '';
      root.querySelector('#download-form-version').value = '';
      presetChips.forEach(c => c.classList.remove('active'));
      updateLogoPreview('');
    }

    modalBackdrop.classList.add('show');
    root.querySelector('#download-form-title').focus();
  };

  const closeDownloadModal = () => {
    modalBackdrop.classList.remove('show');
  };

  // Listeners
  searchInput?.addEventListener('input', filterDownloads);
  statusFilter?.addEventListener('change', filterDownloads);
  typeFilter?.addEventListener('change', filterDownloads);

  root.querySelector('#btn-add-download')?.addEventListener('click', () => openDownloadModal());
  modalClose?.addEventListener('click', closeDownloadModal);
  modalCancel?.addEventListener('click', closeDownloadModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeDownloadModal();
  });

  autoDateBtn?.addEventListener('click', () => {
    root.querySelector('#download-form-date').value = downloadManager.getFormattedToday();
    adminToast('Date auto-set to today: ' + downloadManager.getFormattedToday());
  });

  // Form Submit
  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = root.querySelector('#download-form-id').value;
    const title = root.querySelector('#download-form-title').value.trim();
    const url = root.querySelector('#download-form-url').value.trim();
    const category = root.querySelector('#download-form-category').value;
    const type = root.querySelector('#download-form-type').value;
    const size = root.querySelector('#download-form-size').value.trim() || '1.0 MB';
    const version = root.querySelector('#download-form-version').value.trim();
    const logo = root.querySelector('#download-form-logo').value.trim();
    const status = root.querySelector('#download-form-status').value;
    const date = root.querySelector('#download-form-date').value.trim() || downloadManager.getFormattedToday();
    const description = root.querySelector('#download-form-desc').value.trim();

    if (!title || !url) {
      adminToast('Please provide Title and Download URL');
      return;
    }

    downloadManager.save({
      id: id || undefined,
      title,
      url,
      category,
      type,
      size,
      version,
      logo,
      status,
      date,
      description
    });

    closeDownloadModal();
    adminToast(id ? `Resource "${title}" updated!` : `Resource "${title}" added to downloads!`);
    filterDownloads();
  });

  // Bind Actions
  const bindTableActions = () => {
    // Edit download
    root.querySelectorAll('[data-edit-download]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.editDownload;
        const item = downloadManager.getById(id);
        if (item) openDownloadModal(item);
      };
    });

    // Delete download
    root.querySelectorAll('[data-delete-download]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.deleteDownload;
        const title = btn.dataset.downloadTitle || 'this resource';
        if (confirm(`Are you sure you want to delete "${title}"?\n\nThis will remove it from the download list.`)) {
          downloadManager.delete(id);
          adminToast(`Resource "${title}" deleted.`);
          filterDownloads();
        }
      };
    });
  };

  // Export CSV
  root.querySelector('#btn-export-downloads')?.addEventListener('click', () => {
    const all = downloadManager.getAll();
    if (!all.length) {
      adminToast('No downloads to export');
      return;
    }
    const headers = ['ID', 'Title', 'Download URL', 'Category', 'Type', 'Size', 'Downloads', 'Status', 'Date'];
    const rows = all.map(d => [
      d.id,
      `"${(d.title || d.name || '').replace(/"/g, '""')}"`,
      `"${(d.url || '').replace(/"/g, '""')}"`,
      d.category || '',
      d.type || '',
      `"${d.size || ''}"`,
      d.downloads || 0,
      d.status || 'Published',
      `"${d.date || ''}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `downloads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    adminToast('Downloads exported to CSV');
  });

  bindTableActions();
}

// =========================================================
// DEDICATED NOTIFICATIONS & NOTICES MANAGER RENDERER
// =========================================================
function renderNotificationsManager(root) {
  const noticeManager = window.ghNoticeManager;
  if (!noticeManager) return;

  const escapeHtml = (str) => {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  let activeTab = 'notices'; // 'notices' or 'userNotifs'

  // Stats calculation
  const getStats = () => {
    const notices = noticeManager.getAllNotices();
    const userNotifs = noticeManager.getAllUserNotifications();
    const users = noticeManager.getRegisteredUsers();
    const activeNotices = notices.filter(n => n.active !== false).length;
    const bannerNotices = notices.filter(n => n.active !== false && n.showBanner).length;
    return {
      totalNotices: notices.length,
      activeNotices,
      bannerNotices,
      totalUserNotifs: userNotifs.length,
      totalUsers: users.length
    };
  };

  const renderStatsHtml = () => {
    const s = getStats();
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="color:#ff3038;background:#fff0f1">📢</div>
          <strong>${s.totalNotices}</strong>
          <span>Website Notices</span>
          <div class="stat-change" style="color:var(--accent)">${s.activeNotices} Active</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#16a36a;background:#e9f8f1">⚡</div>
          <strong>${s.bannerNotices}</strong>
          <span>Active Top Banners</span>
          <div class="stat-change" style="color:#16a36a">Live on Site</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#3b82f6;background:#eff6ff">👤</div>
          <strong>${s.totalUserNotifs}</strong>
          <span>Direct User Alerts</span>
          <div class="stat-change" style="color:#3b82f6">1-to-1 Sent</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:#e7a227;background:#fff6df">👥</div>
          <strong>${s.totalUsers}</strong>
          <span>Registered Members</span>
          <div class="stat-change" style="color:var(--muted)">Target Audience</div>
        </div>
      </div>
    `;
  };

  const renderNoticesTable = (list) => {
    if (!list.length) {
      return `<tr><td colspan="7" style="text-align:center;padding:48px;color:var(--muted)">
        <div style="font-size:26px;margin-bottom:8px">📢</div>
        <strong>No website notices found</strong>
        <p style="font-size:12px;margin:4px 0 0">Click "+ New Website Notice" to post an announcement or top banner.</p>
      </td></tr>`;
    }

    return list.map(n => {
      const type = n.type || 'info';
      const isActive = n.active !== false;
      const isBanner = Boolean(n.showBanner);

      return `
        <tr data-notice-id="${n.id}">
          <td>
            <div style="display:flex;flex-direction:column;gap:3px">
              <div style="display:flex;align-items:center;gap:6px">
                <span class="file-type-pill ${type === 'update' ? 'apk' : (type === 'important' ? 'pdf' : 'tool')}">${escapeHtml(n.badge || 'NOTICE')}</span>
                <strong>${escapeHtml(n.title)}</strong>
              </div>
              <small style="color:var(--muted);font-size:11.5px;max-width:380px;white-space:normal;line-height:1.4">${escapeHtml(n.message)}</small>
            </div>
          </td>
          <td>
            ${isBanner 
              ? '<span class="status-pill published" style="color:#16a36a;background:#e9f8f1">🔔 Live Banner</span>' 
              : '<span class="status-pill" style="color:var(--muted);background:var(--paper)">No Banner</span>'}
          </td>
          <td>
            ${n.link 
              ? `<a href="${escapeHtml(n.link)}" target="_blank" class="url-chip" style="font-size:11px">🔗 ${escapeHtml(n.linkText || 'Link')} ↗</a>` 
              : '<span style="color:var(--muted);font-size:11px">—</span>'}
          </td>
          <td>
            <span class="status-pill ${isActive ? 'published' : 'draft'}">${isActive ? 'Active' : 'Inactive'}</span>
          </td>
          <td><span class="date-chip">📅 ${escapeHtml(n.date || 'Today')}</span></td>
          <td class="row-actions">
            <button class="action-btn toggle-btn" data-toggle-banner="${n.id}" title="Toggle Sticky Top Banner">${isBanner ? 'Hide Banner' : 'Show Banner'}</button>
            <button class="action-btn toggle-btn" data-toggle-status="${n.id}" title="Toggle Active / Inactive">${isActive ? 'Deactivate' : 'Activate'}</button>
            <button class="action-btn edit-btn" data-edit-notice="${n.id}">Edit</button>
            <button class="action-btn delete-btn" data-delete-notice="${n.id}" data-notice-title="${escapeHtml(n.title)}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const renderUserNotifsTable = (list) => {
    if (!list.length) {
      return `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--muted)">
        <div style="font-size:26px;margin-bottom:8px">✉️</div>
        <strong>No direct user notifications sent yet</strong>
        <p style="font-size:12px;margin:4px 0 0">Use the form above to send personalized notifications to individual members.</p>
      </td></tr>`;
    }

    return list.map(n => {
      const isAll = n.targetEmail === 'all';
      const readCount = Array.isArray(n.readBy) ? n.readBy.length : 0;

      return `
        <tr data-unotif-id="${n.id}">
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:16px">${isAll ? '👥' : '👤'}</span>
              <div>
                <strong style="font-size:12px">${escapeHtml(n.targetName || n.targetEmail)}</strong>
                <small style="display:block;color:var(--muted);font-size:10px">${escapeHtml(n.targetEmail)}</small>
              </div>
            </div>
          </td>
          <td>
            <div style="max-width:320px;white-space:normal">
              <strong style="display:block;font-size:12px;color:var(--ink)">${escapeHtml(n.title)}</strong>
              <small style="color:var(--muted);font-size:11px;line-height:1.4">${escapeHtml(n.message)}</small>
              ${n.link ? `<div style="margin-top:4px"><a href="${escapeHtml(n.link)}" target="_blank" style="font-size:10px;color:var(--accent);font-weight:700">🔗 ${escapeHtml(n.linkText || 'Open Link')} ↗</a></div>` : ''}
            </div>
          </td>
          <td>
            <span class="tag-pill" style="text-transform:capitalize">${escapeHtml(n.category || 'personal')}</span>
          </td>
          <td><span class="date-chip">🕒 ${escapeHtml(n.date || 'Recent')}</span></td>
          <td>
            <span class="status-pill ${readCount > 0 ? 'published' : 'pending'}" style="font-size:10px">
              ${isAll ? `${readCount} read` : (readCount > 0 ? '✓ Read' : 'Delivered')}
            </span>
          </td>
          <td class="row-actions">
            <button class="action-btn delete-btn" data-delete-unotif="${n.id}" data-unotif-title="${escapeHtml(n.title)}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const usersList = noticeManager.getRegisteredUsers();

  root.innerHTML = `
    <div class="admin-page-title">
      <div>
        <div class="admin-kicker">Communication Hub / Notices & User Alerts</div>
        <h1>Notices & Notifications</h1>
        <p>Send website announcements, top announcement banners, and targeted personal notifications to individual users.</p>
      </div>
      <div class="page-actions">
        <a href="../index.html" target="_blank" class="admin-button outline">View Website ↗</a>
        <button class="admin-button" id="btn-open-create-notice">+ New Website Notice</button>
      </div>
    </div>

    <div id="notifs-stats-container">
      ${renderStatsHtml()}
    </div>

    <!-- TABS -->
    <div class="admin-tabs">
      <button class="admin-tab-btn active" id="tab-btn-notices">
        <span>📢 Website Public Notices</span>
        <span class="admin-tab-badge" id="tab-count-notices">${noticeManager.getAllNotices().length}</span>
      </button>
      <button class="admin-tab-btn" id="tab-btn-usernotifs">
        <span>👤 Direct User Notifications (एक-एक युजर)</span>
        <span class="admin-tab-badge" id="tab-count-usernotifs">${noticeManager.getAllUserNotifications().length}</span>
      </button>
    </div>

    <!-- TAB 1: WEBSITE NOTICES CONTENT -->
    <div id="tab-content-notices">
      <div class="toolbar">
        <input class="admin-table-search" id="notices-search-input" placeholder="Search notices by title, message, badge..." aria-label="Search notices">
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <select id="notices-status-filter" aria-label="Filter notices">
            <option value="All">All Notices</option>
            <option value="Active">Active Only</option>
            <option value="Banner">Top Banner Only</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Notice & Message</th>
              <th>Top Banner</th>
              <th>Action Link</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="notices-table-body">
            ${renderNoticesTable(noticeManager.getAllNotices())}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: DIRECT USER NOTIFICATIONS CONTENT -->
    <div id="tab-content-usernotifs" style="display:none">
      <!-- SENDER CARD -->
      <section class="admin-card" style="margin-bottom:24px;border:1px solid var(--line);border-radius:10px;">
        <div class="admin-card-header" style="border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:18px">
          <div>
            <h2 style="font-size:16px;display:flex;align-items:center;gap:8px">
              <span>✉️ Send Direct Notification to Individual User</span>
              <span class="tag-pill" style="color:var(--accent);font-size:10px">1-to-1 Messaging</span>
            </h2>
            <small style="color:var(--muted)">Target a specific registered student or broadcast to all members. Appears in their notification drawer when logged in.</small>
          </div>
        </div>

        <form id="send-user-notif-form">
          <div class="form-grid" style="gap:16px">
            <div>
              <label for="unotif-target-select" style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">
                SELECT RECIPIENT MEMBER *
              </label>
              <select id="unotif-target-select" required style="width:100%;padding:11px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)">
                <option value="all">👥 All Registered Members (Broadcast to Everyone)</option>
                <optgroup label="Registered Members & Students">
                  ${usersList.map(u => `<option value="${escapeHtml(u.email)}">${escapeHtml(u.name)} (${escapeHtml(u.email)}) — ${escapeHtml(u.role || 'Member')}</option>`).join('')}
                </optgroup>
                <option value="__custom__">✎ Enter Custom Email Address...</option>
              </select>
            </div>

            <div id="unotif-custom-email-box" style="display:none">
              <label for="unotif-custom-email" style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">
                RECIPIENT EMAIL ADDRESS *
              </label>
              <input type="email" id="unotif-custom-email" placeholder="e.g. student@example.com" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)">
            </div>

            <div>
              <label for="unotif-category" style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">
                NOTIFICATION CATEGORY
              </label>
              <select id="unotif-category" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)">
                <option value="personal">Personal Message / Direct Note</option>
                <option value="account">Account Access / VIP Status</option>
                <option value="download">Download Unlocked / APK Update</option>
                <option value="course">Course Assignment / Live Class</option>
                <option value="alert">Important System Alert</option>
              </select>
            </div>

            <div class="wide">
              <label for="unotif-title" style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">
                NOTIFICATION SUBJECT / TITLE *
              </label>
              <input type="text" id="unotif-title" required placeholder="e.g. तपाईंको नयाँ APK डाउनलोड र प्रिमियम पहुँच सक्रिय गरियो" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)">
            </div>

            <div class="wide">
              <label for="unotif-message" style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">
                DETAILED MESSAGE BODY *
              </label>
              <textarea id="unotif-message" required placeholder="Write a personal, helpful message to the user..." style="width:100%;min-height:95px;padding:11px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);resize:vertical"></textarea>
            </div>

            <div>
              <label for="unotif-link" style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">
                ACTION BUTTON LINK (OPTIONAL)
              </label>
              <input type="text" id="unotif-link" placeholder="e.g. downloads.html or courses.html" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)">
            </div>

            <div>
              <label for="unotif-linktext" style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">
                BUTTON LABEL (OPTIONAL)
              </label>
              <input type="text" id="unotif-linktext" placeholder="e.g. फाइल हेर्नुहोस् ↗" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)">
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px">
            <button type="submit" class="admin-button" style="display:inline-flex;align-items:center;gap:6px">
              <span>Send Notification</span>
              <span>⚡</span>
            </button>
          </div>
        </form>
      </section>

      <!-- SENT NOTIFICATIONS HISTORY -->
      <div class="table-wrap">
        <div style="padding:14px 18px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center">
          <strong>Sent User Notifications History</strong>
          <span style="font-size:11px;color:var(--muted)">Targeted alerts sent to individual members</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Subject & Message</th>
              <th>Category</th>
              <th>Date Sent</th>
              <th>Read Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="usernotifs-table-body">
            ${renderUserNotifsTable(noticeManager.getAllUserNotifications())}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADD / EDIT WEBSITE NOTICE MODAL -->
    <div class="admin-modal-backdrop" id="notice-modal-backdrop">
      <div class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="notice-modal-title">
        <div class="admin-modal-header">
          <div>
            <h3 class="admin-modal-title" id="notice-modal-title">Post Website Notice</h3>
            <p class="admin-modal-subtitle" id="notice-modal-subtitle">Broadcast announcement, alert, or sticky top banner.</p>
          </div>
          <button class="admin-modal-close" id="notice-modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <form id="notice-modal-form">
          <input type="hidden" id="notice-form-id">
          <div class="admin-modal-body">
            <div class="modal-field">
              <label for="notice-form-title">Notice Title *</label>
              <input type="text" id="notice-form-title" required placeholder="e.g. 📢 नयाँ एन्ड्रोइड APK तथा सफ्टवेयर उपलब्ध छ!">
            </div>

            <div class="modal-field">
              <label for="notice-form-message">Detailed Message *</label>
              <textarea id="notice-form-message" required placeholder="Explain the announcement, release details, or instructions..." style="min-height:90px"></textarea>
            </div>

            <div class="modal-field-row">
              <div class="modal-field">
                <label for="notice-form-type">Notice Type</label>
                <select id="notice-form-type">
                  <option value="update">Update / New Release</option>
                  <option value="important">Important / Urgent</option>
                  <option value="info">General Information</option>
                  <option value="alert">Alert / Warning</option>
                </select>
              </div>
              <div class="modal-field">
                <label for="notice-form-badge">Badge Label</label>
                <input type="text" id="notice-form-badge" placeholder="e.g. NEW APK or NOTICE">
              </div>
            </div>

            <div class="modal-field-row">
              <div class="modal-field">
                <label for="notice-form-link">Action Link URL (Optional)</label>
                <input type="text" id="notice-form-link" placeholder="e.g. downloads.html or courses.html">
              </div>
              <div class="modal-field">
                <label for="notice-form-linktext">Action Button Label</label>
                <input type="text" id="notice-form-linktext" placeholder="e.g. APK डाउनलोड गर्नुहोस् ⚡">
              </div>
            </div>

            <div class="modal-field" style="background:var(--paper);padding:12px;border-radius:8px;border:1px solid var(--line)">
              <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin:0;text-transform:none;letter-spacing:0">
                <input type="checkbox" id="notice-form-banner" style="width:18px;height:18px;accent-color:var(--accent)">
                <div>
                  <strong style="display:block;font-size:12px">Show in Sticky Top Banner on Website</strong>
                  <span style="font-size:11px;color:var(--muted)">Displays prominently at the very top of all website pages until dismissed.</span>
                </div>
              </label>
            </div>

            <div class="modal-field-row">
              <div class="modal-field">
                <label for="notice-form-status">Status</label>
                <select id="notice-form-status">
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Draft / Hidden)</option>
                </select>
              </div>
              <div class="modal-field">
                <label for="notice-form-date">Date</label>
                <input type="text" id="notice-form-date" placeholder="Auto-generated">
              </div>
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="admin-button outline" id="notice-modal-cancel">Cancel</button>
            <button type="submit" class="admin-button" id="notice-modal-submit">Publish Notice</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Elements
  const tabNoticesBtn = root.querySelector('#tab-btn-notices');
  const tabUserNotifsBtn = root.querySelector('#tab-btn-usernotifs');
  const tabNoticesContent = root.querySelector('#tab-content-notices');
  const tabUserNotifsContent = root.querySelector('#tab-content-usernotifs');
  const statsContainer = root.querySelector('#notifs-stats-container');
  const noticesTbody = root.querySelector('#notices-table-body');
  const userNotifsTbody = root.querySelector('#usernotifs-table-body');
  const noticesSearch = root.querySelector('#notices-search-input');
  const noticesFilter = root.querySelector('#notices-status-filter');

  const noticeModalBackdrop = root.querySelector('#notice-modal-backdrop');
  const noticeModalForm = root.querySelector('#notice-modal-form');
  const noticeModalClose = root.querySelector('#notice-modal-close');
  const noticeModalCancel = root.querySelector('#notice-modal-cancel');
  const openCreateNoticeBtn = root.querySelector('#btn-open-create-notice');

  const sendUserNotifForm = root.querySelector('#send-user-notif-form');
  const targetSelect = root.querySelector('#unotif-target-select');
  const customEmailBox = root.querySelector('#unotif-custom-email-box');
  const customEmailInput = root.querySelector('#unotif-custom-email');

  // Tab switching
  const setTab = (tab) => {
    activeTab = tab;
    if (tab === 'notices') {
      tabNoticesBtn.classList.add('active');
      tabUserNotifsBtn.classList.remove('active');
      tabNoticesContent.style.display = 'block';
      tabUserNotifsContent.style.display = 'none';
    } else {
      tabNoticesBtn.classList.remove('active');
      tabUserNotifsBtn.classList.add('active');
      tabNoticesContent.style.display = 'none';
      tabUserNotifsContent.style.display = 'block';
    }
  };

  tabNoticesBtn.onclick = () => setTab('notices');
  tabUserNotifsBtn.onclick = () => setTab('userNotifs');

  // Custom email toggle
  targetSelect.onchange = () => {
    if (targetSelect.value === '__custom__') {
      customEmailBox.style.display = 'block';
      customEmailInput.required = true;
      customEmailInput.focus();
    } else {
      customEmailBox.style.display = 'none';
      customEmailInput.required = false;
    }
  };

  // Filter Notices
  const filterNotices = () => {
    const q = (noticesSearch?.value || '').trim().toLowerCase();
    const filter = noticesFilter?.value || 'All';
    const all = noticeManager.getAllNotices();

    const filtered = all.filter(n => {
      const matchFilter = (filter === 'All') ||
        (filter === 'Active' && n.active !== false) ||
        (filter === 'Banner' && n.active !== false && n.showBanner) ||
        (filter === 'Inactive' && n.active === false);
      const matchQuery = !q || `${n.title} ${n.message} ${n.badge} ${n.type}`.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });

    noticesTbody.innerHTML = renderNoticesTable(filtered);
    statsContainer.innerHTML = renderStatsHtml();
    root.querySelector('#tab-count-notices').textContent = all.length;
    bindNoticeActions();
  };

  // Filter User Notifs
  const refreshUserNotifs = () => {
    const all = noticeManager.getAllUserNotifications();
    userNotifsTbody.innerHTML = renderUserNotifsTable(all);
    statsContainer.innerHTML = renderStatsHtml();
    root.querySelector('#tab-count-usernotifs').textContent = all.length;
    bindUserNotifActions();
  };

  // Modal helpers for Website Notices
  const openNoticeModal = (itemToEdit = null) => {
    const titleEl = root.querySelector('#notice-modal-title');
    const subtitleEl = root.querySelector('#notice-modal-subtitle');
    const submitBtn = root.querySelector('#notice-modal-submit');

    if (itemToEdit) {
      titleEl.textContent = 'Edit Website Notice';
      subtitleEl.textContent = `Modify notice: "${itemToEdit.title}"`;
      submitBtn.textContent = 'Save Changes';

      root.querySelector('#notice-form-id').value = itemToEdit.id;
      root.querySelector('#notice-form-title').value = itemToEdit.title || '';
      root.querySelector('#notice-form-message').value = itemToEdit.message || '';
      root.querySelector('#notice-form-type').value = itemToEdit.type || 'update';
      root.querySelector('#notice-form-badge').value = itemToEdit.badge || 'NOTICE';
      root.querySelector('#notice-form-banner').checked = Boolean(itemToEdit.showBanner);
      root.querySelector('#notice-form-link').value = itemToEdit.link || '';
      root.querySelector('#notice-form-linktext').value = itemToEdit.linkText || '';
      root.querySelector('#notice-form-status').value = itemToEdit.active !== false ? 'active' : 'inactive';
      root.querySelector('#notice-form-date').value = itemToEdit.date || noticeManager.getFormattedToday();
    } else {
      titleEl.textContent = 'Post Website Notice';
      subtitleEl.textContent = 'Broadcast announcement, alert, or sticky top banner.';
      submitBtn.textContent = 'Publish Notice';

      noticeModalForm.reset();
      root.querySelector('#notice-form-id').value = '';
      root.querySelector('#notice-form-badge').value = 'NOTICE';
      root.querySelector('#notice-form-banner').checked = true;
      root.querySelector('#notice-form-date').value = noticeManager.getFormattedToday();
    }

    noticeModalBackdrop.classList.add('show');
    root.querySelector('#notice-form-title').focus();
  };

  const closeNoticeModal = () => {
    noticeModalBackdrop.classList.remove('show');
  };

  openCreateNoticeBtn.onclick = () => openNoticeModal();
  noticeModalClose.onclick = closeNoticeModal;
  noticeModalCancel.onclick = closeNoticeModal;
  noticeModalBackdrop.onclick = (e) => {
    if (e.target === noticeModalBackdrop) closeNoticeModal();
  };

  // Submit Website Notice Form
  noticeModalForm.onsubmit = (e) => {
    e.preventDefault();
    const id = root.querySelector('#notice-form-id').value;
    const title = root.querySelector('#notice-form-title').value.trim();
    const message = root.querySelector('#notice-form-message').value.trim();
    const type = root.querySelector('#notice-form-type').value;
    const badge = root.querySelector('#notice-form-badge').value.trim() || 'NOTICE';
    const showBanner = root.querySelector('#notice-form-banner').checked;
    const link = root.querySelector('#notice-form-link').value.trim();
    const linkText = root.querySelector('#notice-form-linktext').value.trim();
    const active = root.querySelector('#notice-form-status').value === 'active';
    const date = root.querySelector('#notice-form-date').value.trim() || noticeManager.getFormattedToday();

    if (!title || !message) {
      adminToast('Please provide Title and Message');
      return;
    }

    noticeManager.saveNotice({
      id: id || undefined,
      title,
      message,
      type,
      badge,
      showBanner,
      active,
      link,
      linkText,
      date
    });

    closeNoticeModal();
    adminToast(id ? 'Website notice updated!' : 'Website notice published live!');
    filterNotices();
  };

  // Submit Direct User Notification Form
  sendUserNotifForm.onsubmit = (e) => {
    e.preventDefault();
    let target = targetSelect.value;
    let targetName = 'All Registered Members';

    if (target === '__custom__') {
      target = customEmailInput.value.trim().toLowerCase();
      if (!target || !target.includes('@')) {
        adminToast('Please enter a valid recipient email address');
        return;
      }
      targetName = target.split('@')[0];
    } else if (target !== 'all') {
      const foundUser = usersList.find(u => u.email.toLowerCase() === target.toLowerCase());
      targetName = foundUser ? foundUser.name : target;
    }

    const title = root.querySelector('#unotif-title').value.trim();
    const message = root.querySelector('#unotif-message').value.trim();
    const category = root.querySelector('#unotif-category').value;
    const link = root.querySelector('#unotif-link').value.trim();
    const linkText = root.querySelector('#unotif-linktext').value.trim();

    if (!title || !message) {
      adminToast('Please enter both title and message for notification');
      return;
    }

    noticeManager.sendUserNotification({
      targetEmail: target,
      targetName: targetName,
      title,
      message,
      category,
      link,
      linkText
    });

    adminToast(`Notification sent to ${targetName}!`);
    sendUserNotifForm.reset();
    targetSelect.value = 'all';
    customEmailBox.style.display = 'none';
    refreshUserNotifs();
  };

  // Actions binding
  const bindNoticeActions = () => {
    // Edit
    root.querySelectorAll('[data-edit-notice]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.editNotice;
        const item = noticeManager.getAllNotices().find(n => String(n.id) === String(id));
        if (item) openNoticeModal(item);
      };
    });

    // Delete
    root.querySelectorAll('[data-delete-notice]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.deleteNotice;
        const title = btn.dataset.noticeTitle || 'this notice';
        if (confirm(`Are you sure you want to delete notice "${title}"?`)) {
          noticeManager.deleteNotice(id);
          adminToast(`Notice "${title}" deleted.`);
          filterNotices();
        }
      };
    });

    // Toggle Active/Inactive
    root.querySelectorAll('[data-toggle-status]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.toggleStatus;
        noticeManager.toggleNoticeStatus(id);
        adminToast('Notice status updated!');
        filterNotices();
      };
    });

    // Toggle Top Banner
    root.querySelectorAll('[data-toggle-banner]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.toggleBanner;
        const notice = noticeManager.getAllNotices().find(n => String(n.id) === String(id));
        if (notice) {
          notice.showBanner = !notice.showBanner;
          noticeManager.saveNotice(notice);
          adminToast(notice.showBanner ? 'Notice activated as top website banner!' : 'Notice removed from top banner.');
          filterNotices();
        }
      };
    });
  };

  const bindUserNotifActions = () => {
    // Delete user notification
    root.querySelectorAll('[data-delete-unotif]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.deleteUnotif;
        const title = btn.dataset.unotifTitle || 'this notification';
        if (confirm(`Delete notification "${title}" from record?`)) {
          noticeManager.deleteUserNotification(id);
          adminToast('User notification removed.');
          refreshUserNotifs();
        }
      };
    });
  };

  noticesSearch?.addEventListener('input', filterNotices);
  noticesFilter?.addEventListener('change', filterNotices);

  // Initial bindings
  bindNoticeActions();
  bindUserNotifActions();
}

// FULL POST EDITOR RENDERER
function renderPostEditor(root) {
  const urlParams = new URLSearchParams(location.search);
  const editId = urlParams.get('id');
  const isEditing = Boolean(editId);
  const existingPost = isEditing ? (window.ghPostManager?.getById(editId) || null) : null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const initial = {
    id: existingPost?.id || '',
    title: existingPost?.title || '',
    seoTitle: existingPost?.seoTitle || '',
    slug: existingPost?.slug || '',
    category: existingPost?.category || 'Trading',
    status: existingPost?.status || 'Published',
    author: existingPost?.author || 'GHANSHYAM OLI',
    date: existingPost?.date || todayStr,
    readTime: existingPost?.readTime || '5 min',
    image: existingPost?.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85',
    tags: Array.isArray(existingPost?.tags) ? existingPost.tags.join(', ') : (existingPost?.tags || ''),
    excerpt: existingPost?.excerpt || '',
    content: existingPost?.content || ''
  };

  const categoriesList = [
    'Trading', 'Stock Market', 'Technology', 'Business', 'Web Development', 'Learning', 'Tutorial', 'Digital Skills'
  ];

  const sampleImages = [
    { label: 'Trading Chart', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Coding / Tech', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Learning / Books', url: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Business Strategy', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85' }
  ];

  root.innerHTML = `
    <div class="admin-page-title">
      <div>
        <div class="admin-kicker">Workspace / Editor</div>
        <h1>${isEditing ? 'Edit Post' : 'Create New Post'}</h1>
        <p>${isEditing ? 'Update post content, category, metadata, or status.' : 'Compose and publish an article to your website and Cloud Firestore.'}</p>
      </div>
      <div class="page-actions">
        <a href="posts.html" class="admin-button outline">← Back to Posts</a>
        ${isEditing ? `<button type="button" class="admin-button outline" id="btn-delete-post" style="color:#d92332;border-color:#d92332;">Delete Post</button>` : ''}
        <button type="button" class="admin-button outline" id="btn-save-draft">Save as Draft</button>
        <button type="button" class="admin-button" id="btn-publish-post">Publish Post</button>
      </div>
    </div>

    <form id="post-editor-form" class="admin-card form-card" style="max-width:1050px;">
      <div class="form-grid">
        <label class="wide">
          Post Title *
          <input id="pe-title" placeholder="Enter article headline..." value="${initial.title}" required autofocus>
        </label>

        <label class="wide">
          SEO Meta Title <span style="font-size:11px;font-weight:400;color:var(--muted);">(shown in browser tab &amp; Google — leave empty to use Post Title)</span>
          <input id="pe-seo-title" placeholder="e.g. How to Read Candlestick Charts | Ghanshyam Oli" value="${initial.seoTitle}" style="border-color:#7c3aed;">
          <div style="font-size:11px;color:var(--muted);margin-top:4px;">💡 Tip: Keep SEO title under 60 characters for best Google ranking. Include your main keyword.</div>
        </label>

        <label>
          Slug / URL Identifier
          <input id="pe-slug" placeholder="e.g. candlestick-reading-system" value="${initial.slug}">
        </label>

        <label>
          Category
          <select id="pe-category">
            ${categoriesList.map(c => `<option value="${c}" ${c === initial.category ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </label>

        <label>
          Publishing Status
          <select id="pe-status">
            <option value="Published" ${initial.status === 'Published' ? 'selected' : ''}>Published (Visible on site)</option>
            <option value="Draft" ${initial.status === 'Draft' ? 'selected' : ''}>Draft (Hidden from public)</option>
            <option value="Scheduled" ${initial.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
          </select>
        </label>

        <label>
          Publish Date
          <input type="date" id="pe-date" value="${initial.date}">
        </label>

        <label>
          Author Name
          <input id="pe-author" value="${initial.author}">
        </label>

        <label>
          Estimated Read Time
          <input id="pe-readtime" placeholder="e.g. 6 min" value="${initial.readTime}">
        </label>

        <label class="wide">
          Featured Image URL
          <div style="display:flex;gap:10px;align-items:center;">
            <input id="pe-image" style="flex:1;" placeholder="https://..." value="${initial.image}">
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--muted);display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span>Presets:</span>
            ${sampleImages.map(img => `
              <button type="button" class="admin-button outline sample-img-btn" data-url="${img.url}" style="padding:3px 8px;font-size:10px;">
                ${img.label}
              </button>
            `).join('')}
          </div>
          <div id="image-preview-box" style="margin-top:12px;width:100%;max-height:220px;overflow:hidden;border-radius:6px;border:1px solid var(--line);background:#111;display:flex;justify-content:center;align-items:center;">
            <img id="pe-image-preview" src="${initial.image}" alt="Preview" style="max-width:100%;max-height:220px;object-fit:cover;" onerror="this.style.display='none'">
          </div>
        </label>

        <label class="wide">
          Excerpt / Subtitle *
          <textarea id="pe-excerpt" rows="2" style="min-height:75px;" placeholder="A concise 1-2 sentence overview shown in article cards and social previews...">${initial.excerpt}</textarea>
        </label>

        <label class="wide">
          Tags (comma-separated)
          <input id="pe-tags" placeholder="trading, price action, beginners" value="${initial.tags}">
        </label>

        <!-- HTML CONTENT SECTION -->
        <div class="wide" style="border-top:1px solid var(--line);padding-top:18px;margin-top:4px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <label style="margin:0;font-size:12px;font-weight:700;">Article Content (HTML) *</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <label class="admin-button outline" style="padding:5px 10px;font-size:11px;cursor:pointer;" title="Upload an HTML file to load its content">
                📂 Upload HTML File
                <input type="file" id="pe-html-upload" accept=".html,.htm,.txt" style="display:none;">
              </label>
              <button type="button" class="admin-button outline" id="btn-insert-img-tag" style="padding:5px 10px;font-size:11px;">🖼️ Insert Image</button>
              <button type="button" class="admin-button outline" id="btn-toggle-preview" style="padding:5px 10px;font-size:11px;">👁️ Preview</button>
            </div>
          </div>
          <p style="font-size:11px;color:var(--muted);margin:6px 0 10px;">
            Write or paste raw HTML below, or upload an <strong>.html file</strong>. Use <code>&lt;h1&gt;</code>–<code>&lt;h3&gt;</code> for headings, <code>&lt;p&gt;</code> for paragraphs, <code>&lt;img src="URL"&gt;</code> for images, <code>&lt;ul&gt;&lt;li&gt;</code> for lists.
          </p>
        </div>

        <!-- Formatting Helper Toolbar -->
        <div class="wide" style="display:flex;gap:6px;flex-wrap:wrap;background:var(--paper);padding:8px;border:1px solid var(--line);border-radius:6px 6px 0 0;margin-bottom:-1px;">
          <button type="button" class="toolbar-btn" data-tag="h2">H2</button>
          <button type="button" class="toolbar-btn" data-tag="h3">H3</button>
          <button type="button" class="toolbar-btn" data-tag="p">Paragraph</button>
          <button type="button" class="toolbar-btn" data-tag="b">Bold</button>
          <button type="button" class="toolbar-btn" data-tag="i">Italic</button>
          <button type="button" class="toolbar-btn" data-tag="quote">Quote</button>
          <button type="button" class="toolbar-btn" data-tag="ul">List</button>
          <button type="button" class="toolbar-btn" data-tag="table">Table</button>
          <button type="button" class="toolbar-btn" data-tag="code">Code Block</button>
          <button type="button" class="toolbar-btn" data-tag="img">Image URL</button>
          <button type="button" class="toolbar-btn" data-tag="link">Link</button>
        </div>

        <label class="wide" style="margin-top:0;">
          <textarea id="pe-content" rows="18" style="min-height:380px;font-family:'Fira Mono',monospace;font-size:13px;line-height:1.65;border-radius:0 0 6px 6px;" placeholder="Paste or write raw HTML here. Example:
&lt;h2&gt;Introduction&lt;/h2&gt;
&lt;p&gt;Markets reward a clear process...&lt;/p&gt;
&lt;img src=&quot;https://example.com/chart.jpg&quot; alt=&quot;Chart&quot; style=&quot;width:100%&quot;&gt;
&lt;ul&gt;
  &lt;li&gt;Point one&lt;/li&gt;
  &lt;li&gt;Point two&lt;/li&gt;
&lt;/ul&gt;">${initial.content}</textarea>
        </label>

        <div id="content-preview-container" class="wide" style="display:none;padding:24px;border:1px solid var(--line);border-radius:8px;background:var(--card);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="margin:0;">Live Content Preview</h3>
            <button type="button" id="btn-close-preview" class="admin-button outline" style="padding:4px 10px;font-size:11px;">✕ Close</button>
          </div>
          <div id="content-preview-body" class="article-body" style="font-size:15px;line-height:1.7;"></div>
        </div>
      </div>

      <div class="page-actions" style="margin-top:28px;display:flex;justify-content:flex-end;gap:12px;">
        <a href="posts.html" class="admin-button outline">Cancel</a>
        <button type="button" class="admin-button outline" id="btn-bottom-draft">Save Draft</button>
        <button type="submit" class="admin-button" id="btn-bottom-publish">Publish Post</button>
      </div>
    </form>
  `;

  // Auto-slug generator from title if slug is empty
  const titleInput = root.querySelector('#pe-title');
  const slugInput = root.querySelector('#pe-slug');
  titleInput.addEventListener('input', () => {
    if (!isEditing && !slugInput.value) {
      slugInput.value = titleInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
  });

  // Image preview handler
  const imageInput = root.querySelector('#pe-image');
  const imagePreview = root.querySelector('#pe-image-preview');
  imageInput.addEventListener('input', () => {
    imagePreview.src = imageInput.value.trim();
    imagePreview.style.display = imageInput.value.trim() ? 'block' : 'none';
  });

  // Sample image clicks
  root.querySelectorAll('.sample-img-btn').forEach(btn => {
    btn.onclick = () => {
      imageInput.value = btn.dataset.url;
      imagePreview.src = btn.dataset.url;
      imagePreview.style.display = 'block';
    };
  });

  // Content area
  const contentArea = root.querySelector('#pe-content');

  // HTML FILE UPLOAD
  root.querySelector('#pe-html-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      let html = ev.target.result || '';
      // If full HTML doc, extract <body> content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) html = bodyMatch[1].trim();
      contentArea.value = html;
      adminToast(`HTML file "${file.name}" loaded successfully.`);
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Insert image tag button
  root.querySelector('#btn-insert-img-tag').onclick = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (!url) return;
    const alt = prompt('Enter alt text (description):', 'Image');
    const tag = `<img src="${url}" alt="${alt || 'Image'}" style="width:100%;border-radius:8px;margin:12px 0;">\n`;
    const start = contentArea.selectionStart;
    contentArea.setRangeText(tag, start, start, 'end');
    contentArea.focus();
  };

  // Content formatting toolbar
  root.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.onclick = () => {
      const tag = btn.dataset.tag;
      const start = contentArea.selectionStart;
      const end = contentArea.selectionEnd;
      const selected = contentArea.value.substring(start, end) || 'Text here';
      let snippet = '';

      switch (tag) {
        case 'h2': snippet = `<h2>${selected}</h2>\n`; break;
        case 'h3': snippet = `<h3>${selected}</h3>\n`; break;
        case 'p': snippet = `<p>${selected}</p>\n`; break;
        case 'b': snippet = `<strong>${selected}</strong>`; break;
        case 'i': snippet = `<em>${selected}</em>`; break;
        case 'quote': snippet = `<blockquote>${selected}</blockquote>\n`; break;
        case 'ul': snippet = `<ul>\n  <li>${selected}</li>\n  <li>Second item</li>\n</ul>\n`; break;
        case 'table': snippet = `<table style="width:100%;border-collapse:collapse;">\n  <thead><tr><th style="border:1px solid #444;padding:8px;">Column 1</th><th style="border:1px solid #444;padding:8px;">Column 2</th></tr></thead>\n  <tbody><tr><td style="border:1px solid #444;padding:8px;">${selected}</td><td style="border:1px solid #444;padding:8px;">Value</td></tr></tbody>\n</table>\n`; break;
        case 'code': snippet = `<pre><code>${selected}</code></pre>\n`; break;
        case 'img': {
          const url = prompt('Image URL:', 'https://');
          if (url) snippet = `<img src="${url}" alt="${selected}" style="width:100%;border-radius:8px;margin:12px 0;">\n`;
          break;
        }
        case 'link': {
          const href = prompt('Link URL:', 'https://');
          if (href) snippet = `<a href="${href}" target="_blank" rel="noopener">${selected}</a>`;
          break;
        }
      }

      if (snippet) {
        contentArea.setRangeText(snippet, start, end, 'end');
        contentArea.focus();
      }
    };
  });

  // Toggle preview
  const previewBtn = root.querySelector('#btn-toggle-preview');
  const previewBox = root.querySelector('#content-preview-container');
  const previewBody = root.querySelector('#content-preview-body');
  previewBtn.onclick = () => {
    const isHidden = previewBox.style.display === 'none';
    if (isHidden) {
      previewBody.innerHTML = contentArea.value || '<p style="color:var(--muted)"><em>No content written yet.</em></p>';
      previewBox.style.display = 'block';
      previewBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      previewBtn.textContent = '✕ Close Preview';
    } else {
      previewBox.style.display = 'none';
      previewBtn.textContent = '👁️ Preview';
    }
  };
  root.querySelector('#btn-close-preview').onclick = () => {
    previewBox.style.display = 'none';
    previewBtn.textContent = '👁️ Preview';
  };

  // Delete Post Button (when editing)
  root.querySelector('#btn-delete-post')?.addEventListener('click', async () => {
    if (confirm(`Are you sure you want to delete this article?`)) {
      await window.ghPostManager.delete(editId);
      adminToast('Post deleted successfully.');
      setTimeout(() => location.href = 'posts.html', 500);
    }
  });

  // Save logic helper
  const handleSave = async (statusOverride) => {
    const title = titleInput.value.trim();
    if (!title) {
      adminToast('Please enter a post title.');
      titleInput.focus();
      return;
    }

    const content = contentArea.value.trim();
    if (!content) {
      adminToast('Please provide some content for the post.');
      contentArea.focus();
      return;
    }

    const seoTitle = root.querySelector('#pe-seo-title').value.trim();
    const excerpt = root.querySelector('#pe-excerpt').value.trim() || title;
    const category = root.querySelector('#pe-category').value;
    const author = root.querySelector('#pe-author').value.trim() || 'GHANSHYAM OLI';
    const date = root.querySelector('#pe-date').value || todayStr;
    const readTime = root.querySelector('#pe-readtime').value.trim() || '5 min';
    const image = imageInput.value.trim() || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85';
    const tags = root.querySelector('#pe-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    const slug = slugInput.value.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const status = statusOverride || root.querySelector('#pe-status').value;

    const postPayload = {
      id: editId || String(Date.now()),
      title,
      seoTitle: seoTitle || title,
      slug,
      category,
      status,
      author,
      date,
      readTime,
      views: existingPost?.views || 0,
      image,
      tags,
      excerpt,
      content
    };

    const submitBtn = root.querySelector('#btn-publish-post');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
    }

    try {
      await window.ghPostManager.save(postPayload);
      adminToast(isEditing ? 'Post updated successfully!' : 'Post published successfully!');
      setTimeout(() => {
        location.href = 'posts.html';
      }, 600);
    } catch (err) {
      console.error('Error saving post:', err);
      adminToast('Error saving post: ' + err.message);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Post';
      }
    }
  };

  root.querySelector('#btn-save-draft').onclick = () => handleSave('Draft');
  root.querySelector('#btn-bottom-draft').onclick = () => handleSave('Draft');
  root.querySelector('#btn-publish-post').onclick = () => handleSave('Published');
  root.querySelector('#post-editor-form').onsubmit = (e) => {
    e.preventDefault();
    handleSave();
  };
}

// FULL COURSE EDITOR RENDERER
function renderCourseEditor(root) {
  const urlParams = new URLSearchParams(location.search);
  const editId = urlParams.get('id');
  const isEditing = Boolean(editId);

  const existingCourse = isEditing
    ? (adminData.courses.find(c => String(c.id) === String(editId)) || null)
    : null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const initial = {
    title: existingCourse?.title || '',
    seoTitle: existingCourse?.seoTitle || '',
    excerpt: existingCourse?.excerpt || '',
    category: existingCourse?.category || 'Trading',
    status: existingCourse?.status || 'Published',
    price: existingCourse?.price || '',
    originalPrice: existingCourse?.originalPrice || '',
    currency: existingCourse?.currency || 'NPR',
    image: existingCourse?.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85',
    lessons: existingCourse?.lessons || '',
    duration: existingCourse?.duration || '',
    level: existingCourse?.level || 'Beginner',
    instructor: existingCourse?.instructor || 'GHANSHYAM OLI',
    date: existingCourse?.date || todayStr,
    content: existingCourse?.content || ''
  };

  const categoriesList = ['Trading', 'Stock Market', 'Technology', 'Business', 'Web Development', 'Learning', 'Tutorial', 'Digital Skills'];

  root.innerHTML = `
    <div class="admin-page-title">
      <div>
        <div class="admin-kicker">Workspace / Course Editor</div>
        <h1>${isEditing ? 'Edit Course' : 'Create New Course'}</h1>
        <p>${isEditing ? 'Update course details, curriculum, and pricing.' : 'Build a new course with full details, pricing, and HTML-based curriculum.'}</p>
      </div>
      <div class="page-actions">
        <a href="javascript:history.back()" class="admin-button outline">← Back</a>
        <button type="button" class="admin-button outline" id="btn-ce-draft">Save Draft</button>
        <button type="button" class="admin-button" id="btn-ce-publish">Publish Course</button>
      </div>
    </div>

    <form id="course-editor-form" class="admin-card form-card" style="max-width:1050px;">
      <div class="form-grid">

        <!-- BASIC INFO -->
        <label class="wide">
          Course Title *
          <input id="ce-title" placeholder="e.g. Complete Candlestick Mastery Program" value="${initial.title}" required autofocus>
        </label>

        <label class="wide">
          SEO Meta Title <span style="font-size:11px;font-weight:400;color:var(--muted);">(browser tab &amp; Google — max 60 chars)</span>
          <input id="ce-seo-title" placeholder="e.g. Candlestick Mastery Course | Ghanshyam Oli" value="${initial.seoTitle}" style="border-color:#7c3aed;">
          <div style="font-size:11px;color:var(--muted);margin-top:4px;">💡 SEO title appears in Google search results. Include main keyword + your name for ranking.</div>
        </label>

        <label class="wide">
          Course Description / Excerpt *
          <textarea id="ce-excerpt" rows="3" placeholder="What will students learn? What makes this course unique?">${initial.excerpt}</textarea>
        </label>

        <label>
          Category
          <select id="ce-category">
            ${categoriesList.map(c => `<option value="${c}" ${c === initial.category ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </label>

        <label>
          Status
          <select id="ce-status">
            <option value="Published" ${initial.status === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Draft" ${initial.status === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Coming Soon" ${initial.status === 'Coming Soon' ? 'selected' : ''}>Coming Soon</option>
          </select>
        </label>

        <label>
          Level
          <select id="ce-level">
            <option value="Beginner" ${initial.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
            <option value="Intermediate" ${initial.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="Advanced" ${initial.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
            <option value="All Levels" ${initial.level === 'All Levels' ? 'selected' : ''}>All Levels</option>
          </select>
        </label>

        <label>
          Instructor
          <input id="ce-instructor" value="${initial.instructor}" placeholder="Instructor name">
        </label>

        <!-- PRICING SECTION -->
        <div class="wide" style="background:var(--paper);border:1px solid #7c3aed44;border-radius:8px;padding:16px;">
          <div style="font-size:13px;font-weight:700;color:#a78bfa;margin-bottom:12px;">💰 Pricing Settings</div>
          <div class="form-grid" style="margin:0;">
            <label>
              Currency
              <select id="ce-currency">
                <option value="NPR" ${initial.currency === 'NPR' ? 'selected' : ''}>NPR (Nepali Rupee)</option>
                <option value="USD" ${initial.currency === 'USD' ? 'selected' : ''}>USD (US Dollar)</option>
                <option value="INR" ${initial.currency === 'INR' ? 'selected' : ''}>INR (Indian Rupee)</option>
                <option value="FREE" ${initial.currency === 'FREE' ? 'selected' : ''}>Free Course</option>
              </select>
            </label>
            <label>
              Sale Price *
              <input id="ce-price" type="number" min="0" placeholder="e.g. 2999" value="${initial.price}">
            </label>
            <label>
              Original Price <span style="font-size:10px;color:var(--muted)">(for strikethrough)</span>
              <input id="ce-original-price" type="number" min="0" placeholder="e.g. 4999" value="${initial.originalPrice}">
            </label>
          </div>
          <div id="ce-price-preview" style="margin-top:10px;font-size:13px;color:var(--muted);"></div>
        </div>

        <!-- COURSE DETAILS -->
        <label>
          Total Lessons
          <input id="ce-lessons" type="number" min="0" placeholder="e.g. 24" value="${initial.lessons}">
        </label>

        <label>
          Total Duration
          <input id="ce-duration" placeholder="e.g. 12 hours" value="${initial.duration}">
        </label>

        <label>
          Launch Date
          <input type="date" id="ce-date" value="${initial.date}">
        </label>

        <!-- THUMBNAIL -->
        <label class="wide">
          Course Thumbnail URL
          <div style="display:flex;gap:10px;align-items:center;">
            <input id="ce-image" style="flex:1;" placeholder="https://..." value="${initial.image}">
          </div>
          <div id="ce-image-preview-box" style="margin-top:12px;width:100%;max-height:200px;overflow:hidden;border-radius:6px;border:1px solid var(--line);background:#111;display:flex;justify-content:center;align-items:center;">
            <img id="ce-image-preview" src="${initial.image}" alt="Thumbnail Preview" style="max-width:100%;max-height:200px;object-fit:cover;" onerror="this.style.display='none'">
          </div>
        </label>

        <!-- HTML CONTENT -->
        <div class="wide" style="border-top:1px solid var(--line);padding-top:18px;margin-top:4px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <label style="margin:0;font-size:12px;font-weight:700;">Course Content / Curriculum (HTML)</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <label class="admin-button outline" style="padding:5px 10px;font-size:11px;cursor:pointer;" title="Upload an HTML file">
                📂 Upload HTML File
                <input type="file" id="ce-html-upload" accept=".html,.htm,.txt" style="display:none;">
              </label>
              <button type="button" class="admin-button outline" id="btn-ce-preview" style="padding:5px 10px;font-size:11px;">👁️ Preview</button>
            </div>
          </div>
          <p style="font-size:11px;color:var(--muted);margin:6px 0 10px;">Write the full course curriculum, lesson outlines, what's included, etc. using HTML. Use <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;img&gt;</code> tags freely.</p>
        </div>

        <!-- Formatting Toolbar -->
        <div class="wide" style="display:flex;gap:6px;flex-wrap:wrap;background:var(--paper);padding:8px;border:1px solid var(--line);border-radius:6px 6px 0 0;margin-bottom:-1px;">
          <button type="button" class="ce-toolbar-btn" data-tag="h2">H2</button>
          <button type="button" class="ce-toolbar-btn" data-tag="h3">H3</button>
          <button type="button" class="ce-toolbar-btn" data-tag="p">Paragraph</button>
          <button type="button" class="ce-toolbar-btn" data-tag="b">Bold</button>
          <button type="button" class="ce-toolbar-btn" data-tag="ul">List</button>
          <button type="button" class="ce-toolbar-btn" data-tag="module">📦 Module</button>
          <button type="button" class="ce-toolbar-btn" data-tag="lesson">📖 Lesson Item</button>
          <button type="button" class="ce-toolbar-btn" data-tag="img">🖼️ Image</button>
        </div>

        <label class="wide" style="margin-top:0;">
          <textarea id="ce-content" rows="16" style="min-height:340px;font-family:'Fira Mono',monospace;font-size:13px;line-height:1.65;border-radius:0 0 6px 6px;" placeholder="Write your curriculum HTML here. Example:
&lt;h2&gt;Module 1: Introduction&lt;/h2&gt;
&lt;ul&gt;
  &lt;li&gt;Lesson 1.1 – What is Candlestick? (10 min)&lt;/li&gt;
  &lt;li&gt;Lesson 1.2 – Reading the Wicks (15 min)&lt;/li&gt;
&lt;/ul&gt;
&lt;h2&gt;Module 2: Patterns&lt;/h2&gt;">${initial.content}</textarea>
        </label>

        <div id="ce-preview-container" class="wide" style="display:none;padding:24px;border:1px solid var(--line);border-radius:8px;background:var(--card);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="margin:0;">Curriculum Preview</h3>
            <button type="button" id="btn-ce-close-preview" class="admin-button outline" style="padding:4px 10px;font-size:11px;">✕ Close</button>
          </div>
          <div id="ce-preview-body" style="font-size:15px;line-height:1.7;"></div>
        </div>

      </div>

      <div class="page-actions" style="margin-top:28px;display:flex;justify-content:flex-end;gap:12px;">
        <a href="javascript:history.back()" class="admin-button outline">Cancel</a>
        <button type="button" class="admin-button outline" id="btn-ce-bottom-draft">Save Draft</button>
        <button type="submit" class="admin-button" id="btn-ce-bottom-publish">Publish Course</button>
      </div>
    </form>
  `;

  // Thumbnail preview
  const ceImg = root.querySelector('#ce-image');
  const ceImgPreview = root.querySelector('#ce-image-preview');
  ceImg.addEventListener('input', () => {
    ceImgPreview.src = ceImg.value.trim();
    ceImgPreview.style.display = ceImg.value.trim() ? 'block' : 'none';
  });

  // Price preview label
  const cePriceInput = root.querySelector('#ce-price');
  const ceOrigPrice = root.querySelector('#ce-original-price');
  const ceCurrency = root.querySelector('#ce-currency');
  const cePricePreview = root.querySelector('#ce-price-preview');
  const updatePricePreview = () => {
    const cur = ceCurrency.value;
    if (cur === 'FREE') {
      cePricePreview.innerHTML = '<span style="color:#22c55e;font-weight:700;">✓ Free Course</span>';
      return;
    }
    const p = parseFloat(cePriceInput.value);
    const op = parseFloat(ceOrigPrice.value);
    let html = '';
    if (!isNaN(p)) html += `<span style="font-weight:700;font-size:16px;">${cur} ${p.toLocaleString()}</span>`;
    if (!isNaN(op) && op > p) html += ` <span style="text-decoration:line-through;color:var(--muted);margin-left:8px;">${cur} ${op.toLocaleString()}</span>`;
    if (!isNaN(op) && !isNaN(p) && op > p) {
      const disc = Math.round((1 - p / op) * 100);
      html += ` <span style="color:#22c55e;font-weight:700;margin-left:8px;">${disc}% OFF</span>`;
    }
    cePricePreview.innerHTML = html || '<span style="color:var(--muted);">Enter a price above to see preview</span>';
  };
  [cePriceInput, ceOrigPrice, ceCurrency].forEach(el => el.addEventListener('input', updatePricePreview));
  updatePricePreview();

  // HTML file upload for course
  const ceCaContent = root.querySelector('#ce-content');
  root.querySelector('#ce-html-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      let html = ev.target.result || '';
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) html = bodyMatch[1].trim();
      ceCaContent.value = html;
      adminToast(`HTML file "${file.name}" loaded into course content.`);
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Course toolbar
  root.querySelectorAll('.ce-toolbar-btn').forEach(btn => {
    btn.onclick = () => {
      const tag = btn.dataset.tag;
      const start = ceCaContent.selectionStart;
      const end = ceCaContent.selectionEnd;
      const sel = ceCaContent.value.substring(start, end) || 'Text here';
      let snippet = '';
      switch (tag) {
        case 'h2': snippet = `<h2>${sel}</h2>\n`; break;
        case 'h3': snippet = `<h3>${sel}</h3>\n`; break;
        case 'p': snippet = `<p>${sel}</p>\n`; break;
        case 'b': snippet = `<strong>${sel}</strong>`; break;
        case 'ul': snippet = `<ul>\n  <li>${sel}</li>\n  <li>Second item</li>\n</ul>\n`; break;
        case 'module': snippet = `<div style="background:var(--paper,#111);border:1px solid #333;border-radius:8px;padding:16px;margin:12px 0;">\n  <h3 style="margin:0 0 10px;">${sel}</h3>\n  <ul>\n    <li>Lesson 1 – Topic (10 min)</li>\n    <li>Lesson 2 – Topic (15 min)</li>\n  </ul>\n</div>\n`; break;
        case 'lesson': snippet = `<li>${sel} <span style="color:#888;font-size:12px;">(10 min)</span></li>\n`; break;
        case 'img': {
          const url = prompt('Image URL:', 'https://');
          if (url) snippet = `<img src="${url}" alt="${sel}" style="width:100%;border-radius:8px;margin:12px 0;">\n`;
          break;
        }
      }
      if (snippet) {
        ceCaContent.setRangeText(snippet, start, end, 'end');
        ceCaContent.focus();
      }
    };
  });

  // Preview toggle for course
  const cePrevBtn = root.querySelector('#btn-ce-preview');
  const cePrevBox = root.querySelector('#ce-preview-container');
  const cePrevBody = root.querySelector('#ce-preview-body');
  cePrevBtn.onclick = () => {
    if (cePrevBox.style.display === 'none') {
      cePrevBody.innerHTML = ceCaContent.value || '<p style="color:var(--muted)"><em>No content yet.</em></p>';
      cePrevBox.style.display = 'block';
      cePrevBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      cePrevBtn.textContent = '✕ Close Preview';
    } else {
      cePrevBox.style.display = 'none';
      cePrevBtn.textContent = '👁️ Preview';
    }
  };
  root.querySelector('#btn-ce-close-preview').onclick = () => {
    cePrevBox.style.display = 'none';
    cePrevBtn.textContent = '👁️ Preview';
  };

  // Save course handler
  const saveCourse = (statusOverride) => {
    const title = root.querySelector('#ce-title').value.trim();
    if (!title) { adminToast('Please enter a course title.'); return; }
    const seoTitle = root.querySelector('#ce-seo-title').value.trim() || title;
    const excerpt = root.querySelector('#ce-excerpt').value.trim();
    const category = root.querySelector('#ce-category').value;
    const status = statusOverride || root.querySelector('#ce-status').value;
    const level = root.querySelector('#ce-level').value;
    const instructor = root.querySelector('#ce-instructor').value.trim() || 'GHANSHYAM OLI';
    const currency = ceCurrency.value;
    const price = cePriceInput.value || '0';
    const originalPrice = ceOrigPrice.value || '';
    const image = ceImg.value.trim();
    const lessons = root.querySelector('#ce-lessons').value;
    const duration = root.querySelector('#ce-duration').value.trim();
    const date = root.querySelector('#ce-date').value || todayStr;
    const content = ceCaContent.value.trim();

    const coursePayload = { id: editId || String(Date.now()), title, seoTitle, excerpt, category, status, level, instructor, currency, price, originalPrice, image, lessons, duration, date, content };

    // Store in localStorage under 'gh_custom_courses'
    try {
      const existing = JSON.parse(localStorage.getItem('gh_custom_courses') || '[]');
      const idx = existing.findIndex(c => String(c.id) === String(coursePayload.id));
      if (idx >= 0) existing[idx] = coursePayload;
      else existing.unshift(coursePayload);
      localStorage.setItem('gh_custom_courses', JSON.stringify(existing));
      adminToast(isEditing ? 'Course updated!' : 'Course published!');
      setTimeout(() => location.href = 'courses.html', 600);
    } catch (e) {
      adminToast('Error saving course: ' + e.message);
    }
  };

  root.querySelector('#btn-ce-draft').onclick = () => saveCourse('Draft');
  root.querySelector('#btn-ce-bottom-draft').onclick = () => saveCourse('Draft');
  root.querySelector('#btn-ce-publish').onclick = () => saveCourse('Published');
  root.querySelector('#btn-ce-bottom-publish').onclick = () => saveCourse('Published');
  root.querySelector('#course-editor-form').onsubmit = (e) => { e.preventDefault(); saveCourse(); };
}

function renderSimple() {
  const root = document.querySelector('#simple');
  if (!root) return;
  const page = document.body.dataset.page;

  if (page === 'postEditor') {
    renderPostEditor(root);
    return;
  }

  if (page === 'courseEditor') {
    renderCourseEditor(root);
    return;
  }

  const configs = {
    analytics: ['Analytics', 'Understand how your audience uses the platform.'],
    notifications: ['Notifications', 'System alerts and moderation updates.'],
    activity: ['Activity log', 'A transparent record of admin actions.'],
    settings: ['Settings', 'Configure website, appearance, blog, courses, and email.'],
    profile: ['Profile', 'Manage your admin identity and account preferences.']
  };

  const c = configs[page] || configs.settings;
  root.innerHTML = pageTitle(c[0], c[1]) + `
    <section class="admin-card form-card">
      <div class="form-grid">
        <label>Title / Name<input placeholder="${c[0]} title"></label>
        <label>Status<select><option>Published</option><option>Draft</option><option>Scheduled</option></select></label>
        <label class="wide">Description<textarea placeholder="Write a clear description..."></textarea></label>
        <label>Category<select><option>Trading</option><option>Technology</option><option>Learning</option></select></label>
        <label>SEO title<input placeholder="Search title"></label>
      </div>
      <div class="page-actions">
        <button class="admin-button outline">Cancel</button>
        <button class="admin-button" data-save>Save changes</button>
      </div>
    </section>
  `;
  root.querySelector('[data-save]')?.addEventListener('click', () => adminToast('Changes saved locally'));
}

document.addEventListener('DOMContentLoaded', () => {
  renderManager();
  renderSimple();
});
