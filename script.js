if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker успішно зареєстровано!', registration.scope);
      })
      .catch(error => {
        console.log('Помилка реєстрації ServiceWorker:', error);
      });
  });
}

const bell = document.querySelector(".bell-icon");
const message = document.querySelector('.message-dropdown');
const burger = document.querySelector('.burger');
const sidebar = document.querySelector('.sitebar');

// ------------------------------------------------------------
const notificationDot = document.querySelector(".dot");

if (localStorage.getItem("newMessage") === "true") {
    if (notificationDot) notificationDot.style.display = "block";
}

localStorage.setItem("newMessage", "true");
if (notificationDot) notificationDot.style.display = "block";

if(bell){
    bell.onclick = () => {
        if (notificationDot) {
            localStorage.setItem("newMessage", "false")
            notificationDot.style.display = "none";
        }
        window.location.href = "Messages.html";
    };
}

if (burger && sidebar) {
    burger.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        if (sidebar.classList.contains('active')) {
            burger.textContent = '';
        } else {
            burger.textContent = '☰';
        }
    });

    document.addEventListener("click", function (e) {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnBurger = burger.contains(e.target);

        if (!isClickInsideSidebar && !isClickOnBurger) {
            sidebar.classList.remove("active");
            burger.textContent = "☰";
        }
    });
}

// =========================================================
// ЛОГІКА АВТОРИЗАЦІЇ (MVC & Auth) - ГЛОБАЛЬНА
// =========================================================

const loginBtn = document.getElementById('loginBtn');
const authContent = document.getElementById('authContent');
const currentUserSpan = document.getElementById('current-user');
const logoutBtn = document.getElementById('logoutBtn');

const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

const addStudentBtn = document.querySelector('.add-button');
const delStudentBtn = document.getElementById('allDelete-button');
const sideBarLinks = document.querySelectorAll('.link-sitebar');

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

async function checkAuthStatus() {
    try {
        const response = await fetch('api/index.php?action=checkAuth');
        const result = await response.json();

        if (result.success) {
            updateUI(true, result.user);
            if (document.querySelector('.table')) {
                loadStudents(); 
            }
        } else {
            updateUI(false);
            const tbody = document.getElementById('students-table-body');
            if (tbody) tbody.innerHTML = '';
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

function updateUI(isLoggedIn, user = null) {
    if (isLoggedIn) {
        if(loginBtn) loginBtn.style.display = 'none';
        if(authContent) authContent.style.display = 'flex';
        if(currentUserSpan) currentUserSpan.textContent = user.name;
        
        if (addStudentBtn) addStudentBtn.style.display = 'inline-block';
        
        sideBarLinks.forEach(link => {
            link.style.pointerEvents = 'auto';
            link.style.opacity = '1';
        });
    } else {
        if(loginBtn) loginBtn.style.display = 'block';
        if(authContent) authContent.style.display = 'none';
        if(currentUserSpan) currentUserSpan.textContent = '';
        
        if (addStudentBtn) addStudentBtn.style.display = 'none';
        if (delStudentBtn) delStudentBtn.style.display = 'none';

        sideBarLinks.forEach(link => {
            if (!link.classList.contains('active-menu')) {
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.5';
            }
        });
    }
}

// Функція для обмеження дат (від 15 до 100 років)
function setDateLimits(inputElement) {
    if (!inputElement) return;
    const today = new Date();
    const minAge = 15; 
    const maxAge = 100; 
    
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    
    inputElement.max = maxDate.toISOString().split('T')[0];
    inputElement.min = minDate.toISOString().split('T')[0];
}

if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        loginError.style.display = 'none';
        loginForm.reset();
        
        // Встановлюємо обмеження віку для календаря при логіні!
        const loginPasswordInput = document.getElementById('loginPassword');
        setDateLimits(loginPasswordInput);
    });
}

if(closeLoginModal) {
    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
}
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const loginName = document.getElementById('loginName').value.trim();
        const rawDate = document.getElementById('loginPassword').value; // Отримуємо РРРР-ММ-ДД

        // ПЕРЕТВОРЮЄМО ФОРМАТ РРРР-ММ-ДД НА ДД.ММ.РРРР для бекенду
        let formattedPassword = rawDate;
        if (rawDate) {
            const dateParts = rawDate.split('-');
            formattedPassword = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
        }
        try {
            const response = await fetch('api/index.php?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Відправляємо вже правильний формат: ДД.ММ.РРРР
                body: JSON.stringify({ login: loginName, password: formattedPassword })
            });

            const result = await response.json();

            if (result.success) {
                loginModal.style.display = 'none';
                updateUI(true, result.user);
                if (document.querySelector('.table')) {
                    loadStudents(); 
                }
            } else {
                loginError.textContent = result.message; // Тепер сервер не сваритиметься на формат
                loginError.style.display = 'block';
            }
        } catch (error) {
            loginError.textContent = "Помилка з'єднання з сервером";
            loginError.style.display = 'block';
        }
    });
}

