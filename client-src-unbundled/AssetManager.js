module.exports = function AssetManager() {
  this.successCount = 0;
  this.errorCount = 0;
  let cache = {};

  //dL all ques
  this.downloadAll = (setName, arrPath, cb) => {
    if (arrPath.length === 0) {
      cb();
    }
    const img = document.createElement("img");
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");

    let i = 0;
    const length = arrPath.length;
    for (i; i < length; i++) {
      const path = arrPath[i];

      img.addEventListener(
        "load",
        () => {
          this.successCount++;
          const width = img.width,
            height = img.height;

          c.width = width;
          c.height = height;
          ctx.drawImage(img, 0, 0);
          let imageData = ctx.getImageData(0, 0, width, height);
          let data = imageData.data;
          const dataLength = data.length;
          let j = 0;
          for (j; j < dataLength; j += 4) {
            if (data[j] == 178 && data[j + 1] == 172 && data[j + 2] == 152) {
              data[j + 3] = 0;
            }
          }
          imageData.data = data;
          if (cache[setName]) {
            cache[setName].push(imageData);
          } else {
            cache[setName] = [imageData];
          }

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
    }

    //is it all done?
    this.isDone = () => {
      return arrPath.length == this.successCount + this.errorCount;
    };

    img.remove();
    c.remove();
  };

  //get asset
  this.getAsset = (setName) => {
    if (setName in cache) {
      // console.log("Returning image from cache: " + path);
      return cache[setName];
    } else {
      console.log("No cache found on that path");
    }
  };
};
