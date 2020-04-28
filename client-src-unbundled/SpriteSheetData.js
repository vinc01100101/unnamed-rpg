//TaekwonMaster attack3 deprecated //I FIXED IT NOW 4/28/2020

const head = require("./animation-variables/head/head");

module.exports = function SpriteSheetData() {
  //.PNG SPRITESHEET PATHS
  this.paths = {
    shadow: "./assets/characters/shadow.png",
    selectCharacterFrame: "./assets/system/selectCharacterFrame.png",
  };

  //JOB CLASS SPRITES GENERATOR
  const data_body = {
    fMonk: {
      reversed: {
        acts: ["pick"],
        dirs: ["f"],
      },
    },
    fNinja: {
      reversed: null,
    },
    fAlchemist: {
      reversed: {
        acts: ["attack1", "attack3"],
        dirs: ["b", "b"],
      },
    },
    fOboro: {
      reversed: null,
    },
    fRebellion: { reversed: null },
    fRoyalGuard: { reversed: null },
    fGunslinger: { reversed: null },
    fSwordsman: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fCrusader: { reversed: null },
    fTaekwonKid: { reversed: null },
    fArcher: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fThief: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fRanger: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fLordKnight: {
      reversed: { acts: ["attack1", "attack3"], dirs: ["b", "b"] },
    },
    fMechanic: { reversed: null },
    fBlacksmith: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fTaekwonMaster: { reversed: null }, //<-----FIX THIS
    fAssassin: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fShadowChaser: { reversed: null },
  };
  //JOB CLASS CONSTRUCTOR
  class object_body {
    constructor(jobClass) {
      this.data = require("./animation-variables/body/" + jobClass);
      this.reversed = data_body[jobClass].reversed;
    }
  }

  Object.keys(data_body).map((jobClass) => {
    //initialize object instance
    this[jobClass] = new object_body(jobClass);

    //add to paths
    this.paths[jobClass] = `./assets/characters/body/${jobClass}.png`;
  });

  //HEAD SPRITES GENERATOR
  const data_head = [
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

  data_head.map((h) => {
    this[h] = head[h];
    this.paths[h] = `./assets/characters/head/${h}.png`;
  });
};
