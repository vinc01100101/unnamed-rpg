const React = require("react");

module.exports = function SelectCharacter(props) {
  return (
    <div className="formContainer">
      <p>Select Character</p>
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
