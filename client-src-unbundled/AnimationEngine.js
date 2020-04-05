module.exports = class AnimationEngine {
  constructor(canvas, spriteSheetData, fps) {
    console.log(arguments.length);

    const ctx = canvas.getContext("2d");
    let animationTimer = null;

    this.getCanvas = () => canvas;
    this.getFps = () => fps;
    this.getSpriteSheetData = () => spriteSheetData;

    this.renderThese = [];
    this.initialize = () => {
      const ctx = canvas.getContext("2d");

      const render = () => {
        //clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.renderThese.map((renderTHIS) => {
          const spriteName = renderTHIS.spriteName;
          const actName = renderTHIS.actName;
          const actFacing = renderTHIS.actFacing;
          //sample: f_monk.act.stand.f
          const range = spriteSheetData[spriteName].act[actName][actFacing][0];
          const offsets =
            spriteSheetData[spriteName].act[actName][actFacing][1];
          //add or increment self counter
          if (
            isNaN(renderTHIS.selfCounter) ||
            renderTHIS.selfCounter > range[1] - range[0]
          ) {
            renderTHIS.selfCounter = 0;
          }

          const img = spriteSheetData[spriteName].img;
          const FRAME = range[0] + renderTHIS.selfCounter;
          const x = spriteSheetData[spriteName].x[FRAME];
          const w = spriteSheetData[spriteName].w[FRAME];
          const h = spriteSheetData[spriteName].h[FRAME];
          //drawThisImage
          ctx.drawImage(
            img,
            x,
            0,
            w,
            img.height,
            20 - Math.round(w / 2) + offsets[renderTHIS.selfCounter].x,
            100 - Math.round(h / 2) + offsets[renderTHIS.selfCounter].y,
            w,
            img.height
          );
          renderTHIS.selfCounter++;
        });
      };

      animationTimer = setInterval(() => {
        render();
      }, 1000 / fps);
    };
  }
};
