const dayjs = require("dayjs");

const router = require("express").Router();
const basicAuth = require('express-basic-auth');
router.use(basicAuth({
    users: { 'stminaclinic': 'angelmichael' },
    challenge: true
}));

router.use(async function(req, res, next) {
    const dateNow = dayjs().subtract(3, 'hour');
    try {
      const user = await Users.findOne({
          where: {
             sessionId: req.header("sessionId")
          }
      });
      const sessionTime = dayjs(user.updatedAt);
      if (user && sessionTime.isAfter(dateNow)) {
          next()
      } else {
          user.sessionId = null;
          await user.save();
          throw "Invalid User";
      }
    } catch (e) {
      res.status(401);
      res.json({message: e | 'Invalid User'});
    }
});


router.route('/users').get(async (req, res) => {
    let result = {};
    try {
        // const users = await Users
    } catch (e) {
        res.status(400);
        result = {'message': e};
    } finally {
        res.json(result);
    }
},);


module.exports = router;
