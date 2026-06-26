// ============================================================================
//  app-store.js v2.0 - مع رفع ملفات حقيقي + لوحة تحكم كاملة
// ============================================================================

let currentLang = localStorage.getItem('lang') || 'ar';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let purchasedApps = JSON.parse(localStorage.getItem('purchased') || '[]');
let customApps = JSON.parse(localStorage.getItem('customApps') || '[]');
let currentFilter = 'all';
let currentSort = 'popular';
let searchQuery = '';
let editingAppId = null;
let uploadedFileData = null;
let uploadedIconData = null;

// === الترجمات ===
const TRANSLATIONS = {
    ar: {
        home:'الرئيسية', categories:'الفئات', search:'ابحث عن تطبيقات...', cart:'السلة',
        login:'تسجيل الدخول', register:'حساب جديد', logout:'خروج', account:'حسابي', admin:'لوحة الإدارة',
        featured:'مميز', popular:'الأكثر شيوعاً', newest:'الأحدث', free:'مجاني', install:'تثبيت',
        buy:'شراء', add_to_cart:'أضف للسلة', remove:'إزالة', downloads:'تحميل', rating:'تقييم',
        developer:'المطور', version:'الإصدار', size:'الحجم', updated:'آخر تحديث', reviews:'المراجعات',
        related_apps:'تطبيقات مشابهة', all_categories:'كل الفئات', sort_by:'ترتيب حسب',
        price_low:'السعر: الأقل', price_high:'السعر: الأعلى', rating_high:'التقييم: الأعلى',
        most_downloaded:'الأكثر تحميلاً', checkout:'إتمام الشراء', total:'الإجمالي',
        apply_coupon:'تطبيق', coupon_code:'كود الخصم', empty_cart:'السلة فارغة',
        continue_shopping:'متابعة التسوق', purchase_success:'تم الشراء بنجاح!',
        added_to_cart:'تمت الإضافة للسلة', removed_from_cart:'تمت الإزالة',
        already_in_cart:'موجود في السلة', already_purchased:'مشترى بالفعل',
        download_now:'تحميل الآن', login_required:'يجب تسجيل الدخول',
        invalid_credentials:'بيانات غير صحيحة', welcome_back:'مرحباً بعودتك',
        email:'البريد الإلكتروني', password:'كلمة المرور', name:'الاسم',
        login_btn:'دخول', register_btn:'إنشاء حساب', no_account:'ليس لديك حساب؟',
        have_account:'لديك حساب؟', hero_title:'متجر التطبيقات الأول عربياً',
        hero_subtitle:'100+ تطبيق احترافي + رفع تطبيقاتك الخاصة بسهولة',
        browse_now:'تصفح الآن', learn_more:'اعرف المزيد', view_all:'عرض الكل',
        upload_app:'رفع تطبيق', my_library:'مكتبتي', dashboard:'الرئيسية',
        manage_apps:'إدارة التطبيقات', orders:'الطلبات', users:'المستخدمون',
        add_new:'إضافة جديد', edit:'تعديل', delete:'حذف', save:'حفظ', cancel:'إلغاء',
        app_name:'اسم التطبيق', app_category:'الفئة', app_price:'السعر ($)',
        app_description_ar:'الوصف بالعربية', app_description_en:'الوصف بالإنجليزية',
        app_icon:'الأيقونة', app_file:'ملف التطبيق', app_tags:'الوسوم (مفصولة بفاصلة)',
        upload_file:'اسحب الملف هنا أو اضغط للاختيار', file_types:'APK, ZIP, RAR, EXE, JS, PY',
        upload_icon:'اختر أيقونة (PNG/JPG)', total_apps:'إجمالي التطبيقات',
        total_sales:'المبيعات', total_revenue:'الإيرادات', total_downloads:'التحميلات',
        no_apps:'لا توجد تطبيقات', confirm_delete:'هل تريد الحذف؟',
        uploaded_success:'تم رفع التطبيق بنجاح!', uploaded_failed:'فشل الرفع',
        file_too_large:'الملف كبير جداً (حد أقصى 50MB)', icon_too_large:'الصورة كبيرة (حد 2MB)',
        select_file:'اختر ملف', no_file:'لم يتم اختيار ملف', custom_apps:'تطبيقاتي المرفوعة'
    },
    en: {
        home:'Home', categories:'Categories', search:'Search apps...', cart:'Cart',
        login:'Login', register:'Register', logout:'Logout', account:'Account', admin:'Admin Panel',
        featured:'Featured', popular:'Popular', newest:'Newest', free:'Free', install:'Install',
        buy:'Buy', add_to_cart:'Add to Cart', remove:'Remove', downloads:'downloads', rating:'Rating',
        developer:'Developer', version:'Version', size:'Size', updated:'Updated', reviews:'Reviews',
        related_apps:'Related Apps', all_categories:'All Categories', sort_by:'Sort by',
        price_low:'Price: Low', price_high:'Price: High', rating_high:'Rating: High',
        most_downloaded:'Most Downloaded', checkout:'Checkout', total:'Total',
        apply_coupon:'Apply', coupon_code:'Coupon Code', empty_cart:'Cart is empty',
        continue_shopping:'Continue Shopping', purchase_success:'Purchase successful!',
        added_to_cart:'Added to cart', removed_from_cart:'Removed',
        already_in_cart:'Already in cart', already_purchased:'Already purchased',
        download_now:'Download Now', login_required:'Login required',
        invalid_credentials:'Invalid credentials', welcome_back:'Welcome back',
        email:'Email', password:'Password', name:'Name',
        login_btn:'Login', register_btn:'Register', no_account:'No account?',
        have_account:'Have account?', hero_title:'The #1 App Store',
        hero_subtitle:'100+ professional apps + upload your own easily',
        browse_now:'Browse Now', learn_more:'Learn More', view_all:'View All',
        upload_app:'Upload App', my_library:'My Library', dashboard:'Dashboard',
        manage_apps:'Manage Apps', orders:'Orders', users:'Users',
        add_new:'Add New', edit:'Edit', delete:'Delete', save:'Save', cancel:'Cancel',
        app_name:'App Name', app_category:'Category', app_price:'Price ($)',
        app_description_ar:'Description (Arabic)', app_description_en:'Description (English)',
        app_icon:'Icon', app_file:'App File', app_tags:'Tags (comma separated)',
        upload_file:'Drag file here or click to select', file_types:'APK, ZIP, RAR, EXE, JS, PY',
        upload_icon:'Select icon (PNG/JPG)', total_apps:'Total Apps',
        total_sales:'Sales', total_revenue:'Revenue', total_downloads:'Downloads',
        no_apps:'No apps found', confirm_delete:'Delete this?',
        uploaded_success:'App uploaded successfully!', uploaded_failed:'Upload failed',
        file_too_large:'File too large (max 50MB)', icon_too_large:'Image too large (max 2MB)',
        select_file:'Select File', no_file:'No file selected', custom_apps:'My Uploads'
    }
};

