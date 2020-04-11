const DATA_INDICES = require("./animation-variables/456indices");
module.exports = class AnimationEngine {
  constructor(canvas, spriteSheetData, fps) {
    this.adjustHeadXY = {
      x: { f: 0, fl: 0, l: 0, bl: 0, b: 0, br: 0, r: 0, fr: 0 },
      y: { f: 0, fl: 0, l: 0, bl: 0, b: 0, br: 0, r: 0, fr: 0 },
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
            const sprAct = spriteSheetData[renderTHIS.body];
            //check if the character is facing on the right side
            //if mirrored, use the mirror data, those are the same
            let isMirrored, fourDir;
            if (
              //TO BE REFACTORIZE
              renderTHIS.act == "walk" ||
              renderTHIS.act == "sit" ||
              renderTHIS.act == "idle"
            ) {
              fourDir = false;
              isMirrored = /r/.test(renderTHIS.bodyFacing);
            } else {
              fourDir = true;
              isMirrored =
                /r/.test(renderTHIS.bodyFacing) ||
                /^b$/.test(renderTHIS.bodyFacing);

              //pick animation has different order

              const regs = { f: /f|^r$/, b: /b|^l$/ };
              if (sprAct.reversed) {
                const revIndex = sprAct.reversed.acts.indexOf(renderTHIS.act);
                if (revIndex != -1) {
                  if (
                    regs[sprAct.reversed.dirs[revIndex]].test(
                      renderTHIS.bodyFacing
                    )
                  ) {
                    isMirrored = !isMirrored;
                  }
                }
              }

              // if (
              //   renderTHIS.act == "pick" &&
              //   /f|^r$/.test(renderTHIS.bodyFacing)
              // ) {
              //   isMirrored = sprAct.reversedPick ? !isMirrored : isMirrored;
              // }
            }

            const isMirroredBodyFacing = isMirrored
              ? renderTHIS.bodyFacing.replace("r", "l")
              : renderTHIS.bodyFacing;
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
            // ctx.beginPath();
            // ctx.rect(renderX, renderY, srcW, srcH);
            // ctx.stroke();

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
            // ctx.beginPath();
            // ctx.rect(renderX, renderY, srcW, srcH);
            // ctx.strokeStyle = "red";
            // ctx.stroke();
            // //
            ctx.restore();

            //TESTER---------------
            // console.log(bodyOffset);
            // renderTHIS.selfCounter++;
            // return;
            //---------------------

            //HEAD----------------------
            //if the body has head, render it
            //some sprites has head already attached

            //check if head is rotatable
            const rotatable =
              renderTHIS.act == "sit" || renderTHIS.act == "idle";

            if (renderTHIS.head) {
              //check if head is animating
              //headActs = plain,pick,damaged,dead
              let headIsAnimating =
                renderTHIS.act == "pick" || renderTHIS.act == "damaged";

              //reuse variables to save memory

              //compute headfacing including rotations
              const computed_dirToIndex_rotatable =
                renderTHIS.selfCounter >= 2
                  ? dirToIndex.indexOf(renderTHIS.bodyFacing) - 1
                  : dirToIndex.indexOf(renderTHIS.bodyFacing) +
                    renderTHIS.selfCounter;

              const dirToIndexFourDir =
                ((fourDir &&
                  renderTHIS.bodyFacing.length == 1 &&
                  dirToIndex.indexOf(renderTHIS.bodyFacing) + 1) ||
                  dirToIndex.indexOf(renderTHIS.bodyFacing)) % 8;

              //if index is a negative value, switch to last index
              const dirToIndexRotatable =
                computed_dirToIndex_rotatable < 0
                  ? 7
                  : computed_dirToIndex_rotatable % 8;
              //this.headFacing = f,fl,l,bl, etc..
              this.headFacing = rotatable
                ? dirToIndex[dirToIndexRotatable]
                : dirToIndex[dirToIndexFourDir];
              //check if it is mirrored
              isMirrored = /r/.test(this.headFacing);
              //translate facing
              const isMirroredHeadFacing = isMirrored
                ? this.headFacing.replace("r", "l")
                : this.headFacing;
              //get headAct to use for frameHead value
              const headAct =
                !headIsAnimating && !/dead/.test(renderTHIS.act)
                  ? "plain"
                  : renderTHIS.act;
              //determine the current frame index to render
              const frameNum = !headIsAnimating
                ? //if head is not animating, do not associate with the counter to prevent animation
                  frameHead[headAct][isMirroredHeadFacing]
                : //if head is animating, associate with the counter
                  frameHead[headAct][isMirroredHeadFacing] +
                  (renderTHIS.selfCounter % 2);

              const sprActHead = spriteSheetData[renderTHIS.head];
              img = sprActHead.img;
              srcX = sprActHead.xPos[frameNum];

              //these has different anchor
              const anchorAct = !/pick|damaged|dead/.test(renderTHIS.act)
                ? "normal"
                : renderTHIS.act;
              //center it by formula: x position - (computed width / 2)
              renderX =
                variableX -
                Math.round(sprActHead.widths[frameNum] / 2) +
                sprAct.data.anchorHead[COMPUTED_456_INDEX][0] +
                sprActHead.anchorPoints[anchorAct].x[this.headFacing] +
                this.adjustHeadXY.x[this.headFacing];

              renderY =
                variableY -
                Math.round(sprActHead.heights[frameNum] / 2) +
                sprAct.data.anchorHead[COMPUTED_456_INDEX][1] +
                sprActHead.anchorPoints[anchorAct].y[this.headFacing] +
                this.adjustHeadXY.y[this.headFacing];

              scaleX = isMirrored ? -1 : 1;
              transX = isMirrored
                ? sprActHead.widths[frameNum] + renderX * 2
                : 0;

              //rectangle//character head outline
              // ctx.beginPath();
              // ctx.rect(
              //   renderX,
              //   renderY,
              //   sprActHead.widths[frameNum],
              //   sprActHead.heights[frameNum]
              // );
              // ctx.stroke();

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
              // ctx.beginPath();
              // ctx.rect(
              //   renderX,
              //   renderY,
              //   sprActHead.widths[frameNum],
              //   sprActHead.heights[frameNum]
              // );
              // ctx.strokeStyle = "red";
              // ctx.stroke();
              //
              ctx.restore();
            }
            if (!rotatable) {
              renderTHIS.selfCounter++;
            }
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
