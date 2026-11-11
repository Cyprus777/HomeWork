// Получаем данные из БД
const shoeSizes = [ // Создаем массив с данными о размерах обуви
	{ // Открываем объект первого товара
		size: 38, // Задаем размер обуви
		price: 38000, // Задаем стоимость обуви
		inStock: true, // Указываем, что товар есть на складе
	}, // Закрываем объект первого товара
	{ // Открываем объект товара
		size: 40, // Размер 40
		price: 40000, // Цена 40 000
		inStock: true, // В наличии
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 41, // Размер 41
		price: 41000, // Цена 41 000
		inStock: true, // В наличии
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 42, // Размер 42
		price: 42000, // Цена 42 000
		inStock: true, // В наличии
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 44, // Размер 44
		price: 44000, // Цена 44 000
		inStock: true, // В наличии
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 45, // Размер 45
		price: 45000, // Цена 45 000
		inStock: true, // В наличии
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 36, // Размер 36
		price: 36000, // Цена 36 000
		inStock: false, // Отсутствует на складе (под заказ)
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 37, // Размер 37
		price: 37000, // Цена 37 000
		inStock: false, // Отсутствует на складе (под заказ)
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 43, // Размер 43
		price: 43000, // Цена 43 000
		inStock: false, // Отсутствует на складе (под заказ)
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 46, // Размер 46
		price: 46000, // Цена 46 000
		inStock: false, // Отсутствует на складе (под заказ)
	}, // Закрываем объект
	{ // Открываем объект товара
		size: 47, // Размер 47
		price: 48000, // Цена 48 000
		inStock: false, // Отсутствует на складе (под заказ)
	}, // Закрываем объект
]; // Завершаем массив товаров

//1. Предикат валидации одной сущности
function isValidShoe(shoe) { // Функция проверки корректности одного объекта обуви
	return ( // Возвращаем результат составной логической проверки
		typeof shoe === "object" && // Проверяем, что передан объект
		shoe !== null && // Исключаем null (так как typeof null тоже 'object')
		typeof shoe.size === "number" && // Проверяем, что размер является числом
		Number.isFinite(shoe.size) && // Проверяем, что размер не NaN и не Infinity
		shoe.size > 0 && // Проверяем, что размер больше нуля
		typeof shoe.price === "number" && // Проверяем, что цена — это число
		Number.isFinite(shoe.price) && // Проверяем, что цена конечное число
		shoe.price >= 0 && // Проверяем, что цена не отрицательная
		typeof shoe.inStock === "boolean" // Проверяем, что статус наличия булев (true/false)
	); // Завершаем условие
} // Закрываем функцию isValidShoe

//2. Валидация коллекции
function validateShoeSizes(shoeSizes) { // Функция проверки всего массива товаров
	if (!Array.isArray(shoeSizes) || shoeSizes.length === 0) { // Если не массив или массив пустой
		console.error("Ошибка: Ожидался непустой массив размеров обуви"); // Выводим ошибку в консоль
		return false; // Возвращаем неудачу проверки
	} // Завершаем условие

	const allValid = shoeSizes.every(isValidShoe); // Проверяем каждый элемент функцией isValidShoe

	if (!allValid) { // Если хотя бы один элемент не прошел валидацию
		console.error("Ошибка: Массив содержит некорректные данные о товарах"); // Выводим ошибку в консоль
		return false; // Возвращаем неудачу проверки
	} // Завершаем условие

	return true; // Возвращаем true, если все проверки пройдены
} // Закрываем функцию validateShoeSizes

