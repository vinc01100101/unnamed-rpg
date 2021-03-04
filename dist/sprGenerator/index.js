const form = document.querySelector("#tryForm");

const element = document.querySelector("form");
element.addEventListener("submit", (event) => {
  console.log("DONT SUB");
  event.preventDefault();
  console.log("Form submission cancelled.");
  return false;
});

const c = document.querySelector("#hackerCanvas");
const ctx = c.getContext("2d");
const num = document.querySelector("#num");
const wid = document.querySelector("#wid");
const hyt = document.querySelector("#hyt");
const count = document.querySelector("#count");

let canvasWidth = 0;
let images = [];
let maxHeight = 0;

//FOR VERTICAL GET---
let canvasHeight = 0;
let maxWidth = 0;
//-------------------

//FOR TITLE IMAGES GET----

let titleCanvasHeight = 0;

//------------------------
const hacked = (img) => {
  console.log("Hacked >:)");
  images.push(img);
  count.textContent = "count: " + images.length;
  //horizontal get
  canvasWidth += img.width;
  if (img.height > maxHeight) {
    maxHeight = img.height;
  }
  //vertical get
  canvasHeight += img.height;
  if (img.width > maxWidth) {
    maxWidth = img.width;
  }

  //title images get
  //what is img.width percentage to 1200?
  const h = Math.round((1200 / img.width) * img.height);
  titleCanvasHeight += h;
};

//FOR HORIZONTAL GET
const getEm = () => {
  let widthIncrement = [],
    widthList = [],
    heightList = [],
    lastWidth = 0;
  c.width = canvasWidth;
  c.height = maxHeight;
  images.map((x) => {
    ctx.drawImage(x, lastWidth, 0);
    widthIncrement.push(lastWidth);
    widthList.push(x.width);
    heightList.push(x.height);
    lastWidth += x.width;
  });
  num.textContent = "xPos: [" + widthIncrement + "],";
  wid.textContent = "widths: [" + widthList + "],";
  hyt.textContent = "heights: [" + heightList + "],";
};

//FOR VERTICAL GET
const getVertical = () => {
  let heightIncrement = [],
    lastHeight = 0;
  c.width = maxWidth;
  c.height = canvasHeight;
  images.map((x) => {
    ctx.drawImage(x, 0, lastHeight);
    heightIncrement.push(lastHeight);
    lastHeight += x.height;
  });
  num.textContent = "yPos: [" + heightIncrement + "],";
};

//FOR TITLE IMAGES GET
const getTitleImages = () => {
  let heightIncrement = [],
    heightList = [],
    lastHeight = 0;
  c.width = 1200;
  c.height = titleCanvasHeight;
  images.map((x) => {
    const h = Math.round((1200 / x.width) * x.height);
    ctx.drawImage(x, 0, lastHeight, 1200, h);
    heightIncrement.push(lastHeight);
    heightList.push(h);
    lastHeight += h;
  });
  num.textContent = "yPos: [" + heightIncrement + "],";
  hyt.textContent = "heights: [" + heightList + "],";
};

//FOR MAKING TRANSPARENT BG WITH ONE CLICK
c.addEventListener("click", (e) => {
  const x = e.offsetX,
    y = e.offsetY;

  const imageDot = ctx.getImageData(x, y, 1, 1);
  console.log(imageDot);

  let image = ctx.getImageData(0, 0, c.width, c.height);
  let imageData = image.data,
    length = imageData.length;

  const radius = 100;
  const minRed = imageDot.data[0] - radius,
    maxRed = imageDot.data[0] + radius,
    minGreen = imageDot.data[1] - radius,
    maxGreen = imageDot.data[1] + radius,
    minBlue = imageDot.data[2] - radius,
    maxBlue = imageDot.data[2] + radius;

  for (let i = 0; i < length; i += 4) {
    if (
      //1byte or 8bits or 0-255 value
      imageData[i] >= minRed &&
      imageData[i] <= maxRed && //red
      imageData[i + 1] >= minGreen &&
      imageData[i + 1] <= maxGreen && //green
      imageData[i + 2] >= minBlue &&
      imageData[i + 2] <= maxBlue //blue
    ) {
      imageData[i + 3] = 0;
    }
  }
  console.log(imageData);
  // image.data = imageData; //since array and object are reference type, assignig isnt necessary

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.putImageData(image, 0, 0);
  console.log(ctx);
});
