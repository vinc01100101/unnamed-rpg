module.exports = function SpritesConfig(
  spriteName,
  x,
  y,
  offsetX = 0,
  offsetY = 0
) {
  const conf = {
    F_Alchemist_walk_down: {
      src: "/images/characters/female/classes/ (8).png",
      srcX: 0, //starting X position from the source in pixel, ALWAYS START AT THE FIRST CELL EVEN THERE IS NO FRAME
      srcY: 76, //starting Y position from the source in pixel
      srcW: 46, //width of each frame in pixel
      srcH: 80, //height of each frame in pixel
      speed: 1, //speed of animation relative to the constructed 'fps', the lower the speed value, the faster the animation
      //count starts at 0------------
      frameCount: 8, //number of frames
      cellMaxWidth: 8, //maximum number of cells horizontally, when animation reached the cellWidth value, the animation move down the Y axis by 1 cell
      cellFirstLane: 8, //number of cells horizontally in starting lane position, not all sprites start animating at left-most cell
      //-----------------------------
      rX: 10, //render X position in the canvas
      rY: 10, //render Y position in the canvas
      rW: 45, //render width in the canvas
      rH: 80, //render height in the canvas

      //and finally..
      isAnimating: true //if not animating, set to false. for some cases like head that is not animating (static images)
    }
  };

  return conf[spriteName];
};

/*SAMPLE ANIMATION OBJECT
{
  src: '/path/',
  srcX: 0, //starting X position from the source in pixel
  srcY: 0, //starting Y position from the source in pixel
  srcW: 75, //width of each frame in pixel
  srcH: 75, //height of each frame in pixel
  speed: 1, //speed of animation relative to the constructed 'fps', the lower the speed value, the faster the animation
  frameCount: 10, //number of frames
  cellMaxWidth: 4, //maximum number of cells horizontally, count starts at 0, when animation reached the cellWidth value, the animation move down the Y axis by 1 cell
  cellFirstLane: 3, //number of cells horizontally in starting lane position, not all sprites start animating at left-most cell
  rX: 10, //render X position in the canvas
  rY: 10, //render Y position in the canvas
  rW: 100, //render width in the canvas
  rH: 80, //render height in the canvas
  
  //and finally..
  isAnimating: true, //if not animating, set to false. for some cases like head that is not animating (static images)
  
}
*/
