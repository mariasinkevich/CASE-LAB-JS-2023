/*Использование фейкового сервера предполагает всего по одному fetch-запросу к каждой
из баз данных, так как данные там остаются такими же при любых действиях. 
Однако, для имитации работы с реальным сервером fetch-запросы к базам данных производятся тогда,
когда это было бы необходимо, если бы сервер были настоящим*/

const listContainer = document.querySelector('#todo-list');
const comboBox = document.querySelector('#user-todo');
const inputBox = document.querySelector('#new-todo');
const addBtn = document.querySelector('#add-btn');

const urlTodoData = 'https://jsonplaceholder.typicode.com/todos';
const urlUsersData = 'https://jsonplaceholder.typicode.com/users';

updateWindow();

//Обработчик события, добавляющего новую задачу
addBtn.addEventListener('click', function(event){
	event.preventDefault();
	addTask();
});

//Обработчик событий изменения статуса задачи и удаления задачи
listContainer.addEventListener('click', function(event){
	event.preventDefault();
	if (event.target.className === 'task-checkbox') {
		/*Берётся id задачи, внутри которой находится checkbox, с помощью регулярного выражения
    	этот id преобразуется в число (оно соответствует номеру задачи в БД)*/
		const checkBoxId = parseInt(event.target.parentElement.id.match(/\d+/));
		changeStatus(checkBoxId);
	}
	if (event.target.className === 'close') {
		const deleteTaskId = parseInt(event.target.parentElement.id.match(/\d+/));
		removeTask(deleteTaskId);
	}
});

/*Асинхронная функция, отправляющая запрос о добавлении новой задачи на сервер.
Получен положительный ответ => Вызов функции для работы с клиентской частью
Запрос не отработал => Вывод ошибки в консоль (для разработчика) + alert (для пользователя)*/
async function addTask(){ 
	try {
		if (!navigator.onLine) {
			throw new Error('Internet connection error. Check the connection and reload the page.');
		}

		//Проверка поля ввода и выпадающего списка на пустоту
		if ((inputBox.value === '') || (comboBox.value === 'select user')){
			throw new Error('Incorrect input: task and user must be entered');
		}

		//Заполнение необходимых полей в объекте, который будет добавлен в БД
		const newTask = {};
		const [todoData, usersData] = await Promise.all([fetchData(urlTodoData), fetchData(urlUsersData)]); 
		newTask.id = todoData.length + 1;
		let userInfo = usersData.find(item => item.name === comboBox.value); 
		newTask.userId = userInfo.id; 
		newTask.title = inputBox.value; 
		newTask.completed = false; 
	
		const response = await fetch(urlTodoData, { 
			method: 'POST', 
			headers: { 
				'Content-Type': 'application/json' 
			}, 
			body: JSON.stringify(newTask) 
		});

		const data = await response.json();
		console.log('New element added successfully', data);
		createItem(newTask.title, newTask.completed, newTask.id, 1);
	} 
	catch (error) {
		console.error(error);
		alert(`Adding element error. ${error.message}`);
	}
}

