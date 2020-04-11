//map dragger

let cellWidth = 32,
	cellHeight = 32,
	selX,
	selY,
	selW,
	selH,
	ref,
	mapBase,
	mapMid,
	mapTop,
	layerSelect,
	erase = false;

$.fn.attachDragger = function () {
	var attachment = false,
		lastPosition,
		position,
		difference;

	const frameSelect = document.querySelector("#frameSelect"),
		ctx = frameSelect.getContext("2d");

	let offX, offY;

	$(this).on("mousedown mouseup mousemove", function (e) {
		if (e.buttons == 2) {
			if (e.type == "mousedown")
				(attachment = true), (lastPosition = [e.clientX, e.clientY]);
			if (e.type == "mouseup") attachment = false;
			if (e.type == "mousemove" && attachment == true) {
				position = [e.clientX, e.clientY];
				difference = [
					position[0] - lastPosition[0],
					position[1] - lastPosition[1],
				];
				$(this).scrollLeft($(this).scrollLeft() - difference[0]);
				$(this).scrollTop($(this).scrollTop() - difference[1]);
				lastPosition = [e.clientX, e.clientY];
			}
		} else if (e.buttons == 1 && e.target.id == "frameSelect") {
			erase = false;
			(offX = e.offsetX), (offY = e.offsetY);
			if (e.type == "mousedown") {
				selX = offX - (offX % cellWidth);
				selY = offY - (offY % cellHeight);
				selW = cellWidth;
				selH = cellHeight;
			}
			if (e.type == "mousemove") {
				const tempX = offX - selX,
					tempY = offY - selY;
				selW = tempX - (tempX % cellWidth) + cellWidth;
				selH = tempY - (tempY % cellHeight) + cellHeight;
			}
			ctx.clearRect(0, 0, frameSelect.width, frameSelect.height);
			ctx.beginPath();
			ctx.rect(selX, selY, selW, selH);
			ctx.strokeStyle = "red";
			ctx.lineWidth = 5;
			ctx.stroke();
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

class MapMaker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showFileOptions: false,
			showOpsChildren: "main",
			toggleMapGrid: true,
		};

		this._showFileOptions = this._showFileOptions.bind(this);
		this._showChild = this._showChild.bind(this);
		this._newMap = this._newMap.bind(this);
		this._toggleMapGrid = this._toggleMapGrid.bind(this);
	}

	componentDidMount() {
		ref = document.querySelector("#tileset");
		mapBase = document.querySelector("#mapBase");
		mapMid = document.querySelector("#mapMid");
		mapTop = document.querySelector("#mapTop");
		layerSelect = document.querySelector("#layerSelect");

		["mousemove", "mousedown"].map((x) => {
			document
				.querySelector("#mapClickCatcher")
				.addEventListener(x, (e) => {
					if (!erase) e.target.style.cursor = "grabbing";
					if (e.buttons == 1) {
						if (!erase) e.target.style.cursor = "grab";
						this._drawTile(e);
					}
				});
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
			h = document.querySelector("#newHeight");

		let mapW, mapH;

		let cols, rows;

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

		mapBase.width = mapW;
		mapBase.height = mapH;
		mapMid.width = mapW;
		mapMid.height = mapH;
		mapTop.width = mapW;
		mapTop.height = mapH;
		g.width = mapW;
		g.height = mapH;
		cc.style.width = mapW + "px";
		cc.style.height = mapH + "px";

		const ctx = g.getContext("2d");
		let i = 0;
		for (i; i <= cols; i++) {
			const x = i * cellWidth;
			console.log(x);
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, mapH);
			ctx.stroke();
		}

		i = 0;
		for (i; i <= rows; i++) {
			const y = i * cellHeight;
			console.log(y);
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

		const layers = {
			Base: mapBase,
			Mid: mapMid,
			Top: mapTop,
		};
		const ctx = layers[layerSelect.value].getContext("2d");

		ctx.clearRect(x, y, selW, selH);
		if (erase) return;
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
						<button onClick={this._showFileOptions}>File</button>
						<button onClick={this._toggleMapGrid}>
							Toggle Map Grid
						</button>

						<div
							id="tilesCont"
							onClick={(e) => {
								console.log("CLICKED");
							}}
						>
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
						<select id="layerSelect">
							<option value="Base">Base</option>
							<option value="Mid">Mid</option>
							<option value="Top">Top</option>
						</select>
						<select
							onChange={(e) => {
								document.querySelector(
									"#mapTop"
								).style.opacity = e.target.value;
							}}
						>
							<option value="1">100%</option>
							<option value="0.7">70%</option>
							<option value="0.3">30%</option>
						</select>
						<button
							onClick={() => {
								erase = true;
								document.querySelector(
									"#mapClickCatcher"
								).style.cursor = "cell";
							}}
						>
							Erase
						</button>
						<label htmlFor="b">Base</label>
						<input
							onChange={this._toggleVisibility}
							type="checkbox"
							defaultChecked
							id="b"
							value="mapBase"
						/>
						<label htmlFor="m">Mid</label>
						<input
							onChange={this._toggleVisibility}
							type="checkbox"
							defaultChecked
							id="m"
							value="mapMid"
						/>
						<label htmlFor="t">Top</label>
						<input
							onChange={this._toggleVisibility}
							type="checkbox"
							defaultChecked
							id="t"
							value="mapTop"
						/>
					</div>
					<div id="mapCont">
						<canvas id="mapBase" width="0" height="0"></canvas>
						<canvas id="mapMid" width="0" height="0"></canvas>
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
						<div id="mapClickCatcher"></div>
					</div>
				</div>
			</div>
		);
	}
}

const root = document.querySelector("#root");
ReactDOM.render(<MapMaker />, root);
