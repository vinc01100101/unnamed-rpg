const ninjaAnchorHead = require("./animation-variables/ninjaAnchorHead"),
  monkAnchorHead = require("./animation-variables/monkAnchorHead");

module.exports = function SpriteSheetData() {
  this.paths = {
    //f_bodies

    // "f_monk|idle_f": "/assets/characters/body/F_MONK/f_monk_idle_f.png",
    // "f_monk|idle_fl": "/assets/characters/body/F_MONK/f_monk_idle_fl.png",
    // "f_monk|idle_l": "/assets/characters/body/F_MONK/f_monk_idle_l.png",
    // "f_monk|idle_bl": "/assets/characters/body/F_MONK/f_monk_idle_bl.png",
    // "f_monk|idle_b": "/assets/characters/body/F_MONK/f_monk_idle_b.png",

    "f_monk|walk_f": "/assets/characters/body/F_MONK/f_monk_walk_f.png",
    "f_monk|walk_fl": "/assets/characters/body/F_MONK/f_monk_walk_fl.png",
    "f_monk|walk_l": "/assets/characters/body/F_MONK/f_monk_walk_l.png",
    "f_monk|walk_bl": "/assets/characters/body/F_MONK/f_monk_walk_bl.png",
    "f_monk|walk_b": "/assets/characters/body/F_MONK/f_monk_walk_b.png",

    // "f_monk|sit_f": "/assets/characters/body/F_MONK/f_monk_sit_f.png",
    // "f_monk|sit_fl": "/assets/characters/body/F_MONK/f_monk_sit_fl.png",
    // "f_monk|sit_l": "/assets/characters/body/F_MONK/f_monk_sit_l.png",
    // "f_monk|sit_bl": "/assets/characters/body/F_MONK/f_monk_sit_bl.png",
    // "f_monk|sit_b": "/assets/characters/body/F_MONK/f_monk_sit_b.png",

    // "f_monk|pick_fl": "/assets/characters/body/F_MONK/f_monk_pick_fl.png",
    // "f_monk|pick_bl": "/assets/characters/body/F_MONK/f_monk_pick_bl.png",

    // "f_monk|standby_fl": "/assets/characters/body/F_MONK/f_monk_standby_fl.png",
    // "f_monk|standby_bl": "/assets/characters/body/F_MONK/f_monk_standby_bl.png",

    // "f_monk|attack1_fl": "/assets/characters/body/F_MONK/f_monk_attack1_fl.png",
    // "f_monk|attack1_bl": "/assets/characters/body/F_MONK/f_monk_attack1_bl.png",

    // "f_monk|attack2_fl": "/assets/characters/body/F_MONK/f_monk_attack2_fl.png",
    // "f_monk|attack2_bl": "/assets/characters/body/F_MONK/f_monk_attack2_bl.png",

    // "f_monk|attacknoweapon_fl":
    //   "/assets/characters/body/F_MONK/f_monk_attacknoweapon_fl.png",
    // "f_monk|attacknoweapon_bl":
    //   "/assets/characters/body/F_MONK/f_monk_attacknoweapon_bl.png",

    // "f_monk|damaged_fl": "/assets/characters/body/F_MONK/f_monk_damaged_fl.png",
    // "f_monk|damaged_bl": "/assets/characters/body/F_MONK/f_monk_damaged_bl.png",

    // "f_monk|freeze_fl": "/assets/characters/body/F_MONK/f_F_MONKreeze_fl.png",
    // "f_monk|freeze_bl": "/assets/characters/body/F_MONK/f_F_MONKreeze_bl.png",

    // "f_monk|dead_fl": "/assets/characters/body/F_MONK/f_monk_dead_fl.png",
    // "f_monk|dead_bl": "/assets/characters/body/F_MONK/f_monk_dead_bl.png",

    // "f_monk|cast_fl": "/assets/characters/body/F_MONK/f_monk_cast_fl.png",
    // "f_monk|cast_bl": "/assets/characters/body/F_MONK/f_monk_cast_bl.png",

    //NINJA__
    "f_ninja|walk_f": "/assets/characters/body/F_NINJA/f_ninja_walk_f.png",
    "f_ninja|walk_fl": "/assets/characters/body/F_NINJA/f_ninja_walk_fl.png",
    "f_ninja|walk_l": "/assets/characters/body/F_NINJA/f_ninja_walk_l.png",
    "f_ninja|walk_bl": "/assets/characters/body/F_NINJA/f_ninja_walk_bl.png",
    "f_ninja|walk_b": "/assets/characters/body/F_NINJA/f_ninja_walk_b.png",

    //f_heads
    "f_head0|": "/assets/characters/head/f_head0.png",
    "f_head1|": "/assets/characters/head/f_head1.png",
    // "f_head1|": "/assets/characters/head/f_head1_walk_f.png",
    //f_weapons
    //"f_shuriken|attack_fl": "/assets/characters/weapon/f_head1_walk_f.png",
  };
  //f_body
  //MONK_____________________________________
  this.f_monk = {
    //BODY ADJUST
    //lowest
    adjustXAxis: {
      f: -1,
      fl: -4,
      l: -7,
      bl: -2,
      b: 0,
    },
    //highest
    adjustYAxis: {
      f: -22,
      fl: -21,
      l: -22,
      bl: -20,
      b: -21,
    },
    anchorHead: monkAnchorHead,
  };
  //NINJA_____________________________________
  this.f_ninja = {
    //BODY ADJUST
    //lowest
    adjustXAxis: {
      f: -2,
      fl: -4,
      l: -3,
      bl: -4,
      b: -1,
    },
    //highest
    adjustYAxis: {
      f: -29,
      fl: -27,
      l: -31,
      bl: -27,
      b: -26,
    },
    anchorHead: ninjaAnchorHead,
  };
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
