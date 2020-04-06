module.exports = {
  paths: {
    //f_bodies
    "f_monk|walk_f": "/assets/characters/body/f_monk_walk_f.png",
    "f_monk|walk_fl": "/assets/characters/body/f_monk_walk_fl.png",
    "f_ninja|walk_f": "/assets/characters/body/f_ninja_walk_f.png",
    //f_heads
    "f_head0|": "/assets/characters/head/f_head0.png",
    // "f_head1|": "/assets/characters/head/f_head1_walk_f.png",
    //f_weapons
    //"f_shuriken|attack_fl": "/assets/characters/weapon/f_head1_walk_f.png",
  },
  //f_body
  f_monk: {
    walk_f: {
      count: 8,
      anchorHead: [
        { x: 0, y: -55 },
        { x: 0, y: -54 },
        { x: 0, y: -52 },
        { x: 0, y: -53 },
        { x: 0, y: -55 },
        { x: 0, y: -54 },
        { x: 0, y: -52 },
        { x: 0, y: -53 },
      ],
    },
    walk_fl: {
      count: 8,
      anchorHead: [
        { x: -5, y: -56 },
        { x: -5, y: -55 },
        { x: -5, y: -53 },
        { x: -5, y: -54 },
        { x: -5, y: -56 },
        { x: -5, y: -55 },
        { x: -5, y: -53 },
        { x: -5, y: -54 },
      ],
    },
  },
  f_ninja: {
    walk_f: {
      count: 8,
    },
  },
  //f_head
  f_head0: {
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
  },
  f_head1: null,
  //f_weapon
  f_shuriken: {
    attack_fl: {
      count: 7,
    },
  },
}; //module.exports }
