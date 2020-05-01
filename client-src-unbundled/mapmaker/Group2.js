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
		<div id="Group2">
			{/*SECTION 1---------------------------------------*/}
			<div id="G2s1">
				{/*TILESET*/}
				<div id="tilesCont" onClick={(e) => {}}>
					{props.customTiles[props.showTile] == "" && (
						<TileUploader
							cb={(dataUrl) => {
								const customs = (props.customTiles[
									props.showTile
								] = dataUrl);

								props._setStateCallback((currState) => {
									return {
										customs,
									};
								});
							}}
						/>
					)}
					{props._returnATileset("tileset1", "maptiles1")}
					{props._returnATileset("tileset2", "maptiles2")}
					{props._returnATileset("sample", "sample")}
					{props._returnATileset("sample2", "sample2")}
					{props._returnATileset("custom1")}
					{props._returnATileset("custom2")}
					{props._returnATileset("custom3")}

					<canvas id="frame"></canvas>
					<canvas id="frameSelectAnimation"></canvas>
					<canvas id="frameSelect"></canvas>
				</div>
			</div>
			{/*SECTION 2---------------------------------------*/}
			<div id="G2s2">
				{/*TOOLS*/}
				<div className="G2s2subSection">
					<span>Tools</span>
					<button
						id="eraser"
						style={{
							backgroundColor: props.erase
								? "#13DF26"
								: "#3C3C3C",
							fontWeight: props.erase ? "bold" : "normal",
							boxShadow: props.erase
								? "0px 0px 20px 15px green"
								: "none",
						}}
						onClick={(e) => {
							props._setStateCallback((currState) => {
								return {
									erase: !currState.erase,
								};
							});
						}}
					>
						Eraser[E]
					</button>
					<button>Bucket[B]</button>
					<button>Tile Picker[T]</button>
				</div>
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
									style={
										props.layer == l
											? {
													backgroundColor: "#13DF26",
											  }
											: l == "mapAnimate"
											? {
													backgroundColor: "#3C3C3C",
											  }
											: {
													backgroundColor: "black",
											  }
									}
								>
									<div
										className="layerSelInner1"
										id={"_" + l}
										onClick={
											l != "mapAnimate"
												? props._layerOnChange
												: () => {}
										}
									>
										{l.replace("map", "")}
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
											/>
										)}
										<input
											onChange={props._toggleVisibility}
											type="range"
											defaultValue="10"
											min="0"
											max="10"
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
				{/*ANIMATIONS*/}
				<div className="G2s2subSection">
					<span>Animations</span>
					<button
						style={
							props.isAnimationOn
								? {
										backgroundColor: "#13DF26",
										fontWeight: "bold",
										boxShadow: "0px 0px 20px 15px green",
								  }
								: {
										backgroundColor: "#3C3C3C",
										fontWeight: "normal",
										boxShadow: "none",
								  }
						}
						onClick={props._toggleAnimation}
					>
						{props.isAnimationOn
							? "Select frames[A]"
							: "Animate![A]"}
					</button>

					<label
						style={{
							color: "white",
							display: props.isAnimationOn ? "block" : "none",
						}}
						htmlFor="fps"
					>
						FPS:
						<input
							style={{ width: "50px", height: "1vw" }}
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
					<button
						onClick={() => {
							props._drawTile(false, true);
						}}
					>
						Delete Selected Animation
					</button>
				</div>
			</div>
			{/*SECTION 3---------------------------------------*/}
			<div id="G2s3">
				<div id="mapCont" style={{ width: "100%" }}>
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
