const React = require("react");
const AnimationEngine = require("./AnimationEngine");
const DATA_INDICES = require("./animation-variables/456indices");

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

    if (!this.props.worker) {
      console.log(
        "Worker not found, rendering will be processed on the main thread"
      );
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
      //else if no worker found
    } else {
      console.log("Worker found, rendering on the worker thread");
      const offscreen = c.transferControlToOffscreen();
      this.props.worker.postMessage(
        {
          type: "animationInit",
          args: [
            offscreen,
            JSON.stringify(this.props.spriteSheetData),
            10,
            DATA_INDICES,
          ],
        },
        [offscreen]
      );
    }
  }
  render() {
    return (
      <div id="testWindow">
        <canvas id="testerCanvas" width="250" height="250"></canvas>
        <div id="testControls">
          <select
            onChange={(e) => {
              this.props.worker.postMessage({
                type: "test_act",
                act: e.target.value,
              });
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
              this.props.worker.postMessage({
                type: "test_rotate",
                dir: directions[allIndex],
              });
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
              this.props.worker.postMessage({
                type: "test_rotate_back",
                dir: directions[allIndex],
              });
            }}
          >
            ROTATE BACK
          </button>

          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_head_up",
              });
            }}
          >
            Head Up
          </button>
          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_head_left",
              });
            }}
          >
            Head Left
          </button>
          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_head_right",
              });
            }}
          >
            Head Right
          </button>
          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_head_down",
              });
            }}
          >
            Head Down
          </button>
          <button
            onClick={() => {
              {
                /*this.animationEngine.terminate();*/
              }
            }}
          >
            PAUSE
          </button>
          <button
            onClick={() => {
              {
                /*this.animationEngine.initialize();*/
              }
            }}
          >
            RESUME
          </button>
          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_print",
              });
            }}
          >
            PRINT!
          </button>

          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "terminate",
              });
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
