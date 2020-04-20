const root = document.querySelector("#root");

const React = require("react");
const ReactDOM = require("react-dom");

//React Components
const GamePage = require("./MainPage");
const MapMaker = require("./MapMaker");

let ToRender;
const page = document.querySelector("#page").textContent;

switch (page) {
	case "MainPage":
		ToRender = GamePage();
		break;
	case "MapMaker":
		ToRender = MapMaker();
		break;
}

ReactDOM.render(<ToRender />, root);
