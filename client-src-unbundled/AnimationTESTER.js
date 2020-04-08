const React = require("react");
const AnimationEngine = require("./AnimationEngine");

const directions = ["f", "fl", "l", "bl", "b", "br", "r", "fr"];
let headIndex = 0;
let bodyIndex = 0;
let allIndex = 0;
module.exports = class AnimationTESTER extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const c = document.querySelector("#testerCanvas");
    this.animationEngine = new AnimationEngine(
      c,
      this.props.spriteSheetData,
      10
    );
    this.animationEngine.renderThese = [
      {
        type: "player", // types = player,npc
        body: "f_monk",
        bodyFacing: "f",
        act: "sit",
        head: "f_head0",
        headAct: "plain", // headActs = plain,pick,damage,dead
        headFacing: "f",
      },
    ];

    this.animationEngine.initialize();
  }
  render() {
    return (
      <div className="formContainer">
        <canvas id="testerCanvas" width="250" height="250"></canvas>
        <div id="testControls">
          <button
            onClick={() => {
              if (headIndex >= directions.length - 1) {
                headIndex = 0;
              } else {
                headIndex++;
              }
              this.animationEngine.renderThese[0].headFacing =
                directions[headIndex];
            }}
          >
            Rotate head
          </button>
          <button
            onClick={() => {
              if (bodyIndex >= directions.length - 1) {
                bodyIndex = 0;
              } else {
                bodyIndex++;
              }

              this.animationEngine.renderThese[0].bodyFacing =
                directions[bodyIndex];
            }}
          >
            Rotate body
          </button>
          <button
            onClick={() => {
              if (allIndex >= directions.length - 1) {
                allIndex = 0;
              } else {
                allIndex++;
              }

              this.animationEngine.renderThese[0].bodyFacing =
                directions[allIndex];
              this.animationEngine.renderThese[0].headFacing =
                directions[allIndex];
            }}
          >
            ROTATE ALL
          </button>
          <button
            onClick={() => {
              if (allIndex <= 0) {
                allIndex = 7;
              } else {
                allIndex--;
              }

              this.animationEngine.renderThese[0].bodyFacing =
                directions[allIndex];
              this.animationEngine.renderThese[0].headFacing =
                directions[allIndex];
            }}
          >
            ROTATE BACK
          </button>

          <button
            onClick={() => {
              this.animationEngine.adjustHeadXY.y[
                this.animationEngine.isMirroredHeadFacing
              ]--;

              console.log(
                this.animationEngine.adjustHeadXY.y[
                  this.animationEngine.isMirroredHeadFacing
                ]
              );
            }}
          >
            Head Up
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "300px",
              height: "50px",
            }}
          >
            <button
              onClick={() => {
                this.animationEngine.adjustHeadXY.x[
                  this.animationEngine.isMirroredHeadFacing
                ]--;

                console.log(
                  this.animationEngine.adjustHeadXY.x[
                    this.animationEngine.isMirroredHeadFacing
                  ]
                );
              }}
            >
              Head Left
            </button>
            <button
              onClick={() => {
                this.animationEngine.adjustHeadXY.x[
                  this.animationEngine.isMirroredHeadFacing
                ]++;

                console.log(
                  this.animationEngine.adjustHeadXY.x[
                    this.animationEngine.isMirroredHeadFacing
                  ]
                );
              }}
            >
              Head Right
            </button>
          </div>
          <button
            onClick={() => {
              this.animationEngine.adjustHeadXY.y[
                this.animationEngine.isMirroredHeadFacing
              ]++;

              console.log(
                this.animationEngine.adjustHeadXY.y[
                  this.animationEngine.isMirroredHeadFacing
                ]
              );
            }}
          >
            Head Down
          </button>
          <button
            onClick={() => {
              this.animationEngine.terminate();
            }}
          >
            PAUSE
          </button>
          <button
            onClick={() => {
              this.animationEngine.initialize();
            }}
          >
            RESUME
          </button>
          <button
            onClick={() => {
              alert(JSON.stringify(this.animationEngine.adjustHeadXY));
            }}
          >
            PRINT!
          </button>

          <button
            onClick={() => {
              this.props._toggleVisibility("Login");
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }
};
