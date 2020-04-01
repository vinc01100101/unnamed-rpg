const React = require("react");

module.exports = function SelectCharacter(props) {
  const socket = io();
  return (
    <div className="formContainer">
      <h3>Select Character</h3>
      <div id="gridChars">
        <canvas className="selectCharFrame"></canvas>
        <canvas className="selectCharFrame"></canvas>
        <canvas className="selectCharFrame"></canvas>
        <canvas className="selectCharFrame"></canvas>
      </div>

      <button>Enter</button>
      <button
        onClick={() => {
          props._toggleVisibility("CreateCharacter");
        }}
      >
        Create Character
      </button>
      <button
        onClick={() => {
          props._toggleVisibility("SelectServer");
        }}
      >
        Back
      </button>
    </div>
  );
};
