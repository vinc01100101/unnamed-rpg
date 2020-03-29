const router = require("express").Router();
//independent middleware, this can be reused.

router.use("/", (req, res, next) => {
  console.log(
    "_____________________" +
      "\nMETHOD: " +
      req.method +
      "\nPATH: " +
      req.path +
      "\nIP: " +
      (req.ip || req.connection.remoteAddress) +
      "\nUserAgent: " +
      req.headers["user-agent"]
  );
  next();
});

module.exports = router;
