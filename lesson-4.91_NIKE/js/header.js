const header = document.querySelector(".header");

function updateHeaderShadow() {
	header.classList.toggle("header-fixed--box-shadow", window.scrollY > 0);
	console.log(1)
}

window.addEventListener("scroll", updateHeaderShadow);
