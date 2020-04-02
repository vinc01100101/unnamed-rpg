const React = require("react");

const Login = require("./gamepage/Login");
const Register = require("./gamepage/Register");
const About = require("./gamepage/About");
const SelectServer = require("./gamepage/SelectServer");
const SelectCharacter = require("./gamepage/SelectCharacter");
const CreateCharacter = require("./gamepage/CreateCharacter");
const BgAnimate = require("./BgAnimate");

module.exports = () => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        //toggles
        show: "Login",
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
        },

        //Bg Animation Object
        bgAnimate: new BgAnimate(),
        bgIsOn: true,

        //users count
        usersCount: 0
      };

      this._updateInput = this._updateInput.bind(this);
      this._toggleVisibility = this._toggleVisibility.bind(this);
      this._setStateCallback = this._setStateCallback.bind(this);
    }

    componentDidMount() {
      this.state.bgAnimate.initialize();
      this.state.bgAnimate.startTransition();
    }
    componentDidUpdate(prevProps, prevState) {
      console.log("DID UPDATE");
      if (prevState.bgIsOn != this.state.bgIsOn) {
        console.log("SWITCHING.....");
        this.state.bgIsOn
          ? this.state.bgAnimate.startTransition()
          : this.state.bgAnimate.endTransition();
      }
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
          //clear inputs
          const newInput = this.state.input;
          for (const prop in newInput) {
            newInput[prop] = "";
          }

          this.setState({
            show: component,
            newInput,
            info: {
              type: "",
              message: ""
            },
            popup: {
              loading: false
            }
          });
        }
        if (counter >= 20) {
          clearInterval(faderTimer);
          fader.style.display = "none";
        }
      }, 25);
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
        <div id="GamePageContainer">
          <img id="backgroundImg0" className="backgroundImg" />
          <img id="backgroundImg1" className="backgroundImg" />
          {this.state.show == "Login" && (
            <Login
              _updateInput={this._updateInput}
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              input={this.state.input}
              info={this.state.info}
              bgIsOn={this.state.bgIsOn}
              // bgAnimate={this.state.bgAnimate}
            />
          )}

          {this.state.show == "Register" && (
            <Register
              _updateInput={this._updateInput}
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              input={this.state.input}
              info={this.state.info}
            />
          )}

          {this.state.show == "SelectServer" && (
            <SelectServer
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              info={this.state.info}
              usersCount={this.state.usersCount}
            />
          )}
          {this.state.show == "SelectCharacter" && (
            <SelectCharacter
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
            />
          )}
          {this.state.show == "CreateCharacter" && (
            <CreateCharacter
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
            />
          )}

          {this.state.show == "InGame" && <InGame />}

          {this.state.show == "About" && (
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
