"use strict";

const todoKeys = {
	id: "id",

	text: "text",

	is_completed: "is_completed",
};

const todos = [];

const errTodoNotFound = (todoId) => `Todo with id ${todoId} not found`;

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
	const todo = todos.find((todo) => todo[todoKeys.id] === todoId);

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

//Задание
// При помощи метода querySelector получаем элементы .form, .input и .todos
const form = document.querySelector(".form");
const input = document.querySelector(".input");
const todosList = document.querySelector(".todos");
// Создаем функцию createTodoElement(text), которая будет создавать todo в виде разметки
const createTodoElement = (text) => {
	const itemTodo = document.createElement("li");
	itemTodo.classList.add("todo");

	const taskTodo = document.createElement("div");
	taskTodo.textContent = text;

	const todoActions = document.createElement("div");
	todoActions.classList.add("todo-actions");

	const todoButtonComplete = document.createElement("button");
	todoButtonComplete.classList.add("button-complete", "button");
	todoButtonComplete.textContent = "\u2714";

	const todoButtonDelete = document.createElement("button");
	todoButtonDelete.classList.add("button-delete", "button");
	todoButtonDelete.textContent = "\u2716";

	todoActions.prepend(todoButtonComplete);
	todoActions.append(todoButtonDelete);

	itemTodo.prepend(taskTodo);
	itemTodo.append(todoActions);

	todosList.append(itemTodo);
};
// Создаем функцию handleCreateTodo(todos, text), которая будет вызывать createTodo и createTodoElement
const handleCreateTodo = (todos, text) => {
	createTodo(todos, text);
	createTodoElement(text);
};
