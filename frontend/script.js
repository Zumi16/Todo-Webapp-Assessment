import API_URL from "./config.js";

const cardsContainer = document.getElementById("cardsContainer");
const addButton = document.getElementById("addBtn");
const addModal = document.getElementById("addModal");
const editModal = document.getElementById("editModal");
const closeBtn = document.getElementById("close");
const editCloseBtn = document.getElementById("editClose");
const cancelBtn = document.getElementById("cancelBtn");
const editCancelBtn = document.getElementById("editCancelBtn");
const statusOptions = document.getElementById("statusOptions");
const taskCount = document.getElementById("taskCount");
const filterSelect = document.querySelectorAll(".filter-select");

const form = document.getElementById("modalForm");
const editForm = document.getElementById("editForm");

const statusMap = {
    0: { label: 'to do', color: 'red', key: 'todo' },
    1: { label: 'inprogress', color: 'gold', key: 'inprogress' },
    2: { label: 'done', color: 'green', key: 'done' }
}

let taskData = []

async function fetchTaskData() {
    try {
        const response = await fetch(`${API_URL}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.error("API Failed:", error.message);
        return null;
    }
}

function renderCards(data) {
    if (data.length === 0) {
        cardsContainer.innerHTML = `No tasks found`
        return;
    }
    
    const cardItem = data.map((tasks) => {
        const statusInfo = statusMap[tasks.status] || { label: 'to do', color: 'red' };
        const dateFormat = new Date(tasks.createdAt)
        return `
            <div class="card-item" id="${tasks.id}">
                <div class="card-action">
                    <button class="edit-btn">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="delete-btn" aria-label="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <h1>${tasks.title}</h1>
                <p>${tasks.description}</p>
                <p style="color: ${statusInfo.color}">${statusInfo.label}</p>
                <p class="time-created">Created at ${dateFormat.toLocaleDateString()}</p>
            </div>
        `
    }).join("");

    taskCount.innerHTML = `<p id="taskCount">Showing ${data.length} out of ${taskData.length} tasks.</p>`
    cardsContainer.innerHTML = cardItem
}

async function displayCards() {
    taskData = await fetchTaskData();

    renderCards(taskData);
}

function closeModal(modalElement) {
    modalElement.style.display = "none";
}

addButton.addEventListener("click", (event) => {
    addModal.style.display = "block";
})

closeBtn.addEventListener("click", () => closeModal(addModal));
editCloseBtn.addEventListener("click", () => closeModal(editModal));
cancelBtn.addEventListener("click", () => closeModal(addModal));
editCancelBtn.addEventListener("click", () => closeModal(editModal));

cardsContainer.addEventListener('click', async (event) => {
    const editBtn = event.target.closest?.('.edit-btn');
    const deleteBtn = event.target.closest?.('.delete-btn');

    if (editBtn) {
        editModal.style.display = "block";
        const cardElement = event.target.closest?.('.card-item')
        const selectedTask = taskData.find(task => task.id == cardElement.id);
        let statusString = ''
        if (selectedTask.status === 0) {
            statusString = 'todo';
        }
        else if (selectedTask.status === 1) {
            statusString = 'inprogress';
        }
        else if (selectedTask.status === 2) {
            statusString = 'done';
        }

        document.getElementById("editTitle").value = selectedTask.title;
        document.getElementById("editDescription").value = selectedTask.description;
        statusOptions.value = statusString

        if (cardElement) {
            editForm.dataset.id = cardElement.id;
        }

    } else if (deleteBtn) {
        const cardElement = event.target.closest?.('.card-item');


        if (cardElement) {
            const taskId = cardElement.id;
            const isConfirmed = confirm("are you sure you want to delete this task?")

            if (!isConfirmed) {
                console.log("action cancelled");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/${taskId}`, {
                    method: 'DELETE'
                });

                await displayCards();
            } catch (error) {
                console.error("Failed to add task:", error.message);
            }

        }
    }
})

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.status = 0;
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newTask = await response.json();
        console.log(`Task Added:`, newTask);

        addModal.style.display = 'none';
        form.reset();

        await displayCards();
    } catch (error) {
        console.error("Failed to add task:", error.message);
    }
});

editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const editTitle = document.getElementById('editTitle').value;
    const editDescription = document.getElementById('editDescription').value;
    const taskId = editForm.dataset.id;
    const statusValue = (() => {
        if (statusOptions.value === 'todo') {
            return 0;
        } else if (statusOptions.value === 'inprogress') {
            return 1;
        } else if (statusOptions.value === 'done') {
            return 2;
        }
    })()

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ editTitle: editTitle, editDescription: editDescription, statusValue: statusValue }),
        })

        const result = await response.json();

        if (response.ok) {
            console.log("data updated successfully!")
        } else {
            alert("Error:", result.message);
        }

        editModal.style.display = 'none';
        editForm.reset();

        await displayCards();

    } catch (error) {
        console.error('Network Error', error)
    }
});

filterSelect.forEach(button => {
    button.addEventListener('change', (event) => {

        getValue = event.target.value;
        if (getValue === 'all') {
            renderCards(taskData);
        } else if (getValue === 'todo') {
            const filterActive = [...taskData].filter(tasks => {
                return tasks.status === 0
            })
            renderCards(filterActive);
        } else if (getValue === 'inprogress') {
            const filterActive = [...taskData].filter(tasks => {
                return tasks.status === 1
            })
            renderCards(filterActive);
        } else {
            const filterActive = [...taskData].filter(tasks => {
                return tasks.status === 2
            })
            renderCards(filterActive);
        }
    });
});

document.addEventListener("DOMContentLoaded", displayCards);