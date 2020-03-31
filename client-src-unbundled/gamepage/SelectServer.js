const React = require("react");

module.exports = function SelectServer(props) {
  return (
    <div className="formContainer">
      <h3>Select Server</h3>
      <button
        onClick={() => {
          props._setStateCallback({
            popup: {
              loading: true
            }
          });

          const req = new XMLHttpRequest();
          req.open("GET", "/logout", true);

          req.onreadystatechange = () => {
            if (req.readyState == 4 && req.status == 200) {
              props._toggleVisibility("Login");
            }
          };
          req.send();
        }}
      >
        Back
      </button>
      <button
        onClick={() => {
          socket.emit("try emit", "HEYY");
        }}
      >
        Try Emit
      </button>
    </div>
  );
};
