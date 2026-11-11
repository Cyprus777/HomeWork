// Получаем данные из БД
const shoeSizes = [
	{
		size: 38,
		price: 38000,
		inStock: true,
	},
	{
		size: 40,
		price: 40000,
		inStock: true,
	},
	{
		size: 41,
		price: 41000,
		inStock: true,
	},
	{
		size: 42,
		price: 42000,
		inStock: true,
	},
	{
		size: 44,
		price: 44000,
		inStock: true,
	},
	{
		size: 45,
		price: 45000,
		inStock: true,
	},
	{
		size: 36,
		price: 36000,
		inStock: false,
	},
	{
		size: 37,
		price: 37000,
		inStock: false,
	},
	{
		size: 43,
		price: 43000,
		inStock: false,
	},
	{
		size: 46,
		price: 46000,
		inStock: false,
	},
	{
		size: 47,
		price: 48000,
		inStock: false,
	},
];

function isValidShoe(shoe) {
	return (
		typeof shoe === "object" &&
		shoe !== null &&
		typeof shoe.size === "number" &&
		Number.isFinite(shoe.size) &&
		shoe.size > 0 &&
		typeof shoe.price === "number" &&
		Number.isFinite(shoe.price) &&
		shoe.price >= 0 &&
		typeof shoe.inStock === "boolean"
	);
}

function validateShoeSizes(shoeSizes) {
	if (!Array.isArray(shoeSizes) || shoeSizes.length === 0) {
		console.error("Ошибка: Ожидался непустой массив размеров обуви");
		return false;
	}

	const allValid = shoeSizes.every(isValidShoe);

	if (!allValid) {
		console.error("Ошибка: Массив содержит некорректные данные о товарах");
		return false;
	}

	return true;
}

function prepareShoesForUI(shoeSizes) {
	if (!validateShoeSizes(shoeSizes)) {
		return { inStock: [], orderable: [] };
	}

	const sortedSizes = [...shoeSizes].sort(
		(shoe1, shoe2) => shoe1.size - shoe2.size,
	);

	const inStock = [];
	const orderable = [];

	for (const shoe of sortedSizes) {
		if (shoe.inStock) {
			inStock.push(shoe);
		} else {
			orderable.push(shoe);
		}
	}

	return { inStock, orderable };
}

export const { inStock: inStockSizes, orderable: orderableSizes } =
	prepareShoesForUI(shoeSizes);

function getMiddleShoe(inStockSizes) {
	if (!Array.isArray(inStockSizes) || inStockSizes.length === 0) return null;

	const middleIndex = Math.floor((inStockSizes.length - 1) / 2);
	return inStockSizes[middleIndex];
}

