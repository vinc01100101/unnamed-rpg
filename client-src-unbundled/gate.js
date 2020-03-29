const React = require("react");
const ReactDOM = require("react-dom");

//React Components
const GamePage = require("./gamepage");

let ToRender;
const page = document.querySelector("#page").textContent;

switch (page) {
  case "GamePage":
    ToRender = GamePage();
    break;
}
const root = document.querySelector("#root");
ReactDOM.render(<ToRender />, root);
