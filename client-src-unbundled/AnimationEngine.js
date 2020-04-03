module.exports = class AnimationEngine {
  constructor(canvas, assetManager, fps) {
    console.log(arguments.length);

    const ctx = canvas.getContext("2d");
    let animationTimer = null;
    this.renderThese = {};

    this.getCanvas = () => canvas;
    this.getFps = () => fps;

    const render = () => {
      const renderKeys = Object.keys(this.renderThese);

      if (renderKeys.length !== 0) {
        ctx.clearRect(0, 0, 250, 250);
        renderKeys.map(key => {
          const renderThis = this.renderThese[key];
          const img = assetManager.getAsset(renderThis.src);
          if (
            renderThis.frameCounter == undefined ||
            renderThis.frameCounter >=
              renderThis.cellMaxWidth -
                renderThis.cellFirstLane +
                renderThis.frameCount
          ) {
            renderThis.frameCounter =
              renderThis.cellMaxWidth - renderThis.cellFirstLane;
          }
          let multX, multY, addX, addY;

          multY = Math.floor(renderThis.frameCounter / renderThis.cellMaxWidth);
          multX = renderThis.frameCounter % renderThis.cellMaxWidth;

          addX = multX * renderThis.srcW;
          addY = multY * renderThis.srcH;
          ctx.drawImage(
            img,
            renderThis.srcX + addX,
            renderThis.srcY + addY,
            renderThis.srcW,
            renderThis.srcH,
            renderThis.rX,
            renderThis.rY,
            renderThis.rW,
            renderThis.rH
          );
          renderThis.frameCounter++;
        });
      }
    };

    this.initialize = () => {
      if (animationTimer != null) return;
      animationTimer = setInterval(() => {
        render();
      }, 1000 / fps);
    };
    this.terminate = () => {
      if (!animationTimer) return;
      clearInterval(animationTimer);
      animationTimer = null;
    };
  }
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
