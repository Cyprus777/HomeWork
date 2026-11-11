import { currentSelectedSize, createCustomSizeSelectElement, orderableSizes } from "./sizes.js";

const modalTemplate = document.getElementById("modal");

if (modalTemplate) {

	document.body.appendChild(modalTemplate.content.cloneNode(true));

	const dialog = document.querySelector(".modal__dialog");
	const form = dialog.querySelector(".modal__form");
	const titleElement = dialog.querySelector(".modal__title");
	const formTypeInput = dialog.querySelector(".modal__form-input-form-type");
	const productSizeInput = dialog.querySelector(".modal__form-input-product-size");
	const dynamicFields = dialog.querySelector(".modal__form-dynamic-fields");
	const closeButton = dialog.querySelector(".modal__close");
	const statusMsg = dialog.querySelector(".status-msg");

	function closeModal() {
		dialog.close();
		form.reset();
		dynamicFields.replaceChildren();
		if (statusMsg) statusMsg.textContent = "";
	}

	closeButton.addEventListener("click", closeModal);

	dialog.addEventListener("click", (e) => {
		if (e.target === dialog) {
			closeModal();
		}
	});

	function openDialogModal({ title, formType, size = null, needSelect = false }) {
		titleElement.textContent = title;
		formTypeInput.value = formType;
		dynamicFields.replaceChildren();

		if (needSelect) {

			productSizeInput.value = "";
			const selectElement = createCustomSizeSelectElement(orderableSizes);
			dynamicFields.appendChild(selectElement);
		} else {
			productSizeInput.value = size || currentSelectedSize || "";
		} 

		dialog.showModal();
	}

	const buyButton = document.querySelector(".product__buy-button");
	buyButton?.addEventListener("click", () => {
		openDialogModal({
			title: `Купить в 1 клик (Размер ${currentSelectedSize})`,
			formType: "quick-buy",
			size: currentSelectedSize,
			needSelect: false,
		});
	});

	const cartButton = document.querySelector(".product__cart-button");
	cartButton?.addEventListener("click", () => {
		openDialogModal({
			title: `Добавить в корзину (Размер ${currentSelectedSize})`,
			formType: "cart-add",
			size: currentSelectedSize,
			needSelect: false,
		});
	});

	const orderSizeLink = document.querySelector(".product__sizes-order-link");
	orderSizeLink?.addEventListener("click", () => {
		openDialogModal({
			title: "Заказать отсутствующий размер",
			formType: "order-size",
			needSelect: true,
		});
	});

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		const honeypot = form.querySelector(".modal__form-input-honeypot");
		if (honeypot && honeypot.value !== "") return;

		const formData = new FormData(form);
		console.log("Данные отправлены:", Object.fromEntries(formData.entries()));

		if (statusMsg) {
			statusMsg.textContent = "Заявка успешно принята!";
		}

		setTimeout(() => {
			closeModal();
		}, 1200);
	});
}
