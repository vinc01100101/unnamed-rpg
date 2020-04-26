const React = require("react");

module.exports = class OG extends React.Component {
	render() {
		return (
			<div id="OGPage">
				<canvas id="OGCanvas" width="1000" height="700"></canvas>
			</div>
		);
	}
};
