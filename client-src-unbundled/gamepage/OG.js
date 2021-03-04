const React = require("react");
const sortedClass = require("../../server-modules/sortedClass").sortedClass;

module.exports = class OG extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this._socketEventListeners();
		//terminate worker's animation first
		this.props.worker.postMessage({
			type: "terminate",
		});

		//initialize animation
		let mainCanvas, backgroundCanvas, offscreen, offscreenBackground;
		[mainCanvas, backgroundCanvas] = [
			document.querySelector("#mainCanvas"),
			document.querySelector("#backgroundCanvas"),
		];

		[mainCanvas, backgroundCanvas].map((x) => {
			x.width = 1250;
			x.height = 874;
			x.style.width = "100%";
			x.style.height = "100%";
		});

		[offscreen, offscreenBackground] = [
			mainCanvas.transferControlToOffscreen(),
			backgroundCanvas.transferControlToOffscreen(),
		];

		this.props.worker.postMessage(
			{
				type: "animationInit",
				args: [
					offscreen,
					this.props.spriteSheetData,
					offscreenBackground,
				],
			},
			[offscreen, offscreenBackground]
		);

		//set the active char in the worker
		this.props.worker.postMessage({
			type: "assignActiveChar",
			activeChar: this.props.selectedCharData.name,
		});
		const mapName = this.props.selectedCharData.data.map.split(".");
		this.props.socket.emit("loadmap", mapName[0], mapName[1], (mapData) => {
			this.props.userCallBack(mapData);
			this._clientInputPacketInit();
		});
		console.log("Map request sent..");

		this.P_DIR = 0;
		this.P_HK = 0;
		this.sendPacketsTimer = null;

		this._keyDownEvents = this._keyDownEvents.bind(this);
		this._keyUpEvents = this._keyUpEvents.bind(this);
		this._clientInputPacketInit = this._clientInputPacketInit.bind(this);

		window.addEventListener("keydown", this._keyDownEvents);
		window.addEventListener("keyup", this._keyUpEvents);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this._keyDownEvents);
		window.removeEventListener("keyup", this._keyUpEvents);
	}
	_clientInputPacketInit() {
		const sender = () => {
			const packet = new Uint8Array([this.P_DIR]);
			this.props.socket.emit("clientinput", packet.buffer);
		};
		this.sendPacketsTimer = setInterval(sender, 1000 / 10);
	}
	_keyDownEvents(e) {
		switch (e.keyCode) {
			//w
			case 87:
				this.P_DIR = this.P_DIR | 0b1000;
				break;
			//d
			case 68:
				this.P_DIR = this.P_DIR | 0b0100;
				break;
			//s
			case 83:
				this.P_DIR = this.P_DIR | 0b0010;
				break;
			//a
			case 65:
				this.P_DIR = this.P_DIR | 0b0001;
				break;
		}
	}
	_keyUpEvents(e) {
		switch (e.keyCode) {
			//w
			case 87:
				this.P_DIR = this.P_DIR ^ 0b1000;
				break;
			//d
			case 68:
				this.P_DIR = this.P_DIR ^ 0b0100;
				break;
			//s
			case 83:
				this.P_DIR = this.P_DIR ^ 0b0010;
				break;
			//a
			case 65:
				this.P_DIR = this.P_DIR ^ 0b0001;
				break;
		}
	}
	_socketEventListeners() {
		//reference for decrypting data from 8bit integer
		const decryptReference = {
			type: ["player", "monster", "npc"],
			body: sortedClass,
			bodyFacing: ["f", "fl", "l", "bl", "b", "br", "r", "fr"],
			act: [
				"idle",
				"walk",
				"sit",
				"pick",
				"standby",
				"attack1",
				"damaged",
				"freeze1",
				"dead",
				"freeze2",
				"attack2",
				"attack3",
				"cast",
			],
		};

		const decryptMethod = [
			{
				name: "type",
				method: (val) => decryptReference.type[val],
			},
			{
				name: "head",
				method: (val) => `head${val}`,
			},
			{
				name: "body",
				method: (val) => decryptReference.body[val],
			},
			{
				name: "bodyFacing",
				method: (val) => decryptReference.bodyFacing[val],
			},
			{
				name: "act",
				method: (val) => decryptReference.act[val],
			},
			{
				name: "fps",
				method: (val) => val,
			},
			{
				name: "selfCounter",
				method: (val) => val,
			},
		];
		this.props.socket.on("psps", (packet) => {
			//object to store the packet values
			let renderThese = {};
			Object.entries(packet).map((keyVal) => {
				let decrypted = {};
				let value = keyVal[1];

				//if empty, means that user has disappeared from the area of sight
				if (value == 0) {
					decrypted = 0;
				}

				//if there is a position value
				if (value[0]) {
					decrypted.mapCoords = value[0];
				}

				//if there is a data value
				if (value[1]) {
					value[1] = new Uint8Array(value[1]);
					//convert to binary representation and split into array of 0s and 1s
					const indexReference = value[1][0].toString(2).split("");
					//index of the value that has different length
					let valIndex = 0;
					for (let i = indexReference.length - 2; i >= 0; i--) {
						if (indexReference[i] == "1") {
							const refIndex = indexReference.length - 2 - i;
							decrypted[
								decryptMethod[refIndex].name
							] = decryptMethod[refIndex].method(
								value[1][++valIndex]
							);
						}
					}
				}

				//renderThese.characterName = decrypted
				renderThese[keyVal[0]] = decrypted;
			});
			this.props.worker.postMessage({
				type: "renderThese",
				renderThese,
			});
		});
	}
	render() {
		return (
			<div id="OGPage">
				<canvas id="backgroundCanvas" />
				<canvas id="mainCanvas" />
			</div>
		);
	}
};
