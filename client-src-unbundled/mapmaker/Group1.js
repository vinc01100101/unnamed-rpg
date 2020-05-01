const React = require("react");

module.exports = function Group1(props) {
	const tilesetsSelection = {
		tileset1: "Slates V2 by Ivan Voirol",
		tileset2: "Slates V2[updated] by Ivan Voirol",
		sample: "Sample [Development]",
		sample2: "Sample 2 [Development]",
		custom1: "Custom Tileset 1",
		custom2: "Custom Tileset 2",
		custom3: "Custom Tileset 3",
	};
	return (
		<div id="Group1">
			{/*SECTION 1--------------------------------------*/}
			<div id="G1s1">
				{/*TILESET SELECTION*/}
				<select
					onChange={(e) => {
						props._tilesetOnChange(e.target.value);
					}}
					defaultValue="tileset1"
				>
					{Object.keys(tilesetsSelection).map((x, i) => {
						return (
							<option key={i} value={x}>
								{tilesetsSelection[x]}
							</option>
						);
					})}
				</select>
				{/*FILE OPTION*/}
				<button
					onClick={() => {
						props._showChild("files");
						props._showFileOptions();
					}}
				>
					File
				</button>
				{/*HELP BUTTON*/}
				<button
					onClick={() => {
						props._showChild("help");
						props._showFileOptions();
					}}
				>
					HELP!
				</button>
				{/*FULLSCREEN BUTTON*/}
				<button>Fullscreen[W]</button>
			</div>
			{/*SECTION 2--------------------------------------*/}
			<div id="G1s2">
				{/*GRID TOGGLE*/}
				<button onClick={props._toggleMapGrid}>Grid[G]</button>
				{/*PATHMODE/RENDER TOGGLE*/}
				<button
					onClick={() => {
						props._setStateCallback((currState) => {
							return {
								showRenderControls: !currState.showRenderControls,
							};
						});
					}}
				>
					{props.showRenderControls
						? "Switch to [PATH MODE]"
						: "Back to [RENDER MODE]"}
				</button>
				<div
					style={{
						color: "#13DF26",
						backgroundColor: "black",
					}}
				>
					Changes since your last save: {props.changes}
				</div>
			</div>
			<div id="G1s3">
				{/*ZOOM DROPDOWN*/}
				<select
					id="zoom"
					defaultValue="label"
					onChange={(e) => {
						scX = e.target.value;
						scY = e.target.value;
						props._zoomFunction();
						document.querySelector("#zoomValue").textContent =
							"zoom";
					}}
				>
					<option id="zoomValue" disabled value="label">
						Zoom
					</option>
					<option value={-0.5}>50%</option>
					<option value={0}>100%</option>
					<option value={0.5}>150%</option>
					<option value={1}>200%</option>
					<option value={2}>300%</option>
					<option value={3}>400%</option>
					<option value={4}>500%</option>
					<option value={5}>600%</option>
					<option value={6}>700%</option>
					<option value={7}>800%</option>
				</select>
			</div>
		</div>
	);
};
