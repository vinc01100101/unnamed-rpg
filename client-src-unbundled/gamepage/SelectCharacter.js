const React = require("react");

module.exports = function SelectCharacter(props) {
  return (
    <div className="selectCharsMainWindow">
      <p>Select Character</p>
      <div id="selectCharsContainer">
        <canvas id="mainCanvas" />
      </div>

      <div>
        <button
          onClick={() => {
            props._setStateCallback({
              modalJsx: <p>Please wait..</p>,
              modal: true,
            });

            const mapName = props.selectedCharData.data.map.split(".");
            props.socket.emit(
              "selectedcharacter",
              props.selectedCharData.name,
              (response) => {
                //bad case
                if (response.type == "error") {
                  return props._setStateCallback({
                    modalJsx: (
                      <div className="modal-inner">
                        <p>{response.message}</p>
                        <button
                          onClick={() => {
                            props._setStateCallback({
                              modalJsx: "",
                              modal: false,
                            });
                          }}
                        >
                          OK
                        </button>
                      </div>
                    ),
                  });
                }
                //success
                props._setStateCallback({ bgIsOn: false });
                props._toggleVisibility("OG");
              }
            );
          }}
        >
          Enter
        </button>
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

      {props.selectedCharData && (
        <div id="selectCharsDetails">
          <strong>{props.selectedCharData.name}</strong>
          <br />
          Lv: <strong>{props.selectedCharData.data.lv}</strong>
          <br />
          Class:{" "}
          <strong>
            {props.selectedCharData.data.body.match(/[A-Z][a-z]+/g).join(" ")}
          </strong>
          <br />
          Map:{" "}
          <strong>
            {props.selectedCharData.data.map.replace(/^.+?\./, "")}
          </strong>
          <br />
        </div>
      )}
    </div>
  );
};
