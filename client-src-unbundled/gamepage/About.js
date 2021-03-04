const React = require("react");

module.exports = function About(props) {
  return (
    <div className="formContainer">
      <p>About</p>
      <p>
        We plan to re-work this entire game because the code is bloated and it
        is too much to refactor lol.
      </p>
      <br />
      --vince-r
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
