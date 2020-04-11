const React = require("react");
const AnimationEngine = require("./AnimationEngine");

const directions = ["f", "fl", "l", "bl", "b", "br", "r", "fr"];
let headIndex = 0;
let bodyIndex = 0;
let allIndex = 0;
module.exports = class AnimationTESTER extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const c = document.querySelector("#testerCanvas");
    this.animationEngine = new AnimationEngine(
      c,
      this.props.spriteSheetData,
      40
    );
    this.animationEngine.renderThese = [
      {
        type: "player", // types = player,npc
        body: "f_alchemist",
        bodyFacing: "f",
        act: "attack1",
        head: "f_head1",
      },
    ];

    this.animationEngine.initialize();
  }
  render() {
    return (
      <div id="testWindow">
        <canvas id="testerCanvas" width="250" height="250"></canvas>
        <div id="testControls">
          <select
            onChange={(e) => {
              this.animationEngine.renderThese[0].act = e.target.value;
            }}
          >
            <option value="idle">IDLE</option>
            <option value="walk">WALK</option>
            <option value="sit">SIT</option>
            <option value="pick">PICK</option>
            <option value="standby">STANDBY</option>
            <option value="attack1">ATTACK1</option>
            <option value="damaged">DAMAGED</option>
            <option value="dead">DEAD</option>
            <option value="attack2">ATTACK2(no weapon)</option>
            <option value="attack3">ATTACK3</option>
            <option value="cast">CAST</option>
          </select>

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
            ROTATE
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
                this.animationEngine.headFacing
              ]--;

              console.log(
                this.animationEngine.adjustHeadXY.y[
                  this.animationEngine.headFacing
                ]
              );
            }}
          >
            Head Up
          </button>
          <button
            onClick={() => {
              this.animationEngine.adjustHeadXY.x[
                this.animationEngine.headFacing
              ]--;

              console.log(
                this.animationEngine.adjustHeadXY.x[
                  this.animationEngine.headFacing
                ]
              );
            }}
          >
            Head Left
          </button>
          <button
            onClick={() => {
              this.animationEngine.adjustHeadXY.x[
                this.animationEngine.headFacing
              ]++;

              console.log(
                this.animationEngine.adjustHeadXY.x[
                  this.animationEngine.headFacing
                ]
              );
            }}
          >
            Head Right
          </button>
          <button
            onClick={() => {
              this.animationEngine.adjustHeadXY.y[
                this.animationEngine.headFacing
              ]++;

              console.log(
                this.animationEngine.adjustHeadXY.y[
                  this.animationEngine.headFacing
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
