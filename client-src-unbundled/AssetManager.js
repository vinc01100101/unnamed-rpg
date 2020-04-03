module.exports = function AssetManager() {
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];

  //que dL's
  this.queueDownload = arr => {
    this.downloadQueue = arr;
  };

  //dL all ques
  this.downloadAll = cb => {
    if (this.downloadQueue.length === 0) {
      cb();
    }
    for (let i = 0; i < this.downloadQueue.length; i++) {
      const path = this.downloadQueue[i];
      const img = new Image();
      img.addEventListener(
        "load",
        () => {
          this.successCount++;
          if (this.isDone()) {
            cb();
          }
        },
        false
      );
      img.addEventListener(
        "error",
        () => {
          this.errorCount++;
          if (this.isDone()) {
            cb();
          }
        },
        false
      );
      img.src = path;
      this.cache[path] = img;
    }
  };

  //get asset
  this.getAsset = path => {
    if (path in this.cache) {
      // console.log("Returning image from cache: " + path);
      return this.cache[path];
    } else {
      console.log("No cache found on that path");
    }
  };

  //is it all done?
  this.isDone = () => {
    return this.downloadQueue.length == this.successCount + this.errorCount;
  };
};
