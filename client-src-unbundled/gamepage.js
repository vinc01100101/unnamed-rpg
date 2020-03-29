const React = require("react");
const clientEmitsListener = require("./client-emits-listener");

const Login = require("./gamepage/Login");
const Register = require("./gamepage/Register");
const About = require("./gamepage/About");

let socket;

module.exports = () => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        //toggles
        show: {
          Login: true,
          Register: false,
          SelectServer: false,
          InGame: false,
          About: false
        },

        //modal types
        popup: {
          loading: false,
          modal: false
        },

        //live input values
        input: {
          username: "",
          password: "",
          regUsername: "",
          regPassword: "",
          regConfirmPassword: ""
        },

        //error-success message
        info: {
          type: "",
          message: ""
        }
      };

      this._updateInput = this._updateInput.bind(this);
      this._toggleVisibility = this._toggleVisibility.bind(this);
      this._setStateCallback = this._setStateCallback.bind(this);
    }

    componentDidMount() {
      socket = io();
      clientEmitsListener(socket);
    }
    _setStateCallback(toChange) {
      this.setState(toChange);
    }
    _toggleVisibility(component) {
      const fader = document.querySelector("#fader");
      fader.style.display = "block";
      let counter = 0,
        reducer = 1,
        opaq = 0;
      const faderTimer = setInterval(() => {
        counter++;
        reducer = counter <= 10 ? 1 : -1;
        opaq += reducer * 0.1;

        fader.style.opacity = opaq;
        if (counter == 10) {
          //toggle vis
          const newVisibility = this.state.show;
          for (const props in newVisibility) {
            newVisibility[props] = false;
          }
          newVisibility[component] = true;

          //clear inputs
          const newInput = this.state.input;
          for (const prop in newInput) {
            newInput[prop] = "";
          }

          this.setState({
            newVisibility,
            newInput
          });
        }
        if (counter >= 20) {
          clearInterval(faderTimer);
          fader.style.display = "none";
        }
      }, 50);
    }
    _updateInput(e) {
      const elem = e.target;
      if (elem.id == "regUsername" || elem.id == "username") {
        const reg = /^(\w?)+$/;
        if (!reg.test(elem.value)) return null;
      }
      const newInput = this.state.input;
      newInput[elem.id] = elem.value;
      this.setState(newInput);
    }

    render() {
      return (
        <div>
          {this.state.show.Login && (
            <Login
              _updateInput={this._updateInput}
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              input={this.state.input}
              info={this.state.info}
            />
          )}

          {this.state.show.Register && (
            <Register
              _updateInput={this._updateInput}
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              input={this.state.input}
              info={this.state.info}
            />
          )}

          {this.state.show.SelectServer && <SelectServer />}

          {this.state.show.InGame && <InGame />}

          {this.state.show.About && (
            <About _toggleVisibility={this._toggleVisibility} />
          )}

          {this.state.popup.loading && (
            <div id="loading">
              <p>Processing, please wait..</p>
            </div>
          )}

          {this.state.popup.modal && (
            <div className="modal-bg">
              <div className="modal-fg"></div>
            </div>
          )}

          <div id="fader"></div>
        </div>
      );
    }
  };
};
