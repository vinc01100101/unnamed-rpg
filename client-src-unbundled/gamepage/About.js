const React = require("react");

module.exports = function About(props) {
  return (
    <div className="formContainer">
      <h3>About</h3>
      <p>
        "Under intense development :p"
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
