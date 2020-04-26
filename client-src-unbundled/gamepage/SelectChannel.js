const React = require("react");
const InfoMessage = require("./InfoMessage");

module.exports = function SelectChannel(props) {
  let channelSelected = "";

  props.socket.emit("channelscreen", (data) => {
    const lists = document.querySelectorAll(".channelList");
    for (const item of lists) {
      item.textContent = `${item.id} (${data[item.id]})`;
    }
  });
  channelListActive = (e) => {
    const lists = document.querySelectorAll(".channelList");
    for (const item of lists) {
      item.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }
    const elem = e.target;
    elem.style.backgroundColor = "white";

    channelSelected = elem.id;
  };
  return (
    <div className="formContainer">
      <p>Select Server</p>
      <InfoMessage info={props.info} />
      <ul>
        <li className="channelList" id="ch1" onClick={channelListActive}>
          channel 1
        </li>
        <li className="channelList" id="ch2" onClick={channelListActive}>
          channel 2
        </li>
      </ul>

      <button
        onClick={() => {
          if (channelSelected) {
            props.socket.emit("enterchannel", channelSelected, (info) => {
              if (info.type == "error") {
                props._setStateCallback({
                  info,
                });
              } else {
                props._toggleVisibility("SelectCharacter");
              }
            });
          } else {
            props._setStateCallback({
              info: {
                type: "error",
                message: "Please select a channel",
              },
            });
          }
        }}
      >
        Enter
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
  );
};
