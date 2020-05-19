//fTaekwonMaster attack3 deprecated //I FIXED IT NOW 4/28/2020
//fHighPriest attack1 deprecated //fixed
const head = require("./animation-variables/head/head");
const compressedSpritesYPos = require("./animation-variables/compressedSpritesYPos");
const sortedClass = require("../server-modules/sortedClass").sortedClass;
const data_body = require("../server-modules/sortedClass").data_body;

module.exports = function SpriteSheetData() {
    //.PNG SPRITESHEET PATHS
    this.paths = {
        shadow: "./assets/characters/shadow.png",
        selectCharacterFrame: "./assets/system/selectCharacterFrame.png",
        fClass: `./assets/characters/body/fClass.png`,
        head: `./assets/characters/head/head.png`,
        maptiles1: `./assets/maps/maptiles1.png`,
    };

    //JOB CLASS CONSTRUCTOR
    class object_body {
        constructor(jobClass, index) {
            this.data = require("./animation-variables/body/" + jobClass);
            this.reversed = data_body[jobClass].reversed;
            this.yPos = compressedSpritesYPos.fClass[index];
        }
    }
    //map em
    sortedClass.map((jobClass, i) => {
        //initialize object instance
        this[jobClass] = new object_body(jobClass, i);

        //add to paths
        //this.paths[jobClass] = `./assets/characters/body/${jobClass}.png`;
    });

    //HEAD SPRITES GENERATOR
    for (let i = 0; i <= 28; i++) {
        this["head" + i] = head["head" + i];
        this["head" + i].yPos = compressedSpritesYPos.head[i];
        // this.paths["head" + i] = `./assets/characters/head/${"head" + i}.png`;
    }
};
