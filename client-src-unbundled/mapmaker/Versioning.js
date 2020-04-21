const React = require("react");

module.exports = function Versioning(props) {
	return (
		<div className="popupCont">
			<h3>What's new?</h3>
			<ul>
				<li>
					<span style={{ fontWeight: "bold" }}>v1.2.1</span>
					<ol>
						<li>
							Added an option to export the map to .png format.
							User can specify the number of frames to
							export(userful when converting frames to animated
							.gif format with other software).
						</li>
						<li>
							<span style={{ fontWeight: "bold" }}>
								[Edge's pixel loss explained]
							</span>
							When rendering a tile into the map, edges of tiles
							from different layers may seem to reduce by 1pixel,
							this is due to html5 canvas layering issue.
							Although, it is only when making a map. The pixel
							loss will be automatically fixed when exporting to
							.webm or .png. (4/21/2020)
						</li>
					</ol>
				</li>
				<li>
					<span style={{ fontWeight: "bold" }}>v1.1.1</span> Network
					failure causes loading window to stuck, we now added an
					error handling to network failure while saving, loading,
					opening/creating a stash. (4/20/2020)
				</li>
				<li>
					<span style={{ fontWeight: "bold" }}>v1.1.0</span> Added
					"Hide tools" button to have wider tileset view.
					<br />
					Button hotkey: [W] (4/20/2020)
				</li>
				<li>
					<span style={{ fontWeight: "bold" }}>v1.0.0</span> Started
					Semantic Versioning (4/20/2020)
				</li>
			</ul>
			<button onClick={() => props._showChild("files")}>Back</button>
		</div>
	);
};
