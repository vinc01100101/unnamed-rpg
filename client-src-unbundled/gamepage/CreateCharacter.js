const React = require("react");

module.exports = class CreateCharacter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //show
      appearance: "face",

      //url
      gender: "male",
      male: {
        face: "",
        frontHair: "",
        rearHair: "",
        beard: "",
        ears: "",
        eyes: "",
        eyebrows: "",
        nose: "",
        mouth: "",
        facialMark: "",
        beastEars: "",
        tail: "",
        wing: "",
        clothing: "",
        cloak: "",
        accessoryA: "",
        accessoryB: "",
        glasses: ""
      },
      female: {
        face: "",
        frontHair: "",
        rearHair: "",
        ears: "",
        eyes: "",
        eyebrows: "",
        nose: "",
        mouth: "",
        facialMark: "",
        beastEars: "",
        tail: "",
        wing: "",
        clothing: "",
        cloak: "",
        accessoryA: "",
        accessoryB: "",
        glasses: ""
      }
    };

    this._appearanceOnChange = this._appearanceOnChange.bind(this);
  }

  _appearanceOnChange(e) {
    this.setState({
      appearance: e.target.value
    });
  }
  render() {
    return (
      <div className="formContainer">
        <h3>Create Character</h3>
        <div id="charCreateAssetsContainer">
          <div>
            <label htmlFor="male">Male</label>
            <input type="radio" name="gender" id="male" />
            <label htmlFor="female">Female</label>
            <input type="radio" name="gender" id="female" />
            <select size="18" onChange={this._appearanceOnChange}>
              <option value="face">Face</option>
              <option value="frontHair">Front Hair</option>
              <option value="rearHair">Rear Hair</option>
              {this.state.gender == "male" && (
                <option value="beard">Beard</option>
              )}
              <option value="ears">Ears</option>
              <option value="eyes">Eyes</option>
              <option value="eyebrows">Eyebrows</option>
              <option value="nose">Nose</option>
              <option value="mouth">Mouth</option>
              <option value="facialMark">Facial Mark</option>
              <option value="beastEars">Beast Ears</option>
              <option value="tail">Tail</option>
              <option value="wing">Wing</option>
              <option value="clothing">Clothing</option>
              <option value="cloak">Cloak</option>
              <option value="accessoryA">Accessory 1</option>
              <option value="accessoryB">Accessory 2</option>
              <option value="glasses">Glasses</option>
            </select>
          </div>
          <div>
            <div>
              <canvas></canvas>
              <canvas></canvas>
            </div>
            <div>
              {//fix this
              (this.state.gender == "male" &&
                this.state.appearance == "face" && <h4>Male Face</h4>) ||
                (this.state.appearance == "frontHair" && (
                  <h4>Male Front Hair</h4>
                ))}
            </div>
          </div>
        </div>
        <input type="text" placeholder="Character Name" />
        <button>Create!</button>
        <button
          onClick={() => {
            this.props._toggleVisibility("SelectCharacter");
          }}
        >
          Back
        </button>
      </div>
    );
  }
};
/*
Male--
Face
Front Hair
Rear Hair
Beard
Ears
Eyes
Eyebrows
Nose
Mouth
Facial Mark
Beast Ears
Tail
Wing
Clothing
Cloak
Accessory 1
Accessory 2
Glasses

Female-- same as male except no Beard
*/
