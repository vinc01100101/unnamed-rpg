module.exports = function AssetManager() {
  this.successCount = 0;
  this.errorCount = 0;
  this.errorFiles = [];
  //dL all ques
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

      const img = new Image();
      img.addEventListener(
        "load",
        () => {
          this.successCount++;

          const canv = document.createElement("canvas");
          canv.width = img.width;
          canv.height = img.height;
          const ctx = canv.getContext("2d");

          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, img.width, img.height);

          worker.postMessage({
            type: "imgData",
            name: prop,
            imgData: imgData,
          });

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
      spriteSheetData[prop].img = img;
    }

    //is it all done?
    this.isDone = () => {
      const isDone = length == this.successCount + this.errorCount;
      if (isDone) {
        spriteSheetData.paths = null;
        return isDone;
      }
      return false;
    };
  };
};
