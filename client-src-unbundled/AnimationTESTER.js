const React = require("react");
const SpritesConfig = require("./SpritesConfig");
const AnimationEngine = require("./AnimationEngine");

module.exports = class AnimationTESTER extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // console.log(this.props.assetManager);
    // const c = document.querySelector("#testerCanvas");
    // const animationEngine = new AnimationEngine(c, this.props.assetManager, 10);
    // const obj = SpritesConfig("F_Alchemist_walk_down");
    // const objectsToAnimate = {
    //   "9123asKJSHas": obj
    // };
    // animationEngine.renderThese = objectsToAnimate;
    // animationEngine.initialize();

    const c = document.querySelector("#testerCanvas");
    const img = this.props.assetManager.getAsset(
      "/images/characters/male/classes/ (19).png"
    );
    ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let image = ctx.getImageData(0, 0, 250, 250);
    let imageData = image.data,
      length = imageData.length;
    let i = 0;
    for (i; i < length; i += 4) {
      if (
        imageData[i] == 178 &&
        imageData[i + 1] == 172 &&
        imageData[i + 2] == 152
      ) {
        imageData[i + 3] = 0;
      }
    }

    image.data = imageData;

    ctx.putImageData(image, 50, 80);
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
