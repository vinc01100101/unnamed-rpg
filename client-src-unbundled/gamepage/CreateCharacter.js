const React = require("react");

module.exports = class CreateCharacter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="formContainer">
        <h3>Create Character</h3>
        <h4>Not yet implemented.</h4>
        {/* <input type="text" placeholder="Character Name" /> */}
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
