var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");
var tasksInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed")
var taskIdCounter = 0;
var pageContentE1 = document.querySelector("#page-content")
var tasks = [];

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  
  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formE1.reset();

  var isEdit = formE1.hasAttribute("data-task-id");

  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formE1.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskE1 function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    }
    createTaskE1(taskDataObj);
  }
}

var createTaskE1 = function(taskDataObj) {
  // create list item
  var listItemE1 = document.createElement("li");
  listItemE1.className = "task-item";

  // add task id as a custom attribute
  listItemE1.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoE1 = document.createElement("div");
  taskInfoE1.className = "task-info";
  taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

  listItemE1.appendChild(taskInfoE1);

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);
  saveTasks();

  var taskActionsE1 = createTaskActions(taskIdCounter);
  listItemE1.appendChild(taskActionsE1);

  // add entire list item to list
  if (taskDataObj.status === "to do") {
    listItemE1.querySelector("select[name='status-change']").selectedIndex = 0;
    tasksToDoE1.appendChild(listItemE1);
  }
  else if (taskDataObj.status === "in progress") {
    listItemE1.querySelector("select[name='status-change']").selectedIndex = 1;
    tasksInProgressE1.appendChild(listItemE1);
  }
  else if (taskDataObj.status === 'completed') {
    listItemE1.querySelector("select[name='status-change']").selectedIndex = 2;
    tasksCompletedE1.appendChild(listItemE1);
  }

  taskIdCounter++;
}

var createTaskActions = function(taskId) {
  var actionContainerE1 = document.createElement("div");
  actionContainerE1.className = "task-actions";

  // create edit button
  var editButtonE1 = document.createElement("button");
  editButtonE1.textContent = "Edit";
  editButtonE1.className = "btn edit-btn";
  editButtonE1.setAttribute("data-task-id", taskId);

  actionContainerE1.appendChild(editButtonE1);

  // create delete button
  var deleteButtonE1 = document.createElement("button");
  deleteButtonE1.textContent = "Delete";
  deleteButtonE1.className = "btn delete-btn";
  deleteButtonE1.setAttribute("data-task-id", taskId);

  actionContainerE1.appendChild(deleteButtonE1);

  var statusSelectE1 = document.createElement("select");
  statusSelectE1.className = "select-status";
  statusSelectE1.setAttribute("name", "status-change");
  statusSelectE1.setAttribute("data-task-id", taskId);

  actionContainerE1.appendChild(statusSelectE1);

  var statusChoices = ["To Do", "In Progress", "Completed"]

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionE1 = document.createElement("option");
    statusOptionE1.textContent = statusChoices[i];
    statusOptionE1.setAttribute("value", statusChoices[i]);

    //append to select
    statusSelectE1.appendChild(statusOptionE1);
  }

  return actionContainerE1;
}

var taskButtonHandler = function(event) {
  // get target element from event
  var targetE1 = event.target;

  // edit button was clicked
  if (targetE1.matches(".edit-btn")) {
    var taskId = targetE1.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button was clicked
  else if (targetE1.matches(".delete-btn")) {
    var taskId = targetE1.getAttribute("data-task-id");
    deleteTask(taskId);
  }
}

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  // create new array to hold update list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskID, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks();
}

var editTask = function(taskId) {
  console.log("editing task #" + taskId);

  // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formE1.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array and task object with new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  formE1.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
  saveTasks();
}

var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoE1.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressE1.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedE1.appendChild(taskSelected);
  }

  // update task's status in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
  saveTasks();
}

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
  // get task items from local storage
  var savedTasks = localStorage.getItem("tasks");

  // check if tasks is empty
  if (!savedTasks) {
    return false;
  }

  // convert tasks from string format back into an array of objects
  savedTasks = JSON.parse(savedTasks);

  // iterate through a tasks array and create task elements on the page from it
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the 'createTaskE1()' function
    createTaskE1(savedTasks[i]);
  }
}

formE1.addEventListener("submit", taskFormHandler);
pageContentE1.addEventListener("click", taskButtonHandler);
pageContentE1.addEventListener("change", taskStatusChangeHandler);
loadTasks();