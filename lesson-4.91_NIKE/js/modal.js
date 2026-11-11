import {
	currentSelectedSize,
	createCustomSizeSelectElement,
	orderableSizes,
} from "./sizes.js";

const modalTemplate = document.getElementById("modal");

if (modalTemplate) {
	document.body.appendChild(modalTemplate.content.cloneNode(true));

	const dialog = document.querySelector(".modal__dialog");
	const form = dialog.querySelector(".modal__form");
	const titleElement = dialog.querySelector(".modal__title");
	const formTypeInput = dialog.querySelector(".modal__form-input-form-type");
	const productSizeInput = dialog.querySelector(
		".modal__form-input-product-size",
	);
	const dynamicFields = dialog.querySelector(".modal__form-dynamic-fields");
	const closeButton = dialog.querySelector(".modal__close");
	const submitButton = form.querySelector(".modal__form-submit-btn");
	const statusMsg = dialog.querySelector(".status-msg");

	const telInput = dialog.querySelector(".modal__form-input-tel");

	telInput?.addEventListener("input", (e) => {
		const input = e.target;
		let numbers = input.value.replace(/\D/g, "");
		let formatted = "";

		if (!numbers) {
			input.value = "";
			return;
		}

		if (["7", "8", "9"].includes(numbers[0])) {
			if (numbers[0] === "9") numbers = "7" + numbers;
			formatted = "+7 ";
			if (numbers.length > 1) {
				formatted += "(" + numbers.substring(1, 4);
			}
			if (numbers.length >= 5) {
				formatted += ") " + numbers.substring(4, 7);
			}
			if (numbers.length >= 8) {
				formatted += "-" + numbers.substring(7, 9);
			}
			if (numbers.length >= 10) {
				formatted += "-" + numbers.substring(9, 11);
			}
		} else {
			formatted = "+" + numbers.substring(0, 15);
		}

		input.value = formatted;
	});

	// Функция полной очистки формы
	function resetModalState() {
		form.reset();
		dynamicFields.replaceChildren();
		if (statusMsg) {
			statusMsg.textContent = "";
			statusMsg.style.color = "";
		}
		if (submitButton) submitButton.disabled = false;
		document.body.classList.remove("page__body--no-scroll");
	}

	function closeModal() {
		dialog.close();
		resetModalState();
	}

	closeButton.addEventListener("click", closeModal);

	// Клик по подложке (backdrop)
	dialog.addEventListener("click", (e) => {
		if (e.target === dialog) {
			closeModal();
		}
	});

	// отслеживаем закрытие по клавише Escape
	dialog.addEventListener("close", () => {
		resetModalState();
	});

	function openDialogModal({
		title,
		formType,
		size = null,
		needSelect = false,
	}) {
		titleElement.textContent = title;
		formTypeInput.value = formType;
		dynamicFields.replaceChildren();

		if (needSelect) {
			productSizeInput.value = "";
			const selectElement = createCustomSizeSelectElement(orderableSizes);

			selectElement.addEventListener("sizeSelected", (e) => {
				productSizeInput.value = e.detail.size;

				const trigger = selectElement.querySelector(".custom-select__trigger");
				if (trigger) trigger.style.borderColor = "";
				if (statusMsg) statusMsg.textContent = "";
			});

			dynamicFields.appendChild(selectElement);
		} else {
			productSizeInput.value = size || currentSelectedSize || "";
		}

		document.body.classList.add("page__body--no-scroll"); // Блокируем скролл страницы
		dialog.showModal();
	}

	// 1. Кнопка "Купить в 1 клик"
	const buyButton = document.querySelector(".product__buy-button");
	buyButton?.addEventListener("click", () => {
		if (!currentSelectedSize) {
			alert("Пожалуйста, сначала выберите размер товара на странице!");
			return;
		}
		openDialogModal({
			title: `Купить в 1 клик (Размер ${currentSelectedSize})`,
			formType: "quick-buy",
			size: currentSelectedSize,
			needSelect: false,
		});
	});

	// 2. Кнопка "В корзину"
	const cartButton = document.querySelector(".product__cart-button");
	cartButton?.addEventListener("click", () => {
		if (!currentSelectedSize) {
			alert("Пожалуйста, сначала выберите размер товара на странице!");
			return;
		}
		openDialogModal({
			title: `Добавить в корзину (Размер ${currentSelectedSize})`,
			formType: "cart-add",
			size: currentSelectedSize,
			needSelect: false,
		});
	});

	// 3. Заказ отсутствующего размера
	const orderSizeLink = document.querySelector(".product__sizes-order-link");
	orderSizeLink?.addEventListener("click", () => {
		openDialogModal({
			title: "Заказать отсутствующий размер",
			formType: "order-size",
			needSelect: true,
		});
	});

	// Отправка формы
	form.addEventListener("submit", (e) => {
		e.preventDefault();

		// 1. Проверка honeypot (защита от ботов)
		const honeypot = form.querySelector(".modal__form-input-honeypot");
		if (honeypot && honeypot.value !== "") return;

		// 2. Проверка, выбран ли размер (если заказывают отсутствующий размер)
		if (!productSizeInput.value) {
			if (statusMsg) {
				statusMsg.textContent = "Пожалуйста, выберите нужный размер!";
				statusMsg.style.color = "#ff4d4d";
			}
			const trigger = dialog.querySelector(".custom-select__trigger");
			if (trigger) {
				trigger.style.borderColor = "#ff4d4d";
				trigger.focus();
			}
			return;
		}

		// Блокируем кнопку от повторных кликов
		if (submitButton) submitButton.disabled = true;

		const formData = new FormData(form);
		console.log("Данные отправлены:", Object.fromEntries(formData.entries()));

		if (statusMsg) {
			statusMsg.textContent = "Заявка успешно принята!";
			statusMsg.style.color = "#4BB543";
		}

		setTimeout(() => {
			closeModal();
		}, 1500);
	});
}
