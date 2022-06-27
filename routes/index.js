const express = require("express");
const router = express.Router();
const getData = require("../data");

/* GET home page. */
router.get("/", async function(req, res, next) {
  const result = await getData.main();
  
  //getData.getCount(result, "Auckland");
  
  res.render("index", result);
});
module.exports = router;