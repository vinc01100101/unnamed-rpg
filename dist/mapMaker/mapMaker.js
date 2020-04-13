let cellWidth = 32,
	cellHeight = 32,
	cols,
	rows,
	selX,
	selY,
	selW,
	selH,
	//DOMS
	ref,
	mapBase,
	mapShadowMid,
	mapMid,
	mapShadowTop,
	mapTop,
	layerSelect;
let saveX, saveY;

class MapMaker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showFileOptions: false,
			showOpsChildren: "main",
			toggleMapGrid: true,
			erase: false,
		};

		this._showFileOptions = this._showFileOptions.bind(this);
		this._showChild = this._showChild.bind(this);
		this._newMap = this._newMap.bind(this);
		this._toggleMapGrid = this._toggleMapGrid.bind(this);
	}

	componentDidMount() {
		ref = document.querySelector("#tileset");
		mapBase = document.querySelector("#mapBase");
		mapShadowMid = document.querySelector("#mapShadowMid");
		mapMid = document.querySelector("#mapMid");
		mapShadowTop = document.querySelector("#mapShadowTop");
		mapTop = document.querySelector("#mapTop");
		layerSelect = document.querySelector("#layerSelect");

		["mousemove", "mousedown"].map((x) => {
			document
				.querySelector("#mapClickCatcher")
				.addEventListener(x, (e) => {
					if (!this.state.erase) e.target.style.cursor = "grabbing";
					if (e.buttons == 1) {
						if (!this.state.erase) e.target.style.cursor = "grab";
						this._drawTile(e);
					}
				});
		});

		//ZOOM FUNCTION
		let scX = 0.1,
			scY = 0.1;
		document
			.querySelector("#mapClickCatcher")
			.addEventListener("wheel", (e) => {
				console.log(scX + "_" + scY);
				e.preventDefault();
				[scX, scY] =
					e.deltaY < 0
						? [scX + 0.1, scY + 0.1]
						: [scX - 0.1, scY - 0.1];

				if (scX < -0.3) {
					[scX, scY] = [-0.3, -0.3];
				}
				if (scX > 1.9) {
					[scX, scY] = [1.9, 1.9];
				}
				const x = cols * cellWidth * scX,
					y = rows * cellHeight * scY;
				document.querySelector(
					"#mapScaler"
				).style.transform = `translate(${x}px,${y}px) scale(${
					1 + scX * 2
				},${1 + scY * 2})`;
			});
		window.addEventListener("keypress", (e) => {
			switch (e.keyCode) {
				case 101:
					this.setState((currState) => {
						return { erase: !currState.erase };
					});
			}
		});

		const that = this;
		//===============
		$.fn.attachDragger = function () {
			var attachment = false,
				lastPosition,
				position,
				difference;

			const frameSelect = document.querySelector("#frameSelect"),
				mapClickCatcher = document.querySelector("#mapClickCatcher"),
				ctx = frameSelect.getContext("2d"),
				ctx2 = mapClickCatcher.getContext("2d");

			$(this).on("mousedown mouseup mousemove", function (e) {
				let offX = e.offsetX,
					offY = e.offsetY;

				if (e.buttons == 2) {
					if (e.type == "mousedown")
						(attachment = true),
							(lastPosition = [e.clientX, e.clientY]);
					if (e.type == "mouseup") attachment = false;
					if (e.type == "mousemove" && attachment == true) {
						position = [e.clientX, e.clientY];
						difference = [
							position[0] - lastPosition[0],
							position[1] - lastPosition[1],
						];
						$(this).scrollLeft(
							$(this).scrollLeft() - difference[0]
						);
						$(this).scrollTop($(this).scrollTop() - difference[1]);
						lastPosition = [e.clientX, e.clientY];
					}
				} else if (e.buttons == 1 && e.target.id == "frameSelect") {
					that.state.erase = false;

					if (e.type == "mousedown") {
						selX = offX - (offX % cellWidth);
						selY = offY - (offY % cellHeight);
						[saveX, saveY] = [selX, selY];
						selW = cellWidth;
						selH = cellHeight;
						that.setState({
							erase: false,
						});
					}
					if (e.type == "mousemove") {
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
						selW =
							tempX - (tempX % cellWidth) + cellWidth * operatorX;
						selH =
							tempY -
							(tempY % cellHeight) +
							cellHeight * operatorY;
					}
					ctx.clearRect(0, 0, frameSelect.width, frameSelect.height);
					ctx.beginPath();
					ctx.rect(selX, selY, selW, selH);
					ctx.strokeStyle = "red";
					ctx.lineWidth = 5;
					ctx.stroke();
				} else if (
					e.target.id == "mapClickCatcher" &&
					e.type == "mousemove"
				) {
					const oX = e.offsetX,
						oY = e.offsetY;

					const x = Math.floor(oX / cellWidth) * cellWidth,
						y = Math.floor(oY / cellHeight) * cellHeight;

					ctx2.clearRect(
						0,
						0,
						mapClickCatcher.width,
						mapClickCatcher.height
					);
					ctx2.beginPath();
					ctx2.rect(x, y, selW, selH);
					ctx2.strokeStyle = "red";
					ctx2.lineWidth = 5;
					ctx2.stroke();
				}
			});
			$(window).on("mouseup", function () {
				attachment = false;
			});
		};

		$(document).ready(function () {
			$("#tilesCont").attachDragger();
			$("#mapCont").attachDragger();
		});
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
	_newMap() {
		const g = document.querySelector("#mapGrid"),
			cc = document.querySelector("#mapClickCatcher"),
			u = document.querySelector("#px"),
			w = document.querySelector("#newWidth"),
			h = document.querySelector("#newHeight"),
			mapScaler = document.querySelector("#mapScaler");

		let mapW, mapH;

		if (u.checked) {
			cols = Math.floor(w.value / cellWidth);
			rows = Math.floor(h.value / cellHeight);
			(mapW = w.value), (mapH = h.value);
		} else {
			(cols = w.value),
				(rows = h.value),
				(mapW = w.value * 32),
				(mapH = h.value * 32);
		}

		[mapBase, mapShadowMid, mapMid, mapShadowTop, mapTop, g, cc].map(
			(x) => {
				(x.width = mapW), (x.height = mapH), (x.style.opacity = 1);
			}
		);
		mapScaler.style.width = mapW + "px";
		mapScaler.style.height = mapH + "px";

		const ctx = g.getContext("2d");
		let i = 0;
		for (i; i <= cols; i++) {
			const x = i * cellWidth;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, mapH);
			ctx.stroke();
		}

		i = 0;
		for (i; i <= rows; i++) {
			const y = i * cellHeight;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(mapW, y);
			ctx.stroke();
		}

		this.setState({
			showFileOptions: false,
			showOpsChildren: "main",
		});
	}
	_drawTile(e) {
		const oX = e.offsetX,
			oY = e.offsetY;

		const x = Math.floor(oX / cellWidth) * cellWidth,
			y = Math.floor(oY / cellHeight) * cellHeight;

		const ctx = document
			.querySelector("#" + layerSelect.value)
			.getContext("2d");

		if (this.state.erase) {
			ctx.clearRect(x, y, selW, selH);
			return;
		}
		ctx.drawImage(ref, selX, selY, selW, selH, x, y, selW, selH);
	}
	_toggleVisibility(e) {
		document.querySelector("#" + e.target.value).style.display = e.target
			.checked
			? "block"
			: "none";
	}
	render() {
		return (
			<div id="mainCont">
				{/*FILES OPTION*/}
				{this.state.showFileOptions && (
					<div id="popupBG">
						{this.state.showOpsChildren == "main" && (
							<div className="popupCont">
								<button onClick={() => this._showChild("open")}>
									Open
								</button>
								<button onClick={() => this._showChild("save")}>
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
								<button onClick={this._showFileOptions}>
									Back
								</button>
							</div>
						)}

						{this.state.showOpsChildren == "open" && (
							<div className="popupCont">
								<p>Open a map</p>
								<button onClick={() => this._showChild("main")}>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "save" && (
							<div className="popupCont">
								<p>Save this map?</p>
								<button onClick={() => this._showChild("main")}>
									Back
								</button>
							</div>
						)}
						{this.state.showOpsChildren == "saveas" && (
							<div className="popupCont">
								<p>Enter map name</p>
								<button onClick={() => this._showChild("main")}>
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
								<button onClick={this._newMap}>Start</button>

								<button onClick={() => this._showChild("main")}>
									Back
								</button>
							</div>
						)}
					</div>
				)}
				{/*CANVASES--------------------------------------------*/}
				<div id="group1">
					<div id="controls">
						{/*TILESET*/}
						<div id="tilesCont" onClick={(e) => {}}>
							<img
								id="tileset"
								src="/assets/maps/maptiles1.png"
								onLoad={() => {
									const ts = document.querySelector(
											"#tileset"
										),
										w = ts.width,
										h = ts.height,
										f = document.querySelector("#frame"),
										fs = document.querySelector(
											"#frameSelect"
										);

									f.width = w;
									f.height = h;
									fs.width = w;
									fs.height = h;

									const cols = w / cellWidth,
										rows = h / cellHeight,
										ctx = f.getContext("2d");

									let i = 0;
									for (i; i <= cols; i++) {
										const x = i * cellWidth;
										ctx.beginPath();
										ctx.moveTo(x, cellHeight);
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
								}}
							/>
							<canvas id="frame"></canvas>
							<canvas id="frameSelect"></canvas>
						</div>

						{/*CONTROLS*/}
						<div className="mainControls">
							<div className="mCChild" style={{ color: "white" }}>
								Layer Visibility
								<div>
									<input
										onChange={this._toggleVisibility}
										type="checkbox"
										defaultChecked
										id="b"
										value="mapBase"
									/>
									<label htmlFor="b">Base</label>
								</div>
								<div>
									<input
										onChange={this._toggleVisibility}
										type="checkbox"
										defaultChecked
										id="sm"
										value="mapShadowMid"
									/>
									<label htmlFor="sm">Shadow Mid</label>
								</div>
								<div>
									<input
										onChange={this._toggleVisibility}
										type="checkbox"
										defaultChecked
										id="m"
										value="mapMid"
									/>
									<label htmlFor="m">Mid</label>
								</div>
								<div>
									<input
										onChange={this._toggleVisibility}
										type="checkbox"
										defaultChecked
										id="st"
										value="mapShadowTop"
									/>
									<label htmlFor="st">Shadow Top</label>
								</div>
								<div>
									<input
										onChange={this._toggleVisibility}
										type="checkbox"
										defaultChecked
										id="t"
										value="mapTop"
									/>
									<label htmlFor="t">Top</label>
								</div>
							</div>
							<div className="mCChild">
								<button onClick={this._showFileOptions}>
									File
								</button>
								<button onClick={this._toggleMapGrid}>
									Toggle Map Grid
								</button>
								Layer:
								<select
									id="layerSelect"
									onChange={(e) => {
										document.querySelector(
											"#opacitySelect"
										).value = document.querySelector(
											"#" + e.target.value
										).style.opacity;
									}}
								>
									<option value="mapBase">Base</option>
									<option value="mapShadowMid">
										Mid Shadow
									</option>
									<option value="mapMid">Mid</option>
									<option value="mapShadowTop">
										Top Shadow
									</option>
									<option value="mapTop">Top</option>
								</select>
								<select
									id="opacitySelect"
									defaultValue="label"
									onChange={(e) => {
										const elem = document.querySelector(
											"#layerSelect"
										).value;
										document.querySelector(
											"#" + elem
										).style.opacity = e.target.value;
									}}
								>
									<option disabled value="label">
										Opacity
									</option>
									<option value="1">100%</option>
									<option value="0.7">70%</option>
									<option value="0.3">30%</option>
								</select>
								<button
									id="eraser"
									style={{
										backgroundColor: this.state.erase
											? "white"
											: "black",
									}}
									onClick={(e) => {
										this.setState({
											erase: true,
										});
									}}
								>
									Eraser ("E" toggle)
								</button>
							</div>
						</div>
					</div>
					<div id="mapCont">
						<div id="mapScaler">
							<canvas id="mapBase" width="0" height="0"></canvas>
							<canvas
								id="mapShadowMid"
								width="0"
								height="0"
							></canvas>
							<canvas id="mapMid" width="0" height="0"></canvas>
							<canvas
								id="mapShadowTop"
								width="0"
								height="0"
							></canvas>
							<canvas id="mapTop" width="0" height="0"></canvas>
							<canvas
								id="mapGrid"
								width="0"
								height="0"
								style={{
									display: this.state.toggleMapGrid
										? "block"
										: "none",
								}}
							></canvas>
							<canvas
								id="mapClickCatcher"
								width="0"
								height="0"
							></canvas>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const root = document.querySelector("#root");
ReactDOM.render(<MapMaker />, root);