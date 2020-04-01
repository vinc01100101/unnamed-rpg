const React = require("react");
const InfoMessage = require("./InfoMessage");

module.exports = function Register(props) {
  //we use ajax here because io uses passport auth,
  //thus it will not recognize socket until it is authenticated.

  const __register = () => {
    if (props.input.regPassword != props.input.regConfirmPassword) {
      props._setStateCallback({
        info: {
          type: "error",
          message: "Passwords don't match"
        }
      });
    } else if (props.input.regUsername == "" || props.input.regPassword == "") {
      props._setStateCallback({
        info: {
          type: "error",
          message: "No blank entries allowed."
        }
      });
    } else {
      props._setStateCallback({
        popup: {
          loading: true
        }
      });
      const req = new XMLHttpRequest();
      req.open("POST", "/register", true);
      req.setRequestHeader("Content-Type", "application/json");
      req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
          const json = JSON.parse(req.responseText);
          props._setStateCallback({
            info: json,
            input: {
              regUsername: "",
              regPassword: "",
              regConfirmPassword: ""
            },
            popup: {
              loading: false
            }
          });
        } else {
          console.log(req.response);
        }
      };
      req.send(
        JSON.stringify({
          username: props.input.regUsername,
          password: props.input.regPassword
        })
      );
    }
  };

  return (
    <div className="formContainer">
      <h3>Register</h3>
      {/* error-success message */}
      <InfoMessage info={props.info} />
      <p>
        Username must only contain
        <br />
        alphanumeric characters.
      </p>
      <input
        id="regUsername"
        type="text"
        placeholder="username"
        onChange={props._updateInput}
        value={props.input.regUsername}
      />
      <input
        id="regPassword"
        type="password"
        placeholder="password"
        onChange={props._updateInput}
        value={props.input.regPassword}
      />
      <input
        id="regConfirmPassword"
        type="password"
        placeholder="confirm password"
        onChange={props._updateInput}
        value={props.input.regConfirmPassword}
      />
      <button onClick={__register}>Submit</button>
      <button
        onClick={() => {
          props._toggleVisibility("Login");
        }}
      >
        Back
      </button>
    </div>
  );
};
