module.exports = function bgAnimate() {
  this.initialize = () => {
    console.log("Initializing BG variables..");
    const bgs = [
      document.querySelector("#backgroundImg0"),
      document.querySelector("#backgroundImg1"),
      document.querySelector(".backgroundImg"),
    ];
    //background images: 5 portrait, 15 landscapes
    class BgConstructor {
      constructor(bg) {
        this.reset = () => {
          bg.style.transition = "none";
          bg.style.transform = "none";
        };
        this.fadeOut = () => {
          bg.style.opacity = 0;
        };
        this.setHorizontal = () => {
          const rand = Math.floor(Math.random() * 17) + 5;
          bg.style.top = "-25%";
          bg.style.width = "150%";
          bg.style.height = "150%";
          bg.style.transitionProperty = "transform, opacity";
          bg.style.transitionDuration = "10s, 1s";
          bg.style.transitionTimingFunction = "linear";
          bg.src = `/assets/titles/_ (${rand}).jpg`;
        };
        this.moveLeft = () => {
          bg.style.left = "0px";
          bg.style.transform = `translateX(-33.33%)`;
          bg.style.opacity = 1;
        };
        this.moveRight = () => {
          bg.style.left = "-50%";
          bg.style.transform = `translateX(33.33%)`;
          bg.style.opacity = 1;
        };
        this.setVertical = () => {
          const rand = Math.floor(Math.random() * 4) + 1;
          bg.style.left = "0px";
          bg.style.width = "100%";
          bg.style.height = "200%";
          bg.style.transitionProperty = "transform, opacity";
          bg.style.transitionDuration = "10s, 1s";
          bg.style.transitionTimingFunction = "linear";
          bg.src = `/assets/titles/_ (${rand}).jpg`;
        };
        this.moveUp = () => {
          bg.style.top = "0px";
          bg.style.transform = `translateY(-50%)`;
          bg.style.opacity = 1;
        };
        this.moveDown = () => {
          bg.style.top = "-100%";
          bg.style.transform = `translateY(50%)`;
          bg.style.opacity = 1;
        };
        this.setDiagonal = () => {
          const rand = Math.floor(Math.random() * 17) + 5;
          bg.style.width = "150%";
          bg.style.height = "150%";
          bg.style.transitionProperty = "transform, opacity";
          bg.style.transitionDuration = "10s, 1s";
          bg.style.transitionTimingFunction = "linear";
          bg.src = `/assets/titles/_ (${rand}).jpg`;
        };
        this.moveUpLeft = () => {
          bg.style.top = "0px";
          bg.style.left = "0px";
          bg.style.transform = `translate(-33.33%,-33.33%)`;
          bg.style.opacity = 1;
        };
        this.moveUpRight = () => {
          bg.style.top = "0px";
          bg.style.left = "-50%";
          bg.style.transform = `translate(33.33%,-33.33%)`;
          bg.style.opacity = 1;
        };
        this.moveDownLeft = () => {
          bg.style.top = "-50%";
          bg.style.left = "0px";
          bg.style.transform = `translate(-33.33%,33.33%)`;
          bg.style.opacity = 1;
        };
        this.moveDownRight = () => {
          bg.style.top = "-50%";
          bg.style.left = "-50%";
          bg.style.transform = `translate(33.33%,33.33%)`;
          bg.style.opacity = 1;
        };
        this.setScale = () => {
          const rand = Math.floor(Math.random() * 17) + 5;
          bg.style.transitionProperty = "transform, opacity";
          bg.style.transitionDuration = "10s, 1s";
          bg.style.transitionTimingFunction = "linear";
          bg.src = `/assets/titles/_ (${rand}).jpg`;
        };
        this.zoomIn = () => {
          bg.style.left = "0px";
          bg.style.top = "0px";
          bg.style.width = "100%";
          bg.style.height = "100%";
          bg.style.transform = `scale(2,2)`;
          bg.style.opacity = 1;
        };
        this.zoomOut = () => {
          bg.style.left = "-50%";
          bg.style.top = "-50%";
          bg.style.width = "200%";
          bg.style.height = "200%";
          bg.style.transform = `scale(0.5,0.5)`;
          bg.style.opacity = 1;
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
  };
};
