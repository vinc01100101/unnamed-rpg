const React = require("react");
const InfoMessage = require("./InfoMessage");

module.exports = function Register(props) {
  //we use ajax here because io uses passport auth,
  //thus it will not recognize socket until it is authenticated.

  const __register = () => {
    if (
      props.registerInput.regPassword != props.registerInput.regConfirmPassword
    ) {
      props._setStateCallback({
        info: {
          type: "error",
          message: "Passwords don't match",
        },
      });
    } else if (
      props.registerInput.regUsername == "" ||
      props.registerInput.regPassword == ""
    ) {
      props._setStateCallback({
        info: {
          type: "error",
          message: "Missing credentials.",
        },
      });
    } else {
      props._setStateCallback({
        popup: {
          loading: true,
        },
      });

      props.socket.emit(
        "register",
        {
          username: props.registerInput.regUsername,
          password: props.registerInput.regPassword,
        },
        (info) => {
          props._setStateCallback({
            info,
            registerInput: {
              regUsername: "",
              regPassword: "",
              regConfirmPassword: "",
            },
            popup: {
              loading: false,
            },
          });
        }
      );
    }
  };

  return (
    <div className="formContainer">
      <p>Register</p>
      {/* error-success message */}
      <InfoMessage info={props.info} />
      <p className="smallNote">
        Username must only contain
        <br />
        alphanumeric characters.
      </p>
      <input
        autoComplete="off"
        id="regUsername"
        type="text"
        placeholder="username"
        onChange={props._updateInput}
        value={props.registerInput.regUsername}
      />
      <input
        autoComplete="off"
        id="regPassword"
        type="password"
        placeholder="password"
        onChange={props._updateInput}
        value={props.registerInput.regPassword}
      />
      <input
        autoComplete="off"
        id="regConfirmPassword"
        type="password"
        placeholder="confirm password"
        onChange={props._updateInput}
        value={props.registerInput.regConfirmPassword}
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
