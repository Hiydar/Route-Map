const initialData = [
    { id: 1, phase: 1, phaseName: 'فكرة المشروع والتخطيط', title: 'تحديد الأهداف', status: 'completed' },
    { id: 2, phase: 1, phaseName: 'فكرة المشروع والتخطيط', title: 'تحليل المتطلبات', status: 'pending_dev' },
    { id: 3, phase: 1, phaseName: 'فكرة المشروع والتخطيط', title: 'دراسة الجدوى', status: 'locked' },
    { id: 4, phase: 1, phaseName: 'فكرة المشروع والتخطيط', title: 'إنشاء الميزانية', status: 'locked' },
    { id: 5, phase: 1, phaseName: 'فكرة المشروع والتخطيط', title: 'تشكيل الفريق', status: 'locked' },
    
    { id: 6, phase: 2, phaseName: 'التصميم', title: 'تصميم تجربة المستخدم (UX)', status: 'locked' },
    { id: 7, phase: 2, phaseName: 'التصميم', title: 'تصميم واجهة المستخدم (UI)', status: 'locked' },
    { id: 8, phase: 2, phaseName: 'التصميم', title: 'هندسة النظام', status: 'locked' },

    { id: 9, phase: 3, phaseName: 'التطوير', title: 'تطوير الواجهة الأمامية', status: 'locked' },
    { id: 10, phase: 3, phaseName: 'التطوير', title: 'تطوير الواجهة الخلفية', status: 'locked' },
    { id: 11, phase: 3, phaseName: 'التطوير', title: 'التحكم في الإصدار ودمج الكود', status: 'locked' },

    { id: 12, phase: 4, phaseName: 'الاختبار والجودة', title: 'اختبار الوحدة (Unit Test)', status: 'locked' },
    { id: 13, phase: 4, phaseName: 'الاختبار والجودة', title: 'اختبار النظام', status: 'locked' },
    { id: 14, phase: 4, phaseName: 'الاختبار والجودة', title: 'اختبار القبول (UAT)', status: 'locked' },
    { id: 15, phase: 4, phaseName: 'الاختبار والجودة', title: 'تحديد وإصلاح الأخطاء', status: 'locked' },

    { id: 16, phase: 5, phaseName: 'النشر والتسليم', title: 'إعداد بيئة الإنتاج', status: 'locked' },
    { id: 17, phase: 5, phaseName: 'النشر والتسليم', title: 'النشر السحابي', status: 'locked' },
    { id: 18, phase: 5, phaseName: 'النشر والتسليم', title: 'إطلاق المشروع', status: 'locked' },

    { id: 19, phase: 6, phaseName: 'الصيانة والدعم', title: 'مراقبة الأداء', status: 'locked' },
    { id: 20, phase: 6, phaseName: 'الصيانة والدعم', title: 'التحديثات والتحسينات', status: 'locked' },
    { id: 21, phase: 6, phaseName: 'الصيانة والدعم', title: 'الدعم الفني', status: 'locked' }
];

let projectData = JSON.parse(localStorage.getItem('project_roadmap_db')) || initialData;
let currentRole = localStorage.getItem('current_user_role') || 'pm';

function saveData() {
    localStorage.setItem('project_roadmap_db', JSON.stringify(projectData));
    render();
}

function switchRole(role) {
    currentRole = role;
    localStorage.setItem('current_user_role', role);
    render();
}

function logout() {
    localStorage.removeItem('current_user_role');
    window.location.href = 'login.html';
}

function render() {
    const clientPanel = document.getElementById('client-view-panel');
    if (currentRole === 'client') {
        clientPanel.style.display = 'block';
        updateClientView();
    } else {
        clientPanel.style.display = 'none';
    }

    renderPhasesSidebar();
    renderMainScreen();
    renderActionPanel();
}

function renderPhasesSidebar() {
    const container = document.getElementById('phases-nav-list');
    container.innerHTML = '';

    for (let p = 1; p <= 6; p++) {
        const phaseTasks = projectData.filter(t => t.phase === p);
        const phaseName = phaseTasks[0] ? phaseTasks[0].phaseName : `المرحلة ${p}`;
        
        const div = document.createElement('div');
        div.className = `phase-item-box ${p === 1 ? 'active' : ''}`;
        
        let tasksHtml = '';
        phaseTasks.forEach(task => {
            let statusClass = task.status === 'completed' ? 'completed' : (task.status !== 'locked' ? 'pending' : '');
            let icon = task.status === 'completed' ? '✓' : '•';
            tasksHtml += `<li class="task-sub-item ${statusClass}"><span>${icon}</span> ${task.title}</li>`;
        });

        div.innerHTML = `
            <div class="phase-title-text">المرحلة ${p}: ${phaseName}</div>
            <ul class="task-sub-list">${tasksHtml}</ul>
        `;
        container.appendChild(div);
    }
}

