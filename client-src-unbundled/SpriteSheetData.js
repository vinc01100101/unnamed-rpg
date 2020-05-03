//fTaekwonMaster attack3 deprecated //I FIXED IT NOW 4/28/2020
//fHighPriest attack1 deprecated
const head = require("./animation-variables/head/head");
const compressedSpritesYPos = require("./animation-variables/compressedSpritesYPos");

module.exports = function SpriteSheetData() {
    //.PNG SPRITESHEET PATHS
    this.paths = {
        shadow: "./assets/characters/shadow.png",
        selectCharacterFrame: "./assets/system/selectCharacterFrame.png",
        fClass: `./assets/characters/body/fClass.png`,
        fHead: `./assets/characters/head/fHead.png`,
    };

    //JOB CLASS SPRITES GENERATOR
    const data_body = {
        fSpecial1: {
            reversed: {
                acts: ["pick", "damaged", "dead", "cast"],
                dirs: ["f", "f", "f", "f"],
            },
        },
        fNovice: {
            reversed: {
                acts: ["pick"],
                dirs: ["f"],
            },
        },
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
        fCrusader: {
            reversed: {
                acts: ["attack2", "cast"],
                dirs: ["both", "both"],
            },
        },
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
        fArcBishop: { reversed: null },
        fAcolyte: { reversed: null },
        fPriest: { reversed: null },
        fSage: { reversed: { acts: ["pick"], dirs: ["f"] } },
        fHunter: { reversed: { acts: ["pick"], dirs: ["f"] } },
        fHighPriest: { reversed: null },
        fSura: { reversed: null },
        fDancer: { reversed: null },
        fGuillotineCross: { reversed: null },
        fBiochemist: {
            reversed: { acts: ["attack3", "attack1"], dirs: ["b", "b"] },
        },
        fWizard: { reversed: { acts: ["pick"], dirs: ["b"] } },
        fMage: { reversed: { acts: ["pick"], dirs: ["f"] } },
        fWanderer: { reversed: null },
        fWarlock: { reversed: null },
        fKnight: { reversed: { acts: ["pick"], dirs: ["f"] } },
        fMerchant: { reversed: { acts: ["pick"], dirs: ["b"] } },
        fRuneKnight: { reversed: null },
        fRogue: { reversed: null },
        fSoulLinker: { reversed: null },
        fSorcerer: { reversed: null },
        fSuperNovice: { reversed: { acts: ["pick"], dirs: ["f"] } },
        fSniper: { reversed: null },
        fStalker: { reversed: null },
        fAssassinCross: { reversed: null },
        fGeneticist: {
            reversed: { acts: ["attack3", "attack1"], dirs: ["b", "b"] },
        },
        fPaladin: {
            reversed: {
                acts: ["attack2", "cast"],
                dirs: ["both", "both"],
            },
        },
        fGypsy: { reversed: null },
        fScholar: { reversed: null },
        fHighWizard: { reversed: null },
        fMasterSmith: { reversed: null },
        fChampion: { reversed: null },
    };
    //JOB CLASS CONSTRUCTOR
    class object_body {
        constructor(jobClass, index) {
            this.data = require("./animation-variables/body/" + jobClass);
            this.reversed = data_body[jobClass].reversed;
            this.yPos = compressedSpritesYPos.fClass[index];
        }
    }
    //sort the class props
    const sortedClass = Object.keys(data_body).sort();
    //map em
    sortedClass.map((jobClass, i) => {
        //initialize object instance
        this[jobClass] = new object_body(jobClass, i);

        //add to paths
        //this.paths[jobClass] = `./assets/characters/body/${jobClass}.png`;
    });

    //HEAD SPRITES GENERATOR
    for (let i = 0; i <= 28; i++) {
        this["fHead" + i] = head["fHead" + i];
        this["fHead" + i].yPos = compressedSpritesYPos.fHead[i];
        // this.paths["fHead" + i] = `./assets/characters/head/${"fHead" + i}.png`;
    }
};
