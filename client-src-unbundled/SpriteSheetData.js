//TaekwonMaster attack3 deprecated

const head = require("./animation-variables/head/head");

module.exports = function SpriteSheetData() {
  //.PNG SPRITESHEET PATHS
  this.paths = {
    // f_head0: "./assets/characters/head/f_head0.png",
    // f_head1: "./assets/characters/head/f_head1.png",
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
    fTaekwonMaster: { reversed: null },
    fArcher: { reversed: { acts: ["pick"], dirs: ["f"] } },
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
  ];

  data_head.map((h) => {
    this[h] = head[h];
    this.paths[h] = `./assets/characters/head/${h}.png`;
  });

  //general sprites for head Pick Damage Dead animation
  const PDD = {};
};
