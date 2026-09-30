/* DEMO CMS DATA & POST SYNCHRONIZER */

// Ensure window.ghPostManager is available in admin context
if (!window.ghPostManager) {
  window.ghPostManager = {
    getStoragePosts() {
      try {
        return JSON.parse(localStorage.getItem('gh_custom_posts') || '[]');
      } catch {
        return [];
      }
    },
    getDeletedIds() {
      try {
        return JSON.parse(localStorage.getItem('gh_deleted_posts') || '[]');
      } catch {
        return [];
      }
    },
    getDefaults() {
      return [
        { id: 1, title: 'Candlestick Charts: A Practical Reading System', category: 'Trading', author: 'GHANSHYAM OLI', views: 2840, status: 'Published', date: '2026-09-20', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85', excerpt: 'Read price action with a repeatable framework instead of chasing every green candle.', content: '<p>Markets reward a clear process. Candlestick charts compress the story of a session into a language you can learn to read.</p>' },
        { id: 2, title: 'Build a Personal Learning System That Lasts', category: 'Learning', author: 'GHANSHYAM OLI', views: 1960, status: 'Published', date: '2026-09-16', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=85', excerpt: 'A lightweight system for turning scattered curiosity into useful, durable skill.', content: '<p>Learning becomes easier when the next action is visible. Your system does not need more apps; it needs less friction.</p>' },
        { id: 3, title: 'The Small Website Stack for Big Ideas', category: 'Technology', author: 'GHANSHYAM OLI', views: 1730, status: 'Draft', date: '2026-09-11', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85', excerpt: 'Why a focused HTML, CSS, and JavaScript stack is still a serious creative advantage.', content: '<p>Small stacks are not simplistic. They expose the browser platform and keep the distance between an idea and a working page short.</p>' },
        { id: 4, title: 'A Clearer Way to Think About Business Ideas', category: 'Business', author: 'GHANSHYAM OLI', views: 1480, status: 'Scheduled', date: '2026-09-06', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85', excerpt: 'Turn an interesting idea into a sharper offer by starting with the person and the problem.', content: '<p>A business idea gets stronger when it can name the painful moment it changes for someone.</p>' }
      ];
    },
    getAll() {
      const deleted = this.getDeletedIds();
      const custom = this.getStoragePosts();
      const defaults = this.getDefaults();
      const result = [];

      custom.forEach(cp => {
        if (!deleted.some(d => String(d) === String(cp.id))) {
          result.push(cp);
        }
      });

      defaults.forEach(dp => {
        const isDeleted = deleted.some(d => String(d) === String(dp.id));
        const isOverridden = custom.some(c => String(c.id) === String(dp.id));
        if (!isDeleted && !isOverridden) {
          result.push(dp);
        }
      });

      return result;
    },
    getById(id) {
      return this.getAll().find(p => String(p.id) === String(id));
    },
    async save(postData) {
      const custom = this.getStoragePosts();
      const id = postData.id ? String(postData.id) : String(Date.now());
      const completePost = {
        id: id,
        title: postData.title || 'Untitled Post',
        slug: postData.slug || (postData.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: postData.category || 'Technology',
        status: postData.status || 'Published',
        author: postData.author || 'GHANSHYAM OLI',
        date: postData.date || new Date().toISOString().slice(0, 10),
        readTime: postData.readTime || '5 min',
        views: Number(postData.views || 0),
        image: postData.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',
        tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags ? String(postData.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
        excerpt: postData.excerpt || '',
        content: postData.content || ''
      };

      const existingIdx = custom.findIndex(p => String(p.id) === id);
      if (existingIdx >= 0) {
        custom[existingIdx] = completePost;
      } else {
        custom.unshift(completePost);
      }
      localStorage.setItem('gh_custom_posts', JSON.stringify(custom));

      const deleted = this.getDeletedIds().filter(d => String(d) !== id);
      localStorage.setItem('gh_deleted_posts', JSON.stringify(deleted));

      if (window.cmsService?.savePost) {
        try {
          await window.cmsService.savePost(completePost);
        } catch (err) {
          console.warn('Firestore sync notice (local copy saved):', err);
        }
      }
      return completePost;
    },
    async delete(id) {
      const targetId = String(id);
      const custom = this.getStoragePosts().filter(p => String(p.id) !== targetId);
      localStorage.setItem('gh_custom_posts', JSON.stringify(custom));

      const deleted = this.getDeletedIds();
      if (!deleted.some(d => String(d) === targetId)) {
        deleted.push(targetId);
        localStorage.setItem('gh_deleted_posts', JSON.stringify(deleted));
      }

      if (window.cmsService?.deletePost) {
        try {
          await window.cmsService.deletePost(targetId);
        } catch (err) {
          console.warn('Firestore delete notice:', err);
        }
      }
      return true;
    }
  };
}

// DOWNLOAD MANAGEMENT SYSTEM - Synchronizes downloads with localStorage
if (!window.ghDownloadManager) {
  window.ghDownloadManager = {
    getStorageDownloads() {
      try {
        return JSON.parse(localStorage.getItem('gh_downloads') || 'null');
      } catch {
        return null;
      }
    },
    getDefaults() {
      return [
        {
          id: 1,
          title: 'Candlestick Quick Reference',
          name: 'Candlestick Quick Reference',
          url: 'https://raw.githubusercontent.com/mdn/learning-area/master/html/forms/downloading-file/sample.pdf',
          type: 'PDF',
          size: '1.2 MB',
          category: 'Notes',
          logo: 'pdf',
          logoType: 'preset',
          version: 'v1.0',
          downloads: 834,
          status: 'Published',
          date: 'Sep 18, 2026',
          description: 'A compact visual reference for the most useful candle structures and price patterns.'
        },
        {
          id: 'apk-1',
          title: 'Ghanshyam Oli Trading Mobile App (Official Android APK)',
          name: 'Ghanshyam Oli Trading Mobile App (Official Android APK)',
          url: 'https://raw.githubusercontent.com/ghanshyamoli/assets/main/ghanshyam-trading-v2.5.apk',
          type: 'APK',
          size: '18.5 MB',
          category: 'Software',
          logo: 'android',
          logoType: 'preset',
          version: 'v2.5.0 (Latest)',
          downloads: 1420,
          status: 'Published',
          date: 'Sep 29, 2026',
          description: 'Official Android application for live candlestick patterns, price action cheat sheets, and offline trading calculators.'
        },
        {
          id: 'soft-1',
          title: 'Market Risk & Position Calculator Desktop Software',
          name: 'Market Risk & Position Calculator Desktop Software',
          url: 'https://raw.githubusercontent.com/ghanshyamoli/assets/main/market-calculator-desktop.exe',
          type: 'SOFTWARE',
          size: '32.4 MB',
          category: 'Software',
          logo: 'windows',
          logoType: 'preset',
          version: 'v1.2.0',
          downloads: 884,
          status: 'Published',
          date: 'Sep 24, 2026',
          description: 'Standalone desktop utility for Windows and Mac to calculate accurate lot sizes and risk-reward ratios.'
        },
        {
          id: 2,
          title: 'Weekly Review Template',
          name: 'Weekly Review Template',
          url: 'https://file-examples.com/wp-content/storage/2017/02/file_example_XLSX_50.xlsx',
          type: 'XLSX',
          size: '48 KB',
          category: 'Templates',
          logo: 'xls',
          logoType: 'preset',
          version: 'v1.1',
          downloads: 521,
          status: 'Published',
          date: 'Sep 12, 2026',
          description: 'Track and review decisions, trading outcomes, and actionable improvements.'
        },
        {
          id: 3,
          title: 'Learning Sprint Planner',
          name: 'Learning Sprint Planner',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          type: 'PDF',
          size: '860 KB',
          category: 'Ebook',
          logo: 'pdf',
          logoType: 'preset',
          version: 'v1.0',
          downloads: 319,
          status: 'Draft',
          date: 'Sep 08, 2026',
          description: 'Plan a focused 14-day learning sprint without overloading your daily routine.'
        },
        {
          id: 4,
          title: 'Position Size Calculator',
          name: 'Position Size Calculator',
          url: 'https://file-examples.com/wp-content/storage/2017/02/file_example_XLSX_10.xlsx',
          type: 'XLSX',
          size: '32 KB',
          category: 'Tools',
          logo: 'xls',
          logoType: 'preset',
          version: 'v2.0',
          downloads: 462,
          status: 'Published',
          date: 'Sep 01, 2026',
          description: 'A simple spreadsheet calculator for consistent portfolio risk calculations.'
        }
      ];
    },
    getFormattedToday() {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      return `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;
    },
    getAll() {
      const stored = this.getStorageDownloads();
      if (stored && Array.isArray(stored) && stored.length > 0) {
        // Ensure new defaults (like APK and desktop software) are merged if missing
        const defs = this.getDefaults();
        let updated = false;
        defs.forEach(defItem => {
          if (!stored.some(s => String(s.id) === String(defItem.id) || s.title === defItem.title)) {
            stored.push(defItem);
            updated = true;
          }
        });
        if (updated) {
          try { localStorage.setItem('gh_downloads', JSON.stringify(stored)); } catch {}
        }
        return stored;
      }
      const def = this.getDefaults();
      try {
        localStorage.setItem('gh_downloads', JSON.stringify(def));
      } catch (e) {
        console.warn('Storage write failed', e);
      }
      return def;
    },
    getById(id) {
      return this.getAll().find(d => String(d.id) === String(id));
    },
    save(item) {
      const list = [...this.getAll()];
      const id = item.id ? String(item.id) : String(Date.now());
      const title = item.title || item.name || 'Untitled Resource';
      const existing = list.find(d => String(d.id) === id);
      
      const completeItem = {
        id: id,
        title: title,
        name: title,
        url: item.url || item.downloadUrl || '#',
        type: (item.type || 'PDF').toUpperCase(),
        size: item.size || '1.0 MB',
        category: item.category || 'Notes',
        logo: item.logo !== undefined ? item.logo : (existing?.logo || ''),
        logoType: item.logoType || (existing?.logoType || (item.logo?.startsWith('http') || item.logo?.startsWith('data:') ? 'image' : 'preset')),
        version: item.version !== undefined ? item.version : (existing?.version || ''),
        downloads: Number(item.downloads ?? (existing ? existing.downloads : 0)),
        status: item.status || 'Published',
        date: item.date || (existing ? existing.date : this.getFormattedToday()),
        description: item.description || ''
      };

      const idx = list.findIndex(d => String(d.id) === id);
      if (idx >= 0) {
        list[idx] = completeItem;
      } else {
        list.unshift(completeItem);
      }
      localStorage.setItem('gh_downloads', JSON.stringify(list));
      return completeItem;
    },
    delete(id) {
      const targetId = String(id);
      const list = this.getAll().filter(d => String(d.id) !== targetId);
      localStorage.setItem('gh_downloads', JSON.stringify(list));
      return true;
    },
    incrementDownloads(id) {
      const list = [...this.getAll()];
      const item = list.find(d => String(d.id) === String(id));
      if (item) {
        item.downloads = (Number(item.downloads) || 0) + 1;
        localStorage.setItem('gh_downloads', JSON.stringify(list));
      }
      return item;
    }
  };
}

// USER MANAGEMENT SYSTEM - Synchronizes users with localStorage
if (!window.ghUserManager) {
  window.ghUserManager = {
    getStorageUsers() {
      try {
        return JSON.parse(localStorage.getItem('gh_users') || 'null');
      } catch {
        return null;
      }
    },
    getDefaults() {
      return [
        { id: 1, name: 'Ghanshyam Oli', email: 'admin@ghanshyamoli.com', role: 'Admin', status: 'Active', joined: 'Jan 15, 2026', last: 'Active now' },
        { id: 2, name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Student', status: 'Active', joined: 'Sep 18, 2026', last: '2 hours ago' },
        { id: 3, name: 'Maya Chen', email: 'maya@example.com', role: 'Editor', status: 'Active', joined: 'Sep 12, 2026', last: 'Yesterday' },
        { id: 4, name: 'Rohan Das', email: 'rohan@example.com', role: 'User', status: 'Pending', joined: 'Sep 10, 2026', last: 'Sep 19, 2026' },
        { id: 5, name: 'Sophia Taylor', email: 'sophia@example.com', role: 'Student', status: 'Active', joined: 'Sep 04, 2026', last: '3 days ago' },
        { id: 6, name: 'Alex Vance', email: 'alex.vance@example.com', role: 'User', status: 'Blocked', joined: 'Aug 29, 2026', last: 'Aug 30, 2026' }
      ];
    },
    getFormattedToday() {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      return `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;
    },
    getAll() {
      const stored = this.getStorageUsers();
      if (stored && Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
      const def = this.getDefaults();
      try {
        localStorage.setItem('gh_users', JSON.stringify(def));
      } catch (e) {
        console.warn('User storage write failed', e);
      }
      return def;
    },
    getById(id) {
      return this.getAll().find(u => String(u.id) === String(id));
    },
    save(userData) {
      const list = [...this.getAll()];
      const id = userData.id ? String(userData.id) : String(Date.now());
      const existing = list.find(u => String(u.id) === id);

      const completeUser = {
        id: id,
        name: userData.name || 'Anonymous User',
        email: userData.email || 'user@example.com',
        role: userData.role || 'Student',
        status: userData.status || 'Active',
        joined: userData.joined || (existing ? existing.joined : this.getFormattedToday()),
        last: userData.last || (existing ? existing.last : 'Just now'),
        bio: userData.bio || ''
      };

      const idx = list.findIndex(u => String(u.id) === id);
      if (idx >= 0) {
        list[idx] = completeUser;
      } else {
        list.unshift(completeUser);
      }
      localStorage.setItem('gh_users', JSON.stringify(list));
      return completeUser;
    },
    toggleStatus(id) {
      const list = [...this.getAll()];
      const user = list.find(u => String(u.id) === String(id));
      if (user) {
        user.status = user.status === 'Active' ? 'Blocked' : 'Active';
        localStorage.setItem('gh_users', JSON.stringify(list));
      }
      return user;
    },
    delete(id) {
      const targetId = String(id);
      const list = this.getAll().filter(u => String(u.id) !== targetId);
      localStorage.setItem('gh_users', JSON.stringify(list));
      return true;
    }
  };
}

const adminData = {
  get posts() {
    return window.ghPostManager.getAll();
  },
  get downloads() {
    return window.ghDownloadManager.getAll();
  },
  get users() {
    return window.ghUserManager.getAll();
  },
  courses: [
    { id: 1, title: 'Candlestick Mastery', category: 'Trading', students: 248, lessons: 24, status: 'Published', rating: '4.9', revenue: '$4,280' },
    { id: 2, title: 'Build Your First Website', category: 'Web Development', students: 186, lessons: 18, status: 'Published', rating: '4.8', revenue: '$2,960' },
    { id: 3, title: 'The Digital Workbench', category: 'Digital Skills', students: 94, lessons: 12, status: 'Draft', rating: '-', revenue: '$0' }
  ],
  categories: ['Trading', 'Stock Market', 'Technology', 'Business', 'Web Development', 'Learning', 'Tutorial', 'Digital Skills'],
  comments: [
    { id: 1, user: 'Nina Patel', comment: 'This framework made the chart much easier to read.', post: 'Candlestick Charts', date: '2 min ago', status: 'Pending' },
    { id: 2, user: 'Leo Morgan', comment: 'The weekly review template is excellent.', post: 'Learning System', date: '1 hour ago', status: 'Approved' }
  ],
  messages: [
    { id: 1, name: 'Sam Wilson', email: 'sam@example.com', subject: 'Course collaboration', date: 'Today', status: 'Unread' },
    { id: 2, name: 'Priya K', email: 'priya@example.com', subject: 'Trading article question', date: 'Yesterday', status: 'Read' }
  ],
  get notices() {
    return window.ghNoticeManager.getAllNotices();
  },
  get userNotifications() {
    return window.ghNoticeManager.getAllUserNotifications();
  },
  notifications: [
    { title: 'New comment awaiting review', type: 'Comment', time: '2 min ago' },
    { title: 'New course enrollment', type: 'Course', time: '18 min ago' },
    { title: 'Newsletter subscription received', type: 'Subscriber', time: '1 hour ago' }
  ]
};

// =========================================================
// NOTICE & NOTIFICATION MANAGEMENT SYSTEM (ADMIN SYNC)
// =========================================================
if (!window.ghNoticeManager) {
  window.ghNoticeManager = {
    NOTICES_STORAGE_KEY: 'gh_website_notices',
    USER_NOTIFS_STORAGE_KEY: 'gh_user_notifications',

    getDefaultNotices() {
      return [
        {
          id: 'notice-1',
          title: '📢 आधिकारिक एन्ड्रोइड एप (APK) र नयाँ सफ्टवेयर उपलब्ध छ!',
          message: 'Ghanshyam Oli को नयाँ ट्रेडिङ तथा मार्केट एनालिसिस एन्ड्रोइड APK र डेस्कटप सफ्टवेयर रिलिज भएको छ। डाउनलोड सेक्सनबाट सुरक्षित रूपमा डाउनलोड गर्नुहोस्।',
          type: 'update',
          badge: 'NEW APK',
          showBanner: true,
          active: true,
          link: 'downloads.html',
          linkText: 'APK डाउनलोड गर्नुहोस् ⚡',
          date: 'Sep 30, 2026',
          createdAt: Date.now() - 3600000
        },
        {
          id: 'notice-2',
          title: 'बिशेष सूचना: नयाँ ट्रेडिङ तथा प्राविधिक विश्लेषण लाइभ कक्षा',
          message: 'सबै सदस्यहरूका लागि नयाँ ब्याचको प्रत्यक्ष अनलाइन कक्षा आगामी हप्तादेखि सुरु हुँदैछ। कोर्सेज सेक्सनबाट पाठ्यक्रम र समय तालिका हेर्नुहोस्।',
          type: 'important',
          badge: 'NOTICE',
          showBanner: false,
          active: true,
          link: 'courses.html',
          linkText: 'कोर्स विवरण ↗',
          date: 'Sep 28, 2026',
          createdAt: Date.now() - 86400000
        }
      ];
    },

    getDefaultUserNotifications() {
      return [
        {
          id: 'unotif-1',
          targetEmail: 'student@example.com',
          targetName: 'Demo Student',
          title: 'स्वागत छ! तपाईंको VIP डाउनलोड पहुँच सक्रिय भयो',
          message: 'तपाईंको खाता सफलतापूर्वक भेरिफाई भएको छ। अब तपाईंले सबै प्रिमियम नोट्स, एक्सेल फाइलहरू, र एन्ड्रोइड APK फाइलहरू सिधै डाउनलोड गर्न सक्नुहुन्छ।',
          category: 'account',
          link: 'downloads.html',
          linkText: 'फाइलहरू हेर्नुहोस् ↗',
          date: 'Sep 30, 2026, 02:45 PM',
          createdAt: Date.now() - 7200000,
          readBy: []
        },
        {
          id: 'unotif-2',
          targetEmail: 'all',
          targetName: 'All Members',
          title: '🚀 नयाँ APK v2.5.0 तथा डेस्कटप टुल अपडेट जारी',
          message: 'हाम्रो प्लेटफर्ममा नयाँ एन्ड्रोइड APK (v2.5.0) र विन्डोज सफ्टवेयर टुल थपिएको छ। आफ्नो एप अपडेट गर्न डाउनलोड सेक्सनमा जानुहोस्।',
          category: 'download',
          link: 'downloads.html',
          linkText: 'नयाँ APK हेर्नुहोस् ↗',
          date: 'Sep 29, 2026, 11:15 AM',
          createdAt: Date.now() - 86400000,
          readBy: []
        }
      ];
    },

    getFormattedToday() {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h12 = hours % 12 || 12;
      return `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}, ${h12}:${mins} ${ampm}`;
    },

    // WEBSITE NOTICES
    getAllNotices() {
      try {
        const stored = localStorage.getItem(this.NOTICES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Error reading notices', e);
      }
      const def = this.getDefaultNotices();
      try {
        localStorage.setItem(this.NOTICES_STORAGE_KEY, JSON.stringify(def));
      } catch {}
      return def;
    },

    getActiveNotices() {
      return this.getAllNotices().filter(n => n.active !== false);
    },

    getBannerNotice() {
      const list = this.getActiveNotices();
      return list.find(n => n.showBanner === true) || null;
    },

    saveNotice(noticeData) {
      const list = [...this.getAllNotices()];
      const id = noticeData.id ? String(noticeData.id) : `notice-${Date.now()}`;
      const existing = list.find(n => String(n.id) === id);

      const completeNotice = {
        id: id,
        title: noticeData.title || 'वेबसाइट सूचना',
        message: noticeData.message || '',
        type: noticeData.type || 'info',
        badge: noticeData.badge || 'NOTICE',
        showBanner: Boolean(noticeData.showBanner),
        active: noticeData.active !== false,
        link: noticeData.link || '',
        linkText: noticeData.linkText || 'थप जानकारी ↗',
        date: noticeData.date || (existing ? existing.date : this.getFormattedToday()),
        createdAt: noticeData.createdAt || (existing ? existing.createdAt : Date.now())
      };

      const idx = list.findIndex(n => String(n.id) === id);
      if (idx >= 0) {
        list[idx] = completeNotice;
      } else {
        list.unshift(completeNotice);
      }

      localStorage.setItem(this.NOTICES_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('gh_notifications_updated'));
      return completeNotice;
    },

    deleteNotice(id) {
      const targetId = String(id);
      const list = this.getAllNotices().filter(n => String(n.id) !== targetId);
      localStorage.setItem(this.NOTICES_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('gh_notifications_updated'));
      return true;
    },

    toggleNoticeStatus(id) {
      const list = [...this.getAllNotices()];
      const item = list.find(n => String(n.id) === String(id));
      if (item) {
        item.active = !item.active;
        localStorage.setItem(this.NOTICES_STORAGE_KEY, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('gh_notifications_updated'));
      }
      return item;
    },

    // USER DIRECT NOTIFICATIONS
    getAllUserNotifications() {
      try {
        const stored = localStorage.getItem(this.USER_NOTIFS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Error reading user notifs', e);
      }
      const def = this.getDefaultUserNotifications();
      try {
        localStorage.setItem(this.USER_NOTIFS_STORAGE_KEY, JSON.stringify(def));
      } catch {}
      return def;
    },

    getNotificationsForUser(email) {
      if (!email) return [];
      const cleanEmail = email.toLowerCase().trim();
      const all = this.getAllUserNotifications();
      return all.filter(n => {
        const target = (n.targetEmail || '').toLowerCase().trim();
        return target === 'all' || target === cleanEmail;
      });
    },

    sendUserNotification(payload) {
      const list = [...this.getAllUserNotifications()];
      const id = payload.id ? String(payload.id) : `unotif-${Date.now()}`;
      const newNotif = {
        id: id,
        targetEmail: (payload.targetEmail || 'all').toLowerCase().trim(),
        targetName: payload.targetName || (payload.targetEmail === 'all' ? 'All Registered Members' : payload.targetEmail),
        title: payload.title || 'नयाँ सूचना',
        message: payload.message || '',
        category: payload.category || 'personal',
        link: payload.link || '',
        linkText: payload.linkText || 'हेर्नुहोस् ↗',
        date: payload.date || this.getFormattedToday(),
        createdAt: Date.now(),
        readBy: []
      };

      list.unshift(newNotif);
      localStorage.setItem(this.USER_NOTIFS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('gh_notifications_updated'));
      return newNotif;
    },

    deleteUserNotification(id) {
      const targetId = String(id);
      const list = this.getAllUserNotifications().filter(n => String(n.id) !== targetId);
      localStorage.setItem(this.USER_NOTIFS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('gh_notifications_updated'));
      return true;
    },

    markAsRead(notifId, userEmail) {
      if (!userEmail) return;
      const cleanEmail = userEmail.toLowerCase().trim();
      const list = [...this.getAllUserNotifications()];
      const notif = list.find(n => String(n.id) === String(notifId));
      if (notif) {
        if (!Array.isArray(notif.readBy)) notif.readBy = [];
        if (!notif.readBy.includes(cleanEmail)) {
          notif.readBy.push(cleanEmail);
          localStorage.setItem(this.USER_NOTIFS_STORAGE_KEY, JSON.stringify(list));
          window.dispatchEvent(new CustomEvent('gh_notifications_updated'));
        }
      }
    },

    markAllAsRead(userEmail) {
      if (!userEmail) return;
      const cleanEmail = userEmail.toLowerCase().trim();
      const list = [...this.getAllUserNotifications()];
      let changed = false;
      list.forEach(n => {
        const target = (n.targetEmail || '').toLowerCase().trim();
        if (target === 'all' || target === cleanEmail) {
          if (!Array.isArray(n.readBy)) n.readBy = [];
          if (!n.readBy.includes(cleanEmail)) {
            n.readBy.push(cleanEmail);
            changed = true;
          }
        }
      });
      if (changed) {
        localStorage.setItem(this.USER_NOTIFS_STORAGE_KEY, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('gh_notifications_updated'));
      }
    },

    getUnreadCount(userEmail) {
      if (!userEmail) return 0;
      const cleanEmail = userEmail.toLowerCase().trim();
      const userNotifs = this.getNotificationsForUser(cleanEmail);
      return userNotifs.filter(n => !Array.isArray(n.readBy) || !n.readBy.includes(cleanEmail)).length;
    },

    getRegisteredUsers() {
      const usersMap = new Map();
      const defaultList = [
        { name: 'Demo Student', email: 'student@example.com', role: 'Student' },
        { name: 'Ghanshyam Member', email: 'member@ghanshyamoli.com', role: 'VIP Member' },
        { name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Student' },
        { name: 'Maya Chen', email: 'maya@example.com', role: 'Editor' },
        { name: 'Sophia Taylor', email: 'sophia@example.com', role: 'Student' }
      ];
      defaultList.forEach(u => usersMap.set(u.email.toLowerCase(), u));

      try {
        const registered = JSON.parse(localStorage.getItem('gh_registered_users') || '[]');
        if (Array.isArray(registered)) {
          registered.forEach(u => {
            if (u.email) {
              usersMap.set(u.email.toLowerCase(), {
                name: u.name || u.email.split('@')[0],
                email: u.email,
                role: u.role || 'Member'
              });
            }
          });
        }
      } catch {}

      try {
        const adminUsers = JSON.parse(localStorage.getItem('gh_users') || '[]');
        if (Array.isArray(adminUsers)) {
          adminUsers.forEach(u => {
            if (u.email) {
              usersMap.set(u.email.toLowerCase(), {
                name: u.name || u.email.split('@')[0],
                email: u.email,
                role: u.role || 'User'
              });
            }
          });
        }
      } catch {}

      return Array.from(usersMap.values());
    }
  };
}

