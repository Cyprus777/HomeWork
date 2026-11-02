"use strict";

const todoKeys = {
	id: "id",
	text: "text",
	is_completed: "is_completed",
};

const todos = [];

const errTodoNotFound = (todoId) => `Todo with id ${todoId} not found`;

const findTodoById = (todos, todoId) =>
	todos.find((todo) => todo[todoKeys.id] === todoId) ?? null;

const getNewTodoId = (todos) =>
	todos.reduce((maxId, todo) => Math.max(maxId, todo[todoKeys.id]), 0) + 1;

const createTodo = (todos, text) => {
	const newTodo = {
		[todoKeys.id]: getNewTodoId(todos),
		[todoKeys.text]: text,
		[todoKeys.is_completed]: false,
	};

	todos.push(newTodo);
	return newTodo;
};

const completedTodoById = (todos, todoId) => {
	const todo = findTodoById(todos, todoId);

	if (!todo) {
		console.error(errTodoNotFound(todoId));
		return null;
	}

	todo[todoKeys.is_completed] = !todo[todoKeys.is_completed];
	return todo;
};

const deleteTodoById = (todos, todoId) => {
	const todoIndex = todos.findIndex((todo) => todo[todoKeys.id] === todoId);

	if (todoIndex === -1) {
		console.error(errTodoNotFound(todoId));
		return todos;
	}

	todos.splice(todoIndex, 1);
	return todos;
};

const formElement = document.querySelector(".form");
const inputElement = document.querySelector(".input");
const todosElement = document.querySelector(".todos");

const createTodoElement = (todo) => {
	const todoElement = document.createElement("li");
	todoElement.classList.add("todo");
	todoElement.dataset.id = todo[todoKeys.id];
	todoElement.textContent = todo[todoKeys.text];

	const actionsElement = document.createElement("div");
	actionsElement.classList.add("todo-actions");

	const completeButton = document.createElement("button");
	completeButton.type = "button";
	completeButton.classList.add("button-complete", "button");
	completeButton.textContent = "✔";
	completeButton.setAttribute("aria-label", "Отметить задачу выполненной");

	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("button-delete", "button");
	deleteButton.textContent = "✖";
	deleteButton.setAttribute("aria-label", "Удалить задачу");

	actionsElement.append(completeButton, deleteButton);
	todoElement.append(actionsElement);

	if (todo[todoKeys.is_completed]) {
		todoElement.classList.add("completed");
	}

	return todoElement;
};

const handleCreateTodo = (todos, text) => {
	const todo = createTodo(todos, text);
	const todoElement = createTodoElement(todo);
	todosElement.prepend(todoElement);
};

formElement.addEventListener("submit", (e) => {
	e.preventDefault();

	const text = inputElement.value.trim();

	if (!text) {
		formElement.reset();
		inputElement.focus();
		return;
	}

	handleCreateTodo(todos, text);
	formElement.reset();
	inputElement.focus();
});

todosElement.addEventListener("click", ({ target }) => {
	const todo = target.closest(".todo");

	if (!todo) return;

	const todoId = Number(todo.dataset.id);

	if (target.matches(".button-complete")) {
		completedTodoById(todos, todoId);
		todo.classList.toggle("completed");
	}

	if (target.matches(".button-delete")) {
		deleteTodoById(todos, todoId);
		todo.remove();
	}
});