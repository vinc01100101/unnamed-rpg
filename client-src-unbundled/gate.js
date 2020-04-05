const root = document.querySelector("#root");

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

ReactDOM.render(<ToRender />, root);
