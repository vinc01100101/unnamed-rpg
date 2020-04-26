const React = require("react");

module.exports = function Versioning(props) {
	return (
		<div className="popupCont">
			<h3>What's new?</h3>
			<ul id="versioning">
				<li>
					<span>v1.7.3 [ZOOM + HOTKEYS]</span> Zoom amount can now be{" "}
					<strong>referenced or selected</strong> below the opacity
					dropdown. List of hotkeys is now included in the tools area.
				</li>
				<li>
					<span>
						v1.6.3 [LAYER STACK PREVIEW + DRAG ENHANCEMENT + LAYER
						SELECTION IN RADIO BUTTONS]
					</span>
					<ol>
						<li>
							Previews of <strong>tiles used in a cell</strong>{" "}
							will be shown beside the visibility checkboxes
							whenever a user hover a mouse pointer on that cell.
							Further details can be included like the tileset
							used and the x-y coordinate of the tile, but we
							thought that it is not necessary as of now. Please
							inform us if you think it is, and we'll implement it
							:D
						</li>
						<li>
							Users can now move the map with right click or
							zoom-in even the mouse pointer is not on the main
							canvas, as long as it is inside the container.
						</li>
						<li>
							Layer selection is now in radio buttons rather than
							dropdown list, and it is moved on the right side for
							easy access. (4/26/2020)
						</li>
					</ol>
				</li>
				<li>
					<span>v1.5.3 [UNDO REDO + ACCURATE CHANGE COUNTER]</span>
					<ol>
						<li>
							Undo and redo are now functioning, use them with the
							usual hotkeys z and y respectively{" "}
							<strong>without the ctrl button.</strong> The scope
							of this history is the entire canvas where the map
							is being rendered. There's no count-limit to use
							undo/redo. However, this feature is still on beta.
							We may put range limit to history whenever our app
							shows some performance drop when used for a long
							session, so please report to us if you noticed that
							drop.
						</li>
						<li>
							The <strong>Change rate</strong> is not spamming
							anymore! In our previous versions, it increments
							every mouse move. Now it is more accurate and will
							only increment when real changes in canvas happened.
							The change rate can be a negative number when you{" "}
							<strong>Undo</strong> just after saving the
							progress, it's like travelling back in time! :D
							(4/24/2020)
						</li>
					</ol>
				</li>
				<li>
					<span>v1.4.2 [CUSTOM TILESET]</span> Now we can add our
					custom tileset, we can use maximum of 3 different custom
					tilesets. But since the local custom tileset is not saved on
					the server side, we would have to upload it everytime we
					continue our project. Please remember the slot where the
					tileset was uploaded, for example; We uploaded a tileset at{" "}
					<strong>Custom Tileset 1</strong> and used it for our map,
					we have to upload the same tileset at the same slot(Custom
					Tileset 1) everytime we load our map, so it will re-render
					the map correctly. (4/23/2020)
				</li>
				<li>
					<span>v1.3.2 [MAP QUALITY IMPROVEMENT + EXPORTING]</span>
					<ol>
						<li>
							The issue that was addressed in version 1.2.1.b is
							now fixed! No pixel loss anymore! And to add to
							that, while applying that fix, to our surprise we
							found out that the quality of the map doesn't blur
							anymore when zooming in! How's that? We caught 2
							fishes in one pull! :D
						</li>
						<li>
							The exporting function is now moved to File>Export
							since it is getting larger and it takes more spaces
							in the main tools area. And we now change the input
							value. Instead of only specifying the number of
							frames, it now accepts two values:
							<br />
							<span>Animation Duration</span> and{" "}
							<span>Captures Per Second</span> or simply the fps.
							<br />
							Animation duration is simply how long the duration
							of the exported file would be. While captures per
							second is the number of images per second to export.
							Because we decided to make the animations in the map
							user-defined-fps, the exported animation will look
							odd if we make the exporting values fix or
							unchangeable, especially when the map has many
							animations with <span>different</span> fps.
							<br />
							(Say the map has two animations, the first one has
							25fps while the other has 10fps, the exported file
							will look odd if we export it in 10fps because the
							first animation will lose some frames)
							<br />
							In case of having animations with different fps, we
							suggest to set the <span>
								Captures Per Second
							</span>{" "}
							according to the highest fps you have in your map.
							Or if you want it to be really smooth, just set it
							to 60 captures per second.
						</li>
						<li>
							As an alternative to .webm(which only works on
							Chrome, see{" "}
							<a
								href="https://github.com/spite/ccapture.js/"
								target="_blank"
							>
								here
							</a>{" "}
							at the lower part of the page), we added an option
							to export animated .gif format. The quality,
							however, is reduced. So we use it at our own will.
						</li>
						<li>
							Be aware of the number of images when exporting in
							.png, if you set the
							<br />
							<span>Captures Per Second</span> to 60, and the
							<br />
							<span>Animation Duration</span> to 5, that would be
							60x5=300 .PNG images! So we must be aware of that.
							(4/23/2020)
						</li>
					</ol>
				</li>

				<li>
					<span>v1.2.1 [PNG EXPORTING + EDGE'S PIXEL LOSS]</span>
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
					<span>v1.1.1 [NETTWORK FAILURES]</span> Network failure
					causes loading window to stuck, we now added an error
					handling to network failure while saving, loading,
					opening/creating a stash. (4/20/2020)
				</li>
				<li>
					<span>v1.1.0 [HIDE TOOLS]</span> Added "Hide tools" button
					to have wider tileset view.
					<br />
					Button hotkey: [W] (4/20/2020)
				</li>
				<li>
					<span>v1.0.0 [THE ROCKET IS LAUNCHED! :D]</span> Started
					Semantic Versioning (4/20/2020)
				</li>
			</ul>
			<button onClick={() => props._showChild("files")}>Back</button>
		</div>
	);
};