function t(key) { return TRANSLATIONS[currentLang][key] || key; }

// === جميع التطبيقات (الأصلية + المرفوعة + المعدلة) ===
function getAllApps() {
    return Store.loadApps();
}

function getAppById(id) {
    return Store.loadApps().find(a => a.id === id);
}

// === اللغة ===
function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    applyTranslations();
    renderPage();
    updateNavForUser();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
}

// === Toast ===
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// === السلة ===
function addToCart(appId) {
    if (cart.includes(appId)) { showToast(t('already_in_cart'), 'info'); return; }
    if (purchasedApps.includes(appId)) { showToast(t('already_purchased'), 'info'); return; }
    cart.push(appId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(t('added_to_cart'), 'success');
}

function removeFromCart(appId) {
    cart = cart.filter(id => id !== appId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(t('removed_from_cart'), 'info');
    openCart();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = cart.length;
        badge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

// === أدوات مساعدة ===
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function formatPrice(price) {
    if (price === 0) return `<span class="app-price free">${t('free')}</span>`;
    return `<span class="app-price paid">$${price.toFixed(2)}</span>`;
}

function getCategoryName(catId) {
    const cats = Store.loadCategories();
    const cat = cats.find(c => c.id === catId);
    if (!cat) return '';
    return currentLang === 'ar' ? cat.name_ar : cat.name_en;
}

// === تنزيل حقيقي ===
function downloadApp(appId) {
    const app = getAppById(appId);
    if (!app) return;

    if (app.fileData) {
        // تنزيل الملف المرفوع فعلياً
        const link = document.createElement('a');
        link.href = app.fileData;
        link.download = app.fileName || app.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('⬇️ ' + app.name, 'success');
    } else {
        // تطبيق أصلي - محاكاة
        showToast(`${t('download_now')}: ${app.name}`, 'success');
        setTimeout(() => {
            showToast('✓ ' + (currentLang === 'ar' ? 'تم التنزيل!' : 'Downloaded!'), 'success');
        }, 1500);
    }

    // زيادة عداد التحميل
    app.downloads = (app.downloads || 0) + 1;
}

// === عرض بطاقة تطبيق ===
function getAppCard(app) {
    const isInCart = cart.includes(app.id);
    const isPurchased = purchasedApps.includes(app.id);
    const isCustom = customApps.includes(app);
    const btnText = isPurchased ? '⬇️ ' + t('download_now') :
                    app.price === 0 ? t('install') :
                    isInCart ? '✓' : '🛒 ' + t('add_to_cart');
    const btnClass = isPurchased ? 'free' : app.price === 0 ? 'free' : 'paid';
    const btnAction = isPurchased ? `downloadApp(${app.id})` :
                      isInCart ? '' : `addToCart(${app.id})`;
    const bannerContent = app.iconData ?
        `<img src="${app.iconData}" alt="${app.name}">` :
        `<span style="font-size:64px;">${app.icon || '📱'}</span>`;

    return `
        <div class="app-card" onclick="openAppDetail(${app.id})">
            <div class="app-banner">
                ${bannerContent}
                ${app.featured ? `<span class="featured-badge">${t('featured')}</span>` : ''}
                ${isCustom ? `<span class="featured-badge" style="background:var(--gradient-green);left:14px;right:auto;">${t('custom_apps')}</span>` : ''}
            </div>
            <div class="app-info">
                <div class="app-name">${app.name}</div>
                <div class="app-dev">${app.developer}</div>
                <div class="app-meta">
                    <div class="app-rating"><span class="star">★</span> ${app.rating || 'NEW'}</div>
                    <div class="app-downloads">${formatNumber(app.downloads || 0)} ${t('downloads')}</div>
                </div>
                <div class="app-footer">
                    ${formatPrice(app.price)}
                    <button class="app-btn ${btnClass}" onclick="event.stopPropagation(); ${btnAction}" ${isInCart && !isPurchased ? 'disabled style="opacity:0.6"' : ''}>
                        ${btnText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// === تصفية وترتيب ===
function getFilteredApps() {
    let filtered = getAllApps();
    if (currentFilter !== 'all') filtered = filtered.filter(a => a.category === currentFilter);
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(a =>
            a.name.toLowerCase().includes(q) ||
            (a.developer || '').toLowerCase().includes(q) ||
            (currentLang === 'ar' ? a.desc_ar : a.desc_en).toLowerCase().includes(q) ||
            (a.tags || []).some(tag => tag.toLowerCase().includes(q))
        );
    }
    switch (currentSort) {
        case 'popular': filtered.sort((a, b) => (b.downloads||0) - (a.downloads||0)); break;
        case 'rating': filtered.sort((a, b) => (b.rating||0) - (a.rating||0)); break;
        case 'price_low': filtered.sort((a, b) => a.price - b.price); break;
        case 'price_high': filtered.sort((a, b) => b.price - a.price); break;
        case 'newest': filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated)); break;
    }
    return filtered;
}

// === عرض الصفحة ===
function renderPage() {
    renderCategories();
    renderFeaturedApps();
    renderAllApps();
    renderCategoriesChips();
    updateCartBadge();
}

function renderCategories() {
    const container = document.getElementById('categories-grid');
    if (!container) return;
    const allApps = Store.loadApps();
    const cats = Store.loadCategories();
    container.innerHTML = cats.map(cat => {
        const count = allApps.filter(a => a.category === cat.id).length;
        return `
            <div class="category-card" onclick="filterByCategory('${cat.id}')">
                <span class="cat-icon">${cat.icon}</span>
                <div class="cat-name">${currentLang === 'ar' ? cat.name_ar : cat.name_en}</div>
                <div class="cat-count">${count} ${currentLang === 'ar' ? 'تطبيق' : 'apps'}</div>
            </div>
        `;
    }).join('');
}

function renderCategoriesChips() {
    const container = document.getElementById('categories-chips');
    if (!container) return;
    const cats = Store.loadCategories();
    let html = `<div class="cat-chip ${currentFilter === 'all' ? 'active' : ''}" onclick="filterByCategory('all')">${t('all_categories')}</div>`;
    html += cats.map(cat =>
        `<div class="cat-chip ${currentFilter === cat.id ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
            ${cat.icon} ${currentLang === 'ar' ? cat.name_ar : cat.name_en}
        </div>`
    ).join('');
    container.innerHTML = html;
}

function renderFeaturedApps() {
    const container = document.getElementById('featured-apps');
    if (!container) return;
    const featured = getAllApps().filter(a => a.featured).slice(0, 10);
    container.innerHTML = featured.map(getAppCard).join('');
}

function renderAllApps() {
    const container = document.getElementById('all-apps');
    if (!container) return;
    const filtered = getFilteredApps();
    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-secondary);">
            <div style="font-size:64px;margin-bottom:16px;">🔍</div>
            <div style="font-size:20px;">${currentLang === 'ar' ? 'لا توجد نتائج' : 'No results'}</div>
        </div>`;
        return;
    }
    container.innerHTML = filtered.map(getAppCard).join('');
}

function filterByCategory(catId) {
    currentFilter = catId;
    renderCategoriesChips();
    renderAllApps();
    document.getElementById('all-apps-section')?.scrollIntoView({ behavior: 'smooth' });
}

function setSort(sort) { currentSort = sort; renderAllApps(); }

function handleSearch(query) {
    searchQuery = query;
    renderAllApps();
    if (query) document.getElementById('all-apps-section')?.scrollIntoView({ behavior: 'smooth' });
}

// === تفاصيل التطبيق ===
function openAppDetail(appId) {
    const app = getAppById(appId);
    if (!app) return;
    const desc = currentLang === 'ar' ? (app.desc_ar || '') : (app.desc_en || '');
    const isPurchased = purchasedApps.includes(app.id);
    const isInCart = cart.includes(app.id);
    const related = getAllApps().filter(a => a.category === app.category && a.id !== app.id).slice(0, 4);
    const reviews = REVIEWS[appId] || [];
    const reviewsHtml = reviews.length > 0 ? reviews.map(r => `
        <div style="padding:16px;border-bottom:1px solid var(--border);">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <strong>${r.user}</strong>
                <span style="color:var(--warning);">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
            </div>
            <p style="color:var(--text-secondary);font-size:14px;">${r.comment}</p>
            <small style="color:var(--text-secondary);">${r.date}</small>
        </div>
    `).join('') : `<p style="color:var(--text-secondary);text-align:center;padding:20px;">${currentLang === 'ar' ? 'لا توجد مراجعات' : 'No reviews'}</p>`;

    const modal = document.getElementById('app-modal');
    const iconHtml = app.iconData ?
        `<img src="${app.iconData}" style="width:100px;height:100px;border-radius:24px;object-fit:cover;">` :
        `<div style="width:100px;height:100px;background:var(--gradient-primary);border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:56px;">${app.icon || '📱'}</div>`;

    modal.innerHTML = `
        <div class="modal-overlay active" onclick="if(event.target===this)closeModal('app-modal')">
            <div class="modal" style="max-width:800px;">
                <div style="display:flex;gap:20px;margin-bottom:24px;">
                    ${iconHtml}
                    <div style="flex:1;">
                        <h1 style="font-size:28px;margin-bottom:8px;">${app.name}</h1>
                        <p style="color:var(--text-secondary);margin-bottom:8px;">${app.developer}</p>
                        <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:14px;">
                            <span>⭐ ${app.rating || 'NEW'}</span>
                            <span>⬇️ ${formatNumber(app.downloads || 0)}</span>
                            ${app.size ? `<span>📦 ${app.size}</span>` : ''}
                            ${app.version ? `<span>🔢 v${app.version}</span>` : ''}
                            <span>📅 ${app.updated}</span>
                        </div>
                    </div>
                    <button onclick="closeModal('app-modal')" style="font-size:24px;color:var(--text-secondary);">✕</button>
                </div>
                <p style="margin-bottom:24px;font-size:16px;line-height:1.8;">${desc}</p>
                ${app.tags && app.tags.length > 0 ? `
                    <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;">
                        ${app.tags.map(tag => `<span style="padding:6px 14px;background:var(--primary-light);border-radius:9999px;font-size:13px;color:var(--primary);font-weight:600;">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div style="display:flex;gap:16px;align-items:center;padding:20px;background:rgba(103,80,164,0.06);border-radius:16px;margin-bottom:32px;">
                    ${formatPrice(app.price)}
                    <button class="app-btn ${isPurchased ? 'free' : (app.price === 0 ? 'free' : 'paid')}"
                            style="padding:14px 32px;font-size:16px;"
                            onclick="${isPurchased ? `downloadApp(${app.id})` : (isInCart ? '' : `addToCart(${app.id})`)}"
                            ${isInCart && !isPurchased ? 'disabled style="opacity:0.6;padding:14px 32px;font-size:16px;"' : ''}>
                        ${isPurchased ? '⬇️ ' + t('download_now') :
                          isInCart ? '✓ ' + t('added_to_cart') :
                          app.price === 0 ? '⬇️ ' + t('install') : '🛒 ' + t('add_to_cart')}
                    </button>
                </div>
                ${related.length > 0 ? `
                    <h3 style="margin-bottom:16px;">${t('related_apps')}</h3>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:32px;">
                        ${related.map(a => `
                            <div class="app-card" onclick="closeModal('app-modal');setTimeout(()=>openAppDetail(${a.id}),300)">
                                <div class="app-banner" style="height:80px;font-size:40px;">${a.iconData ? `<img src="${a.iconData}">` : a.icon}</div>
                                <div class="app-info" style="padding:10px;">
                                    <div class="app-name" style="font-size:14px;">${a.name}</div>
                                    <div class="app-rating" style="font-size:12px;">⭐ ${a.rating || 'NEW'}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <h3 style="margin-bottom:16px;">${t('reviews')} (${reviews.length})</h3>
                <div style="border:1px solid var(--border);border-radius:12px;overflow:hidden;">${reviewsHtml}</div>
            </div>
        </div>
    `;
}

function closeModal(modalId) { document.getElementById(modalId).innerHTML = ''; }

// === السلة ===
function openCart() {
    if (cart.length === 0) { showToast(t('empty_cart'), 'info'); return; }
    const cartApps = cart.map(id => getAppById(id)).filter(Boolean);
    const total = cartApps.reduce((sum, app) => sum + app.price, 0);
    const modal = document.getElementById('cart-modal');
    modal.innerHTML = `
        <div class="modal-overlay active" onclick="if(event.target===this)closeModal('cart-modal')">
            <div class="modal" style="max-width:600px;max-height:90vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <h2>🛒 ${t('cart')} (${cart.length})</h2>
                    <button onclick="closeModal('cart-modal')" style="font-size:24px;">✕</button>
                </div>
                <div id="cart-items">
                    ${cartApps.map(app => `
                        <div style="display:flex;gap:16px;padding:16px;border-bottom:1px solid var(--border);align-items:center;">
                            <div style="width:60px;height:60px;border-radius:12px;overflow:hidden;flex-shrink:0;">
                                ${app.iconData ? `<img src="${app.iconData}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:28px;">${app.icon||'📱'}</div>`}
                            </div>
                            <div style="flex:1;">
                                <div style="font-weight:700;">${app.name}</div>
                                <div style="font-size:13px;color:var(--text-secondary);">${app.developer}</div>
                            </div>
                            <div style="font-weight:700;color:var(--primary);">${app.price === 0 ? t('free') : '$' + app.price.toFixed(2)}</div>
                            <button onclick="removeFromCart(${app.id})" style="color:var(--error);font-size:20px;padding:8px;">🗑️</button>
                        </div>
                    `).join('')}
                </div>
                <div style="margin:24px 0;">
                    <label style="display:block;margin-bottom:8px;font-weight:600;">${t('coupon_code')}</label>
                    <div style="display:flex;gap:8px;">
                        <input type="text" id="coupon-input" placeholder="${t('coupon_code')}" style="flex:1;padding:12px;border:1.5px solid var(--border);border-radius:12px;">
                        <button onclick="applyCoupon()" style="padding:12px 24px;background:var(--gradient-primary);color:white;border-radius:12px;font-weight:600;">${t('apply_coupon')}</button>
                    </div>
                </div>
                <div style="padding:20px;background:rgba(103,80,164,0.06);border-radius:16px;margin-bottom:24px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span>${currentLang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}:</span>
                        <span id="subtotal">$${total.toFixed(2)}</span>
                    </div>
                    <div id="discount-row" style="display:none;justify-content:space-between;margin-bottom:8px;color:var(--success);">
                        <span>${currentLang === 'ar' ? 'الخصم' : 'Discount'}:</span>
                        <span id="discount-amount">-$0.00</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:800;padding-top:12px;border-top:2px solid var(--border);">
                        <span>${t('total')}:</span>
                        <span id="total-amount" style="color:var(--primary);">$${total.toFixed(2)}</span>
                    </div>
                </div>
                <button class="btn-primary" onclick="checkout()">${t('checkout')} →</button>
            </div>
        </div>
    `;
}

let appliedCoupon = null;

function applyCoupon() {
    const code = document.getElementById('coupon-input').value.toUpperCase().trim();
    const coupon = COUPONS[code];
    if (!coupon) { showToast(currentLang === 'ar' ? 'كوبون غير صحيح' : 'Invalid coupon', 'error'); return; }
    appliedCoupon = coupon;
    const total = cart.map(id => getAppById(id).price).reduce((a, b) => a + b, 0);
    let discount = coupon.type === 'percent' ? total * coupon.discount / 100 : Math.min(coupon.discount, total);
    document.getElementById('discount-row').style.display = 'flex';
    document.getElementById('discount-amount').textContent = `-$${discount.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `$${(total - discount).toFixed(2)}`;
    showToast(currentLang === 'ar' ? `تم تطبيق: ${coupon.desc_ar}` : `Applied: ${coupon.desc_en}`, 'success');
}

function checkout() {
    if (!currentUser) { closeModal('cart-modal'); openLoginModal(); showToast(t('login_required'), 'info'); return; }
    cart.forEach(id => { if (!purchasedApps.includes(id)) purchasedApps.push(id); });
    localStorage.setItem('purchased', JSON.stringify(purchasedApps));
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    closeModal('cart-modal');
    showToast(t('purchase_success'), 'success');
    setTimeout(() => {
        if (confirm(currentLang === 'ar' ? 'تحميل تطبيقاتك الآن؟' : 'Download your apps now?')) {
            purchasedApps.forEach(id => downloadApp(id));
        }
    }, 1000);
}

// === المصادقة ===
function openLoginModal() {
    document.getElementById('auth-modal').innerHTML = `
        <div class="modal-overlay active" onclick="if(event.target===this)closeModal('auth-modal')">
            <div class="modal">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <h2>${t('login')}</h2>
                    <button onclick="closeModal('auth-modal')" style="font-size:24px;">✕</button>
                </div>
                <form onsubmit="handleLogin(event)">
                    <div class="form-group"><label>${t('email')}</label><input type="email" id="login-email" required placeholder="user@example.com"></div>
                    <div class="form-group"><label>${t('password')}</label><input type="password" id="login-password" required placeholder="••••••••"></div>
                    <button type="submit" class="btn-primary">${t('login_btn')}</button>
                </form>
                <p style="text-align:center;margin-top:20px;">${t('no_account')} <a onclick="closeModal('auth-modal');openRegisterModal()" style="color:var(--primary);font-weight:600;">${t('register')}</a></p>
                <div style="margin-top:20px;padding:16px;background:rgba(103,80,164,0.06);border-radius:12px;font-size:13px;">
                    <strong>${currentLang === 'ar' ? 'حسابات تجريبية:' : 'Demo:'}</strong><br>
                    👤 user@example.com / user123<br>
                    🔑 admin@appstore.com / admin123
                </div>
            </div>
        </div>
    `;
}

function openRegisterModal() {
    document.getElementById('auth-modal').innerHTML = `
        <div class="modal-overlay active" onclick="if(event.target===this)closeModal('auth-modal')">
            <div class="modal">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <h2>${t('register')}</h2>
                    <button onclick="closeModal('auth-modal')" style="font-size:24px;">✕</button>
                </div>
                <form onsubmit="handleRegister(event)">
                    <div class="form-group"><label>${t('name')}</label><input type="text" id="reg-name" required></div>
                    <div class="form-group"><label>${t('email')}</label><input type="email" id="reg-email" required></div>
                    <div class="form-group"><label>${t('password')}</label><input type="password" id="reg-password" required minlength="6"></div>
                    <button type="submit" class="btn-primary">${t('register_btn')}</button>
                </form>
                <p style="text-align:center;margin-top:20px;">${t('have_account')} <a onclick="closeModal('auth-modal');openLoginModal()" style="color:var(--primary);font-weight:600;">${t('login')}</a></p>
            </div>
        </div>
    `;
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const users = Store.loadUsers();
    if (users[email] && users[email].password === password) {
        currentUser = { email, ...users[email] };
        delete currentUser.password;
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('loginTime', Date.now().toString());
        Security.logSecurityEvent('login_success', email);
        closeModal('auth-modal');
        showToast(t('welcome_back') + ', ' + currentUser.name + '!', 'success');
        updateNavForUser();
    } else {
        Security.logSecurityEvent('login_failed', email);
        showToast(t('invalid_credentials'), 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = Security.sanitize(document.getElementById('reg-name').value);
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    if (!Security.validateEmail(email)) { showToast(currentLang==='ar'?'بريد غير صالح':'Invalid email','error'); return; }
    if (!Security.validatePassword(password)) { showToast(currentLang==='ar'?'كلمة مرور قصيرة':'Short password','error'); return; }
    const users = Store.loadUsers();
    if (users[email]) { showToast(currentLang === 'ar' ? 'البريد مستخدم' : 'Email exists', 'error'); return; }
    Store.saveUser(email, { password, name, role: 'user', balance: 0 });
    currentUser = { email, name, role: 'user', balance: 0 };
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('loginTime', Date.now().toString());
    closeModal('auth-modal');
    showToast(currentLang === 'ar' ? 'تم إنشاء الحساب!' : 'Account created!', 'success');
    updateNavForUser();
}

function logout() {
    Security.clearSession();
    currentUser = null;
    updateNavForUser();
    showToast(currentLang === 'ar' ? 'تم الخروج' : 'Logged out', 'info');
}

function updateNavForUser() {
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;
    if (currentUser) {
        navActions.innerHTML = `
            <button class="nav-btn" onclick="openAccount()">👤 ${currentUser.name}</button>
            ${currentUser.role === 'admin' ? `<button class="nav-btn" onclick="openAdmin()">⚙️ ${t('admin')}</button>` : ''}
            <button class="nav-btn" onclick="logout()">🚪 ${t('logout')}</button>
            <button class="lang-toggle" onclick="toggleLang()">${currentLang === 'ar' ? 'EN' : 'ع'}</button>
        `;
    } else {
        navActions.innerHTML = `
            <button class="nav-btn" onclick="openLoginModal()">🔑 ${t('login')}</button>
            <button class="nav-btn primary" onclick="openRegisterModal()">✨ ${t('register')}</button>
            <button class="lang-toggle" onclick="toggleLang()">${currentLang === 'ar' ? 'EN' : 'ع'}</button>
        `;
    }
}

function toggleLang() { setLang(currentLang === 'ar' ? 'en' : 'ar'); }

// === حساب المستخدم ===
function openAccount() {
    const userApps = purchasedApps.map(id => getAppById(id)).filter(Boolean);
    document.getElementById('account-modal').innerHTML = `
        <div class="modal-overlay active" onclick="if(event.target===this)closeModal('account-modal')">
            <div class="modal" style="max-width:700px;max-height:90vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <h2>👤 ${currentUser.name}</h2>
                    <button onclick="closeModal('account-modal')" style="font-size:24px;">✕</button>
                </div>
                <p style="color:var(--text-secondary);margin-bottom:8px;">${currentUser.email}</p>
                <p style="color:var(--text-secondary);margin-bottom:24px;">${currentLang === 'ar' ? 'الرصيد' : 'Balance'}: $${currentUser.balance}</p>
                <h3 style="margin-bottom:16px;">📚 ${t('my_library')} (${userApps.length})</h3>
                ${userApps.length > 0 ? `
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
                        ${userApps.map(app => `
                            <div class="app-card" onclick="downloadApp(${app.id})">
                                <div class="app-banner" style="height:80px;">${app.iconData ? `<img src="${app.iconData}">` : `<span style="font-size:40px;">${app.icon||'📱'}</span>`}</div>
                                <div class="app-info" style="padding:12px;">
                                    <div class="app-name" style="font-size:14px;">${app.name}</div>
                                    <button class="app-btn free" style="margin-top:8px;width:100%;">⬇️ ${t('download_now')}</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `<p style="color:var(--text-secondary);text-align:center;padding:40px;">${currentLang === 'ar' ? 'لم تشترِ بعد' : 'No purchases'}</p>`}
            </div>
        </div>
    `;
}

// === لوحة الأدمن ===
function openAdmin() {
    if (!Security.requireAdmin()) {
        showToast(currentLang === 'ar' ? 'صلاحيات أدمن مطلوبة' : 'Admin required', 'error');
        openLoginModal();
        return;
    }
    window.location.href = 'admin.html';
}

// === رفع تطبيق جديد (Modal) ===
function openUploadModal(appId) {
    if (!Security.requireAdmin()) {
        showToast(currentLang === 'ar' ? 'صلاحيات أدمن مطلوبة' : 'Admin required', 'error');
        openLoginModal();
        return;
    }
    editingAppId = appId || null;
    uploadedFileData = null;
    uploadedIconData = null;
    const app = appId ? getAppById(appId) : null;

    document.getElementById('upload-modal').innerHTML = `
        <div class="modal-overlay active" onclick="if(event.target===this)closeModal('upload-modal')">
            <div class="modal" style="max-width:700px;max-height:90vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <h2>${app ? '✏️ ' + t('edit') : '📤 ' + t('upload_app')}</h2>
                    <button onclick="closeModal('upload-modal')" style="font-size:24px;">✕</button>
                </div>
                <form onsubmit="saveApp(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label>${t('app_name')} *</label>
                            <input type="text" id="app-name" required value="${app ? app.name : ''}">
                        </div>
                        <div class="form-group">
                            <label>${t('developer')}</label>
                            <input type="text" id="app-developer" value="${app ? app.developer : currentUser.name}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>${t('app_category')} *</label>
                            <select id="app-category" required>
                                ${CATEGORIES.map(c => `<option value="${c.id}" ${app && app.category === c.id ? 'selected' : ''}>${c.icon} ${currentLang === 'ar' ? c.name_ar : c.name_en}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>${t('app_price')} ($)</label>
                            <input type="number" id="app-price" min="0" step="0.01" value="${app ? app.price : 0}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>${t('app_description_ar')} *</label>
                        <textarea id="app-desc-ar" required>${app ? app.desc_ar : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>${t('app_description_en')}</label>
                        <textarea id="app-desc-en">${app ? app.desc_en : ''}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>الإصدار</label>
                            <input type="text" id="app-version" value="${app ? app.version : '1.0.0'}">
                        </div>
                        <div class="form-group">
                            <label>${t('app_tags')}</label>
                            <input type="text" id="app-tags" value="${app && app.tags ? app.tags.join(', ') : ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>${t('app_icon')}</label>
                        <div style="display:flex;gap:16px;align-items:center;">
                            <img id="icon-preview" class="image-preview ${app && app.iconData ? 'active' : ''}" src="${app && app.iconData ? app.iconData : ''}" alt="icon">
                            <input type="file" id="icon-input" accept="image/*" onchange="handleIconUpload(event)" style="flex:1;padding:10px;border:1.5px dashed var(--border);border-radius:12px;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>${t('app_file')}</label>
                        <div class="upload-zone" onclick="document.getElementById('file-input').click()" id="upload-zone">
                            <div class="upload-icon">📁</div>
                            <div class="upload-text">${t('upload_file')}</div>
                            <div class="upload-hint">${t('file_types')}</div>
                        </div>
                        <input type="file" id="file-input" style="display:none;" onchange="handleFileUpload(event)">
                        <div class="file-preview" id="file-preview">
                            <div class="preview-header">
                                <span class="preview-icon">📄</span>
                                <div class="preview-info">
                                    <div class="preview-name" id="file-name"></div>
                                    <div class="preview-size" id="file-size"></div>
                                </div>
                                <button type="button" class="remove-btn" onclick="removeFile()">✕</button>
                            </div>
                        </div>
                        ${app && app.fileName ? `<p style="margin-top:8px;font-size:13px;color:var(--text-secondary);">📎 ${currentLang === 'ar' ? 'الملف الحالي' : 'Current file'}: ${app.fileName}</p>` : ''}
                    </div>
                    <div style="display:flex;gap:12px;margin-top:24px;">
                        <button type="button" class="btn-secondary" onclick="closeModal('upload-modal')">${t('cancel')}</button>
                        <button type="submit" class="btn-primary">💾 ${t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // drag & drop
    const zone = document.getElementById('upload-zone');
    if (zone) {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                document.getElementById('file-input').files = e.dataTransfer.files;
                handleFileUpload({ target: { files: e.dataTransfer.files } });
            }
        });
    }
}

// === رفع الملف ===
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
        showToast(t('file_too_large'), 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedFileData = e.target.result;
        const preview = document.getElementById('file-preview');
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-size').textContent = formatFileSize(file.size);
        preview.classList.add('active');
        showToast(currentLang === 'ar' ? 'تم تحميل الملف' : 'File loaded', 'success');
    };
    reader.readAsDataURL(file);
}

// === رفع الأيقونة ===
function handleIconUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showToast(t('icon_too_large'), 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedIconData = e.target.result;
        const preview = document.getElementById('icon-preview');
        preview.src = uploadedIconData;
        preview.classList.add('active');
    };
    reader.readAsDataURL(file);
}

function removeFile() {
    uploadedFileData = null;
    document.getElementById('file-input').value = '';
    document.getElementById('file-preview').classList.remove('active');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// === حفظ التطبيق ===
function saveApp(event) {
    event.preventDefault();
    const name = document.getElementById('app-name').value;
    const developer = document.getElementById('app-developer').value;
    const category = document.getElementById('app-category').value;
    const price = parseFloat(document.getElementById('app-price').value) || 0;
    const descAr = document.getElementById('app-desc-ar').value;
    const descEn = document.getElementById('app-desc-en').value;
    const version = document.getElementById('app-version').value;
    const tagsStr = document.getElementById('app-tags').value;
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (editingAppId) {
        // تعديل
        const idx = customApps.findIndex(a => a.id === editingAppId);
        if (idx !== -1) {
            customApps[idx] = {
                ...customApps[idx],
                name, developer, category, price, desc_ar: descAr, desc_en: descEn,
                version, tags, iconData: uploadedIconData || customApps[idx].iconData,
                fileData: uploadedFileData || customApps[idx].fileData,
                fileName: uploadedFileData ? document.getElementById('file-name').textContent : customApps[idx].fileName
            };
        }
        showToast(currentLang === 'ar' ? 'تم التحديث!' : 'Updated!', 'success');
    } else {
        // جديد
        const newApp = {
            id: Date.now(),
            name, developer, category, price,
            desc_ar: descAr, desc_en: descEn || descAr,
            version, tags,
            icon: '📱',
            iconData: uploadedIconData,
            fileData: uploadedFileData,
            fileName: uploadedFileData ? document.getElementById('file-name').textContent : null,
            rating: 0, downloads: 0, size: uploadedFileData ? formatFileSize(uploadedFileData.length) : 'N/A',
            featured: false, screenshots: 0, updated: new Date().toISOString().split('T')[0],
            custom: true
        };
        customApps.push(newApp);
        showToast(t('uploaded_success'), 'success');
    }

    localStorage.setItem('customApps', JSON.stringify(customApps));
    closeModal('upload-modal');
    renderPage();
    if (window.location.pathname.includes('admin.html')) renderAdminTable();
}

// === حذف تطبيق ===
function deleteApp(appId) {
    if (!confirm(t('confirm_delete'))) return;
    customApps = customApps.filter(a => a.id !== appId);
    localStorage.setItem('customApps', JSON.stringify(customApps));
    showToast(currentLang === 'ar' ? 'تم الحذف' : 'Deleted', 'success');
    renderPage();
    if (window.location.pathname.includes('admin.html')) renderAdminTable();
}

// === تهيئة ===
document.addEventListener('DOMContentLoaded', function() {
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    applyTranslations();
    renderPage();
    updateNavForUser();
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', e => handleSearch(e.target.value));
});
