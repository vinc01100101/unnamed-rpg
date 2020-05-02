const React = require("react");
const InfoMessage = require("./InfoMessage");

module.exports = function PortraitScreen(props) {
  return (
    <div className="formContainer">
      <InfoMessage info={props.info} />
      <button
        onClick={() => {
          const docElem = document.documentElement;
          const container = document.getElementById("GamePageContainer");
          if (docElem.requestFullscreen && document.fullscreenEnabled) {
            container.requestFullscreen();
          } else if (
            docElem.webkitRequestFullScreen &&
            document.webkitFullscreenEnabled
          ) {
            container.webkitRequestFullScreen();
          } else if (
            docElem.mozRequestFullScreen &&
            document.mozFullScreenEnabled
          ) {
            container.mozRequestFullScreen();
          } else if (
            docElem.msRequestFullscreen &&
            document.msFullscreenEnabled
          ) {
            container.msRequestFullscreen();
          } else {
            alert("Fullscreen not supported");
          }

          screen.orientation
            .lock("landscape-primary")
            .then(() => {
              // alert("working");
              props._setStateCallback({
                show: props.lastShow,
              });
            })
            .catch(function (error) {
              const conf = window.confirm(
                "Your browser is not supported for orientation lock, download supported browser instead? (Recommended: Opera Browser)"
              );
              if (conf) {
                window.location.href =
                  "https://play.google.com/store/apps/details?id=com.opera.browser";
              }
              props._setStateCallback({
                info: {
                  type: "error",
                  message: (
                    <div id="orientationError">
                      Your browser is
                      <br />
                      not supported for orientation lock.
                      <br />
                      List of supported browsers:
                      <br />
                      <br />
                      <a
                        style={{ fontWeight: "bold" }}
                        href="https://play.google.com/store/apps/details?id=com.opera.browser"
                      >
                        Opera (Recommended)
                      </a>
                      <br />
                      <br />
                      <a href="https://play.google.com/store/apps/details?id=com.android.chrome">
                        Chrome
                      </a>
                      <br />
                      <a href="https://play.google.com/store/apps/details?id=com.brave.browser">
                        Brave
                      </a>
                      <br />
                      <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx">
                        Microsoft Edge
                      </a>
                    </div>
                  ),
                },
              });
            });
        }}
      >
        Enter Fullscreen
      </button>
    </div>
  );
};
