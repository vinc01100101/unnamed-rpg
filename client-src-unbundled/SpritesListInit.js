const AssetManager = require("./AssetManager");

module.exports = function SpritesDownloader(cb) {
  const assetManager = new AssetManager();

  let arr = [];
  //female ninja body
  for (let i = 1; i < 118; i++) {
    arr.push(`/assets/characters/female/ninja/_ (${i}).bmp`);
  }

  assetManager.downloadAll("f_body_ninja", arr, () => {
    console.log(
      "Finished downloading f_body_ninja sprites = S: " +
        assetManager.successCount +
        " | E: " +
        assetManager.errorCount
    );
  });

  cb(assetManager.isDone());

  setTimeout(() => {
    cb(assetManager.isDone());
  }, 3000);
};
