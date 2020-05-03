const React = require("react");
const Versioning = require("./mapmaker/Versioning");
const Group1 = require("./mapmaker/Group1");
const Group2 = require("./mapmaker/Group2");

let capturer = new CCapture({
	format: "webm",
	framerate: 60,
	verbose: false,
});

let cellWidth = 32,
	cellHeight = 32,
	charCellWidth = cellWidth / 2,
	charCellHeight = cellHeight / 2,
	cols,
	rows,
	selX,
	selY,
	selW,
	selH,
	scX = 0,
	scY = 0,
	//DOMS
	mapBase1,
	mapBase2,
	mapBase3,
	mapShadowMid1,
	mapMid1,
	mapAnimate,
	mapShadowMid2,
	mapMid2,
	mapShadowTop,
	mapTop,
	frameSelect,
	frameSelectAnimation,
	mapClickCatcher,
	captureCanvas,
	mapScaler,
	mapCont,
	//
	scalerHeight,
	durationCounter = 0,
	renderXY = [],
	pathXY = [],
	getPathCoordinate = () =>
		Math.round(pathXY[0] / charCellWidth) +
		"_" +
		Math.round(pathXY[1] / charCellHeight),
	getRenderCoordinate = () =>
		renderXY[0] / cellWidth + "_" + renderXY[1] / cellHeight;

let saveX, saveY;
let mapCellArr = {
	mapBase1: {},
	mapBase2: {},
	mapBase3: {},
	mapShadowMid1: {},
	mapMid1: {},
	mapShadowMid2: {},
	mapMid2: {},
	mapShadowTop: {},
	mapTop: {},
};
let mapPathArr = {};
let stash = null;

