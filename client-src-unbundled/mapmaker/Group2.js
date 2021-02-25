const React = require("react");
const TileUploader = require("./TileUploader");

module.exports = function Group2(props) {
	const layers = [
		"mapTop",
		"mapShadowTop",
		"mapMid2",
		"mapShadowMid2",
		"mapAnimate",
		"mapMid1",
		"mapShadowMid1",
		"mapBase3",
		"mapBase2",
		"mapBase1",
	];

	return (
		<div
			id="Group2"
			style={{
				gridTemplateColumns: props.autoResize
					? props.autoResize
					: "35% 300px 1fr",
			}}
		>
			{/*SECTION 1---------------------------------------*/}
			<div id="G2s1">
				{/*TILESET*/}
				<div id="tilesCont" onClick={(e) => {}}>
					{props._returnATileset("tileset1", "maptiles1")}
					{props._returnATileset("tileset2", "maptiles2")}
					{props._returnATileset("tileset3", "maptiles3")}
					{props._returnATileset("tileset4", "maptiles4")}
					{props._returnATileset("tileset5", "maptiles5")}
					{props._returnATileset("wip1", "wip1")}
					{props._returnATileset("sample3", "sample3")}
					{props._returnATileset("custom1")}
					{props._returnATileset("custom2")}
					{props._returnATileset("custom3")}

					<canvas id="frame"></canvas>
					<canvas id="frameSelectAnimation"></canvas>
					<canvas id="frameSelect"></canvas>
				</div>
				{props[props.showTile] == "" && (
					<TileUploader
						cb={(dataUrl) => {
							const customs = {
								[props.showTile]: dataUrl,
							};
							console.log(customs);
							props._setStateCallback((currState) => {
								return customs;
							});
						}}
					/>
				)}
			</div>
			{/*SECTION 2---------------------------------------*/}
			<div id="G2s2">
				{/*LAYERS*/}
				<div className="G2s2subSection">
					<span>Layers</span>
					{(() => {
						let tempJsx = [],
							i = layers.length - 1;

						for (const l of layers) {
							tempJsx.push(
								<div
									key={i}
									className={
										props.layer == l
											? "G2s2layer buttonActive"
											: l != "mapAnimate"
											? "G2s2layer"
											: ""
									}
								>
									<div
										className="layerSelInner1"
										onClick={() => {
											l != "mapAnimate" &&
												props._layerOnChange(l);
										}}
									>
										{(() => {
											const val = l.replace("map", "");

											switch (val) {
												case "ShadowTop":
													return "[8]Shadow-C";
													break;
												case "ShadowMid2":
													return "[6]Shadow-B";
													break;
												case "ShadowMid1":
													return "[4]Shadow-A";
													break;
												case "Animate":
													return "[ Animations ]";
													break;
												default:
													return `[${
														i > 5 ? i : i + 1
													}]${val}`;
											}
										})()}
									</div>
									<div className="layerSelInner2">
										{l != "mapAnimate" && (
											<canvas
												id={
													"lsp_" + (i > 5 ? i - 1 : i)
												}
												width={props.cellWidth}
												height={props.cellHeight}
												disabled
												onClick={() => {
													props._layerOnChange(l);
												}}
											/>
										)}
										<input
											onChange={props._toggleVisibility}
											type="range"
											defaultValue="10"
											min="0"
											max="10"
											className="slider"
											name={l}
										/>
									</div>
								</div>
							);

							i--;
						}

						return tempJsx;
					})()}
				</div>
				{/*TOOLS*/}
				<div className="G2s2subSection" id="tools">
					<span>Tools</span>
					<div>
						<button
							id="eraser"
							className={props.erase ? "buttonActive" : ""}
							onClick={(e) => {
								props._setStateCallback((currState) => {
									return {
										erase: !currState.erase,
										bucket: false,
										tilepick: false,
									};
								});
							}}
						>
							Eraser[E]
						</button>
						<button
							className={props.bucket ? "buttonActive" : ""}
							onClick={(e) => {
								props._toggleAnimation("bucket");
							}}
						>
							Bucket[B]
						</button>
					</div>
					<div>
						<button
							className={props.tilepick ? "buttonActive" : ""}
							onClick={(e) => {
								props._toggleAnimation("tilepick");
							}}
						>
							Tile Picker[T]
						</button>
					</div>
				</div>
				{/*ANIMATIONS*/}
				<div className="G2s2subSection">
					<span>Animations</span>
					<div>
						<button
							className={
								props.isAnimationOn ? "buttonActive" : ""
							}
							onClick={() => {
								props._toggleAnimation();
							}}
						>
							{props.isAnimationOn
								? "Select frames[A]"
								: "Animate![A]"}
						</button>

						<button
							onClick={() => {
								props._drawTile(false, true);
							}}
						>
							Delete
						</button>
					</div>

					<label
						style={{
							color: "white",
							display: props.isAnimationOn ? "block" : "none",
						}}
						htmlFor="fps"
					>
						FPS:
						<input
							min="1"
							max="60"
							id="fps"
							type="number"
							value={props.fps}
							onChange={(e) => {
								let val = e.target.value;
								if (e.target.value > 60) val = 60;
								if (e.target.value < 1) val = 1;
								props._setStateCallback({
									fps: val,
								});
							}}
						/>
					</label>
					<select
						id="selAnimationInstance"
						size="5"
						onChange={(e) => {
							const x = props.mapAnimationArr[e.target.value].rx,
								y = props.mapAnimationArr[e.target.value].ry,
								w =
									props.mapAnimationArr[e.target.value].src[0]
										.w,
								h =
									props.mapAnimationArr[e.target.value].src[0]
										.h;

							const ctx2 = props.mapClickCatcher.getContext("2d");
							ctx2.clearRect(
								0,
								0,
								props.mapClickCatcher.width,
								props.mapClickCatcher.height
							);
							ctx2.beginPath();

							ctx2.rect(x, y, w, h);

							ctx2.strokeStyle = "blue";
							ctx2.lineWidth = 5;
							ctx2.stroke();
						}}
					>
						{props.mapAnimationArr.map((instance, i) => {
							return (
								<option key={i} value={i}>
									{instance.rx / props.cellWidth +
										"_" +
										instance.ry / props.cellHeight}
								</option>
							);
						})}
					</select>
				</div>
			</div>
			{/*SECTION 3---------------------------------------*/}
			<div id="G2s3">
				<div id="mapCont">
					<div id="mapScaler">
						<canvas id="mapBase1" width="0" height="0"></canvas>
						<canvas id="mapBase2" width="0" height="0"></canvas>
						<canvas id="mapBase3" width="0" height="0"></canvas>
						<canvas id="mapShadowMid1" width="0" height="0" />
						<canvas id="mapMid1" width="0" height="0"></canvas>
						<canvas id="mapAnimate" width="0" height="0" />
						<canvas id="mapShadowMid2" width="0" height="0" />
						<canvas id="mapMid2" width="0" height="0"></canvas>
						<canvas id="mapShadowTop" width="0" height="0" />
						<canvas id="mapTop" width="0" height="0"></canvas>
						<canvas
							id="mapGrid"
							width="0"
							height="0"
							style={{
								display: props.toggleMapGrid ? "block" : "none",
							}}
						/>
						<canvas
							id="charGrid"
							width="0"
							height="0"
							style={{
								display: !props.showRenderControls
									? "block"
									: "none",
							}}
						/>
						<ul
							id="z"
							style={{
								left:
									props.pathXY[0] + props.charCellWidth || 0,
								top: props.pathXY[1] || 0,
								display: props.z ? "block" : "none",
							}}
						>
							{props.z &&
								props.z.map((x, i) => {
									return (
										<li
											key={i}
											id={"z_" + i}
											style={
												props.z_ == i
													? {
															color: "white",
															backgroundColor:
																"black",
													  }
													: {
															color: "black",
															backgroundColor:
																"white",
													  }
											}
										>
											[{x}]
										</li>
									);
								})}
						</ul>

						<canvas id="mapClickCatcher" width="0" height="0" />
						<canvas
							id="captureCanvas"
							width="0"
							height="0"
							style={{ display: "none" }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
