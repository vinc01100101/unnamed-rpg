let animationEngine = null,
	blobs = {};

const requestAnimationFrame =
	self.requestAnimationFrame ||
	self.mozRequestAnimationFrame ||
	self.webkitRequestAnimationFrame ||
	self.msRequestAnimationFrame;

const cancelAnimationFrame =
	self.cancelAnimationFrame || self.mozCancelAnimationFrame;

self.onmessage = (e) => {
	switch (e.data.type) {
		case "animationInit":
			//clear
			animationEngine = undefined;
			//redefine
			animationEngine = new AnimationEngine(...e.data.args);

			animationEngine.initialize();
			break;
		case "renderThese":
			animationEngine.renderThese = e.data.renderThese;
			break;
		case "toBlob":
			async function toBlob() {
				const blob = await fetch(e.data.path)
					.then((r) => r.blob())
					.catch(() => {
						console.log("error");
					});
				await createImageBitmap(blob)
					.then((i) => {
						blobs[e.data.name] = i;
						self.postMessage({
							type: "success",
							name: e.data.name,
						});
					})
					.catch(() => {
						console.log("error uploading an image: " + e.data.path);
					});
			}
			toBlob();
			break;
		case "test":
			animationEngine.isTest = true;
			break;
		case "test_show_ref_head":
			animationEngine.showRefHead = !animationEngine.showRefHead;
			break;
		case "test_act":
			animationEngine.renderThese[0].act = e.data.act;
			break;

		case "test_class":
			animationEngine.renderThese[0].body = e.data.jobclass;
			break;

		case "test_head":
			animationEngine.renderThese[0].head = e.data.head;
			break;

		case "test_head_up":
			animationEngine.adjustHeadXY.y[animationEngine.headFacing]--;
			break;

		case "test_head_down":
			animationEngine.adjustHeadXY.y[animationEngine.headFacing]++;
			break;

		case "test_head_right":
			animationEngine.adjustHeadXY.x[animationEngine.headFacing]++;
			break;

		case "test_head_left":
			animationEngine.adjustHeadXY.x[animationEngine.headFacing]--;
			break;

		case "test_rotate":
			animationEngine.renderThese[0].bodyFacing = e.data.dir;
			animationEngine.renderThese[0].headFacing = e.data.dir;
			break;

		case "test_rotate_back":
			animationEngine.renderThese[0].bodyFacing = e.data.dir;
			animationEngine.renderThese[0].headFacing = e.data.dir;
			break;

		case "test_print":
			console.log("printing...");
			console.log(
				JSON.stringify({
					x: {
						f:
							animationEngine.adjustHeadXY.x.f +
							animationEngine.headXPos.f,
						fl:
							animationEngine.adjustHeadXY.x.fl +
							animationEngine.headXPos.fl,
						l:
							animationEngine.adjustHeadXY.x.l +
							animationEngine.headXPos.l,
						bl:
							animationEngine.adjustHeadXY.x.bl +
							animationEngine.headXPos.bl,
						b:
							animationEngine.adjustHeadXY.x.b +
							animationEngine.headXPos.b,
						br:
							animationEngine.adjustHeadXY.x.br +
							animationEngine.headXPos.br,
						r:
							animationEngine.adjustHeadXY.x.r +
							animationEngine.headXPos.r,
						fr:
							animationEngine.adjustHeadXY.x.fr +
							animationEngine.headXPos.fr,
					},
					y: {
						f:
							animationEngine.adjustHeadXY.y.f +
							animationEngine.headYPos.f,
						fl:
							animationEngine.adjustHeadXY.y.fl +
							animationEngine.headYPos.fl,
						l:
							animationEngine.adjustHeadXY.y.l +
							animationEngine.headYPos.l,
						bl:
							animationEngine.adjustHeadXY.y.bl +
							animationEngine.headYPos.bl,
						b:
							animationEngine.adjustHeadXY.y.b +
							animationEngine.headYPos.b,
						br:
							animationEngine.adjustHeadXY.y.bl +
							animationEngine.headYPos.bl,
						r:
							animationEngine.adjustHeadXY.y.l +
							animationEngine.headYPos.l,
						fr:
							animationEngine.adjustHeadXY.y.fl +
							animationEngine.headYPos.fl,
					},
				})
			);
			break;

		case "terminate":
			animationEngine && animationEngine.terminate();
			break;
	}
};

