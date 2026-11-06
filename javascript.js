const initialData = [
    { id: 1, phase: 1, title: 'تحديد الأهداف', status: 'completed' },
    { id: 2, phase: 1, title: 'تحليل المتطلبات', status: 'pending_dev' },
    { id: 3, phase: 1, title: 'دراسة الجدوى', status: 'locked' },
    { id: 4, phase: 1, title: 'إنشاء الميزانية', status: 'locked' },
    { id: 5, phase: 1, title: 'وتشكيل الفريق', status: 'locked' },
    
    { id: 6, phase: 2, title: 'تصميم تجربة المستخدم', status: 'locked' },
    { id: 7, phase: 2, title: 'تصميم واجهة المستخدم', status: 'locked' },
    { id: 8, phase: 2, title: 'وهندسة النظام', status: 'locked' },

    { id: 9, phase: 3, title: 'تطوير الواجهة الأمامية', status: 'locked' },
    { id: 10, phase: 3, title: 'تطوير الواجهة الخلفية', status: 'locked' },
    { id: 11, phase: 3, title: 'التحكم في الإصدار ودمج الكود', status: 'locked' },

    { id: 12, phase: 4, title: 'اختبار الوحدة', status: 'locked' },
    { id: 13, phase: 4, title: 'اختبار النظام', status: 'locked' },
    { id: 14, phase: 4, title: 'اختبار القبول (UAT)', status: 'locked' },
    { id: 15, phase: 4, title: 'وتحديد وإصلاح الأخطاء', status: 'locked' },

    { id: 16, phase: 5, title: 'إعداد بيئة الإنتاج', status: 'locked' },
    { id: 17, phase: 5, title: 'النشر السحابي', status: 'locked' },
    { id: 18, phase: 5, title: 'وإطلاق المشروع', status: 'locked' },

    { id: 19, phase: 6, title: 'مراقبة الأداء', status: 'locked' },
    { id: 20, phase: 6, title: 'التحديثات والتحسينات', status: 'locked' },
    { id: 21, phase: 6, title: 'والدعم الفني', status: 'locked' }
];

let projectData = JSON.parse(localStorage.getItem('project_roadmap_db')) || initialData;
let currentRole = localStorage.getItem('current_user_role') || 'pm';

function saveData() {
    localStorage.setItem('project_roadmap_db', JSON.stringify(projectData));
    render();
}

function logout() {
    localStorage.removeItem('current_user_role');
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
    const activeTask = projectData.find(t => t.id === 2); 

    if (!controls || !roleTitle || !activeTask) return;

    if (currentRole === 'dev') {
        roleTitle.innerText = "صلاحية الموظف (مكلف بـ: تحليل المتطلبات)";
        controls.innerHTML = activeTask.status === 'pending_dev' 
            ? `<button class="btn-action btn-send" onclick="updateTaskStatus(2, 'pending_branch')">حفظ وإرسال إلى مدير الفرع</button>`
            : `<p style="color: #94a3b8;">تم إرسال العمل للمراجعة بنجاح.</p>`;
    } else if (currentRole === 'sub_pm') {
        roleTitle.innerText = "صلاحية مدير فرع (فكرة المشروع والتخطيط)";
        controls.innerHTML = activeTask.status === 'pending_branch' 
            ? `<button class="btn-action btn-review" onclick="updateTaskStatus(2, 'pending_pm')">تمت المراجعة وإرسال للمدير العام</button>`
            : `<p style="color: #94a3b8;">لا توجد مهام بانتظار مراجعة الفرع حالياً.</p>`;
    } else if (currentRole === 'pm') {
        roleTitle.innerText = "صلاحية مدير المشروع العام (كل الصلاحيات)";
        controls.innerHTML = activeTask.status === 'pending_pm' 
            ? `<button class="btn-action btn-approve" onclick="approveAndPass(2, 3)">موافقة واعتماد (وتمرير البيانات لموظف دراسة الجدوى)</button>`
            : `<p style="color: #94a3b8;">النظام بانتظار اكتمال المراحل الفرعية.</p>`;
    }
}

function updateTaskStatus(taskId, newStatus) {
    const task = projectData.find(t => t.id === taskId);
    if(task) task.status = newStatus;
    saveData();
}

function approveAndPass(currentId, nextId) {
    const currentTask = projectData.find(t => t.id === currentId);
    const nextTask = projectData.find(t => t.id === nextId);
    
    if(currentTask) currentTask.status = 'completed';
    if(nextTask) nextTask.status = 'pending_dev';
    
    saveData();
}

document.addEventListener('DOMContentLoaded', () => {
    render();
});
