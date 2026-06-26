// ============================================================================
//  viral.js - المزايا الفيروسية للانتشار السريع
//  - نظام الإحالات (Referral)
//  - نظام النقاط والإنجازات (Gamification)
//  - مكافآت يومية (Daily Rewards)
//  - مشاركة اجتماعية (Social Sharing)
//  - قائمة الأمنيات (Wishlist)
//  - إشعارات اجتماعية (Social Proof)
//  - QR Code للمشاركة
// ============================================================================

const Viral = {

    // === تهيئة ===
    init() {
        this.loadPoints();
        this.checkDailyReward();
        this.startSocialProof();
    },

    // ============================================================
    // 1. نظام النقاط والإنجازات
    // ============================================================
    loadPoints() {
        return JSON.parse(localStorage.getItem('userPoints') || '{"points":0,"level":1,"streak":0,"lastVisit":null,"badges":[]}');
    },

    savePoints(data) {
        localStorage.setItem('userPoints', JSON.stringify(data));
    },

    addPoints(amount, reason) {
        const data = this.loadPoints();
        data.points += amount;
        data.level = Math.floor(data.points / 100) + 1;
        this.savePoints(data);
        this.checkAchievements(data);
        this.showPointsNotification(amount, reason);
        return data;
    },

    showPointsNotification(amount, reason) {
        const notif = document.createElement('div');
        notif.style.cssText = `position:fixed;top:80px;right:20px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;padding:16px 24px;border-radius:16px;font-weight:800;font-size:16px;box-shadow:0 8px 32px rgba(255,165,0,0.4);z-index:4000;animation:slideIn 0.5s ease;display:flex;align-items:center;gap:10px;`;
        notif.innerHTML = `🎉 +${amount} نقطة${reason ? ' - ' + reason : ''}`;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    },

    checkAchievements(data) {
        const achievements = [
            { id: 'first_visit', points: 0, name_ar: 'أول زيارة', name_en: 'First Visit', icon: '👋', condition: () => true },
            { id: 'points_100', points: 100, name_ar: 'مبتدئ', name_en: 'Beginner', icon: '🥉', condition: d => d.points >= 100 },
            { id: 'points_500', points: 500, name_ar: 'محترف', name_en: 'Pro', icon: '🥈', condition: d => d.points >= 500 },
            { id: 'points_1000', points: 1000, name_ar: 'أسطورة', name_en: 'Legend', icon: '🥇', condition: d => d.points >= 1000 },
            { id: 'streak_7', points: 0, name_ar: 'أسبوع متواصل', name_en: '7-Day Streak', icon: '🔥', condition: d => d.streak >= 7 },
            { id: 'streak_30', points: 0, name_ar: 'شهر متواصل', name_en: '30-Day Streak', icon: '💎', condition: d => d.streak >= 30 },
            { id: 'shared_1', points: 0, name_ar: 'مشارك', name_en: 'Sharer', icon: '📢', condition: d => (d.shares || 0) >= 1 },
            { id: 'shared_10', points: 0, name_ar: 'مؤثر', name_en: 'Influencer', icon: '⭐', condition: d => (d.shares || 0) >= 10 },
            { id: 'referral_1', points: 0, name_ar: 'داعي', name_en: 'Inviter', icon: '🎁', condition: d => (d.referrals || 0) >= 1 },
            { id: 'referral_5', points: 0, name_ar: 'صائد أصدقاء', name_en: 'Friend Hunter', icon: '👥', condition: d => (d.referrals || 0) >= 5 },
            { id: 'wishlist_5', points: 0, name_ar: 'جامع', name_en: 'Collector', icon: '💜', condition: d => (d.wishlistCount || 0) >= 5 },
            { id: 'review_1', points: 0, name_ar: 'ناقد', name_en: 'Critic', icon: '✍️', condition: d => (d.reviews || 0) >= 1 },
        ];

        achievements.forEach(ach => {
            if (!data.badges.includes(ach.id) && ach.condition(data)) {
                data.badges.push(ach.id);
                this.savePoints(data);
                this.showBadgeUnlock(ach);
            }
        });
    },

    showBadgeUnlock(ach) {
        const notif = document.createElement('div');
        notif.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#6750A4,#4F378B);color:white;padding:32px 48px;border-radius:24px;font-weight:800;text-align:center;box-shadow:0 16px 64px rgba(103,80,164,0.5);z-index:5000;animation:badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1);`;
        notif.innerHTML = `
            <div style="font-size:64px;margin-bottom:12px;">${ach.icon}</div>
            <div style="font-size:20px;margin-bottom:8px;">🏆 إنجاز جديد!</div>
            <div style="font-size:24px;font-weight:800;">${currentLang === 'ar' ? ach.name_ar : ach.name_en}</div>
        `;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.animation = 'badgeOut 0.5s ease';
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    },

    // ============================================================
    // 2. مكافآت يومية + Streak
    // ============================================================
    checkDailyReward() {
        const data = this.loadPoints();
        const today = new Date().toDateString();
        const lastVisit = data.lastVisit;

        if (lastVisit !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastVisit === yesterday) {
                data.streak = (data.streak || 0) + 1;
            } else {
                data.streak = 1;
            }
            data.lastVisit = today;

            const reward = Math.min(data.streak * 10, 100);
            data.points += reward;
            this.savePoints(data);
            this.addPoints(reward, currentLang === 'ar' ? `مكافأة يوم ${data.streak}` : `Day ${data.streak} reward`);
            this.showDailyRewardModal(data.streak, reward);
        }
    },

    showDailyRewardModal(streak, reward) {
        if (!document.getElementById('daily-modal')) return;
        const days = [10, 20, 30, 40, 50, 60, 100];
        let daysHtml = '';
        for (let i = 0; i < 7; i++) {
            const day = i + 1;
            const claimed = streak > day;
            const today = streak === day;
            daysHtml += `
                <div style="text-align:center;padding:16px 8px;border-radius:16px;background:${today ? 'var(--gradient-primary)' : claimed ? 'rgba(0,200,83,0.15)' : 'var(--bg-surface-variant)'};color:${today ? 'white' : 'inherit'};border:2px solid ${today ? 'var(--primary)' : 'transparent'};">
                    <div style="font-size:12px;opacity:0.8;">يوم ${day}</div>
                    <div style="font-size:28px;margin:4px 0;">${claimed || today ? '✅' : '🔒'}</div>
                    <div style="font-size:14px;font-weight:700;">+${days[i]}</div>
                </div>
            `;
        }

        document.getElementById('daily-modal').innerHTML = `
            <div class="modal-overlay active" onclick="if(event.target===this)document.getElementById('daily-modal').innerHTML=''">
                <div class="modal" style="max-width:480px;text-align:center;">
                    <div style="font-size:64px;margin-bottom:16px;">🎁</div>
                    <h2 style="font-size:28px;margin-bottom:8px;">مكافأة يومية!</h2>
                    <p style="color:var(--text-secondary);margin-bottom:24px;">
                        🔥 ${streak} ${currentLang === 'ar' ? 'أيام متواصلة' : 'day streak'}!
                    </p>
                    <div style="font-size:48px;font-weight:800;color:var(--warning);margin-bottom:24px;">
                        +${reward} نقطة
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:24px;">
                        ${daysHtml}
                    </div>
                    <button class="btn-primary" onclick="document.getElementById('daily-modal').innerHTML=''">
                        🎉 استلام
                    </button>
                </div>
            </div>
        `;
    },

    // ============================================================
    // 3. نظام الإحالات (Referral)
    // ============================================================
    getReferralCode() {
        let code = localStorage.getItem('referralCode');
        if (!code) {
            code = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
            localStorage.setItem('referralCode', code);
        }
        return code;
    },

    getReferralLink() {
        const code = this.getReferralCode();
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?ref=${code}`;
    },

    checkReferral() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref && !localStorage.getItem('referredBy')) {
            localStorage.setItem('referredBy', ref);
            this.addPoints(50, currentLang === 'ar' ? 'مكافأة إحالة' : 'Referral bonus');
            showToast('🎁 +50 نقطة مكافأة إحالة!', 'success');
        }
    },

    shareReferral() {
        const link = this.getReferralLink();
        const text = currentLang === 'ar' ?
            '🚀 اكتشفت متجر تطبيقات رائع! سجل عبر رابطي واحصل على 50 نقطة مجانية:\n' :
            '🚀 Found an amazing app store! Sign up with my link and get 50 free points:\n';

        if (navigator.share) {
            navigator.share({ title: 'متجر التطبيقات', text: text, url: link });
        } else {
            this.copyToClipboard(link);
            showToast('📋 تم نسخ الرابط! شاركه مع أصدقائك', 'success');
        }
    },

    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    },

    // ============================================================
    // 4. المشاركة الاجتماعية
    // ============================================================
    shareApp(appId, platform) {
        const app = Store.loadApps().find(a => a.id === appId);
        if (!app) return;

        const data = this.loadPoints();
        data.shares = (data.shares || 0) + 1;
        this.savePoints(data);
        this.checkAchievements(data);

        const text = currentLang === 'ar' ?
            `${app.icon} ${app.name} - ${app.desc_ar}\n\nحمّله الآن من متجر التطبيقات!` :
            `${app.icon} ${app.name} - ${app.desc_en}\n\nDownload now from App Store!`;
        const url = window.location.origin + window.location.pathname + `?app=${appId}`;
        const fullText = encodeURIComponent(text + '\n' + url);

        const platforms = {
            whatsapp: `https://wa.me/?text=${fullText}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            twitter: `https://twitter.com/intent/tweet?text=${fullText}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            copy: () => { this.copyToClipboard(text + '\n' + url); showToast('📋 تم النسخ!', 'success'); }
        };

        if (platform === 'copy') {
            platforms.copy();
        } else if (platforms[platform]) {
            window.open(platforms[platform], '_blank');
            this.addPoints(5, currentLang === 'ar' ? 'مشاركة' : 'Share');
        }
    },

    shareStore(platform) {
        const data = this.loadPoints();
        data.shares = (data.shares || 0) + 1;
        this.savePoints(data);

        const text = currentLang === 'ar' ?
            '🚀 متجر التطبيقات الأول عربياً! 100+ تطبيق احترافي في كل المجالات.' :
            '🚀 The #1 App Store! 100+ professional apps in all fields.';
        const url = this.getReferralLink();
        const fullText = encodeURIComponent(text + '\n' + url);

        const platforms = {
            whatsapp: `https://wa.me/?text=${fullText}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            twitter: `https://twitter.com/intent/tweet?text=${fullText}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            copy: () => { this.copyToClipboard(text + '\n' + url); showToast('📋 تم النسخ!', 'success'); }
        };

        if (platform === 'copy') {
            platforms.copy();
        } else if (platforms[platform]) {
            window.open(platforms[platform], '_blank');
            this.addPoints(10, currentLang === 'ar' ? 'مشاركة المتجر' : 'Share store');
        }
    },

    // ============================================================
    // 5. قائمة الأمنيات (Wishlist)
    // ============================================================
    getWishlist() {
        return JSON.parse(localStorage.getItem('wishlist') || '[]');
    },

    toggleWishlist(appId) {
        let wishlist = this.getWishlist();
        if (wishlist.includes(appId)) {
            wishlist = wishlist.filter(id => id !== appId);
            showToast(currentLang === 'ar' ? '💔 أُزيل من الأمنيات' : '💔 Removed from wishlist', 'info');
        } else {
            wishlist.push(appId);
            showToast(currentLang === 'ar' ? '💜 أُضيف للأمنيات' : '💜 Added to wishlist', 'success');
            this.addPoints(2, currentLang === 'ar' ? 'إضافة للأمنيات' : 'Wishlist');

            const data = this.loadPoints();
            data.wishlistCount = wishlist.length;
            this.savePoints(data);
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.updateWishlistBadge();
    },

    isInWishlist(appId) {
        return this.getWishlist().includes(appId);
    },

    updateWishlistBadge() {
        const badge = document.getElementById('wishlist-badge');
        if (badge) {
            const count = this.getWishlist().length;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    // ============================================================
    // 6. الإشعارات الاجتماعية (Social Proof)
    // ============================================================
    startSocialProof() {
        const names = ['Ahmed', 'Sara', 'Mohammed', 'Fatima', 'Ali', 'Layla', 'Omar', 'Nour', 'Khaled', 'Mariam',
                       'John', 'Emma', 'David', 'Sophia', 'James', 'Olivia', 'Lucas', 'Mia', 'Alex', 'Eva'];
        const cities = ['القاهرة', 'الرياض', 'دبي', 'بيروت', 'عمّان', 'الدوحة', 'تونس', 'الجزائر', 'بغداد', 'مراكش',
                        'Cairo', 'Riyadh', 'Dubai', 'London', 'Paris', 'Berlin', 'New York', 'Tokyo', 'Istanbul', 'Toronto'];
        const apps = Store.loadApps();

        setTimeout(() => {
            setInterval(() => {
                if (Math.random() > 0.4) {
                    const app = apps[Math.floor(Math.random() * apps.length)];
                    const name = names[Math.floor(Math.random() * names.length)];
                    const city = cities[Math.floor(Math.random() * cities.length)];
                    const minutes = Math.floor(Math.random() * 10) + 1;
                    this.showSocialProof(name, city, app, minutes);
                }
            }, 15000);
        }, 5000);
    },

    showSocialProof(name, city, app, minutes) {
        const notif = document.createElement('div');
        notif.style.cssText = `position:fixed;bottom:80px;left:20px;background:var(--bg-surface);border-radius:16px;padding:14px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:3000;display:flex;align-items:center;gap:12px;max-width:340px;border:1.5px solid var(--border);animation:slideInLeft 0.5s ease;`;

        const isAr = currentLang === 'ar';
        notif.innerHTML = `
            <div style="width:44px;height:44px;border-radius:12px;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">
                ${app.icon || '📱'}
            </div>
            <div style="flex:1;">
                <div style="font-size:13px;font-weight:700;">
                    ${name} ${isAr ? 'من' : 'from'} ${city}
                </div>
                <div style="font-size:12px;color:var(--text-secondary);">
                    ${isAr ? 'حمّل' : 'downloaded'} ${app.name}
                </div>
                <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">
                    ${isAr ? 'منذ' : ''} ${minutes} ${isAr ? 'دقيقة' : 'min ago'} ${isAr ? '' : 'ago'}
                </div>
            </div>
            <button onclick="this.parentElement.remove()" style="color:var(--text-secondary);font-size:18px;padding:4px;">✕</button>
        `;
        document.body.appendChild(notif);

        setTimeout(() => {
            if (notif.parentElement) {
                notif.style.animation = 'slideOutLeft 0.5s ease';
                setTimeout(() => notif.remove(), 500);
            }
        }, 6000);
    },

    // ============================================================
    // 7. QR Code (توليد بسيط بدون مكتبة)
    // ============================================================
    generateQR(text) {
        // استخدام API مجاني لتوليد QR
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    },

    showQRModal(title, data) {
        const qrUrl = this.generateQR(data);
        if (!document.getElementById('qr-modal')) return;
        document.getElementById('qr-modal').innerHTML = `
            <div class="modal-overlay active" onclick="if(event.target===this)document.getElementById('qr-modal').innerHTML=''">
                <div class="modal" style="text-align:center;max-width:360px;">
                    <h2 style="margin-bottom:20px;">📱 ${title}</h2>
                    <img src="${qrUrl}" alt="QR Code" style="width:240px;height:240px;border-radius:16px;margin:0 auto 20px;display:block;border:3px solid var(--primary);">
                    <p style="color:var(--text-secondary);font-size:14px;margin-bottom:20px;">
                        ${currentLang === 'ar' ? 'امسح الكود بكاميرا هاتفك للمشاركة' : 'Scan with your phone camera to share'}
                    </p>
                    <button class="btn-primary" onclick="Viral.copyToClipboard('${data}'); showToast('📋 تم النسخ!','success');">
                        📋 ${currentLang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                    </button>
                </div>
            </div>
        `;
    },

    // ============================================================
    // 8. App of the Day + Trending
    // ============================================================
    getAppOfDay() {
        const apps = Store.loadApps().filter(a => a.featured && a.active !== false);
        if (apps.length === 0) return Store.loadApps()[0];
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        return apps[dayOfYear % apps.length];
    },

    getTrendingApps() {
        const apps = Store.loadApps().filter(a => a.active !== false);
        // Trending = downloads + rating + recency
        return apps.map(a => ({
            ...a,
            trendingScore: (a.downloads || 0) / 1000 + (a.rating || 0) * 10 + (a.featured ? 50 : 0)
        })).sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 6);
    },

    // ============================================================
    // 9. تتبع الإحالات
    // ============================================================
    getReferralStats() {
        const data = this.loadPoints();
        return {
            code: this.getReferralCode(),
            referrals: data.referrals || 0,
            points: data.points,
            shares: data.shares || 0,
            level: data.level
        };
    },

    // ============================================================
    // 10. نظام المستويات
    // ============================================================
    getLevelInfo() {
        const data = this.loadPoints();
        const level = data.level;
        const currentLevelPoints = (level - 1) * 100;
        const nextLevelPoints = level * 100;
        const progress = ((data.points - currentLevelPoints) / 100) * 100;
        return {
            level,
            points: data.points,
            progress: Math.min(progress, 100),
            nextLevel: nextLevelPoints,
            badges: data.badges || [],
            streak: data.streak || 0
        };
    }
};

// === CSS Animations للإضافات ===
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
@keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }
@keyframes badgePop { 0% { transform: translate(-50%,-50%) scale(0); } 60% { transform: translate(-50%,-50%) scale(1.2); } 100% { transform: translate(-50%,-50%) scale(1); } }
@keyframes badgeOut { to { transform: translate(-50%,-50%) scale(0); opacity: 0; } }

