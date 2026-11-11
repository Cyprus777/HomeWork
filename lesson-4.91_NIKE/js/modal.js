import { currentSelectedSize, createCustomSizeSelectElement, orderableSizes } from "/js/sizes.js";

// ========================================================
// 15. ЛОГИКА ОТКРЫТИЯ ДИАЛОГОВЫХ ОКОН ДЛЯ ВАШИХ КНОПОК
// ========================================================

// 1. Находим шаблон модалки в HTML и вставляем dialog в body
const modalTemplate = document.getElementById("modal"); // Ищем элемент <template id="modal"> в DOM

if (modalTemplate) { // Если тег шаблона найден в разметке
	// Клонируем содержимое template в реальную страницу
	document.body.appendChild(modalTemplate.content.cloneNode(true)); // Клонируем разметку модалки и вставляем в <body>

	const dialog = document.querySelector(".modal__dialog"); // Находим вставленный тег <dialog>
	const form = dialog.querySelector(".modal__form"); // Находим форму внутри модального окна
	const titleElement = dialog.querySelector(".modal__title"); // Находим заголовок модального окна
	const formTypeInput = dialog.querySelector(".modal__form-input-form-type"); // Находим скрытое поле типа заявки
	const productSizeInput = dialog.querySelector(".modal__form-input-product-size"); // Находим скрытое поле размера
	const dynamicFields = dialog.querySelector(".modal__form-dynamic-fields"); // Находим блок для динамических полей
	const closeButton = dialog.querySelector(".modal__close"); // Находим кнопку закрытия (крестик)
	const statusMsg = dialog.querySelector(".status-msg"); // Находим блок системных сообщений статуса

	// Функция закрытия диалога
	function closeModal() { // Функция сворачивания модального окна
		dialog.close(); // Нативно закрываем тег <dialog>
		form.reset(); // Сбрасываем все введенные в форму данные
		dynamicFields.replaceChildren(); // Удаляем из формы кастомный селект, если он добавлялся
		if (statusMsg) statusMsg.textContent = ""; // Очищаем текст сообщения об успехе/ошибке
	} // Закрываем функцию closeModal

	// Закрытие по клику на крестик
	closeButton.addEventListener("click", closeModal); // При клике на крестик вызываем closeModal

	// Закрытие при клике по темному фону вокруг окна
	dialog.addEventListener("click", (e) => { // Слушаем клики по элементу dialog
		if (e.target === dialog) { // Если кликнули непосредственно по подложке (фону вокруг окна)
			closeModal(); // Закрываем модальное окно
		} // Завершаем проверку
	}); // Завершаем слушатель клика по фону

	// Универсальная функция открытия окна
	function openDialogModal({ title, formType, size = null, needSelect = false }) { // Функция конфигурации и показа модалки
		titleElement.textContent = title; // Задаем текст заголовка модалки
		formTypeInput.value = formType; // Записываем тип формы в скрытый инпут
		dynamicFields.replaceChildren(); // Очищаем блок динамических полей от прошлых элементов

		if (needSelect) { // Если для данного сценария требуется выбор размера
			// Если нажали "Заказать размер" — вставляем созданный ранее селект
			productSizeInput.value = ""; // Очищаем скрытый инпут фиксированного размера
			const selectElement = createCustomSizeSelectElement(orderableSizes); // Генерируем выпадающий список
			dynamicFields.appendChild(selectElement); // Вставляем селект в форму
		} else { // Если размер уже был выбран на странице
			// Если обычная покупка — сохраняем текущий выбранный размер
			productSizeInput.value = size || currentSelectedSize || ""; // Передаем размер в скрытый инпут
		} // Завершаем проверку needSelect

		dialog.showModal(); // Вызываем встроенный метод браузера для открытия модального окна
	} // Закрываем функцию openDialogModal

	// ----------------------------------------------------
	// 2. ВЕШАЕМ КЛИКИ НА ВАШИ 3 КНОПКИ:
	// ----------------------------------------------------

	// Кнопка 1: "Купить в 1 клик"
	const buyButton = document.querySelector(".product__buy-button"); // Находим кнопку "Купить в 1 клик" на странице
	buyButton?.addEventListener("click", () => { // Навешиваем слушатель клика (с безопасным оператором ?.)
		openDialogModal({ // Вызываем открытие модального окна с параметрами:
			title: `Купить в 1 клик (Размер ${currentSelectedSize})`, // Текст заголовка с текущим размером
			formType: "quick-buy", // Тип заявки для бэкенда
			size: currentSelectedSize, // Передаем активный размер обуви
			needSelect: false, // Выпадающий список не нужен
		}); // Завершаем параметры вызова
	}); // Завершаем обработчик кнопки "Купить в 1 клик"

	// Кнопка 2: "Иконка корзины"
	const cartButton = document.querySelector(".product__cart-button"); // Находим кнопку корзины возле покупки
	cartButton?.addEventListener("click", () => { // Навешиваем слушатель клика
		openDialogModal({ // Вызываем открытие модального окна с параметрами:
			title: `Добавить в корзину (Размер ${currentSelectedSize})`, // Заголовок с указанием размера
			formType: "cart-add", // Идентификатор операции добавления в корзину
			size: currentSelectedSize, // Передаем активный размер
			needSelect: false, // Выпадающий список не нужен
		}); // Завершаем параметры вызова
	}); // Завершаем обработчик кнопки корзины

	// Кнопка 3: "Заказать размер"
	const orderSizeLink = document.querySelector(".product__sizes-order-link"); // Находим кнопку "Заказать размер"
	orderSizeLink?.addEventListener("click", () => { // Навешиваем слушатель клика
		openDialogModal({ // Вызываем открытие модального окна с параметрами:
			title: "Заказать отсутствующий размер", // Устанавливаем заголовок формы
			formType: "order-size", // Идентификатор предзаказа отсутствующего размера
			needSelect: true, // Флаг: вставляем в форму кастомный выпадающий список
		}); // Завершаем параметры вызова
	}); // Завершаем обработчик кнопки заказа размера

	// Обработка отправки формы
	form.addEventListener("submit", (e) => { // Слушаем событие submit (отправка формы)
		e.preventDefault(); // Отменяем перезагрузку страницы браузером

		// Спам-ловушка (honeypot)
		const honeypot = form.querySelector(".modal__form-input-honeypot"); // Находим скрытое поле-ловушку для ботов
		if (honeypot && honeypot.value !== "") return; // Если поле заполнено (ботом) — прерываем отправку

		const formData = new FormData(form); // Собираем все данные формы в объект FormData
		console.log("Данные отправлены:", Object.fromEntries(formData.entries())); // Преобразуем в объект и выводим в консоль

		if (statusMsg) { // Если блок статуса существует
			statusMsg.textContent = "Заявка успешно принята!"; // Показываем пользователю текст об успехе
		} // Завершаем проверку

		setTimeout(() => { // Устанавливаем таймер задержки на 1.2 секунды
			closeModal(); // Закрываем модальное окно после показа сообщения
		}, 1200); // Время задержки в миллисекундах
	}); // Завершаем обработчик submit
} // Закрываем блок if (modalTemplate)