//3. Функция подготовки данных специально для экрана (UI)
function prepareShoesForUI(shoeSizes) { // Функция сортировки и разделения данных
	//Если данные битые - отдаем пустые списки, чтобы экран не упал с ошибкой
	if (!validateShoeSizes(shoeSizes)) { // Если валидация массива провалилась
		return { inStock: [], orderable: [] }; // Возвращаем пустые списки
	} // Завершаем условие

	//Сортируем копию массива по возрастанию размера (от меньшего к большему)
	const sortedSizes = [...shoeSizes].sort( // Создаем копию массива и сортируем её
		(shoe1, shoe2) => shoe1.size - shoe2.size, // Сравниваем размеры двух пар для порядка по возрастанию
	); // Завершаем сортировку

	//Раскладываем по двум корзинам за один цикл
	const inStock = []; // Массив для размеров в наличии
	const orderable = []; // Массив для размеров под заказ

	for (const shoe of sortedSizes) { // Проходим циклом по всем отсортированным товарам
		if (shoe.inStock) { // Если товар в наличии
			inStock.push(shoe); // Добавляем его в массив inStock
		} else { // Если товара нет в наличии
			orderable.push(shoe); // Добавляем его в массив orderable
		} // Завершаем ветвление
	} // Завершаем цикл

	return { inStock, orderable }; // Возвращаем объект с двумя сформированными массивами
} // Закрываем функцию prepareShoesForUI

//4. Использование: получаем готовые массивы через деструкторизацию
export const { inStock: inStockSizes, orderable: orderableSizes } = // Извлекаем готовые списки с переименованием переменных
	prepareShoesForUI(shoeSizes); // Вызываем функцию подготовки данных

//5. Хелпер для поиска центрального размера
function getMiddleShoe(inStockSizes) { // Функция для нахождения товара в середине списка
	if (!Array.isArray(inStockSizes) || inStockSizes.length === 0) return null; // Если массив пуст — возвращаем null

	const middleIndex = Math.floor((inStockSizes.length - 1) / 2); // Вычисляем индекс среднего элемента
	return inStockSizes[middleIndex]; // Возвращаем элемент из середины массива
} // Закрываем функцию getMiddleShoe

