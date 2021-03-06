const React = require("react");
const InfoMessage = require("./InfoMessage");

module.exports = function Register(props) {
  const __register = () => {
    if (
      props.registerInput.regPassword != props.registerInput.regConfirmPassword
    ) {
      return props._setStateCallback({
        info: {
          type: "error",
          message: "Passwords don't match",
        },
      });
    }
    if (
      props.registerInput.regUsername == "" ||
      props.registerInput.regPassword == ""
    ) {
      return props._setStateCallback({
        info: {
          type: "error",
          message: "Missing credentials.",
        },
      });
    }
    props._setStateCallback({
      modalJsx: <p>Please wait..</p>,
      modal: true,
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
          modal: false,
        });
      }
    );
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
