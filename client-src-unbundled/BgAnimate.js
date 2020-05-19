module.exports = function bgAnimate() {
  this.initialize = (spritesheet, dataSprites) => {
    console.log("Initializing BG variables..");
    const bgs = [
      {
        c: document.querySelector("#backgroundImg0"),
        ctx: document.querySelector("#backgroundImg0").getContext("2d"),
      },
      {
        c: document.querySelector("#backgroundImg1"),
        ctx: document.querySelector("#backgroundImg1").getContext("2d"),
      },
    ];
    //background images: 4 portrait, 17 landscapes
    function drawBG(rand, bg) {
      const height = dataSprites.heights[rand],
        yPos = dataSprites.yPos[rand];

      bg.c.width = 1200;
      bg.c.height = height;
      bg.ctx.drawImage(spritesheet, 0, yPos, 1200, height, 0, 0, 1200, height);
    }
    class BgConstructor {
      constructor(bg) {
        this.reset = () => {
          bg.c.style.transition = "none";
          bg.c.style.transform = "none";
        };
        this.fadeOut = () => {
          bg.c.style.opacity = 0;
        };
        this.setHorizontal = () => {
          const rand = Math.floor(Math.random() * 17) + 4;
          drawBG(rand, bg);
          bg.c.style.top = "-25%";
          bg.c.style.width = "150%";
          bg.c.style.height = "150%";
          bg.c.style.transitionProperty = "transform, opacity";
          bg.c.style.transitionDuration = "10s, 1s";
          bg.c.style.transitionTimingFunction = "linear";
        };
        this.moveLeft = () => {
          bg.c.style.left = "0px";
          bg.c.style.transform = `translateX(-33.33%)`;
          bg.c.style.opacity = 1;
        };
        this.moveRight = () => {
          bg.c.style.left = "-50%";
          bg.c.style.transform = `translateX(33.33%)`;
          bg.c.style.opacity = 1;
        };
        this.setVertical = () => {
          const rand = Math.floor(Math.random() * 4);
          drawBG(rand, bg);
          bg.c.style.left = "0px";
          bg.c.style.width = "100%";
          bg.c.style.height = "200%";
          bg.c.style.transitionProperty = "transform, opacity";
          bg.c.style.transitionDuration = "10s, 1s";
          bg.c.style.transitionTimingFunction = "linear";
        };
        this.moveUp = () => {
          bg.c.style.top = "0px";
          bg.c.style.transform = `translateY(-50%)`;
          bg.c.style.opacity = 1;
        };
        this.moveDown = () => {
          bg.c.style.top = "-100%";
          bg.c.style.transform = `translateY(50%)`;
          bg.c.style.opacity = 1;
        };
        this.setDiagonal = () => {
          const rand = Math.floor(Math.random() * 17) + 4;
          drawBG(rand, bg);
          bg.c.style.width = "150%";
          bg.c.style.height = "150%";
          bg.c.style.transitionProperty = "transform, opacity";
          bg.c.style.transitionDuration = "10s, 1s";
          bg.c.style.transitionTimingFunction = "linear";
        };
        this.moveUpLeft = () => {
          bg.c.style.top = "0px";
          bg.c.style.left = "0px";
          bg.c.style.transform = `translate(-33.33%,-33.33%)`;
          bg.c.style.opacity = 1;
        };
        this.moveUpRight = () => {
          bg.c.style.top = "0px";
          bg.c.style.left = "-50%";
          bg.c.style.transform = `translate(33.33%,-33.33%)`;
          bg.c.style.opacity = 1;
        };
        this.moveDownLeft = () => {
          bg.c.style.top = "-50%";
          bg.c.style.left = "0px";
          bg.c.style.transform = `translate(-33.33%,33.33%)`;
          bg.c.style.opacity = 1;
        };
        this.moveDownRight = () => {
          bg.c.style.top = "-50%";
          bg.c.style.left = "-50%";
          bg.c.style.transform = `translate(33.33%,33.33%)`;
          bg.c.style.opacity = 1;
        };
        this.setScale = () => {
          const rand = Math.floor(Math.random() * 17) + 4;
          drawBG(rand, bg);
          bg.c.style.transitionProperty = "transform, opacity";
          bg.c.style.transitionDuration = "10s, 1s";
          bg.c.style.transitionTimingFunction = "linear";
          // bg.c.src = `/assets/titles/_ (${rand}).jpg`;
        };
        this.zoomIn = () => {
          bg.c.style.left = "0px";
          bg.c.style.top = "0px";
          bg.c.style.width = "100%";
          bg.c.style.height = "100%";
          bg.c.style.transform = `scale(2,2)`;
          bg.c.style.opacity = 1;
        };
        this.zoomOut = () => {
          bg.c.style.left = "-50%";
          bg.c.style.top = "-50%";
          bg.c.style.width = "200%";
          bg.c.style.height = "200%";
          bg.c.style.transform = `scale(0.5,0.5)`;
          bg.c.style.opacity = 1;
        };
      }
    }
    this.bgObject = [new BgConstructor(bgs[0]), new BgConstructor(bgs[1])];
    const methods = {
      setHorizontal: ["moveLeft", "moveRight"],
      setVertical: ["moveUp", "moveDown"],
      setDiagonal: [
        "moveUpLeft",
        "moveUpRight",
        "moveDownLeft",
        "moveDownRight",
      ],
      setScale: ["zoomIn", "zoomOut"],
    };
    const methProps = Object.keys(methods);
    let set;
    //set bg div in the background while the other bg div is playing
    this.setBG = (bgNum) => {
      set = Math.floor(Math.random() * methProps.length);
      this.bgObject[bgNum].reset();
      setTimeout(() => {
        this.bgObject[bgNum][methProps[set]]();
      }, 1000);
    };
    //switch bg divs fade in fade out
    this.switchBG = (bgNum) => {
      const methArr = methods[methProps[set]];
      const move = Math.floor(Math.random() * methArr.length);
      //wtf logic
      this.bgObject[bgNum][methArr[move]]();
      this.bgObject[1 - bgNum].fadeOut();
    };
  };

  //start transitions
  let counter = 0,
    bgCounter = 0,
    bgTimer = null;
  this.startTransition = () => {
    //TIMER
    if (!bgTimer) {
      bgTimer = setInterval(() => {
        //set
        if (counter == 0) {
          this.setBG(bgCounter % 2);
        }
        //switch
        if (counter == 4) {
          this.switchBG(bgCounter % 2);
        }
        counter++;
        //reset
        if (counter >= 9) {
          counter = 0;
          bgCounter++;
        }
      }, 1000);
    } else {
      console.log("Bg transition already running");
      return;
    }
  };

  //end transitions
  this.endTransition = () => {
    clearInterval(bgTimer);
    bgTimer = null;
    this.bgObject[0].fadeOut();
    this.bgObject[1].fadeOut();
    counter = 0;
    console.log("BG transitions ended");
  };
};