class MapMaker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showTile: "",
			showFileOptions: true,
			showOpsChildren: "main",
			showRenderControls: true,
			errormessage: "",
			toggleMapGrid: true,
			erase: false,
			mapList: "",
			selectedMap: "",
			stashName: "",
			mapName: "",
			changes: 0,
			isAnimationOn: false,
			mapAnimationArr: [],
			animationFrames: [],
			exFormat: "webm",
			fps: 15,
			cps: 15,
			ads: 1,
			ref: "",
			layer: "mapBase1",
			z: [],
			z_: 0,
			ztart: null,
			zMult: 1,
			//custom tilesets
			custom1: "",
			custom2: "",
			custom3: "",
			//history for redo undo, and action index to map on history
			history: [],
			actionIndex: -1,
			method: "",
			//layers stack preview
			layersStackPreview: [],
			lspToggle: true,
			//canvas resizing
			autoResize: false,
		};

		this._showFileOptions = this._showFileOptions.bind(this);
		this._showChild = this._showChild.bind(this);
		this._newMap = this._newMap.bind(this);
		this._toggleMapGrid = this._toggleMapGrid.bind(this);
		this._createNewStash = this._createNewStash.bind(this);
		this._saveAs = this._saveAs.bind(this);
		this._load = this._load.bind(this);
		this._tilesetOnChange = this._tilesetOnChange.bind(this);
		this._toggleAnimation = this._toggleAnimation.bind(this);
		this._mapHistory = this._mapHistory.bind(this);
		this._drawTimeTravel = this._drawTimeTravel.bind(this);
		this._layerOnChange = this._layerOnChange.bind(this);
		this._setStateCallback = this._setStateCallback.bind(this);
		this._zoomFunction = this._zoomFunction.bind(this);
		this._returnATileset = this._returnATileset.bind(this);
		this._drawTile = this._drawTile.bind(this);
	}

	componentDidMount() {
		document.querySelector("#Group2").oncontextmenu = (event) => {
			event.preventDefault();
		};
		//I injected a function to CCapture.all.min.js
		injectThis = (type, data) => {
			console.log("Triggering injected function..");
			switch (type) {
				case "done":
					this._showFileOptions();
					break;
				case "detail":
					const loadingDetails = document.querySelector(
						"#loadingDetails"
					);
					if (loadingDetails) loadingDetails.textContent = data;
					break;
			}
		};
		mapBase1 = document.querySelector("#mapBase1");
		mapBase2 = document.querySelector("#mapBase2");
		mapBase3 = document.querySelector("#mapBase3");
		mapShadowMid1 = document.querySelector("#mapShadowMid1");
		mapMid1 = document.querySelector("#mapMid1");
		mapShadowMid2 = document.querySelector("#mapShadowMid2");
		mapMid2 = document.querySelector("#mapMid2");
		mapAnimate = document.querySelector("#mapAnimate");
		mapShadowTop = document.querySelector("#mapShadowTop");
		mapTop = document.querySelector("#mapTop");
		frameSelect = document.querySelector("#frameSelect");
		frameSelectAnimation = document.querySelector("#frameSelectAnimation");
		mapClickCatcher = document.querySelector("#mapClickCatcher");
		captureCanvas = document.querySelector("#captureCanvas");
		mapScaler = document.querySelector("#mapScaler");
		mapCont = document.querySelector("#mapCont");

		//ZOOM FUNCTION
		mapScaler.addEventListener("wheel", this._zoomFunction);

		//HOTKEYS
		window.addEventListener("keypress", (e) => {
			if (!this.state.showFileOptions) {
				console.log(e.keyCode);

				const thePath = mapPathArr[getPathCoordinate()];
				switch (e.keyCode) {
					//e == eraser button toggle
					case 101:
						this.setState((currState) => {
							return { erase: !currState.erase };
						});
						break;
					//g == toggle map grid
					case 103:
						this._toggleMapGrid();
						break;
					//a == animation button toggle
					case 97:
						this._toggleAnimation();
						break;

					//s == set the Z of a path by 1 cell
					case 115:
						if (mapPathArr[getPathCoordinate()]) {
							//if not active yet
							if (!this.state.ztart || this.state.zMult == 0.2) {
								this.setState({
									ztart: pathXY,
									zMult: 1,
								});
							} else {
								mapPathArr[getPathCoordinate()] = this.state.z;
								const modHist = JSON.parse(
									JSON.stringify(this.state.history)
								);
								modHist.filter(
									(x) =>
										x.redo.arrSrc == "mapPathArr" &&
										x.redo.prop == getPathCoordinate()
								)[0].redo.val = this.state.z;
								this.setState({
									ztart: null,
									history: modHist,
								});
							}
						}

						break;

					//d == set the Z of a path by 0.2 cell
					case 100:
						if (mapPathArr[getPathCoordinate()]) {
							//if not active yet
							if (!this.state.ztart || this.state.zMult == 1) {
								this.setState({
									ztart: pathXY,
									zMult: 0.2,
								});
							} else {
								mapPathArr[getPathCoordinate()] = this.state.z;
								const modHist = JSON.parse(
									JSON.stringify(this.state.history)
								);
								modHist.filter(
									(x) =>
										x.redo.arrSrc == "mapPathArr" &&
										x.redo.prop == getPathCoordinate()
								)[0].redo.val = this.state.z;
								this.setState({
									ztart: null,
									history: modHist,
								});
							}
						}

						break;

					//f == switch from Z's of a path
					case 102:
						if (thePath) {
							this.setState((currState) => {
								return {
									z_:
										currState.z_ >= currState.z.length - 1
											? 0
											: currState.z_ + 1,
								};
							});
						}
						break;

					//x == delete a Z from a path
					case 120:
						if (thePath && thePath.length > 1) {
							thePath.splice(this.state.z_, 1);
							this.setState({ z: thePath });
						}
						break;

					//c == add a Z to a path
					case 99:
						if (thePath) {
							thePath.push(0);
							this.setState({ z: thePath });
						}
						break;

					//undo [z]
					case 122:
						this._mapHistory("undo");
						break;

					//redo[y]
					case 121:
						this._mapHistory("redo");
						break;
					//q == auto resize
					case 113:
						this.setState((currState) => {
							return {
								autoResize:
									currState.autoResize == "15% 15% 70%" ||
									currState.autoResize == "55% 15% 30%"
										? false
										: "15% 15% 70%",
							};
						});
						break;
					//w == fullscreen canvas
					case 119:
						this.setState((currState) => {
							return {
								autoResize:
									currState.autoResize == "0px 0px 100%"
										? false
										: "0px 0px 100%",
							};
						});
						break;
				}
			}
		});

		//================================================
		//==============MOUSE EVENTS ON MAP/TILES=========
		//================================================
		const tilesCont = document.querySelector("#tilesCont");

		let attachment = false,
			lastPosition,
			position,
			difference;

		const ctx = frameSelect.getContext("2d"),
			ctx2 = mapClickCatcher.getContext("2d");

		let offX, offY;

		const frameSelectSquares = () => {
			if (this.state.isAnimationOn) {
				const len = this.state.animationFrames.length;
				//dont draw if frames are already 7
				if (len >= 10) return;

				const coloroyGbeef = [
					"#FF0000",
					"#FF00A2",
					"#C000FF",
					"#1800FF",
					"#007EFF",
					"#00FFE4",
					"#00FF60",
					"#48FF00",
					"#F0FF00",
					"#FF8400",
				];

				ctx.strokeStyle = coloroyGbeef[len];
			} else {
				ctx.strokeStyle = "red";
			}
			ctx.clearRect(0, 0, frameSelect.width, frameSelect.height);

			ctx.beginPath();
			ctx.rect(selX, selY, selW, selH);
			ctx.lineWidth = 5;
			ctx.stroke();
		};

		//MOUSE DOWN
		const mDown = (e) => {
			//drag
			if (e.buttons == 2) {
				attachment = true;
				lastPosition = [e.clientX, e.clientY];
			}
			//square
			if (e.buttons == 1 && e.target.id == "frameSelect") {
				(offX = e.offsetX), (offY = e.offsetY);

				selX = offX - (offX % cellWidth);
				selY = offY - (offY % cellHeight);
				[saveX, saveY] = [selX, selY];
				selW = cellWidth;
				selH = cellHeight;
				this.setState({
					erase: false,
				});

				frameSelectSquares();
			}
			if (e.buttons == 1 && e.target.id == "mapClickCatcher") {
				e.target.style.cursor =
					!this.state.erase && e.buttons != 1
						? "grabbing"
						: !this.state.erase && e.buttons == 1
						? "grab"
						: "cell";
				this._drawTile(true);
			}
		};

		//MOUSE MOVE
		const mMove = (e) => {
			//drag/move map/tileset
			if (e.buttons == 2 && attachment == true) {
				position = [e.clientX, e.clientY];
				difference = [
					position[0] - lastPosition[0],
					position[1] - lastPosition[1],
				];

				let targetScroll;
				if (e.target.id == "frameSelect") targetScroll = tilesCont;
				// if (
				// 	e.target.id == "mapClickCatcher" ||
				// 	e.target.id == "mapCont"
				// )
				// 	targetScroll = mapCont;
				if (targetScroll) {
					targetScroll.scrollLeft =
						targetScroll.scrollLeft - difference[0];
					targetScroll.scrollTop =
						targetScroll.scrollTop - difference[1];
					lastPosition = [e.clientX, e.clientY];
				}

				//TRY TRANSLATE MOVE ON CANVAS
				if (e.target.id == "mapClickCatcher") {
					const matches = mapScaler.style.transform.match(
						/(-)?(\d+)(\.)?(\d+)?/g
					);

					mapScaler.style.transform = `translate(${
						parseInt(matches[0]) + difference[0]
					}px,${parseInt(matches[1]) + difference[1]}px) scale(${
						scX + 1
					},${scY + 1})`;
					lastPosition = [e.clientX, e.clientY];
				}

				//---------------------------------
			}
			//square on tileset
			if (e.buttons == 1 && e.target.id == "frameSelect") {
				(offX = e.offsetX), (offY = e.offsetY);

				const tempX = offX - selX,
					tempY = offY - selY;
				const operatorX = tempX >= 0 ? 1 : -1,
					operatorY = tempY >= 0 ? 1 : -1;

				//enable selecting square back and fort
				if (operatorX == -1) {
					selX = saveX + cellWidth;
				} else selX = saveX;
				if (operatorY == -1) {
					selY = saveY + cellHeight;
				} else selY = saveY;
				selW = tempX - (tempX % cellWidth) + cellWidth * operatorX;
				selH = tempY - (tempY % cellHeight) + cellHeight * operatorY;

				frameSelectSquares();
			}
			//mapClickCatcher square on mouse hover
			if (e.target.id == "mapClickCatcher") {
				e.target.style.cursor =
					!this.state.erase && e.buttons != 1
						? "grabbing"
						: !this.state.erase && e.buttons == 1
						? "grab"
						: "cell";

				const oX = e.offsetX,
					oY = e.offsetY;

				//draw square function
				const strokeRect = (x, y, w, h) => {
					ctx2.clearRect(
						0,
						0,
						mapClickCatcher.width,
						mapClickCatcher.height
					);

					ctx2.beginPath();
					ctx2.rect(x, y, w, h);

					ctx2.strokeStyle = this.state.erase
						? "white"
						: !this.state.showRenderControls
						? "#7AFE70"
						: this.state.isAnimationOn
						? "blue"
						: "red";
					ctx2.lineWidth = 2;
					ctx2.stroke();
				};
				const fillRect = (x, y, w, h) => {
					ctx2.beginPath();
					ctx2.fillStyle = "red";
					ctx2.globalAlpha = 0.5;
					ctx2.fillRect(x, y, w, h);
				};

				//pathXY
				if (!this.state.showRenderControls) {
					//the main setter of pathXY coordinates
					const x =
							Math.floor(
								(oX + charCellWidth / 2) / charCellWidth
							) *
								charCellWidth -
							charCellWidth / 2,
						y =
							Math.floor(
								(oY + charCellHeight / 2) / charCellHeight
							) *
								charCellHeight -
							charCellHeight / 2;

					//if not setting the Z
					if (!this.state.ztart) {
						if (pathXY[0] != x || pathXY[1] != y) {
							pathXY = [x, y];
							//the green square
							strokeRect(
								pathXY[0],
								pathXY[1],
								charCellWidth,
								charCellHeight
							);
							const isAPath = mapPathArr[getPathCoordinate()];

							//if path, draw the red squares
							if (isAPath) {
								isAPath.map((x, i) => {
									fillRect(
										pathXY[0],
										pathXY[1] - isAPath[i] * charCellHeight,
										charCellWidth,
										charCellHeight
									);
								});
							}
							this.setState({
								//z to update the list
								z: isAPath,
								//z_=0 to reset the selection
								z_: 0,
							});
						} else return;
					}
					//else if setting the Z
					else {
						//the green square
						strokeRect(
							this.state.ztart[0],
							this.state.ztart[1],
							charCellWidth,
							charCellHeight
						);
						const yMult =
							Math.floor(
								oY / (charCellHeight * this.state.zMult)
							) *
								(charCellHeight * this.state.zMult) -
							charCellHeight / 2;
						//set the Z based on mouse Y
						let z = this.state.z;
						z[this.state.z_] = (
							this.state.ztart[1] / charCellHeight -
							yMult / charCellHeight
						).toFixed(1);
						if (z[this.state.z_] == -0.0) z[this.state.z_] = "0.0";
						//put that in state
						this.setState({
							z,
						});
						//draw all the red sqaures of each z's
						z.map((zEntry, i) => {
							fillRect(
								this.state.ztart[0],
								this.state.ztart[1] - z[i] * charCellHeight,
								charCellWidth,
								charCellHeight
							);
						});
					}
				}
				//renderXY
				else {
					const x = Math.floor(oX / cellWidth) * cellWidth,
						y = Math.floor(oY / cellHeight) * cellHeight;

					if (renderXY[0] != x || renderXY[1] != y) {
						renderXY = [x, y];
						if (this.state.erase) {
							strokeRect(
								renderXY[0],
								renderXY[1],
								cellWidth,
								cellHeight
							);
						} else {
							strokeRect(renderXY[0], renderXY[1], selW, selH);
						}

						//the layers stack preview function
						this.setState({
							layersStackPreview: Object.keys(mapCellArr).map(
								(l) => mapCellArr[l][getRenderCoordinate()]
							),
						});
					} else return;
				}

				//PAINT TILE
				if (e.buttons == 1) {
					this._drawTile(false);
				}
			}
		};

		//MOUSE UP
		const mUp = (e) => {
			attachment = false;
			if (
				this.state.isAnimationOn &&
				e.target.id == "frameSelect" &&
				e.button == 0
			) {
				//if mouseup, push data to this.state.animationFrames

				const ctx = frameSelectAnimation.getContext("2d");
				ctx.drawImage(
					frameSelect,
					0,
					0,
					frameSelect.width,
					frameSelect.height
				);

				if (this.state.animationFrames.length < 7) {
					this.setState((currState) => {
						return {
							animationFrames: currState.animationFrames.concat({
								sx: selX,
								sy: selY,
								w: selW,
								h: selH,
								tileset: currState.showTile,
							}),
						};
					});
				}
			}

			if (e.target.id == "mapClickCatcher")
				e.target.style.cursor = !this.state.erase ? "grabbing" : "cell";
		};

		//AND NOW IT'S TIME TO ATTACH THESE EVENTS!!
		tilesCont.addEventListener("mousedown", mDown);
		tilesCont.addEventListener("mousemove", mMove);
		tilesCont.addEventListener("mouseup", mUp);
		mapCont.addEventListener("mousedown", mDown);
		mapCont.addEventListener("mousemove", mMove);
		mapCont.addEventListener("mouseup", mUp);

		//================AUTO RESIZE CANVAS=========
		const G2 = document.querySelector("#Group2");
		const s1 = document.querySelector("#G2s1");
		s1.addEventListener("mousedown", () => {
			if (
				this.state.autoResize != "0px 0px 100%" &&
				this.state.autoResize
			)
				this.setState({ autoResize: "55% 15% 30%" });
		});
		const s3 = document.querySelector("#G2s3");
		s3.addEventListener("mousedown", () => {
			if (
				this.state.autoResize != "0px 0px 100%" &&
				this.state.autoResize
			)
				this.setState({ autoResize: "15% 15% 70%" });
		});

		//================DRAW FUNCTIONS=============
		//drawing layer canvas
		const getLayer = () =>
			document.querySelector("#" + this.state.layer).getContext("2d");

		//char grid layer canvas
		const ctx4 = document.querySelector("#charGrid").getContext("2d");

		this.drawPath = (x, y) => {
			ctx4.globalAlpha = 0.5;
			ctx4.fillStyle = "blue";
			ctx4.fillRect(
				Math.round(x) + 1,
				Math.round(y) + 1,
				Math.floor(charCellWidth - 2),
				Math.floor(charCellHeight - 2)
			);
		};
		this.erasePath = (x, y) => {
			ctx4.clearRect(
				Math.round(x) + 1,
				Math.round(y) + 1,
				Math.floor(charCellWidth - 2),
				Math.floor(charCellHeight - 2)
			);
		};
		this.drawRender = (ref, sx, sy, sw, sh, rx, ry, rw, rh, layer) => {
			const ctx3 = layer
				? document.querySelector("#" + layer).getContext("2d")
				: getLayer();
			ctx3.clearRect(rx, ry, rw, rh);
			ctx3.drawImage(ref, sx, sy, sw, sh, rx, ry, rw, rh, layer);
		};
		this.eraseRender = (x, y, layer) => {
			const ctx3 = layer
				? document.querySelector("#" + layer).getContext("2d")
				: getLayer();
			ctx3.clearRect(x, y, cellWidth, cellHeight);
		};
		//================================================
		//================================================

		this._mapAnimation();
	}
	// COMPONENTDIDMOUT ABOVE ------------------------------
	componentDidUpdate(prevProps, prevState) {
		if (prevState.actionIndex != this.state.actionIndex) {
			this.state.method && this._drawTimeTravel(this.state.method);
		}
		if (
			(prevState.changes != this.state.changes ||
				JSON.stringify(prevState.layersStackPreview) !=
					JSON.stringify(this.state.layersStackPreview)) &&
			this.state.showRenderControls
		) {
			this.state.layersStackPreview.map((x, i) => {
				const ctx = document
					.querySelector("#lsp_" + i)
					.getContext("2d");
				ctx.clearRect(0, 0, cellWidth, cellHeight);

				if (x) {
					const ref = document.querySelector("#" + x[2]);

					ctx.drawImage(
						ref,
						x[0],
						x[1],
						cellWidth,
						cellHeight,
						0,
						0,
						cellWidth,
						cellHeight
					);
				}
			});
		}
	}
	_setStateCallback(value) {
		this.setState(value);
	}

	_zoomFunction(e) {
		scX = parseFloat(scX);
		scY = parseFloat(scY);

		let adj = 1,
			deductX = 0,
			deductY = 0;
		if (e) {
			e.preventDefault();

			[scX, scY] = e.deltaY < 0 ? [scX + 1, scY + 1] : [scX - 1, scY - 1];

			//scale zoom associated with pointer position
			console.log("BEFORE: " + scX);
			if (scX >= -1 && scX <= 7) {
				const mapScalerSize = [
					parseInt(mapScaler.style.width),
					parseInt(mapScaler.style.height),
				];
				const divider = scX == 0.5 || scX == -1 ? 0.5 : 1;
				console.log(scX);
				deductX = (mapScalerSize[0] / 2 - e.offsetX) * divider;
				deductY = (mapScalerSize[1] / 2 - e.offsetY) * divider;
				if (e.deltaY > 0) adj = -1;
			}

			//--------------------------------------------

			//min max
			if (scX < -0.5) [scX, scY] = [-0.5, -0.5];
			if (scX == 0.5) [scX, scY] = [0, 0]; //when increment from very bottom, readjust
			if (scX > 7) [scX, scY] = [7, 7];

			document.querySelector("#zoomValue").textContent =
				parseInt((scX + 1) * 100) + "%";
			document.querySelector("#zoom").value = "label";
		}

		//for old scroll zoom
		// const x = (cols * cellWidth * scX) / 2,
		// 	y = (rows * cellHeight * scY) / 2;

		const matches = mapScaler.style.transform.match(
			/(-)?(\d+)(\.)?(\d+)?/g
		);

		// const matches = mapScaler.style.transform.replace
		console.log(mapScaler.style.transform);
		console.log(matches);
		mapScaler.style.transform = `translate(${
			parseFloat(matches[0]) + deductX * adj
		}px,${parseFloat(matches[1]) + deductY * adj}px) scale(${1 + scX},${
			1 + scY
		})`;
	}
	_showFileOptions() {
		this.setState((currState) => {
			return {
				showFileOptions: !currState.showFileOptions,
			};
		});
	}
	_showChild(name) {
		this.setState((currState) => {
			return {
				showOpsChildren: name,
			};
		});
	}

	_toggleMapGrid() {
		this.setState((currState) => {
			return {
				toggleMapGrid: !currState.toggleMapGrid,
			};
		});
	}
	_newMap(w, h, u) {
		//if current map is not yet saved, ask
		if (this.state.changes != 0) {
			const conf = confirm(
				"You haven't saved your current progress yet, proceed loading another file without saving?"
			);
			if (!conf) return false;
		}
		//redeclare variables
		(scX = 0), (scY = 0);
		mapCellArr = {
			mapBase1: {},
			mapBase2: {},
			mapBase3: {},
			mapShadowMid1: {},
			mapMid1: {},
			mapShadowMid2: {},
			mapMid2: {},
			mapShadowTop: {},
			mapTop: {},
		};
		mapPathArr = {};

		const g = document.querySelector("#mapGrid"),
			cg = document.querySelector("#charGrid");

		let mapW, mapH;

		if (u) {
			cols = Math.floor(w / cellWidth);
			rows = Math.floor(h / cellHeight);
			(mapW = w), (mapH = h);
		} else {
			(cols = w),
				(rows = h),
				(mapW = w * cellWidth),
				(mapH = h * cellHeight);
		}

		[
			mapBase1,
			mapBase2,
			mapBase3,
			mapShadowMid1,
			mapMid1,
			mapAnimate,
			mapShadowMid2,
			mapMid2,
			mapShadowTop,
			mapTop,
			g,
			cg,
			mapClickCatcher,
			captureCanvas,
		].map((x) => {
			(x.width = mapW), (x.height = mapH), (x.style.opacity = 1);
		});
		mapScaler.style.width = mapW + "px";
		mapScaler.style.height = mapH + "px";
		mapScaler.style.left = 0;
		mapScaler.style.top = 0;
		mapScaler.style.transform = "scale(1,1)";
		scalerHeight = mapH;

		let i, j;

		const ctx = g.getContext("2d");
		const ctx2 = cg.getContext("2d");
		ctx.clearRect(0, 0, g.width, g.height);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
		ctx2.clearRect(0, 0, cg.width, cg.height);
		ctx2.strokeStyle = "#538EF0";
		ctx2.globalAlpha = 0.4;
		ctx2.lineWidth = 1;
		i = 0;
		for (i; i <= cols; i++) {
			const x = i * cellWidth;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, mapH);
			ctx.stroke();
			//the column label
			ctx.font = "20px Arial Bold";
			ctx.fillStyle = "white";
			ctx.fillText(i, x, cellHeight / 2);

			j = 0;
			for (j; j < 3; j++) {
				const x2 = x + j * charCellWidth + charCellWidth / 2;
				ctx2.beginPath();
				ctx2.moveTo(x2, 0);
				ctx2.lineTo(x2, mapH);
				ctx2.stroke();
			}
		}

		i = 0;
		for (i; i <= rows; i++) {
			const y = i * cellHeight;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(mapW, y);
			ctx.stroke();
			//the row label
			ctx.font = "20px Arial Bold";
			ctx.fillStyle = "white";
			ctx.fillText(i, 0, y + cellHeight / 2);
			j = 0;
			for (j; j < 3; j++) {
				const y2 = y + j * charCellHeight + charCellHeight / 2;
				ctx2.beginPath();
				ctx2.moveTo(0, y2);
				ctx2.lineTo(mapW, y2);
				ctx2.stroke();
			}
		}

		this.setState({
			showFileOptions: false,
			showOpsChildren: "main",
			mapName: "",
			mapAnimationArr: [],
		});
		return true;
	}
	_drawTile(isMouseDown, fromAnimationHistory) {
		//the change done to store in data for redo undo
		let changeDone, mapAnimationArr;

		//if on PATH MODE
		if (!this.state.showRenderControls && !this.state.erase) {
			//set the path cell data and render square
			const coordTemp = getPathCoordinate();
			if (!(coordTemp in mapPathArr)) {
				//save the current state before changing
				changeDone = {
					undo: {
						arrSrc: "mapPathArr",
						prop: coordTemp,
						val: null,
						coordRender: [pathXY[0], pathXY[1]],
					},
					redo: {
						arrSrc: "mapPathArr",
						prop: coordTemp,
						val: ["0.0"],
						coordRender: [pathXY[0], pathXY[1]],
					},
				};
				mapPathArr[coordTemp] = ["0.0"];

				this.drawPath(pathXY[0], pathXY[1]);
			} else return;
		}
		//else if erase, just erase, update and return
		else if (this.state.erase && !fromAnimationHistory) {
			//use 'let' so we can delete it
			const prop1 = this.state.layer,
				prop2 = getRenderCoordinate();

			let objRender = mapCellArr[prop1][prop2];
			//if on erase and rendering mode
			if (this.state.showRenderControls && objRender) {
				changeDone = {
					undo: {
						arrSrc: "mapCellArr",
						data: [
							{
								layer: this.state.layer,
								prop: prop2,
								val: mapCellArr[prop1][prop2],
							},
						],
					},
					redo: {
						arrSrc: "mapCellArr",
						data: [
							{
								layer: this.state.layer,
								prop: prop2,
							},
						],
					},
				};
				//clear a tile
				this.eraseRender(renderXY[0], renderXY[1]);
				//remove the data of that tile (direct objRenderer cannot be deleted)
				delete mapCellArr[prop1][prop2];
			}
			//else if on erase and path mode
			else if (!this.state.showRenderControls) {
				const coordTemp = getPathCoordinate();
				if (coordTemp in mapPathArr) {
					//save the current state before changing
					changeDone = {
						undo: {
							arrSrc: "mapPathArr",
							prop: coordTemp,
							val: mapPathArr[coordTemp],
							coordRender: [pathXY[0], pathXY[1]],
						},
						redo: {
							arrSrc: "mapPathArr",
							prop: coordTemp,
							val: null,
							coordRender: [pathXY[0], pathXY[1]],
						},
					};
					//remove the data of that tile
					delete mapPathArr[coordTemp];
					//clear a tile
					this.erasePath(pathXY[0], pathXY[1]);
				} else return;
			} else return;
		}
		//else,if not animating and has selected tile, draw the tile
		else if (
			!this.state.isAnimationOn &&
			selX != undefined &&
			!fromAnimationHistory
		) {
			//setting for mapCellArr
			//DAYS LATER.. I DONT FKING KNOW NOW HOW DID THIS WORK
			//BECAUSE I FORGOT TO WRITE THE COMMENTS @#@#!%$#@$#@#
			const forJ =
				selH > 0
					? { validate: (a, b) => a < b, incDec: 1, adj: 0 }
					: { validate: (a, b) => a > b, incDec: -1, adj: -1 };
			const forI =
				selW > 0
					? { validate: (a, b) => a < b, incDec: 1, adj: 0 }
					: { validate: (a, b) => a > b, incDec: -1, adj: -1 };

			//4/23/2020 - i'm modifying this now and surely gonna write comment!!

			//store data here to validate
			let data = [];
			let dataCompare = []; //the previous data to compare  to new
			for (
				let j = 0;
				forJ.validate(j, selH / cellHeight);
				j += forJ.incDec
			) {
				//DID I EFFIN WRITE THESE??? WTFFFF #$@%#^%^@*#*

				for (
					let i = 0;
					forI.validate(i, selW / cellWidth);
					i += forI.incDec
				) {
					const xIndex = renderXY[0] / cellWidth + i + forI.adj,
						yIndex = renderXY[1] / cellHeight + j + forJ.adj;
					if (
						xIndex >= 0 &&
						yIndex >= 0 &&
						xIndex < cols &&
						yIndex < rows
					) {
						dataCompare.push({
							layer: this.state.layer,
							prop: xIndex + "_" + yIndex,
							val:
								mapCellArr[this.state.layer][
									xIndex + "_" + yIndex
								],
						});
						data.push({
							layer: this.state.layer,
							prop: xIndex + "_" + yIndex,
							val: [
								selX + (i + forI.adj) * cellWidth,
								selY + (j + forJ.adj) * cellHeight,
								this.state.showTile,
							],
						});
					}
				}
			}
			//if rendered vs to be rendered are the same, do nothing
			if (JSON.stringify(data) == JSON.stringify(dataCompare)) {
				return;
			}
			changeDone = {
				undo: {
					arrSrc: "mapCellArr",
					data: dataCompare,
				},
				redo: {
					arrSrc: "mapCellArr",
					data,
				},
			};

			data.map((d) => {
				mapCellArr[d.layer][d.prop] = d.val;
			});
			this.drawRender(
				this.state.ref,
				selX,
				selY,
				selW,
				selH,
				renderXY[0],
				renderXY[1],
				selW,
				selH
			);
		}
		//else if animating.. (length will be > 0 if animating)
		else if (this.state.animationFrames.length > 0 && isMouseDown) {
			changeDone = {
				undo: {
					arrSrc: "mapAnimationArr",
					data: this.state.mapAnimationArr,
				},
				redo: {
					arrSrc: "mapAnimationArr",
					data: this.state.mapAnimationArr.concat({
						rx: renderXY[0],
						ry: renderXY[1],
						fps: this.state.fps,
						src: this.state.animationFrames,
					}),
				},
			};

			mapAnimationArr = this.state.mapAnimationArr.concat({
				rx: renderXY[0],
				ry: renderXY[1],
				fps: this.state.fps,
				src: this.state.animationFrames,
			});
		} else if (fromAnimationHistory) {
			const val = document.querySelector("#selAnimationInstance").value;
			console.log(val);
			let toDel;
			{
				/*if none choose, select the last index*/
			}
			if (this.state.mapAnimationArr.length > 0) {
				if (val == "") {
					toDel = this.state.mapAnimationArr.length - 1;
				} else toDel = val;

				const arrs = this.state.mapAnimationArr.concat();
				arrs.splice(toDel, 1);

				mapAnimationArr = arrs;

				changeDone = {
					undo: {
						arrSrc: "mapAnimationArr",
						data: this.state.mapAnimationArr,
					},
					redo: {
						arrSrc: "mapAnimationArr",
						data: arrs,
					},
				};
			} else return;
		} else return;

		//if history and action index are not equal, cut the excess history indices
		let tempHistory;
		if (this.state.history.length > this.state.actionIndex + 1) {
			tempHistory = JSON.parse(JSON.stringify(this.state.history));
			tempHistory.splice(this.state.actionIndex + 1);
		}
		this.setState((currState) => {
			return {
				changes: currState.changes + 1,
				history: tempHistory
					? tempHistory.concat(changeDone)
					: currState.history.concat(changeDone),
				actionIndex: currState.actionIndex + 1,
				mapAnimationArr: mapAnimationArr
					? mapAnimationArr
					: currState.mapAnimationArr,
				layersStackPreview: Object.keys(mapCellArr).map(
					(l) => mapCellArr[l][getRenderCoordinate()]
				),
			};
		});
	}
	//the draw function of history undo redo
	_drawTimeTravel(method) {
		//get the pointer in history
		const toDo =
			method == "undo"
				? this.state.history[this.state.actionIndex + 1]
				: this.state.history[this.state.actionIndex];

		switch (toDo[method].arrSrc) {
			case "mapPathArr":
				if (toDo[method].val) {
					mapPathArr[toDo[method].prop] = toDo[method].val;
					this.drawPath(...toDo[method].coordRender);
				} else {
					delete mapPathArr[toDo[method].prop];
					this.erasePath(...toDo[method].coordRender);
				}
				break;
			case "mapCellArr":
				//for render history
				if (toDo[method].data) {
					//-------
					toDo[method].data.map((d) => {
						//render axis
						const axis = d.prop.split("_");
						//draw the render data from toDo[method].data
						if (d.val) {
							this.drawRender(
								document.querySelector("#" + d.val[2]),
								d.val[0],
								d.val[1],
								cellWidth,
								cellHeight,
								axis[0] * cellWidth,
								axis[1] * cellHeight,
								cellWidth,
								cellHeight,
								d.layer
							);
							//set the mapCellArr
							mapCellArr[d.layer][d.prop] = d.val;
						} else {
							this.eraseRender(
								axis[0] * cellWidth,
								axis[1] * cellHeight,
								d.layer
							);
							delete mapCellArr[d.layer][d.prop];
						}
					});
					//------------------
				}

				break;

			case "mapAnimationArr":
				this.setState({
					mapAnimationArr: toDo[method].data,
				});
				break;
		}
		//turn method back to empty and update layer stack preview
		this.setState({
			method: "",
			layersStackPreview: Object.keys(mapCellArr).map(
				(l) => mapCellArr[l][getRenderCoordinate()]
			),
		});
	}
	_mapHistory(method) {
		//know the method then process
		if (method == "undo") {
			//decrement index when undo and valid
			if (this.state.actionIndex > -1) {
				this.setState((currState) => {
					return {
						actionIndex: currState.actionIndex - 1,
						method,
						changes: currState.changes - 1,
					};
				});
			}
		}
		//else if redo
		else {
			//increment index when redo and valid
			if (this.state.actionIndex < this.state.history.length - 1) {
				this.setState((currState) => {
					return {
						actionIndex: currState.actionIndex + 1,
						method,
						changes: currState.changes + 1,
					};
				});
			}
		}
	}
	_toggleVisibility(e) {
		document.querySelector("#" + e.target.name).style.opacity =
			parseInt(e.target.value) * 0.1;
	}
	_createNewStash() {
		const cStashName = document.querySelector("#cStashName").value;

		this._showChild("loading");
		const req = new XMLHttpRequest();
		req.open("POST", "/mapmaker/createstash", true);
		req.setRequestHeader("Content-Type", "text/plain");
		req.onreadystatechange = () => {
			if (req.readyState == 4 && req.status == 200) {
				this._showChild("createnewstash");
				const json = JSON.parse(req.responseText);
				const errDom = document.querySelector("#cStashErr");
				const valDom = document.querySelector("#cStashVal");
				this._showErrMsg(errDom, json, valDom);
			} else if (req.readyState == 4) {
				this.setState({
					showOpsChildren: "errormessage",
					errormessage:
						"Failed to create due to network issue, please try again.",
				});
			}
		};

		req.send(cStashName);
	}
	_openStash(stashName, stashKey) {
		this._showChild("loading");
		const req = new XMLHttpRequest();
		req.open("POST", "/mapmaker/openstash", true);
		req.setRequestHeader("Content-Type", "application/json");

		req.onreadystatechange = () => {
			if (req.readyState == 4 && req.status == 200) {
				const json = JSON.parse(req.responseText);
				if (json.type == "error") {
					this._showChild("main");
					const errDom = document.querySelector("#oStashErr");
					this._showErrMsg(errDom, json);
				} else {
					stash = json.message;
					this._showChild("openstash");
					this.setState({
						stashName: stash.mapStashName,
					});

					let jsx = (
						<select
							id="mapList"
							size="7"
							onChange={(e) => {
								if (this.state.showOpsChildren == "saveas") {
									document.querySelector(
										"#saveAsName"
									).value = e.target.value;
								}
								this.setState({
									selectedMap: e.target.value,
								});
							}}
						>
							{Object.keys(stash.maps).map((x, i) => {
								if (x)
									return (
										<option key={i} value={x}>
											{x}
										</option>
									);
							})}
						</select>
					);

					this.setState({
						mapList: jsx,
					});
				}
			} else if (req.readyState == 4) {
				this.setState({
					showOpsChildren: "errormessage",
					errormessage:
						"Failed to open due to network issue, please try again.",
				});
			}
		};
		req.send(JSON.stringify({ stashName, stashKey }));
	}
	_showErrMsg(dom, msgObj, val) {
		dom.style.color = msgObj.type == "error" ? "red" : "green";
		dom.textContent = msgObj.message;
		if (val) {
			val.textContent = msgObj.val;
		}
	}
	_saveAs(directSave) {
		this._showChild("loading");
		const saveasname = directSave
			? this.state.mapName
			: document.querySelector("#saveAsName").value;

		//if "save as" and no name input
		if (!saveasname && !directSave) {
			this._showChild("saveas");
			const errDom = document.querySelector("#saveErr");
			this._showErrMsg(errDom, {
				type: "error",
				message: "Invalid map name",
			});
			return;
		} else if (!saveasname && directSave) {
			//if not yet saved previously
			this._showChild("saveas");
			return;
		} else if (saveasname in stash.maps && !directSave) {
			//if replacing a file, ask confirmation
			const conf = confirm(`Replace this file? "${saveasname}"`);
			if (!conf) {
				this._showChild("saveas");
				return;
			}
		}

		//save the new map to local stash variable first
		stash.maps[saveasname] = {
			mapWidth: mapBase1.width,
			mapHeight: mapBase1.height,
			render: mapCellArr,
			pathData: mapPathArr,
			mapAnimationArr: this.state.mapAnimationArr,
		};
		const req = new XMLHttpRequest();
		req.open("POST", "/mapmaker/savestash", true);
		req.setRequestHeader("Content-Type", "application/json");

		req.onreadystatechange = () => {
			if (req.readyState == 4 && req.status == 200) {
				const json = JSON.parse(req.responseText);
				console.log(json);
				if (json.type == "error") {
					this._showChild("saveas");
					const errDom = document.querySelector("#saveErr");
					this._showErrMsg(errDom, json);
				} else {
					let jsx = (
						<select
							id="mapList"
							size="7"
							onChange={(e) => {
								if (this.state.showOpsChildren == "saveas") {
									document.querySelector(
										"#saveAsName"
									).value = e.target.value;
								}

								this.setState({
									selectedMap: e.target.value,
								});
							}}
						>
							{Object.keys(stash.maps).map((x, i) => {
								if (x)
									return (
										<option key={i} value={x}>
											{x}
										</option>
									);
							})}
						</select>
					);

					this.setState({
						mapList: jsx,
						mapName: saveasname,
						changes: 0,
					});

					this._showFileOptions();
				}
			} else if (req.readyState == 4) {
				this.setState({
					showOpsChildren: "errormessage",
					errormessage:
						"Failed to save due to network issue, please try again.",
				});
			}
		};
		//send the local stash to server to save to DB
		req.send(
			JSON.stringify({
				mapStashName: stash.mapStashName,
				mapName: saveasname,
				mapData: stash.maps[saveasname],
			})
		);
	}
	_load(mapName) {
		console.log("Loading map: " + mapName);
		//get the map to load
		const map = stash.maps[mapName];
		//create new map area to load the render
		const conf = this._newMap(map.mapWidth, map.mapHeight, true);
		if (!conf) return;
		//draw the render from all layers
		[
			"mapBase1",
			"mapBase2",
			"mapBase3",
			"mapShadowMid1",
			"mapMid1",
			"mapShadowMid2",
			"mapMid2",
			"mapShadowTop",
			"mapTop",
		].map((x) => {
			const ctx = document.querySelector(`#${x}`).getContext("2d");
			for (const prop in map.render[x]) {
				const axis = prop.split("_");
				ctx.drawImage(
					document.querySelector("#" + map.render[x][prop][2]),
					map.render[x][prop][0],
					map.render[x][prop][1],
					cellWidth,
					cellHeight,
					axis[0] * cellWidth,
					axis[1] * cellHeight,
					cellWidth,
					cellHeight
				);
			}
		});
		//draw the path data/mapPathArr { }

		const ctx2 = document.querySelector("#charGrid").getContext("2d");
		ctx2.globalAlpha = 0.5;
		ctx2.fillStyle = "blue";
		for (const prop in map.pathData) {
			const axis = prop.split("_");

			ctx2.fillRect(
				axis[0] * charCellWidth + 1 - charCellWidth / 2,
				axis[1] * charCellHeight + 1 - charCellHeight / 2,
				charCellWidth - 2,
				charCellHeight - 2
			);
		}

		this.setState({
			mapName,
			mapAnimationArr: map.mapAnimationArr,
			changes: 0,
			actionIndex: -1,
			history: [],
		});
		//when assigning directly (mapCellArr = map.render)
		//changing mapCellArr will also change map.render
		//because they SHARE the same OBJECT reference
		//so we use deep copy parse and stringify to prevent that
		mapCellArr = JSON.parse(JSON.stringify(map.render));
		mapPathArr = Array.isArray(map.pathData)
			? {}
			: JSON.parse(JSON.stringify(map.pathData));
	}
	_tilesetOnChange(tileset) {
		const ts = document.querySelector("#" + tileset),
			w = ts.width,
			h = ts.height,
			f = document.querySelector("#frame"),
			fs = document.querySelector("#frameSelect"),
			fsa = document.querySelector("#frameSelectAnimation");

		f.width = w;
		f.height = h;
		fs.width = w;
		fs.height = h;
		fsa.width = w;
		fsa.height = h;

		const cols = w / cellWidth,
			rows = h / cellHeight,
			ctx = f.getContext("2d");

		ctx.clearRect(0, 0, w, h);
		let i = 0;
		for (i; i <= cols; i++) {
			const x = i * cellWidth;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, h);
			ctx.stroke();
		}

		i = 0;
		for (i; i <= rows; i++) {
			const y = i * cellHeight;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
			ctx.stroke();
		}
		this.setState({
			showTile: tileset,
			ref: document.querySelector("#" + tileset),
		});
	}
	_toggleAnimation() {
		frameSelectAnimation
			.getContext("2d")
			.clearRect(
				0,
				0,
				frameSelectAnimation.width,
				frameSelectAnimation.height
			);
		frameSelect
			.getContext("2d")
			.clearRect(0, 0, frameSelect.width, frameSelect.height);
		selX = undefined;
		selW = cellWidth;
		selH = cellHeight;
		this.setState((currState) => {
			return {
				animationFrames: [],
				isAnimationOn: !currState.isAnimationOn,
			};
		});
	}
	_mapAnimation() {
		const ctx = mapAnimate.getContext("2d");

		const ctxCapture = captureCanvas.getContext("2d");

		const renderAnimation = () => {
			requestAnimationFrame(renderAnimation);
			ctx.clearRect(0, 0, mapAnimate.width, mapAnimate.height);
			ctxCapture.clearRect(
				0,
				0,
				captureCanvas.width,
				captureCanvas.height
			);
			if (this.state.mapAnimationArr.length > 0) {
				//loop through all instances of animation objects
				this.state.mapAnimationArr.map((instance) => {
					//initiate self frame counter for each instance
					if (
						instance.selfCounter == undefined ||
						instance.selfCounter >= instance.src.length
					)
						instance.selfCounter = 0;

					//initiate self "FPS" counter for each instance
					if (instance.selfFPSCounter == undefined)
						instance.selfFPSCounter = 0;

					const frame = instance.src[instance.selfCounter];
					ctx.drawImage(
						document.querySelector("#" + frame.tileset),
						frame.sx,
						frame.sy,
						frame.w,
						frame.h,
						instance.rx,
						instance.ry,
						frame.w,
						frame.h
					);

					instance.selfFPSCounter++;
					if (instance.selfFPSCounter >= 60 / instance.fps) {
						instance.selfCounter++;
						instance.selfFPSCounter = 0;
					}
				});
			}

			if (durationCounter > 0) {
				[
					mapBase1,
					mapBase2,
					mapBase3,
					mapShadowMid1,
					mapMid1,
					mapAnimate,
					mapShadowMid2,
					mapMid2,
					mapShadowTop,
					mapTop,
				].map((canv) => {
					ctxCapture.drawImage(canv, 0, 0);
				});

				const bar = document.querySelector("#loadingBar");
				if (bar != undefined)
					bar.style.width =
						((this.state.ads * 60 - durationCounter) /
							(this.state.ads * 60)) *
							100 +
						"%";

				capturer.capture(captureCanvas);

				durationCounter--;
				durationCounter <= 0 &&
					this.state.exFormat != "gif" &&
					this._showFileOptions();
			}
		};
		requestAnimationFrame(renderAnimation);
	}
	_returnATileset(id, mapUrlName) {
		return (
			<img
				id={id}
				className="tileset"
				src={
					mapUrlName
						? "/assets/maps/" + mapUrlName + ".png"
						: this.state[id]
				}
				style={{
					display: this.state.showTile == id ? "block" : "none",
					position: "relative",
				}}
				onLoad={() => {
					this.state.mapName
						? this._tilesetOnChange(id)
						: this._tilesetOnChange("tileset1");
					this.state.mapName && this._load(this.state.mapName);
				}}
			/>
		);
	}

	_layerOnChange(e) {
		if (/^_/.test(e.target.id)) {
			console.log(e.target.id.replace("_", ""));
			this.setState({
				layer: e.target.id.replace("_", ""),
			});
		}
	}
	render() {
		return (
			<div id="mainCont">
				{/*GROUP1-----------------------------------*/}
				<Group1
					_drawTile={this._drawTile}
					_setStateCallback={this._setStateCallback}
					_tilesetOnChange={this._tilesetOnChange}
					_showChild={this._showChild}
					_showFileOptions={this._showFileOptions}
					_toggleMapGrid={this._toggleMapGrid}
					_zoomFunction={this._zoomFunction}
					showRenderControls={this.state.showRenderControls}
					changes={this.state.changes}
					autoResize={this.state.autoResize}
					setScale={(val) => {
						scX = val;
						scY = val;
					}}
				/>
				<Group2
					_drawTile={this._drawTile}
					_setStateCallback={this._setStateCallback}
					_returnATileset={this._returnATileset}
					_layerOnChange={this._layerOnChange}
					_toggleVisibility={this._toggleVisibility}
					_toggleAnimation={this._toggleAnimation}
					custom1={this.state.custom1}
					custom2={this.state.custom2}
					custom3={this.state.custom3}
					showTile={this.state.showTile}
					erase={this.state.erase}
					layer={this.state.layer}
					isAnimationOn={this.state.isAnimationOn}
					mapAnimationArr={this.state.mapAnimationArr}
					showRenderControls={this.state.showRenderControls}
					fps={this.state.fps}
					toggleMapGrid={this.state.toggleMapGrid}
					z={this.state.z}
					z_={this.state.z_}
					autoResize={this.state.autoResize}
					mapClickCatcher={mapClickCatcher}
					pathXY={pathXY}
					charCellWidth={charCellWidth}
					cellWidth={cellWidth}
					cellHeight={cellHeight}
				/>
				{/*FILES OPTION---------------------------------*/}
				{this.state.showFileOptions && (
					<div id="popupBG">
						{/*CHILDREN OPTIONS*/}
						{this.state.showOpsChildren == "main" && (
							<div className="popupCont">
								<div id="oStashErr"></div>
								<input
									id="stashName"
									type="text"
									placeholder="Stash name"
								/>
								<input
									id="stashKey"
									type="text"
									placeholder="Key"
								/>
								<button
									onClick={() => {
										this._openStash("r", "r");
									}}
								>
									AUTO
								</button>
								<button
									onClick={() => {
										const stashName = document.querySelector(
												"#stashName"
											).value,
											stashKey = document.querySelector(
												"#stashKey"
											).value;
										this._openStash(stashName, stashKey);
									}}
								>
									Open stash
								</button>
								<button
									onClick={() =>
										this._showChild("createnewstash")
									}
								>
									Create new stash
								</button>
								<button
									onClick={() => (window.location.href = "/")}
								>
									{"<- Game Page"}
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "whatsnew" && (
							<Versioning _showChild={this._showChild} />
						)}
						{this.state.showOpsChildren == "loading" && (
							<div className="popupCont">
								<h3>Please wait..</h3>
								<div id="loadingBar" />
								<div id="loadingDetails" />
							</div>
						)}
						{this.state.showOpsChildren == "errormessage" && (
							<div className="popupCont">
								<h3>Sorry..</h3>
								{this.state.errormessage}
								<button
									onClick={() =>
										cols == undefined
											? this._showChild("main")
											: this._showChild("files")
									}
								>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "createnewstash" && (
							<div className="popupCont">
								<div id="cStashErr"></div>
								<div id="cStashVal"></div>
								<input
									type="text"
									id="cStashName"
									placeholder="Stash name"
								/>
								<button onClick={this._createNewStash}>
									Create
								</button>
								<button onClick={() => this._showChild("main")}>
									Back to login
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "openstash" && (
							<div className="popupCont">
								<div id="ooStashErr"></div>
								<h1 id="ooStashName">{this.state.stashName}</h1>
								{this.state.mapList}
								<button
									onClick={() => {
										this.state.selectedMap &&
											this._load(this.state.selectedMap);
									}}
								>
									Select
								</button>
								<button onClick={() => this._showChild("new")}>
									New
								</button>
								<button onClick={() => this._showChild("main")}>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "files" && (
							<div className="popupCont">
								<div style={{ fontWeight: "bold" }}>v1.8.3</div>
								<button
									onClick={() => this._showChild("whatsnew")}
								>
									What's new?
								</button>
								<button onClick={() => this._showChild("load")}>
									Load
								</button>
								<button
									onClick={() => {
										this._saveAs(true);
									}}
								>
									Save
								</button>
								<button
									onClick={() => this._showChild("saveas")}
								>
									Save As
								</button>
								<button onClick={() => this._showChild("new")}>
									New
								</button>
								<button
									onClick={() => this._showChild("export")}
								>
									Export
								</button>
								<button
									onClick={() => {
										if (this.state.changes != 0) {
											const conf = confirm(
												"Changes are not saved yet, proceed to the game page?"
											);
											if (conf) {
												window.location.href = "/";
											}
										} else {
											window.location.href = "/";
										}
									}}
								>
									{"<-- To Game Page"}
								</button>
								<button onClick={this._showFileOptions}>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "load" && (
							<div className="popupCont">
								<div>Open a map</div>
								{this.state.mapList}
								<button
									onClick={() => {
										this._load(this.state.selectedMap);
									}}
								>
									Load
								</button>
								<button
									onClick={() => this._showChild("files")}
								>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "saveas" && (
							<div className="popupCont">
								<div id="saveErr" />
								{this.state.mapList}
								<input
									id="saveAsName"
									type="text"
									placeholder="Map name"
								/>
								<button
									onClick={() => {
										this._saveAs(false);
									}}
								>
									Save
								</button>
								<button
									onClick={() => this._showChild("files")}
								>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "new" && (
							<div className="popupCont">
								<p>New map</p>
								<div>
									<label htmlFor="px">pixel</label>
									<input
										type="radio"
										name="unit"
										defaultChecked
										id="px"
										value="pixel"
									/>
								</div>
								<div>
									<label htmlFor="cell">cell</label>
									<input
										type="radio"
										name="unit"
										id="cell"
										value="cell"
									/>
								</div>

								<input
									type="number"
									id="newWidth"
									placeholder="width"
								/>
								<input
									type="number"
									id="newHeight"
									placeholder="height"
								/>
								<button
									onClick={() =>
										this._newMap(
											document.querySelector("#newWidth")
												.value,
											document.querySelector("#newHeight")
												.value,
											document.querySelector("#px")
												.checked
										)
									}
								>
									Start
								</button>

								<button
									onClick={() =>
										cols == undefined
											? this._showChild("openstash")
											: this._showChild("files")
									}
								>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "export" && (
							<div className="popupCont">
								<label htmlFor="exFormat">Export format:</label>
								<select
									id="exFormat"
									onChange={(e) => {
										this.setState({
											exFormat: e.target.value,
										});
									}}
									value={this.state.exFormat}
								>
									<option value="webm">
										.webm(Chrome only)
									</option>
									<option value="png">.png</option>
									<option value="gif">.gif</option>
								</select>
								<label htmlFor="cps">
									Captures per second
									<br />
									(max 60):
								</label>
								<input
									id="cps"
									type="number"
									value={this.state.cps}
									onChange={(e) => {
										if (e.target.value > 60)
											e.target.value = 60;
										if (e.target.value < 1)
											e.target.value = 1;

										this.setState({
											cps: e.target.value,
										});
									}}
								/>
								<label htmlFor="ads">
									Animation duration
									<br />
									(in SECONDS) (max 5):
								</label>
								<input
									id="ads"
									type="number"
									value={this.state.ads}
									onChange={(e) => {
										if (e.target.value > 5)
											e.target.value = 5;
										if (e.target.value < 1)
											e.target.value = 1;

										this.setState({
											ads: e.target.value,
										});
									}}
								/>
								<button
									onClick={() => {
										this._showChild("loading");

										capturer = new CCapture({
											format: this.state.exFormat,
											workersPath:
												this.state.exFormat == "gif" &&
												"/",
											framerate: this.state.cps,
											timeLimit: this.state.ads,
											verbose: true,
										});

										durationCounter = 60 * this.state.ads;
										capturer.start();
									}}
								>
									Export!
								</button>
								<button
									onClick={() => this._showChild("files")}
								>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "help" && (
							<div className="popupCont">
								<div id="instructions">
									<h4>Basic Controls</h4>
									<ul>
										<li>
											To create a new map, click File ->
											New
										</li>
										<li>
											To save your map, File -> Save/Save
											as
										</li>
										<li>To load your map, File -> Load</li>
										<li>Scroll to zoom-in/out the map</li>
										<li>
											Hold right-click and drag on the map
											or tileset to navigate
										</li>
										<li>
											Hold left-click to massive select on
											tileset
										</li>
										<li>Press E to toggle Eraser on/off</li>
									</ul>
									<h4>How To Animate?</h4>
									<img src="/assets/system/animationGuide.png" />
									<div>
										Credits to Ivan Voirol for the tilesets!
										You can follow him{" "}
										<a
											href="https://opengameart.org/users/ivan-voirol"
											target="_blank"
										>
											HERE
										</a>
									</div>
									<div>
										Suggestions?
										<br />
										Found bug?
										<br />
										Want to submit a tileset?
										<br />
										Send me an e-mail at:
										<br />
										<span id="email">
											vincauxryua@gmail.com
										</span>
									</div>
								</div>
								<button onClick={this._showFileOptions}>
									Back
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}

module.exports = () => {
	return MapMaker;
};