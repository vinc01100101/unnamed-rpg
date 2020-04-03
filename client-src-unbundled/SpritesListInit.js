const AssetManager = require("./AssetManager");

module.exports = function SpritesDownloader(cb) {
  const assetManager = new AssetManager();

  const spritesList = () => {
    let arr = [];
    //classes
    for (let i = 1; i < 20; i++) {
      const temp = [
        `/images/characters/female/classes/ (${i}).png`,
        `/images/characters/male/classes/ (${i}).png`
      ];
      arr = arr.concat(temp);
    }
    //heads A
    for (let i = 1; i < 9; i++) {
      const temp = [
        `/images/characters/female/heads/a (${i}).png`,
        `/images/characters/male/heads/a (${i}).png`
      ];
      arr = arr.concat(temp);
    }
    //heads B
    for (let i = 1; i < 9; i++) {
      const temp = [
        `/images/characters/female/heads/b (${i}).png`,
        `/images/characters/male/heads/b (${i}).png`
      ];
      arr = arr.concat(temp);
    }

    return arr;
  };
  const list = spritesList();
  assetManager.queueDownload(list);
  assetManager.downloadAll(() => {
    console.log(
      "Finished downloading sprites = S: " +
        assetManager.successCount +
        " | E: " +
        assetManager.errorCount
    );
    cb(assetManager);
  });
};
