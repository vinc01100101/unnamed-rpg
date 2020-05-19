//-------disable reactdevtools on prod.
// if (
//   !window.__ALLOW_REACT_DEVTOOLS__ &&
//   window.__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
//   typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object"
// ) {
//   for (let [key, value] of Object.entries(
//     window.__REACT_DEVTOOLS_GLOBAL_HOOK__
//   )) {
//     window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] =
//       typeof value == "function" ? () => {} : null;
//   }
// }
// delete window.__ALLOW_REACT_DEVTOOLS__;
//-------------------------------------

const React = require("react");

//modules
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
const titleSpriteSheetData = require("./animation-variables/title/title.js");

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
        modal: false,
        modalJsx: null,
        //loading progress
        loadingPercent: 0,
        loadingDetails: "",
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
      this.BGSpritesheet = null;
      this._updateInput = this._updateInput.bind(this);
      this._toggleVisibility = this._toggleVisibility.bind(this);
      this._setStateCallback = this._setStateCallback.bind(this);
      this._functionComponentDidMount = this._functionComponentDidMount.bind(
        this
      );
      this._socketListeners = this._socketListeners.bind(this);
    }

    componentDidMount() {
      //activate initial loading progress
      this.setState({
        modalJsx: <p>Loading...</p>,
        modal: true,
      });

      document.querySelector("#GamePageContainer").oncontextmenu = (event) => {
        event.preventDefault();
      };

      if (window.Worker) {
        console.log("Worker API supported");
        this.worker = new Worker("./animation-worker.js");
      } else {
        console.log("Worker API not supported");
        return this.setState({
          modalJsx: (
            <div>
              <p>Sorry, our app cannot run on this browser.</p>
              err: [Worker API not supported]
            </div>
          ),
        });
      }

      //get the spritesheet
      this.bgAnimate = new BgAnimate();
      const blobPromise = () => {
        fetch("./assets/titles/titleImages.jpg")
          .then((response) => response.blob())
          .then((blob) => {
            return createImageBitmap(blob);
          })
          .then((imageBitmap) => {
            this.bgAnimate.initialize(imageBitmap, titleSpriteSheetData);
            this.bgAnimate.startTransition();
          });
      };

      blobPromise();

      let assetDownloader = new AssetDownloader();
      this.spriteSheetData = new SpriteSheetData();

      assetDownloader.downloadAll(
        this.spriteSheetData,
        this.worker,
        (prog, det) => {
          this.setState({
            loadingPercent: prog,
            loadingDetails: det,
          });
        },
        (err, info) => {
          if (err) console.log(err);
          if (info) {
            //done.. remove the loading screen
            this.setState({
              modal: false,
              modalJsx: null,
              loadingDetails: "",
              loadingPercent: 0,
            });
            console.log(info);
          }
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
        });
        buttons.forEach((x) => {
          x.style.fontSize = gameContWidth * 0.02 + "px";
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
            <div className="modal-inner">
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
      component != "OG" &&
        this.worker.postMessage({
          type: "terminate",
        });
      let mainCanvas, backgroundCanvas, offscreen, offscreenBackground;
      switch (component) {
        case "AnimationTESTER":
          mainCanvas = document.querySelector("#mainCanvas");
          mainCanvas.width = 250;
          mainCanvas.height = 250;
          offscreen = mainCanvas.transferControlToOffscreen();

          this.worker.postMessage(
            {
              type: "animationInit",
              args: [offscreen, this.spriteSheetData],
            },
            [offscreen]
          );
          this.worker.postMessage({
            type: "test",
          });
          this.worker.postMessage({
            type: "renderThese",
            renderThese: {
              test: {
                type: "player", // types = player,npc
                body: "fSpecial1",
                bodyFacing: "f",
                act: "idle",
                head: "head0",
                fps: 10,
                coords: [125, 125],
              },
            },
          });

          break;
        case "SelectCharacter":
          let renderThese = {};
          Object.keys(this.CHARACTERS).map((character, i) => {
            renderThese[character] = {
              body: this.CHARACTERS[character].body,
              head: this.CHARACTERS[character].head,
              coords: [i * 100 + 50, 120],
              type: "player", // types = player,npc
              bodyFacing: "fl",
              act: "sit",
              fps: 10,
              selectCharacterSelected: false,
            };
          });

          mainCanvas = document.querySelector("#mainCanvas");
          mainCanvas.width = Object.keys(renderThese).length * 100;
          mainCanvas.height = 160;

          let selectedIndexRef;

          const clickHandler = (e) => {
            const selectedIndexSet = Math.floor(e.offsetX / 100);

            if (selectedIndexSet != selectedIndexRef) {
              selectedIndexRef = selectedIndexSet;
              for (const [key, val] of Object.entries(renderThese)) {
                val.act = "sit";
                val.bodyFacing = "fl";
                val.selectCharacterSelected = false;
              }
              const keys = Object.keys(renderThese);
              renderThese[keys[selectedIndexRef]].act = "standby";
              renderThese[keys[selectedIndexRef]].bodyFacing = "fl";
              renderThese[
                keys[selectedIndexRef]
              ].selectCharacterSelected = true;

              this.worker.postMessage({
                type: "renderThese",
                renderThese,
              });
              //to get the name
              const [key, value] = Object.entries(this.CHARACTERS)[
                selectedIndexRef
              ];
              //then put into state
              this.setState({
                selectedCharData: {
                  name: key,
                  data: value,
                },
              });
            }
          };

          mainCanvas.addEventListener("click", clickHandler);

          offscreen = mainCanvas.transferControlToOffscreen();
          this.worker.postMessage(
            {
              type: "animationInit",
              args: [offscreen, this.spriteSheetData],
            },
            [offscreen]
          );

          this.worker.postMessage({
            type: "renderThese",
            renderThese,
          });

          break;

        // case "OG":

        //   break;
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
          <canvas
            id="backgroundImg0"
            className="backgroundImg"
            style={{
              display: this.state.bgIsOn ? "block" : "none",
            }}
          />
          <canvas
            id="backgroundImg1"
            className="backgroundImg"
            style={{
              display: this.state.bgIsOn ? "block" : "none",
            }}
          />
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

          {this.state.show == "OG" && (
            <OG
              socket={socket}
              worker={this.worker}
              selectedCharData={this.state.selectedCharData}
              spriteSheetData={this.spriteSheetData}
              userCallBack={(map) => {
                this.CHARACTERS.ACTIVEMAP = map;
              }}
            />
          )}

          {this.state.show == "About" && (
            <About _toggleVisibility={this._toggleVisibility} />
          )}

          {this.state.modal && (
            <div id="modal-bg">
              <div id="modal-fg">
                {this.state.modalJsx}
                <div
                  id="progressBar"
                  style={{
                    width: this.state.loadingPercent + "%",
                    backgroundColor: "green",
                    height: "10px",
                  }}
                />
                <span>{this.state.loadingDetails}</span>
              </div>
            </div>
          )}

          <div id="fader"></div>
        </div>
      );
    }
  };
};
