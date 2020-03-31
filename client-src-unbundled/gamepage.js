const React = require("react");

const Login = require("./gamepage/Login");
const Register = require("./gamepage/Register");
const About = require("./gamepage/About");
const SelectServer = require("./gamepage/SelectServer");

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
      const bgs = [
        document.querySelector("#backgroundImg0"),
        document.querySelector("#backgroundImg1"),
        document.querySelector(".backgroundImg")
      ];
      class BgConstructor {
        constructor(bg) {
          this.reset = () => {
            bg.style.transition = "none";
            bg.style.transform = "none";
          };
          this.fadeOut = () => {
            bg.style.opacity = 0;
          };
          this.setHorizontal = () => {
            const rand = Math.floor(Math.random() * 19);
            bg.style.top = "0px";
            bg.style.width = "200%";
            bg.style.height = "100%";
            bg.style.transitionProperty = "transform, opacity";
            bg.style.transitionDuration = "10s, 1s";
            bg.style.backgroundImage = `url(${window.location.href}img/${rand})`;
          };
          this.moveLeft = () => {
            bg.style.left = "0px";
            bg.style.transform = `translateX(-50%)`;
            bg.style.opacity = 1;
          };
        }
      }
      const bgObject = [new BgConstructor(bgs[0]), new BgConstructor(bgs[1])];

      const setBG = bgNum => {
        bgObject[bgNum].reset();
        setTimeout(() => {
          bgObject[bgNum].setHorizontal();
        }, 1000);
      };
      const switchBG = bgNum => {
        bgObject[bgNum].moveLeft();
        bgObject[1 - bgNum].fadeOut();
      };

      //TIMER
      let counter = 0,
        bgCounter = 0;
      const bgTimer = setInterval(() => {
        //set
        if (counter == 0) {
          setBG(bgCounter % 2);
        }
        //switch
        if (counter == 4) {
          switchBG(bgCounter % 2);
        }
        counter++;
        //reset
        if (counter == 11) {
          counter = 0;
          bgCounter++;
        }
      }, 1000);
    }
    _setStateCallback(toChange) {
      this.setState(toChange);
      // const clientEmitsListener = require("./gamepage/client-emits-listener");
      // const socket = io();
      // clientEmitsListener(socket);
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
          <div id="backgroundImg0" className="backgroundImg" />
          <div id="backgroundImg1" className="backgroundImg" />
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

          {this.state.show.SelectServer && (
            <SelectServer
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
            />
          )}

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
