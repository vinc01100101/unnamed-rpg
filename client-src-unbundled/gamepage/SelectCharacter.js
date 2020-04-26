const React = require("react");
const DATA_INDICES = require("../animation-variables/456indices");

module.exports = function SelectCharacter(props) {
  return (
    <div className="formContainer">
      <p>Select Character</p>
      <div id="selectCharsContainer">{props.mainCanvas}</div>

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
          props._toggleVisibility("SelectChannel");
        }}
      >
        Back
      </button>
    </div>
  );
};
