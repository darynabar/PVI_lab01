const modal = document.getElementById('modalOverlay');
const addBtn = document.querySelector('.add-button'); // Ваша кнопка +
const closeBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const tableStudents = document.querySelector('.table');
const titleModal = document.querySelector('.modal-title');
const modalWarning = document.querySelector(".modalWarning");
const cancelWarning = document.querySelector(".btn-cancel");
const closeWarning = document.querySelector(".close-warning-btn");
const bell = document.querySelector(".bell-icon");
const message = document.querySelector('.message-dropdown');

    const form = document.getElementById('addStudentForm'); // Твоя форма
    const tableBody = document.querySelector('.table tbody'); // Тіло твоєї таблиці
    const modalOverlay = document.getElementById('modalOverlay'); // Модальне вікно
    // 1. Знаходимо головні елементи
    const mainCheckbox = document.getElementById('checkbox-select-all'); // Твій головний чекбокс в шапці
    const allDeleteBtn = document.getElementById('allDelete-button');    // Кнопка видалення
    let rowToDelete = null; 
    const okWarningBtn = document.querySelector(".btn-Ok");
    const delBtn = document.querySelector('.delete-all-btn');
    const burger = document.getElementById('burger');
    const sidebar = document.getElementById('sidebar');


function UpdateCheckbox()
{
    const allCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const anyChecked = Array.from(allCheckboxes).some(c => c.checked);
    const allChecked = Array.from(allCheckboxes).every(c => c.checked) && allCheckboxes.length > 0;
    delBtn.style.display = anyChecked ? "block" : "none";
    mainCheckbox.checked = allChecked;

}

burger.addEventListener('click', function () {
    sidebar.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        burger.textContent = '';
    } else {
        burger.textContent = '☰';
    }
});

    
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // 1. Отримуємо дані
    const group = document.getElementById('group').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gender = document.getElementById('gender').value;
    const birthdayInput = document.getElementById('birthday').value; 

    // 2. Валідація
    if (!group || !firstName || !lastName || !gender || !birthdayInput) {
        alert("Помилка: Будь ласка, заповніть всі поля!");
        return; 
    }

    // 3. Логіка статусів
    // !!! Створюємо ім'я для порівняння (Прізвище + Ім'я, бо так у тебе в шапці)
    const studentFullName = `${lastName} ${firstName}`; 
    
    const currentUserElement = document.getElementById('current-user');
    let currentUserName = "";
    
    // Перевіряємо, чи існує елемент в шапці, щоб не було помилок
    if (currentUserElement) {
        currentUserName = currentUserElement.innerText.trim();
    }

    // !!! Оголошуємо змінну перед if
    let statusClass = ''; 

    // Порівнюємо
    if (studentFullName.toLowerCase() === currentUserName.toLowerCase()) {
        statusClass = 'status-active'; // Клас для зеленого
    } else {
        statusClass = 'status-inactive'; // Клас для сірого
    }

    // 4. Форматування дати
    const dateParts = birthdayInput.split('-');
    const formattedBirthday = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; 

    // 5. Створюємо рядок
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td><input type="checkbox" name="select-student"></td>
        <td>${group}</td>
        <td>${firstName} ${lastName}</td> <td>${gender}</td>
        <td>${formattedBirthday}</td>
        <td>
            <span class="status-circle ${statusClass}"></span>
        </td>
        <td>
            <button class="action-btn editBtn">✏️</button>
            <button class="action-btn deleteBtn">❌</button>
        </td>
    `;

    // 6. Додаємо в таблицю і чистимо
    tableBody.appendChild(newRow);
    form.reset(); 
    UpdateCheckbox();
    modalOverlay.style.display = 'none'; 
});

const notificationDot = document.querySelector(".dot");

if (localStorage.getItem("newMessage")==="true")
{
     notificationDot.style.display = "block"; 

}

        localStorage.setItem("newMessage", "true");
        notificationDot.style.display = "block"; 


bell.onclick = () => {

    if (notificationDot) {
        localStorage.setItem("newMessage", "false")
        notificationDot.style.display = "none"; 
        
    }
    window.location.href = "Messages.html";
};


// Відкрити модалку
addBtn.onclick = () => {
    titleModal.textContent = "Add student";
    modal.style.display = 'flex';

};

let isDeleteAllMode = false; // Прапорець: true — видаляємо всіх, false — одного
delBtn.onclick = () => {
    isDeleteAllMode = true; // Вмикаємо режим "масового видалення"
    modalWarning.style.display = "flex";
    document.querySelector('.delete').textContent = "all selected students";    
    UpdateCheckbox();
}


// Закрити модалку
const closeModal = () => {
    modal.style.display = 'none';
};

cancelWarning.addEventListener("click", function() {
    modalWarning.style.display = "none";
});
closeWarning.addEventListener("click", function () {
    modalWarning.style.display = "none";
});

closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
});

cancelBtn.addEventListener("click", function() {
    modal.style.display = "none";
});
// Закриття при кліку поза вікном
window.onclick = (event) => {
    if (event.target == modal) closeModal();
};


// 2. Слухаємо зміни головного чекбокса
mainCheckbox.addEventListener('change', function() {
    
   const studentCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    // Перебираємо всі чекбокси і ставимо їм такий самий стан, як у головного
    studentCheckboxes.forEach(function(checkbox) {
        checkbox.checked = mainCheckbox.checked;
    });

    // Оновлюємо кнопку видалення
    UpdateCheckbox();
    
});


tableStudents.addEventListener("click", function (e) {
    if (e.target.type === 'checkbox' && e.target !== mainCheckbox) {
         UpdateCheckbox(); // Оновлюємо стан кнопки та головного чекбокса
    }
        
    const editBtn = e.target.closest(".editBtn");
    if (editBtn) {
        titleModal.textContent = "Edit student";
        modal.style.display = 'flex';
        return; // Виходимо, щоб не йти далі
    }

    // 2. Перевіряємо, чи натиснули на кнопку видалення
    const deleteBtn = e.target.closest(".deleteBtn");
    if (deleteBtn) {
    isDeleteAllMode = false; // Це НЕ масове видалення
    rowToDelete = deleteBtn.closest("tr");
    const userName = rowToDelete.cells[2].textContent.trim();
    document.querySelector('.delete').textContent = userName;
    modalWarning.style.display = "flex";
    }
    
});

okWarningBtn.addEventListener("click", function() {
   if (isDeleteAllMode) {
        const selectedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
        
        selectedCheckboxes.forEach(checkbox => {
            checkbox.closest('tr').remove();
        });

        
        delBtn.style.display = 'none';
        
    } else if (rowToDelete) {
        
        rowToDelete.remove();
        rowToDelete = null;
    }

    modalWarning.style.display = "none";
    UpdateCheckbox();
});




