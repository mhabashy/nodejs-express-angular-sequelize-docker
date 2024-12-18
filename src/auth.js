const router = require('express').Router();
const { Users } = require("../models/tables");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const basicAuth = require('express-basic-auth');
router.use(basicAuth({
    users: { 'stminaclinic': 'angelmichael' },
    challenge: true
}));

router.route('/login').post(async (req, res) => {
    let result = {};
    const password = crypto.createHash('md5').update(req.body.password).digest('hex');
    try {
        const user = await Users.findOne({
            where: {
                username: req.body.username,
                password
            }
        });
        if (user) {
            user.sessionId = uuidv4();
            await user.save();
            result = {'status': 'success', sessionId: user.sessionId, user: user.toJSON()};
        } else {
          throw 'Invalid Password/ Invalid User';
        }
    } catch (e) {
        res.status(400);
        result = {'message': e};
    } finally {
        res.json(result);
    }
},);

router.route('/logout')
    .get(async (req, res) => {
            console.log(req.header('session'));
      const session = req.header('session');
      if (_.isNil(session)) {
        res.json({"status": 'success'});
        return;
      }
      const user = await Users.findOne({
        where: {
          sessionId: session
        }
      });
      if (user != null) {
        user.sessionId = null;
        await user.save();
      }
      res.json({"status": 'success'});
    },
);

module.exports = router;
