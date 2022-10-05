const taskInput = document.querySelector('.task-input input'),
      filters = document.querySelectorAll('.filters span'),
      clearAll = document.querySelector('.clear-btn'),
      taskBox = document.querySelector('.task-box')

let editId
let isEditTask = false
//creating todolist in local storage
let todos = JSON.parse(localStorage.getItem('todo-list'))

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active')
        btn.classList.add('active')
        showTodo(btn.id)
    })
})

 function showTodo(filter){
     let li = ''
     if(todos){
        todos.forEach((todo, id) => {
            //if task completed, set isCompleted to checked
            let isCompleted = todo.status == 'completed' ? 'checked' : ''
            if(filter == todo.status || filter == 'all'){
                li += `<li class="task">
                        <label for="${id}">
                            <input onclick = "updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick = "showMenu(this)" class='bx bx-dots-horizontal-rounded'></i>
                            <ul class="task-menu">
                                <li onclick = "editTask(${id}, '${todo.name}')"><i class='bx bx-edit'></i>Edit</li>
                                <li onclick = "deleteTask(${id})"><i class='bx bx-trash' ></i>Delete</li>
                            </ul>
                        </div>
                    </li>`
            }
        })
     }
     //if there is no tasks this is inserted
     taskBox.innerHTML = li || `<span>You don't currently have any tasks</span>`
 }
 showTodo('all')

 function showMenu(selectedTask){
    //getting the task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild
    taskMenu.classList.add('show')
    document.addEventListener('click', e => {
        //removes the menu when you click on other parts of the screen
        if(e.target.tagName != 'I' || e.target != selectedTask){
            taskMenu.classList.remove('show')
        }
    })
 }

 function editTask(taskId, taskName){
    editId = taskId
    isEditTask = true
    taskInput.value = taskName
 }

 function deleteTask(deleteId){
    //removes seleted item from the array
    todos.splice(deleteId, 1)
    localStorage.setItem('todo-list', JSON.stringify(todos))
    showTodo('all')
 }

 clearAll.addEventListener('click', () => {
    //removes all items from the array
    todos.splice(0, todos.length)
    localStorage.setItem('todo-list', JSON.stringify(todos))
    showTodo('all')
 })

 function updateStatus(selectedTask){
    //getting task name
    let taskName = selectedTask.parentElement.lastElementChild
    if(selectedTask.checked){
        taskName.classList.add('checked')
        //updating status of the task
        todos[selectedTask.id].status = 'completed'
    } else{
        taskName.classList.remove('checked')
        todos[selectedTask.id].status = 'pending'
    }
    localStorage.setItem('todo-list', JSON.stringify(todos))
 }

taskInput.addEventListener('keyup', e => {
    let userTask = taskInput.value.trim() 
    if(e.key == 'Enter' && userTask){
        if(!isEditTask){
            if(!todos){ //if todo doesnt exist, pass an empty array
                todos = []
            }
            let taskInfo = {name: userTask, status: 'pending'}
            todos.push(taskInfo)
        } else{
            isEditTask = false
            todos[editId].name = userTask
        }
        
        taskInput.value = ''
        
        localStorage.setItem('todo-list', JSON.stringify(todos))
        showTodo('all')
    }
})