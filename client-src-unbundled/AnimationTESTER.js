const React = require("react");
const AnimationEngine = require("./AnimationEngine");
const spriteSheetData = require("./SpriteSheetData");

module.exports = class AnimationTESTER extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const c = document.querySelector("#testerCanvas");
    this.animationEngine = new AnimationEngine(c, spriteSheetData, 10);
    this.animationEngine.renderThese = [
      {
        type: "player", // types = player,npc
        body: "f_monk",
        bodyFacing: "fr",
        act: "walk",
        head: "f_head0",
        headAct: "plain", // headActs = plain,pick,damage,dead
        headFacing: "fr",
      },
    ];

    this.animationEngine.initialize();
  }
  render() {
    return (
      <div className="formContainer">
        <canvas id="testerCanvas" width="500" height="250"></canvas>
        <div id="testControls">
          <button
            onClick={() => {
              this.animationEngine.notEqualDir.x.f.fl--;
              console.log(this.animationEngine.notEqualDir.x.f.fl);
            }}
          >
            Adjust F FL
          </button>
          <button
            onClick={() => {
              this.animationEngine.renderThese = [
                {
                  type: "player", // types = player,npc
                  body: "f_ninja",
                  bodyFacing: "fl",
                  act: "walk",
                  head: "f_head0",
                  headAct: "plain", // headActs = plain,pick,damage,dead
                  headFacing: "fl",
                },
              ];
            }}
          >
            Change Class
          </button>
          <div>
            <button
              onClick={() => {
                this.animationEngine.renderThese[0].headFacing =
                  this.animationEngine.renderThese[0].headFacing == "fl"
                    ? "l"
                    : "fl";
              }}
            >
              Face Left
            </button>
            <button
              onClick={() => {
                this.animationEngine.renderThese[0].headFacing =
                  this.animationEngine.renderThese[0].headFacing == "fr"
                    ? "r"
                    : "fr";
              }}
            >
              Face Right
            </button>
            <button
              onClick={() => {
                this.animationEngine.renderThese = [
                  {
                    type: "player", // types = player,npc
                    body: "f_monk",
                    bodyFacing: "fl",
                    act: "walk",
                    head: "f_head0",
                    headAct: "plain", // headActs = plain,pick,damage,dead
                    headFacing: "fl",
                  },
                ];
              }}
            >
              Body Left
            </button>
            <button
              onClick={() => {
                this.animationEngine.renderThese = [
                  {
                    type: "player", // types = player,npc
                    body: "f_monk",
                    bodyFacing: "fr",
                    act: "walk",
                    head: "f_head0",
                    headAct: "plain", // headActs = plain,pick,damage,dead
                    headFacing: "fr",
                  },
                ];
              }}
            >
              Body Right
            </button>

            <button
              onClick={() => {
                this.animationEngine.renderThese = [
                  {
                    type: "player", // types = player,npc
                    body: "f_monk",
                    bodyFacing: "f",
                    act: "walk",
                    head: "f_head0",
                    headAct: "plain", // headActs = plain,pick,damage,dead
                    headFacing: "f",
                  },
                ];
              }}
            >
              Body Front
            </button>
          </div>
          <button
            onClick={() => {
              this.animationEngine.systemAdjustHeadSprY--;
              console.log(this.animationEngine.systemAdjustHeadSprY);
            }}
          >
            Adjust Y Head Down
          </button>
          <button
            onClick={() => {
              this.animationEngine.systemAdjustHeadSprY++;
              console.log(this.animationEngine.systemAdjustHeadSprY);
            }}
          >
            Adjust Y Head Up
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
