const bell = document.querySelector(".bell-icon");
const message = document.querySelector('.message-dropdown');
const burger = document.querySelector('.burger');
const sidebar = document.querySelector('.sitebar');

// ------------------------------------------------------------

const notificationDot = document.querySelector(".dot");

if (localStorage.getItem("newMessage") === "true") {
    notificationDot.style.display = "block";
}

localStorage.setItem("newMessage", "true");
notificationDot.style.display = "block";

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

// ------------------------------------------------------------

const tableStudents = document.querySelector('.table');
if (tableStudents) {
    const tableBody = document.querySelector('.table tbody');
    const modal = document.getElementById('modalOverlay');
    const addBtn = document.querySelector('.add-button');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const titleModal = document.querySelector('.modal-title');
    const modalWarning = document.querySelector(".modalWarning");
    const cancelWarning = document.querySelector(".btn-cancel");
    const closeWarning = document.querySelector(".close-warning-btn");
    const form = document.getElementById('addStudentForm');
    const modalOverlay = document.getElementById('modalOverlay');
    const mainCheckbox = document.getElementById('checkbox-select-all');
    const allDeleteBtn = document.getElementById('allDelete-button');
    let rowToDelete = null;
    const okWarningBtn = document.querySelector(".btn-Ok");
    const delBtn = document.querySelector('.delete-all-btn');


    function UpdateCheckbox() {
        const allCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        const anyChecked = Array.from(allCheckboxes).some(c => c.checked);
        const allChecked = Array.from(allCheckboxes).every(c => c.checked) && allCheckboxes.length > 0;
        delBtn.style.display = anyChecked ? "block" : "none";
        mainCheckbox.checked = allChecked;

    }
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const group = document.getElementById('group').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const gender = document.getElementById('gender').value;
        const birthdayInput = document.getElementById('birthday').value;

        if (!group || !firstName || !lastName || !gender || !birthdayInput) {
            alert("Помилка: Будь ласка, заповніть всі поля!");
            return;
        }

        const studentFullName = `${lastName} ${firstName}`;
    
        const currentUserElement = document.getElementById('current-user');
        let currentUserName = "";
    
        if (currentUserElement) {
            currentUserName = currentUserElement.innerText.trim();
        }

        let statusClass = '';

        if (studentFullName.toLowerCase() === currentUserName.toLowerCase()) {
            statusClass = 'status-active';
        } else {
            statusClass = 'status-inactive';
        }

        const dateParts = birthdayInput.split('-');
        const formattedBirthday = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        const newRow = document.createElement('tr');

        newRow.innerHTML = `
        <td><input type="checkbox" name="select-student" aria-label="Select student John Smith"></td>
        <td>${group}</td>
        <td class="user-name">${firstName} ${lastName}</td>
        <td>${gender}</td>
        <td>${formattedBirthday}</td>
        <td>
            <span class="status-circle ${statusClass}" aria-label="Status: Inactive"></span>
        </td>
        <td>
            <button class="editBtn" aria-label="Edit student John Smith">✏️</button>
            <button class="deleteBtn" aria-label="Delete student John Smith">❌</button>
        </td>
    `;
    
        tableBody.appendChild(newRow);
        form.reset();
        UpdateCheckbox();
        modalOverlay.style.display = 'none';
    });

    addBtn.onclick = () => {
        titleModal.textContent = "Add student";
        modal.style.display = 'flex';

    };

    let isDeleteAllMode = false;
    delBtn.onclick = () => {
        isDeleteAllMode = true;
        modalWarning.style.display = "flex";
        document.querySelector('.delete').textContent = "all selected students";
        UpdateCheckbox();
    }


    const closeModal = () => {
        modal.style.display = 'none';
    };

    cancelWarning.addEventListener("click", function () {
        modalWarning.style.display = "none";
    });
    closeWarning.addEventListener("click", function () {
        modalWarning.style.display = "none";
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    cancelBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });
    // Закриття при кліку поза вікном
    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    };


    mainCheckbox.addEventListener('change', function () {
    
        const studentCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
        // Перебираємо всі чекбокси і ставимо їм такий самий стан, як у головного
        studentCheckboxes.forEach(function (checkbox) {
            checkbox.checked = mainCheckbox.checked;
        });

        // Оновлюємо кнопку видалення
        UpdateCheckbox();
    
    });


    tableStudents.addEventListener("click", function (e) {
        if (e.target.type === 'checkbox' && e.target !== mainCheckbox) {
            UpdateCheckbox();
        }
        
        const editBtn = e.target.closest(".editBtn");
        if (editBtn) {
            titleModal.textContent = "Edit student";
            modal.style.display = 'flex';
            return;
        }

        const deleteBtn = e.target.closest(".deleteBtn");
        if (deleteBtn) {
            isDeleteAllMode = false;
            rowToDelete = deleteBtn.closest("tr");
            const userName = rowToDelete.cells[2].textContent.trim();
            document.querySelector('.delete').textContent = userName;
            modalWarning.style.display = "flex";
        }
    
    });

    okWarningBtn.addEventListener("click", function () {
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
}