const React = require("react");

module.exports = function infoMessage(props) {
  return (
    <div
      style={{
        color:
          (props.info.type == "error" && "red") ||
          (props.info.type == "success" && "green"),
      }}
    >
      {props.info.message}
    </div>
  );
};
