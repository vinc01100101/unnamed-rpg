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
	mapBase1,
	mapBase2,
	mapBase3,
	mapShadowMid,
	mapMid,
	mapShadowTop,
	mapTop,
	layerSelect;
let saveX, saveY;
let mapCellArr = {
	mapBase1: {},
	mapBase2: {},
	mapBase3: {},
	mapShadowMid: {},
	mapMid: {},
	mapShadowTop: {},
	mapTop: {},
};
let stash = null,
	editingNow;

class MapMaker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showFileOptions: true,
			showOpsChildren: "main",
			toggleMapGrid: true,
			erase: false,
			mapList: "",
			selectedMap: "",
			stashName: "",
			mapName: "",
			changes: 0,
		};

		this._showFileOptions = this._showFileOptions.bind(this);
		this._showChild = this._showChild.bind(this);
		this._newMap = this._newMap.bind(this);
		this._toggleMapGrid = this._toggleMapGrid.bind(this);
		this._createNewStash = this._createNewStash.bind(this);
		this._saveAs = this._saveAs.bind(this);
		this._load = this._load.bind(this);
	}

	componentDidMount() {
		ref = document.querySelector("#tileset");
		mapBase1 = document.querySelector("#mapBase1");
		mapBase2 = document.querySelector("#mapBase2");
		mapBase3 = document.querySelector("#mapBase3");
		mapShadowMid = document.querySelector("#mapShadowMid");
		mapMid = document.querySelector("#mapMid");
		mapShadowTop = document.querySelector("#mapShadowTop");
		mapTop = document.querySelector("#mapTop");
		layerSelect = document.querySelector("#layerSelect");

		["mousemove", "mousedown"].map((x) => {
			document
				.querySelector("#mapClickCatcher")
				.addEventListener(x, (e) => {
					e.preventDefault();
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
					if (that.state.erase) {
						ctx2.rect(x, y, cellWidth, cellHeight);
					} else {
						ctx2.rect(x, y, selW, selH);
					}

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
	_newMap(w, h, u) {
		const g = document.querySelector("#mapGrid"),
			cg = document.querySelector("#charGrid"),
			cc = document.querySelector("#mapClickCatcher"),
			mapScaler = document.querySelector("#mapScaler");

		let mapW, mapH;

		if (u) {
			cols = Math.floor(w / cellWidth);
			rows = Math.floor(h / cellHeight);
			(mapW = w), (mapH = h);
		} else {
			(cols = w), (rows = h), (mapW = w * 32), (mapH = h * 32);
		}

		[
			mapBase1,
			mapBase2,
			mapBase3,
			mapShadowMid,
			mapMid,
			mapShadowTop,
			mapTop,
			g,
			cg,
			cc,
		].map((x) => {
			(x.width = mapW), (x.height = mapH), (x.style.opacity = 1);
		});
		mapScaler.style.width = mapW + "px";
		mapScaler.style.height = mapH + "px";
		mapScaler.style.left = 0;
		mapScaler.style.top = 0;
		mapScaler.style.transform = "scale(1,1)";

		let i, j;

		const ctx = g.getContext("2d");
		const ctx2 = cg.getContext("2d");
		ctx2.strokeStyle = "#538EF0";
		i = 0;
		for (i; i <= cols; i++) {
			const x = i * cellWidth;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, mapH);
			ctx.stroke();

			j = 0;
			for (j; j < 3; j++) {
				const x2 = x + j * (cellWidth / 3);
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

			j = 0;
			for (j; j < 3; j++) {
				const y2 = y + j * (cellHeight / 3);
				ctx2.beginPath();
				ctx2.moveTo(0, y2);
				ctx2.lineTo(mapW, y2);
				ctx2.stroke();
			}
		}

		this.setState({
			showFileOptions: false,
			showOpsChildren: "main",
		});
	}
	_drawTile(e) {
		this.setState((currState) => {
			return { changes: currState.changes + 1 };
		});

		const oX = e.offsetX,
			oY = e.offsetY;

		const x = Math.floor(oX / cellWidth) * cellWidth,
			y = Math.floor(oY / cellHeight) * cellHeight;

		const ctx = document
			.querySelector("#" + layerSelect.value)
			.getContext("2d");

		//if erase, just erase, update and return
		if (this.state.erase) {
			ctx.clearRect(x, y, cellWidth, cellHeight);
			delete mapCellArr[layerSelect.value][
				Math.floor(oX / cellWidth) + "_" + Math.floor(oY / cellHeight)
			];
			return;
		}

		//else if not erase
		const forJ =
			selH > 0
				? { validate: (a, b) => a < b, incDec: 1, adj: 0 }
				: { validate: (a, b) => a > b, incDec: -1, adj: -1 };
		const forI =
			selW > 0
				? { validate: (a, b) => a < b, incDec: 1, adj: 0 }
				: { validate: (a, b) => a > b, incDec: -1, adj: -1 };

		for (let j = 0; forJ.validate(j, selH / cellHeight); j += forJ.incDec) {
			for (
				let i = 0;
				forI.validate(i, selW / cellWidth);
				i += forI.incDec
			) {
				const xIndex = Math.floor(oX / cellWidth) + i + forI.adj,
					yIndex = Math.floor(oY / cellHeight) + j + forJ.adj;
				if (
					xIndex >= 0 &&
					yIndex >= 0 &&
					xIndex < cols &&
					yIndex < rows
				)
					mapCellArr[layerSelect.value][xIndex + "_" + yIndex] = [
						selX + (i + forI.adj) * cellWidth,
						selY + (j + forJ.adj) * cellHeight,
					];
			}
		}
		console.log(mapCellArr);
		ctx.clearRect(x, y, selW, selH);
		ctx.drawImage(ref, selX, selY, selW, selH, x, y, selW, selH);
	}
	_toggleVisibility(e) {
		document.querySelector("#" + e.target.value).style.display = e.target
			.checked
			? "block"
			: "none";
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
				console.log(json);
				const errDom = document.querySelector("#cStashErr");
				const valDom = document.querySelector("#cStashVal");
				this._showErrMsg(errDom, json, valDom);
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

				console.log(json);
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

		if (!saveasname && !directSave) {
			this._showChild("saveas");
			const errDom = document.querySelector("#saveErr");
			this._showErrMsg(errDom, {
				type: "error",
				message: "Invalid map name",
			});
			return;
		} else if (!saveasname && directSave) {
			this._showChild("saveas");
			return;
		} else if (saveasname in stash.maps) {
			const conf = confirm(`Replace this file? "${saveasname}"`);
			if (!conf) {
				this._showChild("saveas");
				return;
			}
		}
		stash.maps[saveasname] = {
			mapWidth: mapBase1.width,
			mapHeight: mapBase1.height,
			render: mapCellArr,
			pathData: [],
		};
		const req = new XMLHttpRequest();
		req.open("POST", "/mapmaker/savestash", true);
		req.setRequestHeader("Content-Type", "application/json");

		req.onreadystatechange = () => {
			if (req.readyState == 4 && req.status == 200) {
				const json = JSON.parse(req.responseText);
				if (json.type == "error") {
					this._showChild("saveas");
					const errDom = document.querySelector("#saveErr");
					this._showErrMsg(errDom, json);
				} else {
					stash = json.message;
					editingNow = stash.maps[saveasname];

					let jsx = (
						<select
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

				console.log(json);
			}
		};
		req.send(JSON.stringify(stash));
	}
	_load(mapName) {
		if (this.state.mapName)
			stash.maps[this.state.mapName].changes = this.state.changes;
		const map = stash.maps[mapName];
		this._newMap(map.mapWidth, map.mapHeight, true);

		[
			"mapBase1",
			"mapBase2",
			"mapBase3",
			"mapShadowMid",
			"mapMid",
			"mapShadowTop",
			"mapTop",
		].map((x) => {
			const ctx = document.querySelector(`#${x}`).getContext("2d");

			for (const prop in map.render[x]) {
				const axis = prop.split("_");
				ctx.drawImage(
					ref,
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
		this.setState({
			mapName,
			changes: map.changes || 0,
		});
		mapCellArr = map.render;
	}
	render() {
		return (
			<div id="mainCont">
				{/*FILES OPTION*/}
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
							</div>
						)}

						{this.state.showOpsChildren == "loading" && (
							<div className="popupCont">
								<h3>Please wait..</h3>
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
									Submit
								</button>
								<button onClick={() => this._showChild("main")}>
									Back
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
								<button onClick={this._saveAs}>Save</button>
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
										id="b1"
										value="mapBase1"
									/>
									<label htmlFor="b1">Base1</label>
								</div>
								<div>
									<input
										onChange={this._toggleVisibility}
										type="checkbox"
										defaultChecked
										id="b2"
										value="mapBase2"
									/>
									<label htmlFor="b2">Base2</label>
								</div>
								<div>
									<input
										onChange={this._toggleVisibility}
										type="checkbox"
										defaultChecked
										id="b3"
										value="mapBase3"
									/>
									<label htmlFor="b3">Base3</label>
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
								<button
									onClick={() => {
										this._showChild("files");
										this._showFileOptions();
									}}
								>
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
									<option value="mapBase1">Base1</option>
									<option value="mapBase2">Base2</option>
									<option value="mapBase3">Base3</option>
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
											? "green"
											: "black",
										color: this.state.erase
											? "black"
											: "white",
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
							<div className="mCChild">
								{/*changes since*/}
								<div>
									Changes since last save:{" "}
									{this.state.changes}
								</div>
							</div>
						</div>
					</div>
					<div id="mapCont">
						<p>
							To create new map, click File -> New <br />
							Scroll to zoom map
							<br />
							Hold right-click on the map or tileset to drag and
							navigate
							<br />
							Hold left-click to massive select tiles
							<br />
							Press E to toggle Eraser
						</p>
						<div id="mapScaler">
							<canvas id="mapBase1" width="0" height="0"></canvas>
							<canvas id="mapBase2" width="0" height="0"></canvas>
							<canvas id="mapBase3" width="0" height="0"></canvas>
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
								id="charGrid"
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
