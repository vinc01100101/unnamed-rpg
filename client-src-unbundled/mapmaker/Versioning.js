const React = require("react");

module.exports = function Versioning(props) {
	return (
		<div className="popupCont">
			<h3>What's new?</h3>
			<ul>
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