function formatPrice(price) {
	return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

function updatePriceUI(price) {
	const priceElement = document.querySelector(".product__price");

	if (priceElement && typeof price === "number") {
		priceElement.textContent = formatPrice(price);
	}
}

const defaultShoe = getMiddleShoe(inStockSizes);
export let currentSelectedSize = defaultShoe?.size ?? null;

if (defaultShoe) {
	updatePriceUI(defaultShoe.price);
}

function createSizeButtonElement(shoe, isOrderable = false, isActive = false) {
	const button = document.createElement("button");

	button.classList.add("product__sizes-button");

	if (isActive) {
		button.classList.add("product__sizes-button--is-active");
	}

	button.textContent = shoe.size;
	button.dataset.sizes = "button";
	button.dataset.size = shoe.size;

	if (isOrderable) {
		button.disabled = true;
		button.title = `Размер ${shoe.size} доступен под заказ`;
		button.setAttribute("aria-label", `Размер ${shoe.size} доступен под заказ`);
	} else {
		button.dataset.price = shoe.price;
		button.title = `Выбрать размер ${shoe.size}`;
		button.setAttribute("aria-label", `Кнопка выбрать размер ${shoe.size}`);
	}

	return button;
}

export function createCustomSizeSelectElement(orderableSizes) {
	const container = document.createElement("div");
	container.classList.add("custom-select");

	const trigger = document.createElement("button");
	trigger.type = "button";
	trigger.classList.add("custom-select__trigger");
	trigger.setAttribute("aria-haspopup", "listbox");
	trigger.setAttribute("aria-expanded", "false");

	const valueSpan = document.createElement("span");
	valueSpan.classList.add("custom-select__value");
	valueSpan.textContent = "- Выберите нужный размер -";

	const arrow = document.createElement("span");
	arrow.classList.add("custom-select__arrow");
	arrow.setAttribute("aria-hidden", "true");
	arrow.textContent = "▼";

	trigger.appendChild(valueSpan);
	trigger.appendChild(arrow);
	container.appendChild(trigger);

	const list = document.createElement("ul");
	list.classList.add("custom-select__list");
	list.setAttribute("role", "listbox");
	list.hidden = true;
	container.appendChild(list);

	const optionElements = [];

	orderableSizes.forEach((shoe) => {
		const li = document.createElement("li");
		li.classList.add("custom-select__option");
		li.setAttribute("role", "option");
		li.setAttribute("aria-selected", "false");
		li.setAttribute("tabindex", "-1");
		li.dataset.value = shoe.size;
		li.textContent = `Размер ${shoe.size}`;

		list.appendChild(li);
		optionElements.push(li);
	});

	let currentFocusIndex = -1;

	function updateFocus(newIndex) {
		currentFocusIndex = newIndex;
		optionElements.forEach((opt, idx) => {
			const isCurrent = idx === currentFocusIndex;
			opt.classList.toggle("is-focused", isCurrent);
			if (isCurrent) {
				opt.scrollIntoView({ block: "nearest" });
				opt.focus();
			}
		});
	}

	function openSelect() {
		container.classList.add("is-open");
		list.hidden = false;
		trigger.setAttribute("aria-expanded", "true");

		const startIndex = currentFocusIndex >= 0 ? currentFocusIndex : 0;
		if (optionElements.length > 0) {
			updateFocus(startIndex);
		}
	}

	function closeSelect() {
		container.classList.remove("is-open");
		list.hidden = true;
		trigger.setAttribute("aria-expanded", "false");
		currentFocusIndex = -1;
		optionElements.forEach((opt) => opt.classList.remove("is-focused"));
		trigger.focus();
	}


	function selectOption(option) {
		if (!option) return;
		const size = option.dataset.value;
		valueSpan.textContent = `Размер ${size}`;

		optionElements.forEach((opt) => {
			opt.setAttribute("aria-selected", String(opt === option));
		});

		container.dispatchEvent(
			new CustomEvent("sizeSelected", {
				bubbles: true,
				detail: { size: Number(size) },
			})
		);

		closeSelect();
	}

	trigger.addEventListener("click", (e) => {
		e.preventDefault();
		trigger.focus();
		list.hidden ? openSelect() : closeSelect();
	});

	list.addEventListener("click", ({ target }) => {
		const option = target.closest(".custom-select__option");
		if (option) selectOption(option);
	});

	document.addEventListener("click", ({ target }) => {
		if (!container.contains(target) && !list.hidden) {
			closeSelect();
		}
	});

	container.addEventListener("keydown", (e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (list.hidden) {
				openSelect();
			} else {
				const nextIndex = (currentFocusIndex + 1) % optionElements.length;
				updateFocus(nextIndex);
			}
			return;
		}

		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (list.hidden) {
				openSelect();
			} else {
				const prevIndex =
					currentFocusIndex <= 0
						? optionElements.length - 1
						: currentFocusIndex - 1;
				updateFocus(prevIndex);
			}
			return;
		}

		if (e.key === "Enter" || e.key === " ") {
			if (list.hidden) {
				e.preventDefault();
				openSelect();
			} else if (
				currentFocusIndex >= 0 &&
				currentFocusIndex < optionElements.length
			) {
				e.preventDefault();
				selectOption(optionElements[currentFocusIndex]);
			}
			return;
		}

		if (e.key === "Escape" && !list.hidden) {
			e.preventDefault();
			e.stopPropagation();
			closeSelect();
			return;
		}

		if (e.key === "Tab" && !list.hidden) {
			closeSelect();
		}
	});

	return container;
}

function renderShoeSizesUI(inStockSizes, orderableSizes) {
	const inStockContainer = document.querySelector(".in-stock-list");
	const orderableContainer = document.querySelector(".orderable-list");

	if (inStockContainer) {
		inStockContainer.replaceChildren();

		const fragment = document.createDocumentFragment();

		inStockSizes.forEach((shoe) => {
			const isActive = shoe.size === currentSelectedSize;
			fragment.appendChild(createSizeButtonElement(shoe, false, isActive));
		});

		inStockContainer.appendChild(fragment);
	}

	if (orderableContainer) {
		orderableContainer.replaceChildren();

		const fragment = document.createDocumentFragment();

		orderableSizes.forEach((shoe) => {
			fragment.appendChild(createSizeButtonElement(shoe, true, false));
		});

		orderableContainer.appendChild(fragment);
	}
}

renderShoeSizesUI(inStockSizes, orderableSizes);

const inStockContainer = document.querySelector(".in-stock-list");

inStockContainer?.addEventListener("click", ({ target }) => {
	const button = target.closest(".product__sizes-button");

	if (!button || button.disabled) return;

	const clickedSize = Number(button.dataset.size);
	const clickedPrice = Number(button.dataset.price);

	if (clickedSize === currentSelectedSize) return;

	currentSelectedSize = clickedSize;

	inStockContainer.querySelectorAll(".product__sizes-button").forEach((btn) => {
		btn.classList.remove("product__sizes-button--is-active");
	});

	button.classList.add("product__sizes-button--is-active");

	updatePriceUI(clickedPrice);
});