if(logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('api/index.php?action=logout');
            const result = await response.json();
            if (result.success) {
                updateUI(false);
                const tbody = document.getElementById('students-table-body');
                if (tbody) tbody.innerHTML = ''; 
                if (delStudentBtn) delStudentBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// =========================================================
// ЛОГІКА ТАБЛИЦІ СТУДЕНТІВ
// =========================================================

const tableStudents = document.querySelector('.table');

if (tableStudents) {
    const hiddenIdInput = document.querySelector("#studentId");
    const saveBtn = document.querySelector(".btn-primary");
    const modal = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const titleModal = document.querySelector('.modal-title');
    const modalWarning = document.querySelector(".modalWarning");
    const cancelWarning = document.querySelector(".btn-cancel");
    const closeWarning = document.querySelector(".close-warning-btn");
    const form = document.getElementById('addStudentForm');
    const mainCheckbox = document.getElementById('checkbox-select-all');
    let rowToDelete = null;
    let rowToEdit = null;
    const birthdayInput = document.getElementById('birthday');
    
    if (birthdayInput) {
        const today = new Date();
        const minAge = 15; 
        const maxAge = 100; 
        const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
        const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
        birthdayInput.max = maxDate.toISOString().split('T')[0];
        birthdayInput.min = minDate.toISOString().split('T')[0];
    }

    const okWarningBtn = document.querySelector(".btn-Ok");
    const delBtn = document.querySelector('.delete-all-btn');

    function UpdateCheckbox() {
        const allCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        const anyChecked = Array.from(allCheckboxes).some(c => c.checked);
        const allChecked = Array.from(allCheckboxes).every(c => c.checked) && allCheckboxes.length > 0;
        if(delBtn) delBtn.style.display = anyChecked ? "block" : "none";
        if(mainCheckbox) mainCheckbox.checked = allChecked;
    }
    
    // Створюємо блок для помилок у формі, якщо його ще немає
let formErrorDiv = document.getElementById('formErrorDiv');
if (!formErrorDiv && form) {
    formErrorDiv = document.createElement('div');
    formErrorDiv.id = 'formErrorDiv';
    formErrorDiv.style.color = 'red';
    formErrorDiv.style.marginBottom = '10px';
    formErrorDiv.style.display = 'none';
    form.prepend(formErrorDiv);
}

if(form) {
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        formErrorDiv.style.display = 'none'; // Ховаємо старі помилки

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const fullName = firstName + ' ' + lastName; // Збираємо ім'я до купи

        const studentData = {
            id: hiddenIdInput ? hiddenIdInput.value : '',
            name: fullName,
            group: document.getElementById('group').value,
            gender: document.getElementById('gender').value,
            birthday: document.getElementById('birthday').value
        };

        try {
            const response = await fetch('api/index.php?action=saveStudent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            const result = await response.json();

            if (result.success) {
                modal.style.display = 'none';
                form.reset();
                loadStudents(currentPage); // Оновлюємо поточну сторінку таблиці
            } else {
                // Відповідь сервера при дублюванні чи порожніх полях
                formErrorDiv.innerHTML = result.message;
                formErrorDiv.style.display = 'block';
            }
        } catch (error) {
            formErrorDiv.textContent = "Помилка сервера. Спробуйте пізніше.";
            formErrorDiv.style.display = 'block';
        }
    });
}
    if(addStudentBtn) {
        addStudentBtn.onclick = () => {
            if(form) form.reset();
            rowToEdit = null;
            if(hiddenIdInput) hiddenIdInput.value = "";
            if(titleModal) titleModal.textContent = "Add student";
            if(modal) modal.style.display = 'flex';
            if(saveBtn) saveBtn.textContent = "Login";
        };
    }

    let isDeleteAllMode = false;
    if(delBtn) {
        delBtn.onclick = () => {
            isDeleteAllMode = true;
            if(modalWarning) modalWarning.style.display = "flex";
            const delText = document.querySelector('.delete');
            if(delText) delText.textContent = "all selected students";
            UpdateCheckbox();
        }
    }

    if(cancelWarning) cancelWarning.addEventListener("click", () => modalWarning.style.display = "none");
    if(closeWarning) closeWarning.addEventListener("click", () => modalWarning.style.display = "none");
    if(closeBtn) closeBtn.addEventListener("click", () => modal.style.display = "none");
    if(cancelBtn) cancelBtn.addEventListener("click", () => modal.style.display = "none");
    
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };

    if(mainCheckbox) {
        mainCheckbox.addEventListener('change', function () {
            const studentCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            studentCheckboxes.forEach(checkbox => checkbox.checked = mainCheckbox.checked);
            UpdateCheckbox();
        });
    }
tableStudents.addEventListener("click", async function (e) {

// Обробка чекбоксів
 if (e.target.type === 'checkbox' && e.target !== mainCheckbox) {
 UpdateCheckbox();
}

// ОБРОБКА ВИДАЛЕННЯ (пункт 4.5)
 if (e.target.classList.contains('deleteBtn')) {
 const studentId = e.target.getAttribute('data-id');
 if (!confirm("Ви впевнені, що хочете видалити цього студента?")) return;

try {
 const response = await fetch('api/index.php?action=deleteStudent', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id: studentId })
 });
const result = await response.json();

    if (result.success) {
        loadStudents(currentPage); // Студент зникне з таблиці
 } else {
 alert(result.message); // Повідомлення про помилку видалення
 }
 } catch (error) {
 alert("Помилка з'єднання з сервером.");
 }
}

 // ОБРОБКА РЕДАГУВАННЯ (пункт 4.4)
 if (e.target.classList.contains('editBtn')) {
 // Дістаємо дані студента, які ми сховали в атрибуті data-student
 const studentDataStr = e.target.getAttribute('data-student');
 const student = JSON.parse(studentDataStr);

 // Розбиваємо "John Smith" на First Name та Last Name
 const nameParts = student.name.split(' ');
 const firstName = nameParts[0] || '';
 const lastName = nameParts.slice(1).join(' ') || '';

 // Заповнюємо форму даними
 if(hiddenIdInput) hiddenIdInput.value = student.id;
 document.getElementById('firstName').value = firstName;
 document.getElementById('lastName').value = lastName;
document.getElementById('group').value = student.group;
document.getElementById('gender').value = student.gender;
 document.getElementById('birthday').value = student.birthday;

 // Змінюємо заголовки і відкриваємо модалку
 if(titleModal) titleModal.textContent = "Edit student";
 if(saveBtn) saveBtn.textContent = "Save changes";
            if (formErrorDiv) formErrorDiv.style.display = 'none';
            if (modal) modal.style.display = 'flex';
 }
});
}


