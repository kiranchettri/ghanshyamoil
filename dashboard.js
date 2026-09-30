(() => {
  const posts = adminData.posts || [];

  // Update stats
  const totalPostsEl = document.querySelector('#stat-total-posts');
  if (totalPostsEl) {
    totalPostsEl.textContent = posts.length;
  }

  const totalViewsEl = document.querySelector('#stat-total-views');
  if (totalViewsEl) {
    const totalViews = posts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
    totalViewsEl.textContent = totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews;
  }

  const recentGrid = document.querySelector('#dashboard-recent-grid');
  if (!recentGrid) return;

  const recentPosts = posts.slice(0, 5);
  const rows = recentPosts.map(p => {
    const views = Number(p.views || 0).toLocaleString();
    const status = p.status || 'Published';
    return `<tr>
      <td>
        <a href="post-editor.html?id=${p.id}" style="color:inherit;font-weight:700;">
          ${p.title}
        </a>
      </td>
      <td>${p.category || 'General'}</td>
      <td>${views}</td>
      <td><span class="status ${status}">${status}</span></td>
      <td>${p.date || 'Today'}</td>
      <td class="row-actions">
        <a href="post-editor.html?id=${p.id}" class="admin-button outline" style="padding:4px 8px;font-size:11px;">Edit</a>
      </td>
    </tr>`;
  }).join('');

  recentGrid.innerHTML = `
    <section class="admin-card">
      <div class="admin-card-header">
        <h2>Recent posts (${posts.length})</h2>
        <a href="posts.html">View all →</a>
      </div>
      ${table(['Post', 'Category', 'Views', 'Status', 'Date', 'Action'], rows)}
    </section>
    <section class="admin-card">
      <div class="admin-card-header">
        <h2>Live activity <span class="live-dot"></span></h2>
        <span>127 live users</span>
      </div>
      <div class="activity-list">
        ${[
          'New post published',
          'User opened trading article',
          'Course enrollment verified',
          'Template downloaded',
          'Newsletter subscriber joined'
        ].map((x, i) => `
          <div class="activity-item">
            <i class="activity-dot"></i>
            <div>
              <p>${x}</p>
              <small>${i + 2} minutes ago</small>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
})();