//6. Хелпер для форматирования цены
function formatPrice(price) { // Функция приведения числа к денежному формату
	//Форматируем число: 38000 -> 38 000 ₽
	return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`; // Преобразуем число в строку с пробелом и знаком ₽
} // Закрываем функцию formatPrice

//7. Функция обновления цены на экране
function updatePriceUI(price) { // Функция вывода цены на веб-страницу
	const priceElement = document.querySelector(".product__price"); // Ищем текстовый блок с ценой в DOM

	if (priceElement && typeof price === "number") { // Если блок найден и цена валидная
		priceElement.textContent = formatPrice(price); // Записываем отформатированную цену в разметку
	} // Завершаем проверку
} // Закрываем функцию updatePriceUI

//8. Состояние: по умолчанию выбираем середину
const defaultShoe = getMiddleShoe(inStockSizes); // Получаем центральный размер в наличии
export let currentSelectedSize = defaultShoe?.size ?? null; // Сохраняем размер по умолчанию (или null, если списка нет)

//9. Сразу выводим стартовую цену активного элемента на экран
if (defaultShoe) { // Если средний товар определен
	updatePriceUI(defaultShoe.price); // Отображаем его стоимость в карточке товара
} // Завершаем условие

//10. Создаем элемент как объект, а не как текст
function createSizeButtonElement(shoe, isOrderable = false, isActive = false) { // Генератор HTML-кнопки размера
	const button = document.createElement("button"); // Создаем тег <button>

	//Добавляем классы
	button.classList.add("product__sizes-button"); // Добавляем базовый CSS-класс кнопки

	if (isActive) { // Если эта кнопка должна быть активной
		button.classList.add("product__sizes-button--is-active"); // Добавляем CSS-класс активного состояния
	} // Завершаем условие

	//Безопасно вставляем текст (XSS здесь невозможен физически)
	button.textContent = shoe.size; // Задаем текст внутри кнопки (номер размера)

	//Навешиваем атрибуты
	button.dataset.sizes = "button"; // Задаем data-атрибут data-sizes="button"
	button.dataset.size = shoe.size; // Сохраняем номер размера в data-size

	if (isOrderable) { // Если размер только под заказ
		button.disabled = true; // Делаем кнопку неактивной для клика
		button.title = `Размер ${shoe.size} доступен под заказ`; // Добавляем подсказку при наведении мыши
		button.setAttribute("aria-label", `Размер ${shoe.size} доступен под заказ`); // Задаем подпись для скринридеров
	} else { // Если размер есть в наличии
		button.dataset.price = shoe.price; // Сохраняем цену товара в data-price кнопки
		button.title = `Выбрать размер ${shoe.size}`; // Добавляем подсказку при наведении мыши
		button.setAttribute("aria-label", `Кнопка выбрать размер ${shoe.size}`); // Задаем подпись для скринридеров
	} // Завершаем ветвление

	return button; // Возвращаем готовую DOM-кнопку
} // Закрываем функцию createSizeButtonElement

//11. Создаем доступный кастомный выпадающий список
export function createCustomSizeSelectElement(orderableSizes) { // Функция сборки кастомного селекта
	const container = document.createElement("div"); // Создаем контейнер <div> для селекта
	container.classList.add("custom-select"); // Добавляем контейнеру класс .custom-select

	// Скрытый input для формы
	const hiddenInput = document.createElement("input"); // Создаем <input>
	hiddenInput.type = "hidden"; // Делаем его скрытым (type="hidden")
	hiddenInput.name = "product-size"; // Задаем имя поля для отправки формы
	hiddenInput.required = true; // Делаем поле обязательным для заполнения
	container.appendChild(hiddenInput); // Вставляем скрытый инпут в контейнер

	// Кнопка-триггер
	const trigger = document.createElement("button"); // Создаем кнопку для открытия списка
	trigger.type = "button"; // Указываем тип "button" (чтобы не отправляла форму)
	trigger.classList.add("custom-select__trigger"); // Добавляем кнопке класс .custom-select__trigger
	trigger.setAttribute("aria-haspopup", "listbox"); // Сообщаем скринридерам о выпадающем меню
	trigger.setAttribute("aria-expanded", "false"); // Указываем, что меню пока свернуто

	const valueSpan = document.createElement("span"); // Создаем <span> для вывода выбранного значения
	valueSpan.classList.add("custom-select__value"); // Добавляем класс значению
	valueSpan.textContent = "- Выберите нужный размер -"; // Устанавливаем текст по умолчанию (плейсхолдер)

	const arrow = document.createElement("span"); // Создаем <span> для стрелочки иконки
	arrow.classList.add("custom-select__arrow"); // Добавляем класс стрелочке
	arrow.setAttribute("aria-hidden", "true"); // Скрываем декоративную стрелочку от скринридеров
	arrow.textContent = "▼"; // Вставляем символ стрелочки вниз

	trigger.appendChild(valueSpan); // Помещаем текст значения внутрь кнопки
	trigger.appendChild(arrow); // Помещаем иконку стрелочки внутрь кнопки
	container.appendChild(trigger); // Вставляем кнопку-триггер в общий контейнер

	// Выпадающий список (ul)
	const list = document.createElement("ul"); // Создаем тег списка <ul>
	list.classList.add("custom-select__list"); // Задаем класс выпадающему списку
	list.setAttribute("role", "listbox"); // Задаем семантическую роль "listbox"
	list.hidden = true; // Скрываем выпадающий список по умолчанию
	container.appendChild(list); // Добавляем список <ul> в общий контейнер

	const optionElements = []; // Создаем массив для хранения элементов <li>

	orderableSizes.forEach((shoe) => { // Перебираем каждый доступный под заказ размер
		const li = document.createElement("li"); // Создаем пункт списка <li>
		li.classList.add("custom-select__option"); // Добавляем класс пункту опции
		li.setAttribute("role", "option"); // Задаем роль "option" для скринридеров
		li.setAttribute("aria-selected", "false"); // Указываем, что опция изначально не выбрана
		li.setAttribute("tabindex", "-1"); // Позволяем программно фокусировать данный <li>
		li.dataset.value = shoe.size; // Сохраняем значение размера в data-value
		li.textContent = `Размер ${shoe.size}`; // Задаем видимый текст опции

		list.appendChild(li); // Добавляем пункт в список <ul>
		optionElements.push(li); // Сохраняем ссылку на элемент в массив optionElements
	}); // Завершаем перебор элементов

	let currentFocusIndex = -1; // Переменная для хранения индекса пункта в фокусе (-1 — ничего не выбрано)

	// Перемещение фокуса и подсветки
	function updateFocus(newIndex) { // Вспомогательная функция для обновления фокуса на элементах
		currentFocusIndex = newIndex; // Запоминаем новый текущий индекс
		optionElements.forEach((opt, idx) => { // Перебираем все элементы опций
			const isCurrent = idx === currentFocusIndex; // Проверяем, совпадает ли индекс элемента с текущим
			opt.classList.toggle("is-focused", isCurrent); // Включаем/выключаем класс .is-focused
			if (isCurrent) { // Если элемент стал активным
				opt.scrollIntoView({ block: "nearest" }); // Прокручиваем список к нему, если он не виден
				opt.focus(); // Устанавливаем реальный фокус браузера на этот элемент
			} // Завершаем проверку
		}); // Завершаем перебор
	} // Закрываем функцию updateFocus

	function openSelect() { // Функция открытия списка
		container.classList.add("is-open"); // Добавляем контейнеру класс открытого состояния
		list.hidden = false; // Делаем список <ul> видимым
		trigger.setAttribute("aria-expanded", "true"); // Обновляем атрибут доступности на true

		// При открытии сразу подсвечиваем и фокусируем первый пункт
		const startIndex = currentFocusIndex >= 0 ? currentFocusIndex : 0; // Берем сохраненный или нулевой индекс
		if (optionElements.length > 0) { // Если в списке есть хотя бы один элемент
			updateFocus(startIndex); // Фокусируемся на стартовом пункте
		} // Завершаем условие
	} // Закрываем функцию openSelect

	function closeSelect() { // Функция закрытия списка
		container.classList.remove("is-open"); // Удаляем класс открытого состояния
		list.hidden = true; // Скрываем список <ul>
		trigger.setAttribute("aria-expanded", "false"); // Обновляем атрибут доступности на false
		currentFocusIndex = -1; // Сбрасываем индекс фокуса
		optionElements.forEach((opt) => opt.classList.remove("is-focused")); // Снимаем класс фокуса со всех опций
		trigger.focus(); // Возвращаем фокус ввода на кнопку-триггер
	} // Закрываем функцию closeSelect

	function selectOption(option) { // Функция выбора определенной опции
		if (!option) return; // Если опция не передана — выходим
		const size = option.dataset.value; // Получаем значение размера из data-value
		hiddenInput.value = size; // Записываем выбранный размер в скрытый инпут
		valueSpan.textContent = `Размер ${size}`; // Обновляем текст на кнопке-триггере

		optionElements.forEach((opt) => { // Перебираем все элементы списка
			opt.setAttribute("aria-selected", String(opt === option)); // Отмечаем выбранным только активный пункт
		}); // Завершаем перебор

		closeSelect(); // Закрываем выпадающий список
	} // Закрываем функцию selectOption

	// Клик мыши по кнопке
	trigger.addEventListener("click", (e) => { // Слушаем клик мыши по кнопке-триггеру
		e.preventDefault(); // Предотвращаем стандартное поведение кнопки
		trigger.focus(); // Фокусируемся на кнопке
		list.hidden ? openSelect() : closeSelect(); // Если список скрыт — открываем, иначе закрываем
	}); // Завершаем слушатель клика

	// Клик мыши по пункту
	list.addEventListener("click", ({ target }) => { // Слушаем клик внутри списка опций
		const option = target.closest(".custom-select__option"); // Находим кликнутый элемент опции
		if (option) selectOption(option); // Если клик был по опции — выбираем её
	}); // Завершаем слушатель клика

	// Клик вне селекта
	document.addEventListener("click", ({ target }) => { // Слушаем глобальный клик по всей странице
		if (!container.contains(target) && !list.hidden) { // Если кликнули мимо селекта и список открыт
			closeSelect(); // Закрываем выпадающий список
		} // Завершаем условие
	}); // Завершаем слушатель документа

	// ========================================================
	// НАВЕШИВАЕМ НА CONTAINER (ловит стрелки и с кнопки, и с пунктов)
	// ========================================================
	container.addEventListener("keydown", (e) => { // Слушаем нажатия клавиш на селекте
		// 1. Стрелка ВНИЗ
		if (e.key === "ArrowDown") { // Если нажата стрелка "Вниз"
			e.preventDefault(); // Блокируем прокрутку страницы браузером
			if (list.hidden) { // Если список сейчас закрыт
				openSelect(); // Открываем его
			} else { // Если список уже открыт
				const nextIndex = (currentFocusIndex + 1) % optionElements.length; // Вычисляем индекс следующего пункта по кругу
				updateFocus(nextIndex); // Переводим фокус на следующий пункт
			} // Завершаем ветвление
			return; // Прерываем выполнение обработчика
		} // Завершаем проверку ArrowDown

		// 2. Стрелка ВВЕРХ
		if (e.key === "ArrowUp") { // Если нажата стрелка "Вверх"
			e.preventDefault(); // Блокируем прокрутку страницы браузером
			if (list.hidden) { // Если список закрыт
				openSelect(); // Открываем его
			} else { // Если список открыт
				const prevIndex = // Вычисляем индекс предыдущего пункта
					currentFocusIndex <= 0 // Если стоим на первом или фокуса не было
						? optionElements.length - 1 // Перескакиваем в самый конец списка
						: currentFocusIndex - 1; // Иначе делаем шаг на один пункт назад
				updateFocus(prevIndex); // Переводим фокус на вычисленный пункт
			} // Завершаем ветвление
			return; // Прерываем выполнение обработчика
		} // Завершаем проверку ArrowUp

		// 3. Выбор размера (ENTER или ПРОБЕЛ)
		if (e.key === "Enter" || e.key === " ") { // Если нажат Enter или Пробел
			if (list.hidden) { // Если список закрыт
				e.preventDefault(); // Отменяем стандартное действие браузера
				openSelect(); // Раскрываем список
			} else if (currentFocusIndex >= 0 && currentFocusIndex < optionElements.length) { // Если пункт выбран
				e.preventDefault(); // Запрещаем отправку формы по клавише Enter
				selectOption(optionElements[currentFocusIndex]); // Применяем выбранный пункт
			} // Завершаем ветвление
			return; // Прерываем выполнение обработчика
		} // Завершаем проверку Enter / Space

		// 4. Закрытие списка (ESCAPE)
		if (e.key === "Escape" && !list.hidden) { // Если нажат Escape и список был раскрыт
			e.preventDefault(); // Отменяем стандартное поведение Escape
			e.stopPropagation(); // Не даем событию всплыть к <dialog>, чтобы не закрыть всё модальное окно
			closeSelect(); // Сворачиваем выпадающий список
			return; // Прерываем выполнение обработчика
		} // Завершаем проверку Escape

		// 5. Переход дальше по форме (TAB)
		if (e.key === "Tab" && !list.hidden) { // Если нажат Tab и список открыт
			closeSelect(); // Закрываем список при переходе на следующий элемент формы
		} // Завершаем проверку Tab
	}); // Завершаем слушатель клавиатуры

	return container; // Возвращаем собранный кастомный селект
} // Закрываем функцию createCustomSizeSelectElement

//12. Отрисовка в DOM (через append, а не innerHTML)
function renderShoeSizesUI(inStockSizes, orderableSizes) { // Функция вывода кнопок размеров на страницу
	const inStockContainer = document.querySelector(".in-stock-list"); // Находим блок для размеров в наличии
	const orderableContainer = document.querySelector(".orderable-list"); // Находим блок для размеров под заказ

	if (inStockContainer) { // Если контейнер товаров в наличии найден в DOM
		inStockContainer.replaceChildren(); // Очищаем контейнер от старого содержимого

		//Создаем фрагмент для быстрой и плавной вставки в DOM
		const fragment = document.createDocumentFragment(); // Создаем пустой DocumentFragment

		inStockSizes.forEach((shoe) => { // Перебираем товары в наличии
			//Кнопка получит класс активности, если совпадает с currentSelectedSize
			const isActive = shoe.size === currentSelectedSize; // Проверяем, выбран ли этот размер
			fragment.appendChild(createSizeButtonElement(shoe, false, isActive)); // Создаем кнопку и добавляем во фрагмент
		}); // Завершаем перебор

		inStockContainer.appendChild(fragment); // Вставляем весь фрагмент с кнопками в разметку за одну операцию
	} // Завершаем условие inStockContainer

	if (orderableContainer) { // Если контейнер товаров под заказ найден в DOM
		orderableContainer.replaceChildren(); // Очищаем контейнер под заказ

		const fragment = document.createDocumentFragment(); // Создаем DocumentFragment для второй группы кнопок

		orderableSizes.forEach((shoe) => { // Перебираем товары под заказ
			fragment.appendChild(createSizeButtonElement(shoe, true, false)); // Создаем неактивную кнопку и пушим во фрагмент
		}); // Завершаем перебор

		orderableContainer.appendChild(fragment); // Вставляем фрагмент кнопок под заказ на страницу
	} // Завершаем условие orderableContainer
} // Закрываем функцию renderShoeSizesUI

// 13. Запускаем отрисовку
renderShoeSizesUI(inStockSizes, orderableSizes); // Вызываем функцию первичного рендера кнопок размеров

//14. Обработка клика по кнопкам
const inStockContainer = document.querySelector(".in-stock-list"); // Находим контейнер кнопок размеров в наличии

inStockContainer?.addEventListener("click", ({ target }) => { // Слушаем клики внутри контейнера через делегирование
	const button = target.closest(".product__sizes-button"); // Определяем, был ли клик по кнопке размера

	//Игнорируем клики мимо или по заблокированным кнопкам
	if (!button || button.disabled) return; // Если кликнули не на кнопку или она неактивна — выходим

	const clickedSize = Number(button.dataset.size); // Получаем выбранный размер из data-size в виде числа
	const clickedPrice = Number(button.dataset.price); // Получаем цену из data-price в виде числа

	//Если кликнули по уже выбранному размеру - ничего не делаем
	if (clickedSize === currentSelectedSize) return; // Если размер уже активен — повторно ничего не делаем

	//Обновляем состояние
	currentSelectedSize = clickedSize; // Обновляем глобальную переменную выбранного размера

	//Переключаем активный класс на кнопках
	inStockContainer.querySelectorAll(".product__sizes-button").forEach((btn) => { // Перебираем все кнопки размеров
		btn.classList.remove("product__sizes-button--is-active"); // Снимаем активный CSS-класс
	}); // Завершаем перебор

	button.classList.add("product__sizes-button--is-active"); // Добавляем активный CSS-класс нажатой кнопке

	//Обновляем цену на экране
	updatePriceUI(clickedPrice); // Выводим обновленную стоимость обуви на страницу
}); // Закрываем слушатель клика по размерам