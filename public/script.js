// Admin Login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert("Login successful!");
        } else {
            alert("Login failed!");
        }
    });
}

// Update Timetable
function updateTimetable() {
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;
    const lesson = document.getElementById('lesson').value;

    fetch('/admin/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ day, time, lesson })
    })
    .then(res => res.json())
    .then(() => alert("Timetable Updated"));
}

// Load Timetable for Client
fetch('/client/timetable')
    .then(res => res.json())
    .then(data => {
        let table = '<tr><th>Day</th><th>Time</th><th>Lesson</th></tr>';
        data.forEach(row => {
            table += `<tr><td>${row.day}</td><td>${row.time}</td><td>${row.lesson}</td></tr>`;
        });
        document.getElementById('timetable').innerHTML = table;
    });
