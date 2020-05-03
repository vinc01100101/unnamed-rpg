const React = require("react");
const DATA_INDICES = require("../animation-variables/456indices");

module.exports = function SelectCharacter(props) {
  return (
    <div className="selectCharsMainWindow">
      <p>Select Character</p>
      <div id="selectCharsContainer">{props.mainCanvas}</div>

      {props.selectedCharData && (
        <div id="selectCharsDetails">
          <strong>{props.selectedCharData.name}</strong>
          <br />
          Lv: <strong>{props.selectedCharData.data.lv}</strong>
          <br />
          Class:{" "}
          <strong>
            {props.selectedCharData.data.class.match(/[A-Z][a-z]+/g).join(" ")}
          </strong>
          <br />
          Map: <strong>{props.selectedCharData.data.map}</strong>
          <br />
        </div>
      )}

      <div>
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
            props._setStateCallback({
              loading: true,
            });

            props.socket.emit("logout", () => {
              props._toggleVisibility("Login");
            });
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};
