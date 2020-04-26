const React = require("react");

// Check for the various File API support.
if (window.File && window.FileReader && window.Blob) {
	// Great success! All the File APIs are supported.
	console.log("All file APIs are supported");
} else {
	alert("The File APIs are not fully supported in this browser.");
}

module.exports = class TileUploader extends React.Component {
	constructor(props) {
		super(props);
		this._handleFileSelect = this._handleFileSelect.bind(this);
	}
	_handleFileSelect(evt) {
		const file = evt.target.files;
		const reader = new FileReader();

		reader.onload = (e) => {
			this.props.cb(e.target.result);
		};
		reader.readAsDataURL(file[0]);
	}

	render() {
		return (
			<div>
				<input
					type="file"
					id="file"
					onChange={this._handleFileSelect}
					name="file"
				/>
			</div>
		);
	}
};