function renderMainScreen() {
    const bodyContent = document.getElementById('screen-body-content');
    const activeTask = projectData.find(t => t.status !== 'completed') || projectData[projectData.length - 1];

    bodyContent.innerHTML = `
        <h2 style="color: #38bdf8; margin-bottom: 10px;">الحالة التنفيذية للمشروع</h2>
        <p style="color: #94a3b8; margin-bottom: 15px;">المهمة الحالية: <strong style="color: #fff;">${activeTask ? activeTask.title : 'اكتملت جميع المهام'}</strong></p>
        <div style="background: rgba(15, 23, 42, 0.8); padding: 15px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.2);">
            <p><strong>المرحلة الحالية:</strong> ${activeTask ? activeTask.phaseName : 'النهاية'}</p>
            <p><strong>الحالة:</strong> <span style="color: #eab308;">${activeTask ? activeTask.status : 'منجز بالكامل'}</span></p>
        </div>
    `;
}

function renderActionPanel() {
    const actionPanel = document.getElementById('action-panel-content');
    const activeTask = projectData.find(t => t.status !== 'completed');

    if (!activeTask) {
        actionPanel.innerHTML = `<p style="color: #22c55e;">تم إنجاز كافة مهام المشروع بنجاح!</p>`;
        return;
    }

    if (currentRole === 'dev') {
        actionPanel.innerHTML = `
            <p><strong>صلاحية الموظف:</strong></p>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 8px 0;">المهمة: ${activeTask.title}</p>
            ${activeTask.status === 'pending_dev' 
                ? `<button class="btn-action btn-send" onclick="updateTaskStatus(${activeTask.id}, 'pending_branch')">حفظ وإرسال لمدير الفرع</button>`
                : `<p style="color: #eab308; font-size: 0.85rem;">قيد مراجعة الإدارة الفرعية أو العامة.</p>`}
        `;
    } else if (currentRole.startsWith('sub_pm')) {
        actionPanel.innerHTML = `
            <p><strong>صلاحية المدير الفرعي:</strong></p>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 8px 0;">مراجعة مهام الفرع.</p>
            ${activeTask.status === 'pending_branch' 
                ? `<button class="btn-action btn-review" onclick="updateTaskStatus(${activeTask.id}, 'pending_pm')">تمت المراجعة وإرسال للمدير العام</button>`
                : `<p style="color: #94a3b8; font-size: 0.85rem;">لا توجد مهام بانتظار مراجعة فرعك حالياً.</p>`}
        `;
    } else if (currentRole === 'pm') {
        const nextTask = projectData.find(t => t.id === activeTask.id + 1);
        actionPanel.innerHTML = `
            <p><strong>صلاحية مدير المشروع العام:</strong></p>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 8px 0;">اعتماد المهمة: ${activeTask.title}</p>
            ${activeTask.status === 'pending_pm' 
                ? `<button class="btn-action btn-approve" onclick="approveAndPass(${activeTask.id}, ${nextTask ? nextTask.id : null})">موافقة واعتماد وتمرير للخطوة التالية</button>`
                : `<p style="color: #94a3b8; font-size: 0.85rem;">النظام بانتظار إنهاء المهام من الأقسام الفرعية.</p>`}
        `;
    } else if (currentRole === 'client') {
        actionPanel.innerHTML = `<p style="color: #94a3b8; font-size: 0.85rem;">أنت تشاهد واجهة تتبع العميل المباشرة.</p>`;
    }
}

function updateTaskStatus(taskId, newStatus) {
    const task = projectData.find(t => t.id === taskId);
    if (task) task.status = newStatus;
    saveData();
}

function approveAndPass(currentId, nextId) {
    const currentTask = projectData.find(t => t.id === currentId);
    if (currentTask) currentTask.status = 'completed';
    
    if (nextId) {
        const nextTask = projectData.find(t => t.id === nextId);
        if (nextTask) nextTask.status = 'pending_dev';
    }
    saveData();
}

function updateClientView() {
    const completedCount = projectData.filter(t => t.status === 'completed').length;
    const progress = Math.round((completedCount / projectData.length) * 100);
    
    document.getElementById('client-progress-text').innerText = `${progress}%`;
    document.getElementById('client-progress-fill').style.width = `${progress}%`;

    let detailsHtml = '<ul style="margin-top: 10px; font-size: 0.85rem; list-style: none; color: #94a3b8;">';
    for (let p = 1; p <= 6; p++) {
        const pTasks = projectData.filter(t => t.phase === p);
        const pCompleted = pTasks.filter(t => t.status === 'completed').length;
        const pStatus = pCompleted === pTasks.length ? '✅ مكتملة' : (pCompleted > 0 ? '🔄 قيد التنفيذ' : '⏳ قادم');
        detailsHtml += `<li style="padding: 4px 0;">المرحلة ${p}: ${pStatus} (${pCompleted}/${pTasks.length})</li>`;
    }
    detailsHtml += '</ul>';
    document.getElementById('client-status-details').innerHTML = detailsHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    render();
});
