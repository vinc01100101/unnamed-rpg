module.exports = function AssetManager() {
  //dL all paths
  this.downloadAll = (spriteSheetData, worker, updateProgress, cb) => {
    const length = Object.keys(spriteSheetData.paths).length; //CHANGE LATER
    if (length === 0) {
      return cb("Error: Empty spriteSheetData");
    }
    const toAdd = 100 / length;
    let prog = 0;
    for (const prop in spriteSheetData.paths) {
      const path = spriteSheetData.paths[prop];

      worker.postMessage({
        type: "toBlob",
        name: prop,
        path: path,
      });

      worker.onmessage = (e) => {
        if (e.data.type == "success") {
          prog += toAdd;
          console.log(prog);
          updateProgress(prog, `${e.data.name} sprite cached.`);
          if (prog >= 100) {
            cb(null, "All images successfully passed to worker");
            spriteSheetData.paths = null;
          }
        }
      };
    }
  };
};
