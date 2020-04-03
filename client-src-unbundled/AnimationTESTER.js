const React = require("react");
const SpritesConfig = require("./SpritesConfig");
const AnimationEngine = require("./AnimationEngine");

module.exports = class AnimationTESTER extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    console.log(this.props.assetManager);
    const c = document.querySelector("#testerCanvas");
    const animationEngine = new AnimationEngine(c, this.props.assetManager, 10);
    const obj = SpritesConfig("F_Alchemist_walk_down");
    const objectsToAnimate = {
      "9123asKJSHas": obj
    };

    animationEngine.renderThese = objectsToAnimate;

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
