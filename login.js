function loginAs(role) {
    // حفظ الدور المحدد في المتصفح والانتقال للصفحة الرئيسية للمشروع
    localStorage.setItem('current_user_role', role);
    window.location.href = 'index.html';
}