let currentPage = 1;

async function loadStudents(page = 1) {
    try {
        const response = await fetch(`api/index.php?action=getStudents&page=${page}`);
        const result = await response.json();
        
        if (result.success) {
            console.log("🔥 Оновлений масив студентів:", result.data);
            renderTable(result.data);
            currentPage = result.currentPage;
            renderPagination(result.totalPages, result.currentPage);

        }
    } catch (error) {
        console.error('Помилка завантаження даних з сервера:', error);
    }
}

// Нова функція для малювання кнопок сторінок
function renderPagination(totalPages, current) {
    let pagContainer = document.getElementById('pagination-container');
    
    // Якщо контейнера ще немає, створюємо його після таблиці
    if (!pagContainer) {
        pagContainer = document.createElement('div');
        pagContainer.id = 'pagination-container';
        pagContainer.style.marginTop = '15px';
        pagContainer.style.display = 'flex';
        pagContainer.style.gap = '5px';
        document.querySelector('.table').after(pagContainer);
    }

    pagContainer.innerHTML = ''; // Очищаємо старі кнопки

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.style.padding = '5px 10px';
        btn.style.cursor = 'pointer';
        
        if (i === current) {
            btn.style.fontWeight = 'bold';
            btn.style.backgroundColor = '#007bff';
            btn.style.color = 'white';
        }

        btn.onclick = () => loadStudents(i);
        pagContainer.appendChild(btn);
    }
}

function renderTable(students) {
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return; 

    tbody.innerHTML = ''; 

    students.forEach(student => {
        const tr = document.createElement('tr');
        const statusClass = student.status === 'active' ? 'status-active' : 'status-inactive';

        // Зберігаємо дані студента у форматі JSON для швидкого редагування
        const studentDataStr = JSON.stringify(student).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

        tr.innerHTML = `
            <td><input type="checkbox" name="select-student" value="${student.id}"></td>
            <td>${student.group}</td>
            <td class="user-name">${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.birthday}</td>
            <td>
                <span class="status-circle ${statusClass}" aria-label="Status: ${student.status}"></span>
            </td>
            <td>
                <button class="editBtn" data-student="${studentDataStr}">✏️</button>
                <button class="deleteBtn" data-id="${student.id}">❌</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}