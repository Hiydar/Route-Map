const initialData = [
    // المرحلة 1: التخطيط
    { id: 1, phase: 1, title: 'تحديد الأهداف', status: 'completed' },
    { id: 2, phase: 1, title: 'تحليل المتطلبات', status: 'pending_dev' },
    { id: 3, phase: 1, title: 'دراسة الجدوى', status: 'locked' },
    { id: 4, phase: 1, title: 'إنشاء الميزانية', status: 'locked' },
    { id: 5, phase: 1, title: 'وتشكيل الفريق', status: 'locked' },
    
    // المرحلة 2: التصميم
    { id: 6, phase: 2, title: 'تصميم تجربة المستخدم', status: 'locked' },
    { id: 7, phase: 2, title: 'تصميم واجهة المستخدم', status: 'locked' },
    { id: 8, phase: 2, title: 'وهندسة النظام', status: 'locked' },

    // المرحلة 3: التطوير
    { id: 9, phase: 3, title: 'تطوير الواجهة الأمامية', status: 'locked' },
    { id: 10, phase: 3, title: 'تطوير الواجهة الخلفية', status: 'locked' },
    { id: 11, phase: 3, title: 'التحكم في الإصدار ودمج الكود', status: 'locked' },

    // المرحلة 4: الاختبار والجودة
    { id: 12, phase: 4, title: 'اختبار الوحدة', status: 'locked' },
    { id: 13, phase: 4, title: 'اختبار النظام', status: 'locked' },
    { id: 14, phase: 4, title: 'اختبار القبول (UAT)', status: 'locked' },
    { id: 15, phase: 4, title: 'وتحديد وإصلاح الأخطاء', status: 'locked' },

    // المرحلة 5: النشر والتسليم
    { id: 16, phase: 5, title: 'إعداد بيئة الإنتاج', status: 'locked' },
    { id: 17, phase: 5, title: 'النشر السحابي', status: 'locked' },
    { id: 18, phase: 5, title: 'وإطلاق المشروع', status: 'locked' },

    // المرحلة 6: الصيانة والدعم
    { id: 19, phase: 6, title: 'مراقبة الأداء', status: 'locked' },
    { id: 20, phase: 6, title: 'التحديثات والتحسينات', status: 'locked' },
    { id: 21, phase: 6, title: 'والدعم الفني', status: 'locked' }
];

let projectData = JSON.parse(localStorage.getItem('project_roadmap_db')) || initialData;
let currentRole = localStorage.getItem('current_user_role') || 'pm';
let currentUserName = localStorage.getItem('current_user_name') || 'مدير المشروع العام';

function saveData() {
    localStorage.setItem('project_roadmap_db', JSON.stringify(projectData));
    render();
}

function logout() {
    localStorage.removeItem('current_user_role');
    localStorage.removeItem('current_user_name');
    window.location.href = 'login.html';
}

function render() {
    for(let i=1; i<=6; i++) {
        const el = document.getElementById(`phase-${i}-tasks`);
        if (el) el.innerHTML = '';
    }

    let completedCount = 0;

    projectData.forEach(task => {
        if(task.status === 'completed') completedCount++;
        
        const li = document.createElement('li');
        li.className = `task-item ${task.status}`;
        li.innerHTML = `<span class="status-dot"></span> ${task.title}`;
        const container = document.getElementById(`phase-${task.phase}-tasks`);
        if (container) container.appendChild(li);
    });

    const progress = Math.round((completedCount / projectData.length) * 100);
    const progressPercentEl = document.getElementById('progress-percent');
    const progressFillEl = document.getElementById('progress-fill');
    if (progressPercentEl) progressPercentEl.innerText = `${progress}%`;
    if (progressFillEl) progressFillEl.style.width = `${progress}%`;

    const clientView = document.getElementById('client-view');
    const actionView = document.getElementById('action-view');
    
    if(currentRole === 'client') {
        if (clientView) clientView.style.display = 'block';
        if (actionView) actionView.style.display = 'none';
    } else {
        if (clientView) clientView.style.display = 'none';
        if (actionView) actionView.style.display = 'block';
        renderControls();
    }
}

function renderControls() {
    const controls = document.getElementById('action-controls');
    const roleTitle = document.getElementById('role-title');
    const activeTask = projectData.find(t => t.status !== 'completed') || projectData[0];

    if (!controls || !roleTitle) return;

    roleTitle.innerText = `لوحة التحكم - الصلاحية الحالية: ${currentUserName}`;

    if (currentRole === 'dev') {
        controls.innerHTML = `
            <p>المهمة الحالية المطلوبة للتنفيذ: <strong>${activeTask ? activeTask.title : 'لا توجد مهام'}</strong></p>
            ${activeTask && activeTask.status === 'pending_dev' 
                ? `<button class="btn-action btn-send" onclick="updateTaskStatus(${activeTask.id}, 'pending_branch')">حفظ وإرسال إلى مدير الفرع المختص</button>`
                : `<p style="color: #94a3b8; margin-top:5px;">بانتظار اعتماد الإدارات العليا للمهام السابقة.</p>`}
        `;
    } else if (currentRole.startsWith('sub_pm')) {
        const phaseMap = { 'sub_pm_1': 1, 'sub_pm_2': 2, 'sub_pm_3': 3, 'sub_pm_4': 4, 'sub_pm_5': 5, 'sub_pm_6': 6 };
        const myPhase = phaseMap[currentRole];
        const branchTask = projectData.find(t => t.phase === myPhase && t.status === 'pending_branch');

        controls.innerHTML = branchTask 
            ? `<p>مهام بانتظار مراجعة فرعك: <strong>${branchTask.title}</strong></p>
               <button class="btn-action btn-review" onclick="updateTaskStatus(${branchTask.id}, 'pending_pm')">تمت المراجعة وإرسال للمدير العام</button>`
            : `<p style="color: #94a3b8;">لا توجد مهام معلقة بحاجة لمراجعة هذا الفرع حالياً.</p>`;
    } else if (currentRole === 'pm') {
        const pmTask = projectData.find(t => t.status === 'pending_pm');
        const nextTask = pmTask ? projectData.find(t => t.id === pmTask.id + 1) : null;

        controls.innerHTML = pmTask 
            ? `<p>مهمة بانتظار الاعتماد النهائي: <strong>${pmTask.title}</strong></p>
               <button class="btn-action btn-approve" onclick="approveAndPass(${pmTask.id}, ${nextTask ? nextTask.id : null})">موافقة واعتماد نهائي (وتمرير البيانات للمرحلة التالية)</button>`
            : `<p style="color: #94a3b8;">النظام يعمل بسلاسة وبانتظار إنهاء المهام من الأقسام الفرعية.</p>`;
    }
}

function updateTaskStatus(taskId, newStatus) {
    const task = projectData.find(t => t.id === taskId);
    if(task) task.status = newStatus;
    saveData();
}

function approveAndPass(currentId, nextId) {
    const currentTask = projectData.find(t => t.id === currentId);
    if(currentTask) currentTask.status = 'completed';
    
    if(nextId) {
        const nextTask = projectData.find(t => t.id === nextId);
        if(nextTask) nextTask.status = 'pending_dev';
    }
    
    saveData();
}

document.addEventListener('DOMContentLoaded', () => {
    render();
});
