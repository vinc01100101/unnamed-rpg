const React = require("react");
const InfoMessage = require("./InfoMessage");

module.exports = function Login(props) {
  const __login = () => {
    if (!props.loginInput.username || !props.loginInput.password) {
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
      "login",
      {
        username: props.loginInput.username,
        password: props.loginInput.password,
      },
      (info) => {
        if (info.type == "error") {
          return props._setStateCallback({
            info,
            modal: false,
          });
        }

        //set the user variables in the main component
        props.userCallBack(info.message);

        props._toggleVisibility("SelectCharacter");
      }
    );
  };

  return (
    <div className="formContainer">
      <p>Login</p>
      {/* error-success message */}
      <InfoMessage info={props.info} />
      <input
        autoComplete="off"
        id="username"
        type="text"
        placeholder="username"
        onChange={props._updateInput}
        value={props.loginInput.username}
      />
      <input
        autoComplete="off"
        id="password"
        type="password"
        placeholder="password"
        onChange={props._updateInput}
        value={props.loginInput.password}
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
          window.location.href = "/mapmaker";
        }}
      >
        Map Maker
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
          props._setStateCallback((currState) => {
            return {
              bgIsOn: !currState.bgIsOn,
            };
          });
        }}
      >
        Turn {props.bgIsOn ? "OFF" : "ON"} bg (DEV)
      </button>
      <button
        onClick={() => {
          props._toggleVisibility("AnimationTESTER");
        }}
      >
        Animation Tester (DEV)
      </button>
      <button
        onClick={() => {
          window.location.href = "/spr";
        }}
      >
        Sprites Tool
      </button>
    </div>
  );
};