/*Асинхронная функция, отправляющая запрос об изменении статуса задачи с id=changeStatusId на сервер.
Получен положительный ответ => Вызов функции для работы с клиентской частью
Запрос не отработал => Вывод ошибки в консоль (для разработчика) + alert (для пользователя)*/
async function changeStatus(changeStatusId){
	try {
		if (!navigator.onLine) {
			throw new Error('Internet connection error. Check the connection and reload the page.');
		}

		const todoPromise = fetchData(urlTodoData);
		const todoData = await todoPromise;

		//Заполнение поля completed и формирование объекта, который будет добавлен в БД
		const changeTask = todoData.find(item => item.id === changeStatusId);
		let newStatus = !changeTask.completed;
		let newStatusObject = {"completed": newStatus};

		const response = await fetch(`${urlTodoData}/${changeStatusId}`, { 
			method: 'PATCH', 
			headers: { 
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(newStatusObject)
		});

		const data = await response.json();
		console.log('Task status changed successfully', data);
		changeCheckBox(changeStatusId, newStatus);
	} 
	catch(error){
		console.error(error);
		alert(`Change task status error. ${error.message}`);
	}
}

/*Асинхронная функция, отправляющая запрос об удалении задачи c removeTaskId на сервер.
Получен положительный ответ => Вызов функции для работы с клиентской частью
Запрос не отработал => Вывод ошибки в консоль (для разработчика) + alert (для пользователя)*/
async function removeTask(removeTaskId){
	try {
		if (!navigator.onLine) {
			throw new Error('Internet connection error. Check the connection and reload the page.');
		}

		const response = await fetch(`${urlTodoData}/${removeTaskId}`, { 
			method: 'DELETE', 
			headers: {
				'Content-Type': 'application/json'
			}
		});

		console.log('Task removed successfully');
		removeListItem(removeTaskId);
	}
	catch(error){
		console.error(error);
		alert(`Remove task error. ${error.message}`);
	}
}

//Функция для удаления задачи на клиентской части
function removeListItem(id){
	const deleteTask = document.querySelector(`#task${id}`);
	deleteTask.remove();
}

//Функция для изменения статуса задачи на клиентской части
function changeCheckBox(id, status){
	const changeTask = document.querySelector(`#task${id}`);
	changeTask.firstChild.checked = status;
}

/*Асинхронная функция, отправляющая запрос на получение данных с сервера.
Получен положительный ответ => Возврат полученных данных
Запрос не отработал => Вывод ошибки в консоль (для разработчика) + alert (для пользователя)*/
async function fetchData(url){
	try{
		const response = await fetch(url);
		if (!response.ok){
			throw new Error(`${response.status}`);
		}

		const data = await response.json();
		console.log('Data fetched successfully');
		return data;
	}
	catch(error){
		console.error(error);
		alert(`Fetch data error. ${error.message}`);
	}	
}

//Асинхронная функция для обновления страницы
async function updateWindow(){
	try{
		if (!navigator.onLine) {
			throw new Error('Internet connection error. Check the connection and reload the page.');
		}

		const [todoData, usersData] = await Promise.all([fetchData(urlTodoData), fetchData(urlUsersData)]); 
		
		usersData.forEach(item => {
			let optionTitle = item.name;
			fillComboBox(optionTitle);
		});

		todoData.forEach(item => { 
			let userInfo = usersData.find(user => user.id === item.userId);
			let itemString = `${item.title} by ${userInfo.name}`;
			let itemStatus = item.completed;
			let itemId = item.id;
			createItem(itemString, itemStatus, itemId);
		});

		console.log('Window updated successfully');
	}
	catch(error){
		console.error(error);
		alert(`Update window error. ${error.message}`);
	}
}

//Функция заполнения выпадающего списка именами юзеров из БД
function fillComboBox(userName){
	const userOption = document.createElement('option');
	userOption.innerHTML = userName;
	comboBox.appendChild(userOption);
}

//Функция создания задачи на клиентской части сайта
function createItem(string, status, id, newTask = 0){
	const listItem = document.createElement('li');
	listItem.classList.add('todo-item');
	listItem.id = `task${id}`;
	listContainer.appendChild(listItem);
	
	if (newTask === 1) {
		listContainer.insertBefore(listItem, listContainer.firstChild);
	}

	const checkBox = document.createElement('input');
	checkBox.type = `checkbox`;
	checkBox.checked = status;
	checkBox.name = 'checkbox';
	checkBox.classList.add('task-checkbox');
	listItem.appendChild(checkBox);

	const listText = document.createElement('p');
	listText.innerHTML = string;
	listItem.appendChild(listText);

	const deleteBtn = document.createElement('span');
	deleteBtn.classList.add('close');
	deleteBtn.innerHTML = '\u00d7';
	listItem.appendChild(deleteBtn);
}
