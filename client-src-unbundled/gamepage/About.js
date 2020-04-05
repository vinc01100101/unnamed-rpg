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
        <div
          className="fb-like"
          data-href="https://vince-r-unnamed-rpg.glitch.me"
          data-width=""
          data-layout="standard"
          data-action="like"
          data-size="small"
          data-share="true"
          data-show-faces="true"
        ></div>
        <br />
        --vince-r
      </p>
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
