// ============================================================================
//  security.js - نظام الأمان الكامل
//  - منع XSS (Cross-Site Scripting)
//  - تنظيف المدخلات
//  - التحقق من الصلاحيات
//  - تشفير كلمات المرور (تجريبي)
//  - إدارة الجلسات
// ============================================================================

const Security = {

    // === منع XSS: تحويل الأحرف الخطرة ===
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        if (typeof text !== 'string') text = String(text);
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        return text.replace(/[&<>"'`/=]/g, m => map[m]);
    },

    // === تنظيف النص من أكواد خطرة ===
    sanitize(text) {
        if (!text) return '';
        // إزالة وسوم script
        text = String(text).replace(/<script[^>]*>.*?<\/script>/gi, '');
        // إزالة on* events
        text = text.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
        text = text.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
        // إزالة javascript: URLs
        text = text.replace(/javascript:/gi, '');
        // إزالة data: URLs (ما عدا الصور)
        text = text.replace(/data:(?!image\/)/gi, '');
        return this.escapeHtml(text);
    },

    // === التحقق من البريد الإلكتروني ===
    validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    },

    // === التحقق من كلمة المرور ===
    validatePassword(password) {
        if (!password || password.length < 6) return false;
        return true;
    },

    // === التحقق من السعر ===
    validatePrice(price) {
        const num = parseFloat(price);
        return !isNaN(num) && num >= 0 && num <= 99999;
    },

    // === التحقق من الاسم ===
    validateName(name) {
        if (!name || name.trim().length < 2) return false;
        if (name.length > 100) return false;
        return true;
    },

    // === التحقق من النص الطويل ===
    validateText(text, maxLength = 1000) {
        if (!text) return false;
        if (text.length > maxLength) return false;
        return true;
    },

    // === التحقق من حجم الملف ===
    validateFileSize(file, maxSizeMB) {
        if (!file) return true;
        return file.size <= maxSizeMB * 1024 * 1024;
    },

    // === التحقق من نوع الملف ===
    validateFileType(file, allowedTypes) {
        if (!file) return true;
        const ext = file.name.split('.').pop().toLowerCase();
        return allowedTypes.includes(ext);
    },

    // === تشفير كلمة المرور (تجريبي - SHA-256) ===
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + '_salt_appstore_2026');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // === التحقق من صلاحيات الأدمن ===
    requireAdmin() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) {
            this.logSecurityEvent('unauthorized_access', 'No user logged in');
            return false;
        }
        if (user.role !== 'admin') {
            this.logSecurityEvent('unauthorized_access', `User ${user.email} tried admin action`);
            return false;
        }
        // التحقق من انتهاء الجلسة (30 دقيقة)
        const loginTime = localStorage.getItem('loginTime');
        if (loginTime) {
            const elapsed = Date.now() - parseInt(loginTime);
            if (elapsed > 30 * 60 * 1000) {
                localStorage.removeItem('user');
                localStorage.removeItem('loginTime');
                return false;
            }
        }
        return true;
    },

    // === تسجيل الأحداث الأمنية ===
    logSecurityEvent(type, detail) {
        const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        logs.push({
            type,
            detail: this.escapeHtml(detail),
            timestamp: new Date().toISOString(),
            ip: 'local'
        });
        // الاحتفاظ بآخر 100 سجل فقط
        if (logs.length > 100) logs.shift();
        localStorage.setItem('securityLogs', JSON.stringify(logs));
    },

    // === توليد CSRF Token ===
    generateCSRFToken() {
        const token = crypto.getRandomValues(new Uint32Array(4)).join('-');
        localStorage.setItem('csrfToken', token);
        return token;
    },

    // === التحقق من CSRF Token ===
    verifyCSRFToken(token) {
        const stored = localStorage.getItem('csrfToken');
        return token === stored;
    },

    // === تنظيف كل البيانات الحساسة ===
    clearSession() {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('csrfToken');
    },

    // === فحص شامل للملف المرفوع ===
    validateUpload(file, type = 'file') {
        const errors = [];

        if (type === 'file') {
            if (!this.validateFileSize(file, 50)) {
                errors.push('حجم الملف يتجاوز 50 ميجابايت');
            }
            const allowed = ['apk', 'zip', 'rar', 'exe', 'js', 'py', 'jar', 'ipa', 'deb', 'gz', '7z'];
            if (!this.validateFileType(file, allowed)) {
                errors.push('نوع الملف غير مسموح');
            }
        } else if (type === 'image') {
            if (!this.validateFileSize(file, 2)) {
                errors.push('حجم الصورة يتجاوز 2 ميجابايت');
            }
            const allowed = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
            if (!this.validateFileType(file, allowed)) {
                errors.push('نوع الصورة غير مسموح');
            }
        }

        return errors;
    }
};
