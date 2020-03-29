const React = require("react");

module.exports = function About(props) {
  return (
    <div>
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
