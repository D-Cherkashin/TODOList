const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')
const search = document.querySelector('#search')
const sortElement = document.querySelector('#sort')


const lsValue = JSON.parse(localStorage.getItem('tasks'))

let tasks = Array.isArray(lsValue) ? lsValue : []

tasks.forEach((task) => renderTask(task))

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
search.addEventListener('input', searchTasks)
sortElement.addEventListener('change', sortTasks)

function addTask(event) {
    event.preventDefault()

    const taskText = taskInput.value

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
        created: new Date()
    }

    tasks.push(newTask)

    saveToLocalStorage()

    renderTask(newTask)

    taskInput.value = ''
    taskInput.focus()

    checkEmptyList()
}

function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return

    const parentNode = event.target.closest('.list-group-item')

    const id = Number(parentNode.id)

    tasks = tasks.filter((task) => task.id !== id)

    saveToLocalStorage()

    parentNode.remove()
    checkEmptyList()
}

function doneTask (event) {
    if (event.target.dataset.action !== 'done') return
    const parentNode = event.target.closest('.list-group-item')

    const id = Number(parentNode.id)
    const task = tasks.find((task) => (task.id === id))
    task.done = !task.done

    saveToLocalStorage()

    const taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = 
            `<li id="emptyList" class="emp_list">
                <div class="empty-list__title">Список дел пуст</div>
            </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

    const taskHTML = `
        <li id="${task.id}" class="list-group-item" title="Задача">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action_g" title="Выполнено">
                    <img src="img/tick.png" alt="Done" width="20" height="20">
                </button>
                <button type="button" data-action="delete" class="btn-action_r" title="Удалить задачу">
                    <img src="img/cross.png" alt="Delete" width="20" height="20">
                </button>
            </div>
        </li>
    `
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}

function searchTasks(event) {
    const filteredTasks = tasks.filter((item) => {
        return item.text.includes(event.target.value.toLowerCase())
    })
    tasksList.innerHTML = ''
    filteredTasks.forEach((task) => renderTask(task))
}

function sortTasks(event) {
    console.log()
    switch(event.target.value) {
        case 'all':
            tasksList.innerHTML = ''
            tasks.forEach((task) => renderTask(task))
            break

        case 'completed':
            const filteredTasks = tasks.filter((item) => {
                return item.done === true
            })
            tasksList.innerHTML = ''
            filteredTasks.forEach((task) => renderTask(task))
            break

        case 'unfilled':
            tasksList.innerHTML = ''
            tasks.filter((item) => {
                return item.done !== true
            }).forEach((task) => renderTask(task))
            break

        case 'new':
            tasksList.innerHTML = ''
            tasks.toSorted((task1, task2) => {
                return new Date (task2.created) - new Date (task1.created)
            }).forEach((task) => renderTask(task))
            break

        case 'old':
            tasksList.innerHTML = ''
            tasks.toSorted((task1, task2) => {
                return new Date (task1.created) - new Date (task2.created)
            }).forEach((task) => renderTask(task))
            break
        }
}

