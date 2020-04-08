const DATA_INDICES = require("./animation-variables/456indices");
module.exports = class AnimationEngine {
  constructor(canvas, spriteSheetData, fps) {
    this.adjustHeadXY = {
      x: { f: 0, fl: 0, l: 0, bl: 0, b: 0 },
      y: { f: 0, fl: 0, l: 0, bl: 0, b: 0 },
    };
    //index of head frames per action
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
    //convert facing direction to index for 456indices.js
    const dirToIndex = ["f", "fl", "l", "bl", "b", "br", "r", "fr"];
    const ctx = canvas.getContext("2d");
    //we defined timer variable here so we can initiate and terminate it
    let animationTimer = null;

    //variable for array of objects to be rendered
    this.renderThese = [];

    //initialize the timer
    this.initialize = () => {
      if (animationTimer == null) {
        const render = () => {
          //clear canvas first
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          //map on array of objects to render
          this.renderThese.map((renderTHIS) => {
            //check if the character is facing on the right side
            //if mirrored, use the mirror data, those are the same
            let isMirrored;
            if (
              renderTHIS.act == "walk" ||
              renderTHIS.act == "sit" ||
              renderTHIS.act == "idle"
            ) {
              isMirrored = /r/.test(renderTHIS.bodyFacing);
            } else {
              isMirrored =
                /r/.test(renderTHIS.bodyFacing) ||
                /^b$/.test(renderTHIS.bodyFacing);
            }

            const isMirroredBodyFacing = isMirrored
              ? renderTHIS.bodyFacing.replace("r", "l")
              : renderTHIS.bodyFacing;
            const sprAct = spriteSheetData[renderTHIS.body];
            //add or increment self counter
            if (
              isNaN(renderTHIS.selfCounter) ||
              renderTHIS.selfCounter >= DATA_INDICES[renderTHIS.act].count
            ) {
              renderTHIS.selfCounter = 0;
            }

            //(TEST)VARIABLES OF OBJECT'S POSITION ON THE MAP
            const variableX = 125,
              variableY = 125;
            //horizontal
            ctx.strokeStyle = "green";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, 125);
            ctx.lineTo(250, 125);
            ctx.stroke();
            //vertical
            ctx.beginPath();
            ctx.moveTo(125, 0);
            ctx.lineTo(125, 250);
            ctx.stroke();

            //BODY--------------------
            //necessary variables for animation
            //LET's will be reused on the head object to save memory
            let img = sprAct.img;

            let COMPUTED_456_INDEX =
              DATA_INDICES[renderTHIS.act].start +
              DATA_INDICES[renderTHIS.act].count *
                dirToIndex.indexOf(renderTHIS.bodyFacing) +
              renderTHIS.selfCounter;

            let COMPUTED_SPRITE_INDEX =
              sprAct.data.spriteIndices[COMPUTED_456_INDEX];

            const srcW = sprAct.data.widths[COMPUTED_SPRITE_INDEX];
            let srcH = sprAct.data.heights[COMPUTED_SPRITE_INDEX];
            let srcX = sprAct.data.xPos[COMPUTED_SPRITE_INDEX];
            let bodyOffset = sprAct.data.bodyOffsets[COMPUTED_456_INDEX];
            let renderX = variableX - Math.round(srcW / 2) + bodyOffset[0],
              renderY = variableY - Math.round(srcH / 2) + bodyOffset[1],
              scaleX = isMirrored ? -1 : 1,
              transX = isMirrored ? srcW + renderX * 2 : 0;

            //rectangle//character body outline
            ctx.beginPath();
            ctx.rect(renderX, renderY, srcW, srcH);
            ctx.stroke();

            //drawThisImage
            ctx.save();
            ctx.translate(transX, 0);
            ctx.scale(scaleX, 1);
            ctx.drawImage(
              img,
              srcX,
              0,
              srcW,
              srcH,
              renderX,
              renderY,
              srcW,
              srcH
            );
            //rect for mirrored
            ctx.beginPath();
            ctx.rect(renderX, renderY, srcW, srcH);
            ctx.strokeStyle = "red";
            ctx.stroke();
            //
            ctx.restore();

            //TESTER---------------
            // console.log(bodyOffset);
            renderTHIS.selfCounter++;
            return;
            //---------------------

            //HEAD----------------------
            //if the body has head, render it
            //some sprites has head already attached
            if (renderTHIS.head) {
              //index of the head on our spritesheedata

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
              srcX = sprActHead.xPos[frameNum];

              //center it by formula: x position - (computed width / 2)
              renderX =
                variableX -
                Math.round(sprActHead.widths[frameNum] / 2) +
                sprAct.anchorHead[
                  anchorIndices[renderTHIS.act].start +
                    dirToIndex.indexOf(renderTHIS.headFacing) *
                      anchorIndices[renderTHIS.act].count +
                    renderTHIS.selfCounter
                ][0] +
                sprActHead.anchorPoints.x[renderTHIS.headFacing] +
                this.adjustHeadXY.x[this.isMirroredHeadFacing];

              renderY =
                variableY -
                Math.round(sprActHead.heights[frameNum] / 2) +
                sprAct.anchorHead[
                  anchorIndices[renderTHIS.act].start +
                    dirToIndex.indexOf(renderTHIS.headFacing) *
                      anchorIndices[renderTHIS.act].count +
                    renderTHIS.selfCounter
                ][1] +
                sprActHead.anchorPoints.y[renderTHIS.headFacing] +
                this.adjustHeadXY.y[this.isMirroredHeadFacing]; //-

              scaleX = isMirrored ? -1 : 1;
              transX = isMirrored
                ? sprActHead.widths[frameNum] + renderX * 2
                : 0;

              //rectangle//character head outline
              ctx.beginPath();
              ctx.rect(
                renderX,
                renderY,
                sprActHead.widths[frameNum],
                sprActHead.heights[frameNum]
              );
              ctx.stroke();

              //
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
              //rect for mirrored
              ctx.beginPath();
              ctx.rect(
                renderX,
                renderY,
                sprActHead.widths[frameNum],
                sprActHead.heights[frameNum]
              );
              ctx.strokeStyle = "red";
              ctx.stroke();
              //
              ctx.restore();
            }
            renderTHIS.selfCounter++;
          });
        };

        animationTimer = setInterval(() => {
          render();
        }, 1000 / fps);
      }
    };

    this.terminate = () => {
      clearInterval(animationTimer);
      animationTimer = null;
    };
  }
};
