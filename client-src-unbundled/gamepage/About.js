const React = require("react");

module.exports = function About(props) {
  return (
    <div className="formContainer">
      <h3>About</h3>
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
