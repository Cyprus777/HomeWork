function initBurgerMenu() {
	const burgerBtn = document.querySelector(".header__burger");
	const headerMenu = document.getElementById("header__menu");
	const body = document.querySelector(".page__body");

	if (!burgerBtn || !headerMenu) return;

	const menuLinks = headerMenu.querySelectorAll(".menu__link");

	const openMenu = () => {
		burgerBtn.classList.add("burger--open");
		headerMenu.classList.add("header__menu--open");
		body.classList.add("page__body--menu-open");

		burgerBtn.setAttribute("aria-expanded", "true");
		burgerBtn.setAttribute("aria-label", "Закрыть меню");
	};

	const closeMenu = () => {
		burgerBtn.classList.remove("burger--open");
		headerMenu.classList.remove("header__menu--open");
		body.classList.remove("page__body--menu-open");

		burgerBtn.setAttribute("aria-expanded", "false");
		burgerBtn.setAttribute("aria-label", "Открыть меню");
	};

	burgerBtn.addEventListener("click", (e) => {
		const isOpen = burgerBtn.classList.contains("burger--open");
		if (isOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	});

	headerMenu.addEventListener("click", ({ target }) => {
		const link = target.closest(".menu__link");

		if (link) {
			closeMenu();
		}
	});

	document.addEventListener("click", ({ target }) => {
		const isOpen = headerMenu.classList.contains("header__menu--open");
		if (isOpen && !headerMenu.contains(target) && !burgerBtn.contains(target)) {
			closeMenu();
		}
	});

	document.addEventListener("keydown", (e) => {
		if (
			e.key === "Escape" &&
			headerMenu.classList.contains("header__menu--open")
		) {
			closeMenu();
			burgerBtn.focus();
		}
	});

	const mediaQuery = window.matchMedia('min-width: 769px')
	const handleMediaChange = (e) => {
		if(e.matches) closeMenu()
	}
if(mediaQuery.addEventListener) {
	mediaQuery.addEventListener('change', handleMediaChange)
} else {
	mediaQuery.addListener(handleMediaChange)
}
}

document.addEventListener('DOMContentLoaded', initBurgerMenu)