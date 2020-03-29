const React = require("react");

module.exports = function Login(props) {
  //we use ajax here because io uses passport auth,
  //thus it will not recognize socket until it is authenticated.

  const __login = () => {
    const req = new XMLHttpRequest();
    req.open("POST", "/login", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        const json = JSON.parse(req.responseText);
        console.log(JSON.stringify(json));
      }
    };

    req.send(
      JSON.stringify({
        username: props.input.username,
        password: props.input.password
      })
    );
  };

  return (
    <div>
      <h3>Login</h3>
      {/* error-success message */}
      <p
        style={{
          color:
            (props.info.type == "error" && "red") ||
            (props.info.type == "success" && "green")
        }}
      >
        {props.info.message}
      </p>
      <input
        id="username"
        type="text"
        placeholder="username"
        onChange={props._updateInput}
        value={props.input.username}
      />
      <input
        id="password"
        type="password"
        placeholder="password"
        onChange={props._updateInput}
        value={props.input.password}
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
          props._toggleVisibility("About");
        }}
      >
        About
      </button>
    </div>
  );
};
