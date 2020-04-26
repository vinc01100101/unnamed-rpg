module.exports = function AssetManager() {
  //dL all paths
  this.downloadAll = (spriteSheetData, worker, cb) => {
    const length = Object.keys(spriteSheetData.paths).length; //CHANGE LATER
    if (length === 0) {
      cb("Error: Empty spriteSheetData");
    }

    for (const prop in spriteSheetData.paths) {
      const path = spriteSheetData.paths[prop];

      worker.postMessage({
        type: "toBlob",
        name: prop,
        path: path,
      });
    }
    spriteSheetData.paths = null;
    console.log("All images successfully passed to worker");
  };
};