class AnimationEngine {
	constructor(canvas, spriteSheetData, backgroundCanvas) {
		//variables for adjusting head sprites position
		this.adjustHeadXY = {
			x: { f: 0, fl: 0, l: 0, bl: 0, b: 0, br: 0, r: 0, fr: 0 },
			y: { f: 0, fl: 0, l: 0, bl: 0, b: 0, br: 0, r: 0, fr: 0 },
		};
		//this will be referenced inside the render() function
		//Action per index:
		const actsPerIndex = [
			"idle",
			"walk",
			"sit",
			"pick",
			"standby",
			"attack1",
			"damaged",
			"freeze1",
			"dead",
			"freeze2",
			"attack2",
			"attack3",
			"cast",
		];

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
		const ctxBG = backgroundCanvas
			? backgroundCanvas.getContext("2d")
			: null;
		//variable for array of objects to be rendered
		this.renderThese = [];

		//variable for array of map tiles to be rendered
		this.renderTiles = [];

		//store request id's
		let reqID;

		//initialize the timer
		this.initialize = () => {
			const render = (timestamp) => {
				console.log("rendering");
				//clear canvas first
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				//map on array of objects to render
				this.renderThese.map((renderTHIS) => {
					//general body frame count values per act
					//modify this if some sprite shows different frame count in some act
					let actsCounts = [3, 8, 3, 3, 6, 5, 3, 1, 1, 1, 9, 8, 6];
					//modify the act counts for some sprites that has different counts
					//we do that before asigning them to DATA_INDICES
					//sprites that have different cast frame count
					switch (renderTHIS.body) {
						case "fShadowChaser":
						case "fRogue":
						case "fStalker":
							actsCounts[12] = 5;
							break;
						case "fWizard":
							actsCounts[5] = 4;
							break;
						case "fAssassinCross":
							actsCounts[5] = 4;
							break;
					}

					//object to store our frame count data
					let DATA_INDICES = {};
					//now map to actsCount and assign variables to DATA_INDICES
					actsCounts.map((count, i) => {
						//define the property because it is undefined at first
						DATA_INDICES[actsPerIndex[i]] = {};
						//assign frame count and starting frame animation index
						DATA_INDICES[actsPerIndex[i]].count = count;
						//the first index has to start at 0
						//preceding indeces will be computed with formula:
						//current act's start = previous act's count * 8 + previous act's start
						DATA_INDICES[actsPerIndex[i]].start =
							i == 0
								? 0
								: DATA_INDICES[actsPerIndex[i - 1]].count * 8 +
								  DATA_INDICES[actsPerIndex[i - 1]].start;
					});
					//-----------------------------------
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
						//transform f,l,b,r to 4 directional when fourDir==true
						if (renderTHIS.bodyFacing.length == 1) {
							renderTHIS.bodyFacing =
								renderTHIS.bodyFacing == "f"
									? "fl"
									: renderTHIS.bodyFacing == "l"
									? "bl"
									: renderTHIS.bodyFacing == "b"
									? "br"
									: renderTHIS.bodyFacing == "r"
									? "fr"
									: renderTHIS.bodyFacing;
						}
						isMirrored =
							/r/.test(renderTHIS.bodyFacing) ||
							/^b$/.test(renderTHIS.bodyFacing);

						//some pick and attack animation has
						//different order so we flip it back
						const regs = { f: /f|^r$/, b: /b|^l$/ };
						if (sprAct.reversed) {
							const revIndex = sprAct.reversed.acts.indexOf(
								renderTHIS.act
							);
							if (revIndex != -1) {
								if (sprAct.reversed.dirs[revIndex] == "both") {
									isMirrored = !isMirrored;
								} else if (
									regs[sprAct.reversed.dirs[revIndex]].test(
										renderTHIS.bodyFacing
									)
								) {
									isMirrored = !isMirrored;
								}
							}
						}
					}

					const isMirroredBodyFacing = isMirrored
						? renderTHIS.bodyFacing.replace("r", "l")
						: renderTHIS.bodyFacing;
					//check if head is rotatable
					const rotatable =
						renderTHIS.act == "sit" || renderTHIS.act == "idle";

					//add or increment self counter
					if (
						isNaN(renderTHIS.selfCounter) ||
						renderTHIS.selfCounter >=
							DATA_INDICES[renderTHIS.act].count
					) {
						renderTHIS.selfCounter = 0;
					}
					if (isNaN(renderTHIS.frameCounter))
						renderTHIS.frameCounter = 0;

					//VARIABLES OF OBJECT'S POSITION ON THE MAP
					const variableX = renderTHIS.coords[0],
						variableY = renderTHIS.coords[1];

					if (this.isTest) {
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
					}

					//BODY--------------------
					//necessary variables for animation
					//LET's will be reused on the head object to save memory

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

					let bodyOffset =
						sprAct.data.bodyOffsets[COMPUTED_456_INDEX];
					let renderX =
							variableX - Math.round(srcW / 2) + bodyOffset[0],
						renderY =
							variableY - Math.round(srcH / 2) + bodyOffset[1],
						scaleX = isMirrored ? -1 : 1,
						transX = isMirrored ? srcW + renderX * 2 : 0;

					if (this.isTest) {
						//rectangle character body outline
						ctx.beginPath();
						ctx.rect(renderX, renderY, srcW, srcH);
						ctx.stroke();
					}

					//the shadow
					ctx.drawImage(blobs.shadow, variableX - 18, variableY - 9);

					//the body
					ctx.save();
					ctx.translate(transX, 0);
					ctx.scale(scaleX, 1);

					ctx.drawImage(
						blobs.fClass,
						srcX,
						sprAct.yPos,
						srcW,
						srcH,
						renderX,
						renderY,
						srcW,
						srcH
					);

					if (this.isTest) {
						//rect for mirrored
						ctx.beginPath();
						ctx.rect(renderX, renderY, srcW, srcH);
						ctx.strokeStyle = "red";
						ctx.stroke();
					}

					ctx.restore();

					// TESTER---------------
					// renderTHIS.selfCounter++;
					// return;
					// ---------------------

					//HEAD----------------------
					//if the body has head, render it
					//some sprites has head already attached

					if (renderTHIS.head) {
						//check if head is animating
						//headActs = plain,pick,damaged,dead
						let headIsAnimating =
							renderTHIS.act == "pick" ||
							renderTHIS.act == "damaged";

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
								dirToIndex.indexOf(renderTHIS.bodyFacing) +
									1) ||
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

						//SPECIAL CASE FOR TAEKWON KID WHERE IT REVOLVES 350 DEGREE ON ATTACK 3
						if (
							/TaekwonKid|TaekwonMaster/.test(renderTHIS.body) &&
							renderTHIS.act == "attack3"
						) {
							if (
								(/TaekwonKid/.test(renderTHIS.body) &&
									renderTHIS.selfCounter == 5) ||
								(/TaekwonMaster/.test(renderTHIS.body) &&
									renderTHIS.selfCounter == 6)
							) {
								const regTestX = /l/.test(this.headFacing)
									? "l"
									: "r";
								const toReplaceX = regTestX == "l" ? "r" : "l";

								const regTestY = /f/.test(this.headFacing)
									? "f"
									: "b";
								const toReplaceY = regTestY == "f" ? "b" : "f";

								this.headFacing = this.headFacing.replace(
									regTestX,
									toReplaceX
								);
								this.headFacing = this.headFacing.replace(
									regTestY,
									toReplaceY
								);
							} else if (
								(/TaekwonKid/.test(renderTHIS.body) &&
									renderTHIS.selfCounter == 4) ||
								(/TaekwonMaster/.test(renderTHIS.body) &&
									renderTHIS.selfCounter == 5)
							) {
								this.headFacing = /l/.test(this.headFacing)
									? "r"
									: "l";
							}
						}
						//ABOVE ^ IS THE SPECIAL CASE FOR TAEKWON KID WHERE IT REVOLVES 350 DEGREE ON ATTACK 3

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
						//FOR TEST: PRINTING ADJUSTED XY POSITION
						this.headYPos = sprActHead.anchorPoints.normal.y;
						this.headXPos = sprActHead.anchorPoints.normal.x;

						srcX = sprActHead.xPos[frameNum];

						//these has different anchor
						const anchorAct = !/pick|damaged|dead/.test(
							renderTHIS.act
						)
							? "normal"
							: renderTHIS.act;
						//center it by formula: x position - (computed width / 2)
						renderX =
							variableX -
							Math.round(sprActHead.widths[frameNum] / 2) +
							sprAct.data.anchorHead[COMPUTED_456_INDEX][0] +
							sprActHead.anchorPoints[anchorAct].x[
								this.headFacing
							] +
							this.adjustHeadXY.x[this.headFacing];

						renderY =
							variableY -
							Math.round(sprActHead.heights[frameNum] / 2) +
							sprAct.data.anchorHead[COMPUTED_456_INDEX][1] +
							sprActHead.anchorPoints[anchorAct].y[
								this.headFacing
							] +
							this.adjustHeadXY.y[this.headFacing];

						scaleX = isMirrored ? -1 : 1;
						transX = isMirrored
							? sprActHead.widths[frameNum] + renderX * 2
							: 0;

						if (this.isTest) {
							//rectangle character head outline
							ctx.beginPath();
							ctx.rect(
								renderX,
								renderY,
								sprActHead.widths[frameNum],
								sprActHead.heights[frameNum]
							);
							ctx.stroke();
						}

						ctx.save();
						ctx.translate(transX, 0);
						ctx.scale(scaleX, 1);

						ctx.drawImage(
							blobs.fHead,
							srcX,
							sprActHead.yPos,
							sprActHead.widths[frameNum],
							sprActHead.heights[frameNum],
							renderX,
							renderY,
							sprActHead.widths[frameNum],
							sprActHead.heights[frameNum]
						);
						if (this.isTest) {
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

							ctx.restore();
							ctx.save();

							const transXREF = isMirrored
								? spriteSheetData.fHead0.widths[frameNum] +
								  (variableX -
										Math.round(
											spriteSheetData.fHead0.widths[
												frameNum
											] / 2
										) +
										sprAct.data.anchorHead[
											COMPUTED_456_INDEX
										][0] +
										spriteSheetData.fHead0.anchorPoints[
											anchorAct
										].x[this.headFacing]) *
										2
								: 0;

							ctx.translate(transXREF, 0);
							ctx.scale(scaleX, 1);
							//reference
							if (this.showRefHead) {
								ctx.drawImage(
									blobs.fHead0,
									spriteSheetData.fHead0.xPos[frameNum],
									0,
									spriteSheetData.fHead0.widths[frameNum],
									spriteSheetData.fHead0.heights[frameNum],
									variableX -
										Math.round(
											spriteSheetData.fHead0.widths[
												frameNum
											] / 2
										) +
										sprAct.data.anchorHead[
											COMPUTED_456_INDEX
										][0] +
										spriteSheetData.fHead0.anchorPoints[
											anchorAct
										].x[this.headFacing],
									variableY -
										Math.round(
											spriteSheetData.fHead0.heights[
												frameNum
											] / 2
										) +
										sprAct.data.anchorHead[
											COMPUTED_456_INDEX
										][1] +
										spriteSheetData.fHead0.anchorPoints[
											anchorAct
										].y[this.headFacing],
									spriteSheetData.fHead0.widths[frameNum],
									spriteSheetData.fHead0.heights[frameNum]
								);
							}
						}

						ctx.restore();

						if (renderTHIS.selectCharacterSelected) {
							ctx.drawImage(
								blobs.selectCharacterFrame,
								variableX - 50,
								variableY - 110,
								100,
								130
							);
						}
					}
					if (!rotatable) {
						renderTHIS.frameCounter++;
						if (renderTHIS.frameCounter >= 60 / renderTHIS.fps) {
							renderTHIS.selfCounter++;
							renderTHIS.frameCounter = 0;
						}
					}
				});
				reqID = requestAnimationFrame(render);
			};
			reqID = requestAnimationFrame(render);
		};

		this.terminate = () => {
			reqID && cancelAnimationFrame(reqID);
		};
	}
}
