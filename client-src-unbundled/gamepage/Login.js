const React = require("react");
const InfoMessage = require("./InfoMessage");

module.exports = function Login(props) {
  //we use ajax here because io uses passport auth,
  //thus it will not recognize socket until it is authenticated.

  const __login = () => {
    props._setStateCallback({
      popup: {
        loading: true
      }
    });

    const req = new XMLHttpRequest();
    req.open("POST", "/login", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        const json = JSON.parse(req.responseText);
        if (json.type == "error") {
          props._setStateCallback({
            info: json,
            popup: {
              loading: false
            }
          });
        } else if (json.type == "success") {
          props._toggleVisibility("SelectServer");
        }
        return;
      } else if (req.status != 200) {
        props._setStateCallback({
          popup: {
            loading: false,
            modal: false
          },
          info: {
            type: "error",
            message:
              req.status == 0
                ? "Please check your network connection"
                : "Connection failed"
          }
        });
        return;
      }
    };

    req.send(
      JSON.stringify({
        username: props.input.username,
        password: props.input.password
      })
    );
  };

  return (
    <div className="formContainer">
      <h3>Login</h3>
      {/* error-success message */}
      <InfoMessage info={props.info} />
      <input
        id="username"
        type="text"
        placeholder="username"
        onChange={props._updateInput}
        value={props.input.username}
      />
      <input
        id="password"
        type="password"
        placeholder="password"
        onChange={props._updateInput}
        value={props.input.password}
      />
      <button onClick={__login}>Login</button>
      <button
        onClick={() => {
          props._toggleVisibility("Register");
        }}
      >
        Register
      </button>
      <button
        onClick={() => {
          props._toggleVisibility("About");
        }}
      >
        About
      </button>
      <button
        onClick={() => {
          props._setStateCallback(currState => {
            return {
              bgIsOn: !currState.bgIsOn
            };
          });
        }}
      >
        Turn {props.bgIsOn ? "OFF" : "ON"} bg
      </button>
    </div>
  );
};
