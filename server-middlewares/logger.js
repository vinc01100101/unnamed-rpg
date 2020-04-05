const router = require("express").Router();
//independent middleware, this can be reused.

router.use("/", (req, res, next) => {
  console.log(
    "__________________________________________" +
      "\nMETHOD: " +
      req.method +
      "\nPATH: " +
      req.path +
      "\nIP: " +
      (req.ip || req.connection.remoteAddress) +
      "__________________________________________"
  );
  next();
});

module.exports = router;
