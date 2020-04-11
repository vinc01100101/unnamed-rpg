const fMonk = require("./animation-variables/fMonk");
const fNinja = require("./animation-variables/fNinja");
const fAlchemist = require("./animation-variables/fAlchemist");
module.exports = function SpriteSheetData() {
  this.paths = {
    f_monk: "./assets/characters/body/fMonk.png",
    f_ninja: "./assets/characters/body/fNinja.png",
    f_alchemist: "./assets/characters/body/fAlchemist.png",

    f_head0: "./assets/characters/head/f_head0.png",
    f_head1: "./assets/characters/head/f_head1.png",
  };
  //Body_____________________________________
  this.f_monk = {
    data: fMonk,
    reversed: {
      acts: ["pick"],
      dirs: ["f"],
    },
  };
  this.f_ninja = {
    data: fNinja,
  };
  this.f_alchemist = {
    data: fAlchemist,
    reversed: {
      acts: ["attack1", "attack3"],
      dirs: ["b", "b"],
    },
  };

  //Head_____________________________________
  this.f_head0 = {
    xPos: [
      0,
      27,
      55,
      82,
      108,
      135,
      165,
      192,
      222,
      241,
      269,
      299,
      327,
      357,
      386,
    ],
    widths: [27, 28, 27, 26, 27, 30, 27, 30, 19, 28, 30, 28, 30, 29, 25],
    heights: [31, 33, 32, 31, 32, 30, 31, 29, 26, 27, 27, 29, 28, 23, 25],
    anchorPoints: {
      normal: {
        x: { f: 0, fl: 4, l: 4, bl: -13, b: -11, br: 11, r: -4, fr: -5 },
        y: { f: -10, fl: -8, l: -9, bl: 7, b: 6, br: 7, r: -9, fr: -8 },
      },
      pick: {
        x: { fl: -2, bl: -2, br: 1, fr: 2 },
        y: { fl: 15, bl: 14, br: 14, fr: 14 },
      },
      damaged: {
        x: { fl: -13, bl: -7, br: 5, fr: 12 },
        y: { fl: 6, bl: 14, br: 13, fr: 6 },
      },
      dead: {
        x: { fl: -13, bl: -10, br: 11, fr: 13 },
        y: { fl: -2, bl: -3, br: -3, fr: -2 },
      },
    },
  };
  this.f_head1 = {
    xPos: [
      0,
      29,
      57,
      83,
      110,
      139,
      167,
      194,
      220,
      239,
      267,
      296,
      325,
      356,
      380,
    ],
    widths: [29, 28, 26, 27, 29, 28, 27, 26, 19, 28, 29, 29, 31, 24, 25],
    heights: [27, 27, 29, 31, 32, 27, 27, 27, 27, 27, 27, 31, 31, 22, 25],
    anchorPoints: {
      normal: {
        x: { f: 0, fl: 4, l: 4, bl: -13, b: -11, br: 11, r: -4, fr: -5 },
        y: { f: -10, fl: -8, l: -9, bl: 7, b: 6, br: 7, r: -9, fr: -8 },
      },
      pick: {
        x: { fl: -2, bl: -2, br: 1, fr: 2 },
        y: { fl: 15, bl: 14, br: 14, fr: 14 },
      },
      damaged: {
        x: { fl: -13, bl: -7, br: 5, fr: 12 },
        y: { fl: 6, bl: 14, br: 13, fr: 6 },
      },
      dead: {
        x: { fl: -13, bl: -10, br: 11, fr: 13 },
        y: { fl: -2, bl: -3, br: -3, fr: -2 },
      },
    },
  };

  //f_weapon
  this.f_shuriken = {
    attack_fl: {
      count: 7,
    },
  };
};
