const React = require("react");
const InfoMessage = require("./InfoMessage");

module.exports = function SelectServer(props) {
  let serverSelected = "";
  serverListActive = e => {
    const lists = document.querySelectorAll(".serverList");
    for (const item of lists) {
      item.style.backgroundColor = "rgba(0,0,0,0)";
      item.style.color = "white";
    }
    const elem = e.target;
    elem.style.backgroundColor = "white";
    elem.style.color = "black";

    serverSelected = elem.id;
  };
  return (
    <div className="formContainer">
      <h3>Select Server</h3>
      <InfoMessage info={props.info} />
      <ul>
        <li className="serverList" id="odin" onClick={serverListActive}>
          Odin
        </li>
        <li className="serverList" id="loki" onClick={serverListActive}>
          Loki (Closed)
        </li>
      </ul>

      <button
        onClick={() => {
          switch (serverSelected) {
            case "loki":
              props._setStateCallback({
                info: {
                  type: "error",
                  message: "Loki is not yet open"
                }
              });
              break;

            case "odin":
              props._toggleVisibility("SelectCharacter");
              break;

            default:
              props._setStateCallback({
                info: {
                  type: "error",
                  message: "Please select a server"
                }
              });
          }
        }}
      >
        Enter
      </button>
      <button
        onClick={() => {
          props._setStateCallback({
            popup: {
              loading: true
            }
          });

          const req = new XMLHttpRequest();
          req.open("GET", "/logout", true);

          req.onreadystatechange = () => {
            if (req.readyState == 4 && req.status == 200) {
              props._toggleVisibility("Login");
            }
          };
          req.send();
        }}
      >
        Back
      </button>
    </div>
  );
};
