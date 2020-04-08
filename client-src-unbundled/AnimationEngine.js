module.exports = class AnimationEngine {
  constructor(canvas, spriteSheetData, fps) {
    //offset when head and body has different facing
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
    // this.adjustHeadXY = {
    //   x: { f: 0, fl: 0, l: 0, bl: 0, b: 0 },
    //   y: { f: 0, fl: 0, l: 0, bl: 0, b: 0 },
    // };
    this.adjustHeadXY = {
      x: { f: 0, fl: 0, l: 0, bl: 0, b: 0 },
      y: { f: 0, fl: 0, l: 0, bl: 0, b: 0 },
    };
    const ctx = canvas.getContext("2d");
    //we defined timer variable here so we can initiate and terminate it
    let animationTimer = null;

    //variable for array of objects to be rendered
    this.renderThese = [];

    //initialize the timer
    this.initialize = () => {
      const render = () => {
        //clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //map on array of objects to render
        this.renderThese.map((renderTHIS) => {
          //check if the character is facing on the right side
          //if mirrored, use the mirror data, those are the same
          let isMirrored = /r/.test(renderTHIS.bodyFacing);

          const isMirroredBodyFacing = isMirrored
            ? renderTHIS.bodyFacing.replace("r", "l")
            : renderTHIS.bodyFacing;
          const sprAct =
            spriteSheetData[renderTHIS.body][
              renderTHIS.act + "_" + isMirroredBodyFacing
            ];
          //add or increment self counter
          if (
            isNaN(renderTHIS.selfCounter) ||
            renderTHIS.selfCounter >= sprAct.count
          ) {
            renderTHIS.selfCounter = 0;
          }

          //(TEST)VARIABLES OF OBJECT'S POSITION ON THE MAP
          const variableX = 125,
            variableY = 125;
          //horizontal

          ctx.strokeStyle = "green";
          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.moveTo(0, 125);
          ctx.lineTo(250, 125);
          ctx.stroke();
          //vertical
          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.moveTo(125, 0);
          ctx.lineTo(125, 250);
          ctx.stroke();

          //necessary variables for animation
          //LET's will be reused on the head object to save memory
          let img = sprAct.img;
          const srcW = img.width / sprAct.count;
          let srcX = srcW * renderTHIS.selfCounter,
            renderX = variableX - Math.round(srcW / 2),
            renderY = variableY - Math.round(img.height / 2), //12pixelfooter
            scaleX = isMirrored ? -1 : 1,
            transX = isMirrored ? srcW + renderX * 2 : 0;

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
            renderX +
              spriteSheetData[renderTHIS.body].adjustXAxis[
                isMirroredBodyFacing
              ],
            renderY +
              spriteSheetData[renderTHIS.body].adjustYAxis[
                isMirroredBodyFacing
              ],
            srcW,
            img.height
          );
          ctx.restore();

          //if the body has head, render it
          //some sprites has head already attached
          if (renderTHIS.head) {
            //index of the head on our spritesheedata
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
            //reuse variables to save memory
            isMirrored = /r/.test(renderTHIS.headFacing);
            //determine if the head is animating or not
            const isHeadStatic =
              renderTHIS.headAct == "plain" || renderTHIS.headAct == "dead";

            //translate facing if mirrored
            this.isMirroredHeadFacing = isMirrored
              ? renderTHIS.headFacing.replace("r", "l")
              : renderTHIS.headFacing;
            //determine the current frame index to render
            const frameNum = isHeadStatic
              ? //if static, do not associate with the counter to prevent animation
                frameHead[renderTHIS.headAct][this.isMirroredHeadFacing]
              : //if not static, associate with the counter
                frameHead[renderTHIS.headAct][this.isMirroredHeadFacing] +
                renderTHIS.selfCounter;

            const sprActHead = spriteSheetData[renderTHIS.head];
            img = sprActHead.img;
            const bodyAnchorHead = sprAct.anchorHead;
            srcX = sprActHead.xPos[frameNum];

            //center it by formula: x position - (computed width / 2)
            renderX = variableX - Math.round(sprActHead.widths[frameNum] / 2);

            renderY = variableY - Math.round(sprActHead.heights[frameNum] / 2); //-
            // (renderTHIS.bodyFacing != renderTHIS.headFacing
            //   ? this.notEqualDir.x[renderTHIS.bodyFacing][
            //       renderTHIS.headFacing
            //     ]
            //   : 0);

            scaleX = isMirrored ? -1 : 1;
            transX = isMirrored ? sprActHead.widths[frameNum] + renderX * 2 : 0;
            ctx.save();
            ctx.translate(transX, 0);
            ctx.scale(scaleX, 1);
            ctx.drawImage(
              img,
              srcX,
              0,
              sprActHead.widths[frameNum],
              sprActHead.heights[frameNum],
              renderX +
                bodyAnchorHead[renderTHIS.selfCounter].x +
                this.adjustHeadXY.x[this.isMirroredHeadFacing],
              renderY +
                bodyAnchorHead[renderTHIS.selfCounter].y +
                this.adjustHeadXY.y[this.isMirroredHeadFacing],
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

    this.terminate = () => {
      clearInterval(animationTimer);
    };
  }
};
