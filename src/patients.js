const router = require('express').Router();
const dayjs = require("dayjs");
const {Clinic, Patients, Users} = require('../models/tables');

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


router.route('/patients/:clinicId').get(async (req, res) => {
  let result = {};
  try {
    result.patients = await Patients.findAll({
      where: {
        clinicId: req.params.clinicId
      },
      order: [['firstName', 'ASC'], ['lastName', 'ASC']]
    });
    res.status(200);
  } catch (e) {
    res.status(400);
    result = {'message': e};
  } finally {
    res.json(result);
  }
},);

router.route('/patient').post(async (req, res) => {
    let result = {};
    try {
        result.patient = await Patients.create(req.body);
        res.status(201);
    } catch (e) {
        res.status(400);
        result = {'message': e};
    } finally {
        res.json(result);
    }
},);

router.route('/patient/:id').patch(async (req, res) => {
    let result = {};
    try {
          await Patients.update(req.body, {
            where: {
                id: req.params.id
            }
          });
          res.status(204);
    } catch (e) {
        res.status(400);
        result = {'message': e};
    } finally {
        res.json(result);
    }
},).delete(async (req, res) => {
  let result = {};
      try {
          await Patients.destroy({
              where: {
                  id: req.params.id
              },
          });
          res.status(204);
    } catch (e) {
        res.status(400);
        result = {'message': e};
    } finally {
        res.json(result);
    }
},);

module.exports = router;
