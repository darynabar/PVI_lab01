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
const btnedit= document.querySelector(".editBtn");
const saveBtn = document.querySelector(".btn-primary");
const hiddenIdInput = document.querySelector("#studentId");

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
    let rowToEdit = null;

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

    const firstNameInput = document.getElementById('firstName');
    const firstNameError = document.getElementById('firstNameError');
    const firstNameValue = firstNameInput.value.trim();

    const lastNameInput = document.getElementById('lastName');
    const lastNameError = document.getElementById('lastNameError'); 
    const lastNameValue = lastNameInput.value.trim();

    const groupInput = document.getElementById('group');
    const groupValue = groupInput.value;

    const genderInput = document.getElementById('gender');
    const genderValue = genderInput.value;

    const birthdayInput = document.getElementById('birthday');
    const birthdayValue = birthdayInput.value;

    let isValid = true; 
    
    const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ']+$/;

    if (!nameRegex.test(firstNameValue) || firstNameValue.length < 2) {
        firstNameInput.classList.add('input-error');
        if(firstNameError) firstNameError.classList.add('show');        
        isValid = false; 
    } else {
        firstNameInput.classList.remove('input-error');
        if(firstNameError) firstNameError.classList.remove('show');        
    }

    if (!nameRegex.test(lastNameValue) || lastNameValue.length < 2) {
        lastNameInput.classList.add('input-error');
        if(lastNameError) lastNameError.classList.add('show');        
        isValid = false; 
    } else {
        lastNameInput.classList.remove('input-error');
        if(lastNameError) lastNameError.classList.remove('show');        
    }

    if (groupValue === "") {
        groupInput.classList.add('input-error');
        isValid = false;
    } else {
        groupInput.classList.remove('input-error');
    }

    if (genderValue === "") {
        genderInput.classList.add('input-error');
        isValid = false;
    } else {
        genderInput.classList.remove('input-error');
    }

    if (birthdayValue === "") {
        birthdayInput.classList.add('input-error');
        isValid = false;
    } else {
        birthdayInput.classList.remove('input-error');
    }

    if (!isValid) {
        return; 
    }

    
    const studentFullName = `${lastNameValue} ${firstNameValue}`;
    
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

    const dateParts = birthdayValue.split('-');
       const formattedBirthday = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
        

    if (rowToEdit) {
        const cells = rowToEdit.querySelectorAll("td");
        cells[1].textContent = groupValue; // Використовуємо groupValue
        cells[2].textContent = `${firstNameValue} ${lastNameValue}`;
        cells[3].textContent = genderValue; // Використовуємо genderValue
        cells[4].textContent = formattedBirthday;

        const statusCircle = cells[5].querySelector('.status-circle');
        statusCircle.className = `status-circle ${statusClass}`;
    } 
    else {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
        <td><input type="checkbox" name="select-student" aria-label="Select student ${firstNameValue} ${lastNameValue}"></td>
        <td>${groupValue}</td>
        <td class="user-name">${firstNameValue} ${lastNameValue}</td>
        <td>${genderValue}</td>
        <td>${formattedBirthday}</td>
        <td>
        <span class="status-circle ${statusClass}" aria-label="Status: Inactive"></span>
        </td>
         <td>
        <button class="editBtn" aria-label="Edit student ${firstNameValue} ${lastNameValue}">✏️</button>
        <button class="deleteBtn" aria-label="Delete student ${firstNameValue} ${lastNameValue}">❌</button>
        </td>
        `;
        
        const tableBody = document.querySelector('.table tbody');
        tableBody.appendChild(newRow);
    }
    
    const studentData =
        {
            group: groupValue,
            firstName: firstNameValue,
            lastName: lastNameValue,
            gender: genderValue,
            birthday: formattedBirthday
        };
    console.log("Data student :", JSON.stringify(studentData,null));
    
    form.reset();
    rowToEdit = null;
    hiddenIdInput.value = "";
    UpdateCheckbox();
    
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'none';
});


    addBtn.onclick = () => {
        form.reset();
        rowToEdit = null;
        hiddenIdInput.value = "";
        titleModal.textContent = "Add student";
        modal.style.display = 'flex';
        saveBtn.textContent = "Create";

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
    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    };


    mainCheckbox.addEventListener('change', function () {
    
        const studentCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
        studentCheckboxes.forEach(function (checkbox) {
            checkbox.checked = mainCheckbox.checked;
        });

        UpdateCheckbox();
    
    });

    tableStudents.addEventListener("click", function (e) {
        if (e.target.type === 'checkbox' && e.target !== mainCheckbox) {
            UpdateCheckbox();
        }
        
        const editBtn = e.target.closest(".editBtn");
        if (editBtn) {
            rowToEdit = editBtn.closest("tr");
 

            const cells = rowToEdit.querySelectorAll("td");
            const group = cells[1].textContent;
            const fullName = cells[2].textContent.split(" "); 
            const firstName = fullName[0];
            const lastName = fullName[1];
            const gender = cells[3].textContent;
            const birthdayRaw = cells[4].textContent;
            const dateParts = birthdayRaw.split('.');
            const formattedDateForInput = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
           
            document.getElementById('group').value = group;
            document.getElementById('firstName').value = firstName;
            document.getElementById('lastName').value = lastName;
            document.getElementById('gender').value = gender;
            document.getElementById('birthday').value = formattedDateForInput;

            hiddenIdInput.value = "editing";
            saveBtn.textContent = "Save";
            titleModal.textContent = "Edit student";
            modal.style.display = 'flex';

            const studentData =
            {
                group: group,
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                birthday: formattedDateForInput
            };
            console.log("Data student :", JSON.stringify(studentData));
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

