/* conditional modules/ dynamic imports */

const page = document.querySelector("#page").textContent;

(() => {
	switch (page) {
		case "MainPage":
			import("./MainPage.js");
			break;
		case "MapMaker":
			import("./MapMaker.js");
			break;
		default:
			import("./MainPage.js");
			break;
	}
})();
