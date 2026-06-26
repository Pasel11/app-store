// ============================================================================
//  store.js - طبقة البيانات الكاملة
//  كل البيانات قابلة للتعديل والحفظ في localStorage
// ============================================================================

const Store = {

    // === تحميل كل البيانات ===
    init() {
        this.loadApps();
        this.loadCategories();
        this.loadCoupons();
        this.loadUsers();
        this.loadSettings();
    },

    // === التطبيقات ===
    loadApps() {
        // دمج التطبيقات الأصلية مع المخصصة
        const custom = JSON.parse(localStorage.getItem('customApps') || '[]');
        const deleted = JSON.parse(localStorage.getItem('deletedApps') || '[]');
        const modified = JSON.parse(localStorage.getItem('modifiedApps') || '{}');

        // البدء بالتطبيقات الأصلية
        let apps = APPS.map(app => {
            // تطبيق التعديلات إن وجدت
            if (modified[app.id]) {
                return { ...app, ...modified[app.id] };
            }
            return { ...app };
        });

        // إزالة المحذوفة
        apps = apps.filter(app => !deleted.includes(app.id));

        // إضافة المخصصة
        apps = apps.concat(custom);

        return apps;
    },

    saveApp(appData) {
        const isOriginal = APPS.some(a => a.id === appData.id);
        const custom = JSON.parse(localStorage.getItem('customApps') || '[]');
        const modified = JSON.parse(localStorage.getItem('modifiedApps') || '{}');

        if (isOriginal) {
            // تعديل تطبيق أصلي
            modified[appData.id] = appData;
            localStorage.setItem('modifiedApps', JSON.stringify(modified));
        } else {
            // تطبيق مخصص - تعديل أو إضافة
            const idx = custom.findIndex(a => a.id === appData.id);
            if (idx !== -1) {
                custom[idx] = appData;
            } else {
                custom.push(appData);
            }
            localStorage.setItem('customApps', JSON.stringify(custom));
        }
    },

    deleteApp(appId) {
        const isOriginal = APPS.some(a => a.id === appId);
        if (isOriginal) {
            const deleted = JSON.parse(localStorage.getItem('deletedApps') || '[]');
            if (!deleted.includes(appId)) deleted.push(appId);
            localStorage.setItem('deletedApps', JSON.stringify(deleted));
        } else {
            let custom = JSON.parse(localStorage.getItem('customApps') || '[]');
            custom = custom.filter(a => a.id !== appId);
            localStorage.setItem('customApps', JSON.stringify(custom));
        }
    },

    // === الفئات ===
    loadCategories() {
        const custom = JSON.parse(localStorage.getItem('customCategories') || '[]');
        const deleted = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
        const modified = JSON.parse(localStorage.getItem('modifiedCategories') || '{}');

        let cats = CATEGORIES.map(cat => {
            if (modified[cat.id]) return { ...cat, ...modified[cat.id] };
            return { ...cat };
        });

        cats = cats.filter(c => !deleted.includes(c.id));
        cats = cats.concat(custom);
        return cats;
    },

    saveCategory(catData) {
        const isOriginal = CATEGORIES.some(c => c.id === catData.id);
        const custom = JSON.parse(localStorage.getItem('customCategories') || '[]');
        const modified = JSON.parse(localStorage.getItem('modifiedCategories') || '{}');

        if (isOriginal) {
            modified[catData.id] = catData;
            localStorage.setItem('modifiedCategories', JSON.stringify(modified));
        } else {
            const idx = custom.findIndex(c => c.id === catData.id);
            if (idx !== -1) custom[idx] = catData;
            else custom.push(catData);
            localStorage.setItem('customCategories', JSON.stringify(custom));
        }
    },

    deleteCategory(catId) {
        const isOriginal = CATEGORIES.some(c => c.id === catId);
        if (isOriginal) {
            const deleted = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
            if (!deleted.includes(catId)) deleted.push(catId);
            localStorage.setItem('deletedCategories', JSON.stringify(deleted));
        } else {
            let custom = JSON.parse(localStorage.getItem('customCategories') || '[]');
            custom = custom.filter(c => c.id !== catId);
            localStorage.setItem('customCategories', JSON.stringify(custom));
        }
    },

    // === الكوبونات ===
    loadCoupons() {
        const custom = JSON.parse(localStorage.getItem('customCoupons') || '{}');
        const deleted = JSON.parse(localStorage.getItem('deletedCoupons') || '[]');
        const modified = JSON.parse(localStorage.getItem('modifiedCoupons') || '{}');

        let coupons = {};
        // الأصلية
        for (const [code, data] of Object.entries(COUPONS)) {
            if (!deleted.includes(code)) {
                coupons[code] = modified[code] ? { ...data, ...modified[code] } : { ...data };
            }
        }
        // المخصصة
        for (const [code, data] of Object.entries(custom)) {
            if (!deleted.includes(code)) {
                coupons[code] = data;
            }
        }
        return coupons;
    },

    saveCoupon(code, couponData) {
        const isOriginal = COUPONS[code] !== undefined;
        const custom = JSON.parse(localStorage.getItem('customCoupons') || '{}');
        const modified = JSON.parse(localStorage.getItem('modifiedCoupons') || '{}');

        if (isOriginal) {
            modified[code] = couponData;
            localStorage.setItem('modifiedCoupons', JSON.stringify(modified));
        } else {
            custom[code] = couponData;
            localStorage.setItem('customCoupons', JSON.stringify(custom));
        }
    },

    deleteCoupon(code) {
        const isOriginal = COUPONS[code] !== undefined;
        if (isOriginal) {
            const deleted = JSON.parse(localStorage.getItem('deletedCoupons') || '[]');
            if (!deleted.includes(code)) deleted.push(code);
            localStorage.setItem('deletedCoupons', JSON.stringify(deleted));
        } else {
            let custom = JSON.parse(localStorage.getItem('customCoupons') || '{}');
            delete custom[code];
            localStorage.setItem('customCoupons', JSON.stringify(custom));
        }
    },

    // === المستخدمون ===
    loadUsers() {
        const custom = JSON.parse(localStorage.getItem('customUsers') || '{}');
        const modified = JSON.parse(localStorage.getItem('modifiedUsers') || '{}');
        const deleted = JSON.parse(localStorage.getItem('deletedUsers') || '[]');

        let users = {};
        for (const [email, data] of Object.entries(USERS)) {
            if (!deleted.includes(email)) {
                users[email] = modified[email] ? { ...data, ...modified[email] } : { ...data };
            }
        }
        for (const [email, data] of Object.entries(custom)) {
            if (!deleted.includes(email)) {
                users[email] = data;
            }
        }
        return users;
    },

    saveUser(email, userData) {
        const isOriginal = USERS[email] !== undefined;
        const custom = JSON.parse(localStorage.getItem('customUsers') || '{}');
        const modified = JSON.parse(localStorage.getItem('modifiedUsers') || '{}');

        if (isOriginal) {
            modified[email] = userData;
            localStorage.setItem('modifiedUsers', JSON.stringify(modified));
        } else {
            custom[email] = userData;
            localStorage.setItem('customUsers', JSON.stringify(custom));
        }
    },

    deleteUser(email) {
        const isOriginal = USERS[email] !== undefined;
        if (isOriginal) {
            const deleted = JSON.parse(localStorage.getItem('deletedUsers') || '[]');
            if (!deleted.includes(email)) deleted.push(email);
            localStorage.setItem('deletedUsers', JSON.stringify(deleted));
        } else {
            let custom = JSON.parse(localStorage.getItem('customUsers') || '{}');
            delete custom[email];
            localStorage.setItem('customUsers', JSON.stringify(custom));
        }
    },

    // === إعدادات الموقع ===
    loadSettings() {
        const defaults = {
            storeName: 'متجر التطبيقات',
            storeNameEn: 'App Store',
            supportEmail: 'support@appstore.com',
            currency: 'USD',
            currencySymbol: '$',
            primaryColor: '#6750A4',
            maxFileSize: 50,
            maxImageSize: 2,
            allowRegistration: true,
            requireEmailVerification: false,
            maintenanceMode: false,
            footerText: '© 2026 متجر التطبيقات | جميع الحقوق محفوظة',
            announcement: '',
            announcementActive: false
        };
        const saved = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        return { ...defaults, ...saved };
    },

    saveSettings(settings) {
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    },

    // === التصدير والاستيراد ===
    exportAll() {
        const data = {
            customApps: JSON.parse(localStorage.getItem('customApps') || '[]'),
            modifiedApps: JSON.parse(localStorage.getItem('modifiedApps') || '{}'),
            deletedApps: JSON.parse(localStorage.getItem('deletedApps') || '[]'),
            customCategories: JSON.parse(localStorage.getItem('customCategories') || '[]'),
            modifiedCategories: JSON.parse(localStorage.getItem('modifiedCategories') || '{}'),
            deletedCategories: JSON.parse(localStorage.getItem('deletedCategories') || '[]'),
            customCoupons: JSON.parse(localStorage.getItem('customCoupons') || '{}'),
            modifiedCoupons: JSON.parse(localStorage.getItem('modifiedCoupons') || '{}'),
            deletedCoupons: JSON.parse(localStorage.getItem('deletedCoupons') || '[]'),
            customUsers: JSON.parse(localStorage.getItem('customUsers') || '{}'),
            modifiedUsers: JSON.parse(localStorage.getItem('modifiedUsers') || '{}'),
            deletedUsers: JSON.parse(localStorage.getItem('deletedUsers') || '[]'),
            siteSettings: this.loadSettings(),
            exportedAt: new Date().toISOString()
        };
        return data;
    },

    importAll(data) {
        for (const [key, value] of Object.entries(data)) {
            if (key !== 'exportedAt') {
                localStorage.setItem(key, JSON.stringify(value));
            }
        }
    },

    // === إعادة تعيين كل شيء ===
    resetAll() {
        const keys = [
            'customApps', 'modifiedApps', 'deletedApps',
            'customCategories', 'modifiedCategories', 'deletedCategories',
            'customCoupons', 'modifiedCoupons', 'deletedCoupons',
            'customUsers', 'modifiedUsers', 'deletedUsers',
            'siteSettings', 'cart', 'purchased', 'user', 'loginTime'
        ];
        keys.forEach(k => localStorage.removeItem(k));
    }
};
