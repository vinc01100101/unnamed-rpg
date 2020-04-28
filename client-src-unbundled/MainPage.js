const React = require("react");

const Login = require("./gamepage/Login");
const Register = require("./gamepage/Register");
const About = require("./gamepage/About");
const SelectCharacter = require("./gamepage/SelectCharacter");
const CreateCharacter = require("./gamepage/CreateCharacter");
const OG = require("./gamepage/OG");
const BgAnimate = require("./BgAnimate");
const PortraitScreen = require("./gamepage/PortraitScreen");

//animation
const AssetDownloader = require("./AssetDownloader");
const SpriteSheetData = require("./SpriteSheetData");
const DATA_INDICES = require("./animation-variables/456indices");
//for testing purpose only
const AnimationTESTER = require("./AnimationTESTER");

//from passport to TOTAL SOCKET IO!!!!!
const socket = io();

module.exports = () => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        //toggles
        show: "PortraitScreen",
        lastShow: "Login",
        //modal types
        loading: false,
        modal: false,
        modalJsx: null,
        //live input values
        loginInput: {
          username: "",
          password: "",
        },
        registerInput: {
          regUsername: "",
          regPassword: "",
          regConfirmPassword: "",
        },

        //error-success message
        info: {
          type: "",
          message: "",
        },

        //Bg Animation Object
        bgIsOn: true,

        //character selection
        selectedCharData: null,
      };
      this.bgAnimate = null;
      this._updateInput = this._updateInput.bind(this);
      this._toggleVisibility = this._toggleVisibility.bind(this);
      this._setStateCallback = this._setStateCallback.bind(this);
      this._functionComponentDidMount = this._functionComponentDidMount.bind(
        this
      );
      this._socketListeners = this._socketListeners.bind(this);
    }

    componentDidMount() {
      document.querySelector("#GamePageContainer").oncontextmenu = (event) => {
        event.preventDefault();
      };

      if (window.Worker) {
        console.log("Worker API supported");
        this.worker = new Worker("./animation-worker.js");
      } else {
        console.log("Worker API not supported");
      }

      this.bgAnimate = new BgAnimate();
      this.bgAnimate.initialize();
      this.bgAnimate.startTransition();

      let assetDownloader = new AssetDownloader();
      this.spriteSheetData = new SpriteSheetData();
      this.mainCanvas = <canvas id="mainCanvas" />;

      assetDownloader.downloadAll(
        this.spriteSheetData,
        this.worker,
        (err, info) => {
          if (err) console.log(err);
          if (info) console.log(info);
        }
      );

      if (document.querySelector("#isDesktop").textContent == "true") {
        console.log("DESKTOP");
        this.setState({
          show: "Login",
        });
      } else {
        //if not a desktop, redirect to fullscreen request
        document.onfullscreenchange = () => {
          if (
            !document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement
          ) {
            this.setState({
              lastShow: this.state.show,
              show: "PortraitScreen",
            });
          }
        };
      }
      //adjust font size on window resize
      window.onresize = function (event) {
        const gameContWidth = document.querySelector("#GamePageContainer")
          .offsetWidth;
        const inputs = document.querySelectorAll("input");
        const buttons = document.querySelectorAll("button");
        inputs.forEach((x) => {
          x.style.fontSize = gameContWidth * 0.02 + "px";
          // x.style.margin = gameContWidth * 0.02 + "px";
        });
        buttons.forEach((x) => {
          x.style.fontSize = gameContWidth * 0.02 + "px";
          // x.style.margin = gameContWidth * 0.02 + "px";
        });
      };

      //activate socket listeners once
      this._socketListeners();
    }
    componentDidUpdate(prevProps, prevState) {
      if (prevState.bgIsOn != this.state.bgIsOn) {
        this.state.bgIsOn
          ? this.bgAnimate.startTransition()
          : this.bgAnimate.endTransition();
      }

      if (prevState.show != this.state.show) {
        this._functionComponentDidMount(this.state.show);
      }
    }
    _socketListeners() {
      console.log("listening");
      //socket listeners
      socket.on("forceleave", (message) => {
        this.setState({
          modal: true,
          modalJsx: (
            <div>
              <h4>{message}</h4>
              <button
                onClick={() => {
                  this._toggleVisibility("Login");
                }}
              >
                Ok
              </button>
            </div>
          ),
        });
      });

      socket.on("newuser", (user) => {
        console.log("user " + user + " has connected");
      });
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
          this.setState({
            show: component,
            loginInput: {
              username: "",
              password: "",
            },
            registerInput: {
              regUsername: "",
              regPassword: "",
              regConfirmPassword: "",
            },
            info: {
              type: "",
              message: "",
            },
            loading: false,
            modal: false,
            modalJsx: null,
          });
        }
        if (counter >= 20) {
          clearInterval(faderTimer);
          fader.style.display = "none";
        }
      }, 25);
    }

    //MODIFIED FUNCTIONAL-COMPONENTS DID MOUNT
    _functionComponentDidMount(component) {
      //terminate worker's animation first
      this.worker.postMessage({
        type: "terminate",
      });
      let mainCanvas, offscreen;
      switch (component) {
        case "AnimationTESTER":
          mainCanvas = document.querySelector("#mainCanvas");
          mainCanvas.width = 250;
          mainCanvas.height = 250;
          console.log(mainCanvas);
          console.log(mainCanvas.transferControlToOffscreen);
          offscreen = mainCanvas.transferControlToOffscreen();

          this.worker.postMessage(
            {
              type: "animationInit",
              args: [
                offscreen,
                JSON.stringify(this.spriteSheetData),
                DATA_INDICES,
              ],
            },
            [offscreen]
          );
          this.worker.postMessage({
            type: "test",
          });
          console.log("WORKING");
          this.worker.postMessage({
            type: "renderThese",
            renderThese: [
              {
                type: "player", // types = player,npc
                body: "fMonk",
                bodyFacing: "f",
                act: "idle",
                head: "fHead0",
                fps: 10,
                coords: [125, 125],
              },
            ],
          });

          break;
        case "SelectCharacter":
          let renderThese = [];
          Object.keys(this.CHARACTERS).map((character, i) => {
            renderThese.push({
              body: this.CHARACTERS[character].class,
              head: this.CHARACTERS[character].head,
              coords: [i * 100 + 50, 120],
              type: "player", // types = player,npc
              bodyFacing: "fl",
              act: "sit",
              fps: 10,
              selectCharacterSelected: false,
            });
          });

          mainCanvas = document.querySelector("#mainCanvas");
          mainCanvas.width = renderThese.length * 100;
          mainCanvas.height = 160;

          let selectedIndexRef;

          const clickHandler = (e) => {
            const selectedIndexSet = Math.floor(e.offsetX / 100);

            if (selectedIndexSet != selectedIndexRef) {
              selectedIndexRef = selectedIndexSet;
              renderThese.map((c) => {
                c.act = "sit";
                c.bodyFacing = "fl";
                c.selectCharacterSelected = false;
              });

              renderThese[selectedIndexRef].act = "standby";
              renderThese[selectedIndexRef].bodyFacing = "fl";
              renderThese[selectedIndexRef].selectCharacterSelected = true;

              this.worker.postMessage({
                type: "renderThese",
                renderThese,
              });

              const selectedCharName = Object.keys(this.CHARACTERS)[
                selectedIndexRef
              ];
              this.setState({
                selectedCharData: {
                  name: selectedCharName,
                  data: this.CHARACTERS[selectedCharName],
                },
              });
            }
          };

          mainCanvas.addEventListener("click", clickHandler);

          offscreen = mainCanvas.transferControlToOffscreen();
          this.worker.postMessage(
            {
              type: "animationInit",
              args: [
                offscreen,
                JSON.stringify(this.spriteSheetData),
                DATA_INDICES,
              ],
            },
            [offscreen]
          );

          this.worker.postMessage({
            type: "renderThese",
            renderThese,
          });

          break;
      }
    }
    _updateInput(e) {
      const elem = e.target;
      if (elem.id == "regUsername" || elem.id == "username") {
        const reg = /^(\w?)+$/;
        if (!reg.test(elem.value)) return null;
      }
      let newInput =
        elem.id.indexOf("reg") == 0
          ? this.state.registerInput
          : this.state.loginInput;
      newInput[elem.id] = elem.value;
      this.setState(newInput);
    }

    render() {
      return (
        <div id="GamePageContainer">
          <img id="backgroundImg0" className="backgroundImg" />
          <img id="backgroundImg1" className="backgroundImg" />
          {this.state.show == "PortraitScreen" && (
            <PortraitScreen
              _setStateCallback={this._setStateCallback}
              lastShow={this.state.lastShow}
              info={this.state.info}
            />
          )}

          {this.state.show == "AnimationTESTER" && (
            <AnimationTESTER
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              info={this.state.info}
              worker={this.worker}
              mainCanvas={this.mainCanvas}
            />
          )}

          {this.state.show == "Login" && (
            <Login
              _updateInput={this._updateInput}
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              loginInput={this.state.loginInput}
              info={this.state.info}
              bgIsOn={this.state.bgIsOn}
              socket={socket}
              userCallBack={(characters) => {
                this.CHARACTERS = characters;
              }}
            />
          )}

          {this.state.show == "Register" && (
            <Register
              _updateInput={this._updateInput}
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              registerInput={this.state.registerInput}
              info={this.state.info}
              socket={socket}
            />
          )}

          {this.state.show == "SelectCharacter" && (
            <SelectCharacter
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              worker={this.worker}
              mainCanvas={this.mainCanvas}
              socket={socket}
              selectedCharData={this.state.selectedCharData}
            />
          )}
          {this.state.show == "CreateCharacter" && (
            <CreateCharacter
              _toggleVisibility={this._toggleVisibility}
              _setStateCallback={this._setStateCallback}
              socket={socket}
            />
          )}

          {this.state.show == "OG" && <OG />}

          {this.state.show == "About" && (
            <About _toggleVisibility={this._toggleVisibility} />
          )}

          {this.state.loading && (
            <div id="loading">
              <p>Processing, please wait..</p>
            </div>
          )}

          {this.state.modal && (
            <div id="modal-bg">
              <div id="modal-fg">{this.state.modalJsx}</div>
            </div>
          )}
          <div id="fader"></div>
        </div>
      );
    }
  };
};
