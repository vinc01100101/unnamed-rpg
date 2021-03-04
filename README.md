# unnamedRPG

**[Live App's Link](https://unnamed-rpg.herokuapp.com/ "an online rpg that is unnamed. :D")**
(still under development)

## Technologies used:

-   **React**
-   **Mongoose/MongoDB**
-   **Node.js**
-   **Express**
-   **Web Worker API** (used canvas.transferControlToOffscreen() to let the worker thread handle huge calculations of the animations and prevent lag on the user interface)
-   **Service Worker** (to cache the assets in the browser, so the next visit won't take too much time, since it will automatically look on the cached files, and will not perform re-download)
-   **HTML5** Canvas (to render animation)
-   **Socket.io** (to communicate between the server and multiple clients)
-   **Pug** (to perform dynamic import)

## Features:

-   **Map Maker** https://unnamed-rpg.herokuapp.com/mapmaker
    (supposed to be used as map maker of the game, arts were made by my teammate, just click "Auto" to use the test account)
-   **Animation Tester** (development tool that I built to test the animations, here's **_[how I test them](https://www.youtube.com/watch?v=Qa5rHBS0rtc&t=4s)_**)
-   **Sprites Tool** (a sprite sheet generator I built to make sprites, here's the **_[demo](https://www.youtube.com/watch?v=zS5dc3_CD6s)_**)