/* Share buttons */
.share-btn { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; transition: all 0.3s; border: none; color: white; }
.share-btn:hover { transform: scale(1.15) translateY(-2px); }
.share-btn.whatsapp { background: #25D366; }
.share-btn.telegram { background: #0088cc; }
.share-btn.twitter { background: #1DA1F2; }
.share-btn.facebook { background: #1877F2; }
.share-btn.copy { background: var(--primary); }
.share-btn.qr { background: var(--secondary); }

/* Wishlist button */
.wishlist-btn { background: none; border: none; font-size: 24px; cursor: pointer; transition: all 0.3s; }
.wishlist-btn:hover { transform: scale(1.2); }
.wishlist-btn.active { color: #E91E63; animation: heartBeat 0.6s; }
@keyframes heartBeat { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }

/* Level badge */
.level-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: linear-gradient(135deg,#FFD700,#FFA500); color: #000; border-radius: 9999px; font-weight: 800; font-size: 13px; }

/* Progress bar */
.progress-bar { width: 100%; height: 8px; background: var(--border); border-radius: 9999px; overflow: hidden; }
.progress-bar .fill { height: 100%; background: var(--gradient-primary); border-radius: 9999px; transition: width 0.5s ease; }

/* Streak flame */
.streak-flame { display: inline-block; animation: flameFlicker 1s infinite alternate; }
@keyframes flameFlicker { 0% { transform: scale(1) rotate(-2deg); } 100% { transform: scale(1.1) rotate(2deg); } }

/* Trending badge */
.trending-badge { position: absolute; top: 14px; left: 14px; background: var(--gradient-red); color: white; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; z-index: 2; box-shadow: var(--shadow-sm); }

/* Dark mode */
body.dark-mode { --bg-main: #1A1A2E; --bg-surface: #16213E; --bg-glass: rgba(22,33,62,0.7); --text-primary: #E0E0E0; --text-secondary: #A0A0B0; --border: rgba(255,255,255,0.1); --bg-surface-variant: #0F3460; }
body.dark-mode .app-card, body.dark-mode .category-card, body.dark-mode .stat-card, body.dark-mode .admin-table { background: rgba(22,33,62,0.7); }
body.dark-mode .modal { background: #16213E; color: #E0E0E0; }
body.dark-mode input, body.dark-mode select, body.dark-mode textarea { background: rgba(255,255,255,0.05); color: #E0E0E0; }
body.dark-mode .navbar { background: rgba(22,33,62,0.85); }

/* Share modal buttons */
.share-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
`;
document.head.appendChild(style);
