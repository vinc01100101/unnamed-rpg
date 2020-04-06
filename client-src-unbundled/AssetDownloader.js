module.exports = function AssetManager() {
  this.successCount = 0;
  this.errorCount = 0;
  this.errorFiles = [];
  //dL all ques
  this.downloadAll = (spriteSheetData, cb) => {
    const length = Object.keys(spriteSheetData.paths).length; //CHANGE LATER
    if (length === 0) {
      cb("Error: Empty spriteSheetData");
    }

    for (const prop in spriteSheetData.paths) {
      const path = spriteSheetData.paths[prop];
      const img = new Image();
      img.addEventListener(
        "load",
        () => {
          this.successCount++;
          if (this.isDone()) {
            cb(null, {
              successCount: this.successCount,
              errorCount: this.errorCount,
              errorFiles: this.errorFiles,
            });
          }
        },
        false
      );
      img.addEventListener(
        "error",
        () => {
          this.errorFiles.push(img.src);
          this.errorCount++;
          if (this.isDone()) {
            cb(null, {
              successCount: this.successCount,
              errorCount: this.errorCount,
              errorFiles: this.errorFiles,
            });
          }
        },
        false
      );
      img.src = path;
      const props = prop.split("|");
      if (/_head/.test(props[0])) {
        spriteSheetData[props[0]].img = img;
      } else {
        spriteSheetData[props[0]][props[1]].img = img;
      }
    }

    //is it all done?
    this.isDone = () => {
      return length == this.successCount + this.errorCount;
    };
  };
};
