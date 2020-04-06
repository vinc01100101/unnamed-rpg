module.exports = class AnimationEngine {
  constructor(canvas, spriteSheetData, fps) {
    this.systemAdjustHeadSprY = 8;
    this.notEqualDir = {
      x: {
        f: {
          l: -2,
          fl: -2,
          fr: -2,
          r: -2,
        },
        fl: {
          bl: -2,
          l: -2,
          f: -2,
          fr: -2,
        },
        fr: {
          br: -2,
          r: -2,
          f: -2,
          fl: -2,
        },
      },
    };
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
          //add or increment self counter
          let isMirrored = /r/.test(renderTHIS.bodyFacing);
          const sprAct =
            spriteSheetData[renderTHIS.body][
              renderTHIS.act +
                "_" +
                (isMirrored
                  ? renderTHIS.bodyFacing.replace("r", "l")
                  : renderTHIS.bodyFacing)
            ];
          if (
            isNaN(renderTHIS.selfCounter) ||
            renderTHIS.selfCounter >= sprAct.count
          ) {
            renderTHIS.selfCounter = 0;
          }

          const variableX = 400,
            variableY = 100;

          let img = sprAct.img;
          let srcW = img.width / sprAct.count;
          let srcX = srcW * renderTHIS.selfCounter;
          let renderX = variableX - Math.round(srcW / 2);
          let renderY = variableY - img.height;
          let scaleX = isMirrored ? -1 : 1;
          let transX = isMirrored ? srcW + renderX * 2 : 0;
          //drawThisImage
          ctx.save();
          ctx.translate(transX, 0);
          ctx.scale(scaleX, 1);
          ctx.drawImage(
            img,
            srcX,
            0,
            srcW,
            img.height,
            renderX,
            renderY,
            srcW,
            img.height
          );
          ctx.restore();

          if (renderTHIS.head) {
            const frameHead = {
              plain: {
                f: 0,
                fl: 1,
                l: 2,
                bl: 3,
                b: 4,
              },
              pick: {
                fl: 5,
                bl: 7,
              },
              damaged: {
                fl: 9,
                bl: 11,
              },
              dead: {
                fl: 13,
                bl: 14,
              },
            };
            isMirrored = /r/.test(renderTHIS.headFacing);
            const isHeadStatic =
              renderTHIS.headAct == "plain" || renderTHIS.headAct == "dead";
            const frameNum = isHeadStatic
              ? frameHead[renderTHIS.headAct][
                  isMirrored
                    ? renderTHIS.headFacing.replace("r", "l")
                    : renderTHIS.headFacing
                ]
              : frameHead[renderTHIS.headAct][
                  isMirrored
                    ? renderTHIS.headFacing.replace("r", "l")
                    : renderTHIS.headFacing
                ] + renderTHIS.selfCounter;

            const sprActHead = spriteSheetData[renderTHIS.head];
            img = sprActHead.img;
            const bodyAnchorHead = sprAct.anchorHead;
            srcX = sprActHead.xPos[frameNum];

            renderX =
              variableX -
              Math.round(
                (sprActHead.widths[frameNum] +
                  bodyAnchorHead[renderTHIS.selfCounter].x) /
                  2
              );

            renderY =
              variableY -
              sprActHead.heights[frameNum] +
              bodyAnchorHead[renderTHIS.selfCounter].y -
              this.systemAdjustHeadSprY -
              (renderTHIS.bodyFacing != renderTHIS.headFacing
                ? this.notEqualDir.x[renderTHIS.bodyFacing][
                    renderTHIS.headFacing
                  ]
                : 0);

            scaleX = isMirrored ? -1 : 1;
            transX = isMirrored
              ? sprActHead.widths[frameNum] +
                bodyAnchorHead[renderTHIS.selfCounter].x +
                renderX * 2
              : 0;
            ctx.save();
            ctx.translate(transX, 0);
            ctx.scale(scaleX, 1);
            ctx.drawImage(
              img,
              srcX,
              0,
              sprActHead.widths[frameNum],
              sprActHead.heights[frameNum],
              renderX,
              renderY,
              sprActHead.widths[frameNum],
              sprActHead.heights[frameNum]
            );
            ctx.restore();
          }
          renderTHIS.selfCounter++;
        });
      };

      animationTimer = setInterval(() => {
        render();
      }, 1000 / fps);
    };
  }
};
