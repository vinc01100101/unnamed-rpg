const React = require("react");

const directions = ["f", "fl", "l", "bl", "b", "br", "r", "fr"];
let allIndex = 0,
  actionIndex = 0;

const classes = {
  fSpecial1: "GM_1 (F)",
  fNovice: "Novice (F)",
  fMonk: "Monk (F)",
  fNinja: "Ninja (F)",
  fAlchemist: "Alchemist (F)",
  fOboro: "Oboro (F)",
  fRebellion: "Rebellion (F)",
  fRoyalGuard: "RoyalGuard (F)",
  fGunslinger: "Gunslinger (F)",
  fSwordsman: "Swordsman (F)",
  fCrusader: "Crusader (F)",
  fTaekwonKid: "TaekwonKid (F)",
  fArcher: "Archer (F)",
  fThief: "Thief (F)",
  fRanger: "Ranger (F)",
  fLordKnight: "LordKnight (F)",
  fMechanic: "Mechanic (F)",
  fBlacksmith: "Blacksmith (F)",
  fTaekwonMaster: "TaekwonMaster (F)",
  fAssassin: "Assassin (F)",
  fShadowChaser: "ShadowChaser (F)",
  fArcBishop: "ArcBishop (F)",
  fAcolyte: "Acolyte (F)",
  fPriest: "Priest (F)",
  fSage: "Sage (F)",
  fHunter: "Hunter (F)",
  fHighPriest: "HighPriest (F)",
  fSura: "Sura (F)",
  fDancer: "Dancer (F)",
  fGuillotineCross: "GuillotineCross (F)",
  fBiochemist: "Biochemist (F)",
  fWizard: "Wizard (F)",
  fMage: "Mage (F)",
  fWanderer: "Wanderer (F)",
  fWarlock: "Warlock (F)",
  fKnight: "Knight (F)",
  fMerchant: "Merchant (F)",
  fRuneKnight: "RuneKnight (F)",
  fRogue: "Rogue (F)",
  fSoulLinker: "SoulLinker (F)",
  fSorcerer: "Sorcerer (F)",
  fSuperNovice: "SuperNovice (F)",
  fSniper: "Sniper (F)",
  fStalker: "Stalker (F)",
  fAssassinCross: "AssassinCross (F)",
  fGeneticist: "Geneticist (F)",
  fPaladin: "Paladin (F)",
  fGypsy: "Gypsy (F)",
  fScholar: "Scholar (F)",
  fHighWizard: "HighWizard (F)",
  fMasterSmith: "MasterSmith (F)",
  fChampion: "Champion (F)",
};

const actions = [
  "idle",
  "walk",
  "sit",
  "pick",
  "standby",
  "attack1",
  "damaged",
  "dead",
  "attack2",
  "attack3",
  "cast",
];

const heads = [
  "fHead0",
  "fHead1",
  "fHead2",
  "fHead3",
  "fHead4",
  "fHead5",
  "fHead6",
  "fHead7",
  "fHead8",
  "fHead9",
  "fHead10",
  "fHead11",
  "fHead12",
  "fHead13",
  "fHead14",
  "fHead15",
  "fHead16",
  "fHead17",
  "fHead18",
  "fHead19",
  "fHead20",
  "fHead21",
  "fHead22",
  "fHead23",
  "fHead24",
  "fHead25",
  "fHead26",
  "fHead27",
  "fHead28",
];

module.exports = class AnimationTESTER extends React.Component {
  constructor(props) {
    super(props);
    this._rotateLeft = this._rotateLeft.bind(this);
    this._rotateRight = this._rotateRight.bind(this);
    this._keyPressEvt = this._keyPressEvt.bind(this);
    this._selectOnChange = this._selectOnChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keypress", this._keyPressEvt);
  }
  componentWillUnmount() {
    console.log("WILL UNMOUNT");
    window.removeEventListener("keypress", this._keyPressEvt);
  }
  _keyPressEvt(e) {
    console.log(e.keyCode);
    e.preventDefault();
    switch (e.keyCode) {
      //a
      case 97:
        this._rotateLeft();
        break;
      //d
      case 100:
        this._rotateRight();
        break;
      //s
      case 115:
        actionIndex = actionIndex + 1 >= actions.length ? 0 : actionIndex + 1;
        document.querySelector("#actionSelect").value = actions[actionIndex];
        this._selectOnChange();
        break;
      //w
      case 119:
        actionIndex =
          actionIndex - 1 < 0 ? actions.length - 1 : actionIndex - 1;
        document.querySelector("#actionSelect").value = actions[actionIndex];
        this._selectOnChange();
        break;
      //b
      case 98:
        this.props.worker.postMessage({
          type: "test_print",
        });
        break;

      case 114:
        this.props.worker.postMessage({
          type: "test_head_up",
        });
        break;
      case 102:
        this.props.worker.postMessage({
          type: "test_head_down",
        });
        break;
      case 101:
        this.props.worker.postMessage({
          type: "test_show_ref_head",
        });
        break;
      case 99:
        this.props.worker.postMessage({
          type: "test_head_right",
        });
        break;
      case 122:
        this.props.worker.postMessage({
          type: "test_head_left",
        });
        break;
    }
  }
  _selectOnChange(e) {
    this.props.worker.postMessage({
      type: "test_act",
      act: document.querySelector("#actionSelect").value,
    });
  }
  _rotateLeft() {
    if (allIndex >= directions.length - 1) {
      allIndex = 0;
    } else {
      allIndex++;
    }
    this.props.worker.postMessage({
      type: "test_rotate",
      dir: directions[allIndex],
    });
  }
  _rotateRight() {
    if (allIndex <= 0) {
      allIndex = 7;
    } else {
      allIndex--;
    }
    this.props.worker.postMessage({
      type: "test_rotate_back",
      dir: directions[allIndex],
    });
  }
  render() {
    return (
      <div id="testWindow">
        {this.props.mainCanvas}
        <ul
          style={{
            position: "fixed",
            left: "0px",
            top: "0px",
            color: "white",
            backgroundColor: "black",
          }}
        >
          <li>W/S= Change Action</li>
          <li>A/D= Rotate Left/Right</li>
        </ul>
        <div id="testControls">
          <select id="actionSelect" onChange={this._selectOnChange}>
            {actions.map((x, i) => (
              <option key={i} value={x}>
                {x}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              this.props.worker.postMessage({
                type: "test_class",
                jobclass: e.target.value,
              });
            }}
          >
            {Object.keys(classes).map((prop, i) => (
              <option key={i} value={prop}>
                {classes[prop]}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              this.props.worker.postMessage({
                type: "test_head",
                head: e.target.value,
              });
            }}
          >
            {heads.map((x, i) => (
              <option key={i} value={x}>
                {x}
              </option>
            ))}
          </select>

          <button onClick={this._rotateLeft}>ROTATE LEFT</button>
          <button onClick={this._rotateRight}>ROTATE RIGHT</button>

          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_head_up",
              });
            }}
          >
            Head Up [r]
          </button>
          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_head_left",
              });
            }}
          >
            Head Left [z]
          </button>
          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_head_right",
              });
            }}
          >
            Head Right [c]
          </button>
          <button
            onClick={() => {
              this.props.worker.postMessage({
                type: "test_head_down",
              });
            }}
          >
            Head Down [f]
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
                type: "test_print_y",
              });
            }}
          >
            PRINT! [p]
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
