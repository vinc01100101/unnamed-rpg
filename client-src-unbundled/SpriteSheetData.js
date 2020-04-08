const fMonk = require("./animation-variables/fMonk");
module.exports = function SpriteSheetData() {
  this.paths = {
    f_monk: "./assets/characters/body/fMonk.png",
  };
  //MONK_____________________________________
  this.f_monk = {
    img: null,
    data: fMonk,
  };
  //NINJA_____________________________________
  this.f_ninja = {};
  //f_head
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
      x: { f: -1, fl: 3, l: 2, bl: -12, b: -12 },
      y: { f: -8, fl: -7, l: -8, bl: 8, b: 7 },
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
      x: { f: 0, fl: 3, l: 3, bl: -12, b: -11 },
      y: { f: -9, fl: -7, l: -7, bl: 8, b: 7 },
    },
  };

  //f_weapon
  this.f_shuriken = {
    attack_fl: {
      count: 7,
    },
  };
};
