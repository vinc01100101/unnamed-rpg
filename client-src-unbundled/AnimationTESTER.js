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
    const animationEngine = new AnimationEngine(c, spriteSheetData, 10);
    animationEngine.renderThese = [
      {
        spriteName: "f_monk",
        actName: "walk",
        actFacing: "f",
      },
    ];

    animationEngine.initialize();
  }
  render() {
    return (
      <div className="formContainer">
        <canvas id="testerCanvas" width="250" height="250"></canvas>

        <button
          onClick={() => {
            this.props._toggleVisibility("Login");
          }}
        >
          Back
        </button>
      </div>
    );
  }
};
