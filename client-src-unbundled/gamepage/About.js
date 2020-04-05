const React = require("react");

module.exports = function About(props) {
  return (
    <div className="formContainer">
      <p>About</p>
      <p>
        This game is still under development.
        <br />
        Will you wait for the completion of this project?
        <br />
        <br />
        --vince-r
      </p>
      <div
        className="fb-like"
        data-href="https://vince-r-unnamed-rpg.glitch.me"
        data-width="20"
        data-layout="standard"
        data-action="like"
        data-size="small"
        data-share="true"
      ></div>
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
