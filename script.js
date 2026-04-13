let tasks = JSON.parse(localStorage.getItem('studyTrackerData')) || [];

function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if(element) {
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        element.classList.add('active');
    }
    
    renderAll();
}

const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeBtn.querySelector('i');
    if(document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        desc: document.getElementById('desc').value,
        completed: false
    };
    tasks.push(newTask);
    localStorage.setItem('studyTrackerData', JSON.stringify(tasks));
    document.getElementById('task-form').reset();
    alert('Task Saved!');
    showPage('tasks');
});

function toggleStatus(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    localStorage.setItem('studyTrackerData', JSON.stringify(tasks));
    renderAll();
}

function deleteTask(id) {
    if (confirm("Apakah kamu yakin ingin menghapus task ini?")) {
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem('studyTrackerData', JSON.stringify(tasks));
        renderAll();
    }
}

function renderAll() {
    const taskList = document.getElementById('tasks-list');
    const scheduleList = document.getElementById('schedule-list');
    
    const completed = tasks.filter(t => t.completed).length;
    document.getElementById('summary-total').innerText = tasks.length + " Tasks";
    document.getElementById('summary-completed').innerText = completed + " Tasks";
    document.getElementById('summary-remaining').innerText = (tasks.length - completed) + " Tasks";

    taskList.innerHTML = tasks.map(t => `
        <div class="task-card">
            <div class="card-header">
                <h4>${t.title}</h4>
                <button onclick="deleteTask(${t.id})" class="btn-delete" title="Hapus Course">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="task-date">
                <i class="far fa-calendar-alt"></i> ${t.date}
            </div>
            <p class="task-desc">${t.desc}</p>
            <div style="margin-top:15px">
                <button onclick="toggleStatus(${t.id})" class="btn-task ${t.completed ? 'status-done' : 'status-pending'}">
                    ${t.completed ? '<i class="fas fa-check-circle"></i> Selesai' : 'Tandai Selesai'}
                </button>
            </div>
        </div>
    `).join('');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    const todaysTasks = tasks.filter(t => !t.completed && t.date === formattedToday);

    if (todaysTasks.length === 0) {
        scheduleList.innerHTML = `
            <div style="text-align: center; color: #888; padding: 20px;">
                <i class="fas fa-glass-cheers" style="font-size: 24px; margin-bottom: 10px;"></i>
                <p>Yeay! Tidak ada tenggat waktu untuk hari ini.</p>
            </div>
        `;
    } else {
        scheduleList.innerHTML = todaysTasks.map(t => `
            <div class="task-card" style="margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h4>${t.title}</h4>
                    <div class="task-date" style="margin-bottom:0; margin-top:5px;">
                        <i class="far fa-clock"></i> ${t.date}
                    </div>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <button onclick="toggleStatus(${t.id})" class="btn-task status-pending" style="width:auto; padding: 8px 15px;">Mark Done</button>
                    <button onclick="deleteTask(${t.id})" class="btn-delete" style="width: 35px; height: 35px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

renderAll();