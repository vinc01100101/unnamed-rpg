const form = document.querySelector("#tryForm");

const element = document.querySelector("form");
element.addEventListener("submit", (event) => {
  console.log("DONT SUB");
  event.preventDefault();
  return false;
  console.log("Form submission cancelled.");
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

const hacked = (img) => {
  console.log("Hacked >:)");
  images.push(img);
  count.textContent = "count: " + images.length;
  canvasWidth += img.width;
  if (img.height > maxHeight) {
    maxHeight = img.height;
  }
};

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

c.addEventListener("click", (e) => {
  const x = e.offsetX,
    y = e.offsetY;

  const imageDot = ctx.getImageData(x, y, 1, 1);
  console.log(imageDot.data);

  let image = ctx.getImageData(0, 0, c.width, c.height);
  let imageData = image.data,
    length = imageData.length;

  let i = 0;
  for (i; i < length; i += 4) {
    if (
      imageData[i] == imageDot.data[0] &&
      imageData[i + 1] == imageDot.data[1] &&
      imageData[i + 2] == imageDot.data[2]
    ) {
      imageData[i + 3] = 0;
    }
  }
  console.log(imageData);
  image.data = imageData;

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.putImageData(image, 0, 0);
});
