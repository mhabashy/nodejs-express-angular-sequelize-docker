const {Op} = require("sequelize");

const router = require('express').Router();
const dayjs = require("dayjs");
const { Clinic, Patients, Users}  = require('../models/tables');

const basicAuth = require('express-basic-auth');
const xl = require("excel4node");

const _ = require('lodash');

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

router.route('/clinic/').get(async (req, res) => {
    let result = {};
    const today = dayjs().add(1, 'day');
    try {
        result.upcoming = await Clinic.findAll({
            where: {
                date: {[Op.gte]: today.toDate()}
            },
            include: [{model: Patients, as: 'Patients', attributes: ['id']}],
            order: [['id', 'DESC']]
        });
        result.previous = await Clinic.findAll(
          {
            where: {
              date: {[Op.lte]: today.toDate()}
            },
            include: [{model: Patients, as: 'Patients', attributes: ['id']}],
            order: [['id', 'DESC']],
            limit: 10
          }
        );
    } catch (e) {
        res.status(400);
        result = {'message': e};
    } finally {
        res.json(result);
    }
},).post(async (req, res) => {
  let result = {};
      try {
        const body = _.cloneDeep(req.body);
        body.date = dayjs(body.date).toDate();
        result.clinic = Clinic.create(body);
    } catch (e) {
        res.status(400);
        result = {'message': e};
    } finally {
        res.json(result);
    }
},);

router.route('/clinic/:id').patch(async (req, res) => {
    let result = {};
    try {
        const body = _.cloneDeep(req.body);
        body.date = dayjs(body.date).toDate();
        result.clinic = await Clinic.update(body, {
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
        await Clinic.destory({
            where: {
                id: req.params.id,
            }
        });
        res.status(204);
    } catch (e) {
        res.status(400);
        result = {'message': e};
    } finally {
        res.json(result);
    }
},);

router.route('/clinic/excel/:id').get(async (req, res) => {
  try {
    const patients = await Patients.findAll({
      where: {
        clinicId: req.params.id
      },
      order: [['firstName', 'ASC'], ['lastName', 'ASC']]
    });
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Sheet 1');
    const style = wb.createStyle({
      font: {
        bold: true,
        color: '#0048BA',
      },
    });
    const header = [
        {label: 'ID', key: 'id'},
        {label: 'Full Name', key: 'name'},
        {label: 'First Name', key: 'firstName'},
        {label: 'Last Name', key: 'lastName'},
        {label: 'Date of Birth', key: 'dateOfBirth'},
        {label: 'Age', key: 'age'},
        {label: 'Phone', key: 'phone'},
        {label: 'Email', key: 'email'},
        {label: 'Address', key: 'address'},
        {label: 'City', key: 'city'},
        {label: 'Zip Code', key: 'zipcode'},
        // {label: 'Refills Only', key: 'refills', b: true},
        // {label: 'Online', key: 'online', b: true},
        // {label: 'Contact Type', key: 'contactType'},
        {label: 'Is New', key: 'isNew', b: true},
        {label: 'Question Only', key: 'generalQuestion', b: true},
        {label: 'Signed Up Time', key: 'createdAt'},
    ];
    const row = 2;
    _.forEach(header, (v, i) => {
        ws.cell(1,i + 1).string(v.label).style(style);
    });
    _.forEach(patients, (v, i) => {
       _.forEach(header, (h, k) => {
         if (h.b) {
           if (_.get(patients[i], `${h.key}`, false)) {
             ws.cell(row + i, k + 1, ).string(
                 'Yes'
              );
           } else {
             ws.cell(row + i, k + 1, ).string(
                 'No'
              );
           }
         } else {
           ws.cell(row + i, k + 1, ).string(
               _.toString(_.get(patients[i], `${h.key}`, ''))
            );
         }
       });
    });
    wb.write(`clinic-${req.params.id}.xlsx`, res);
    res.status(200);
  } catch (e) {
    res.status(400);
    res.json({'message': e});
  }
},);

router.route("/clinic/excel/:id/simple").get(async (req, res) => {
  try {
    const patients = await Patients.findAll({
      where: {
        clinicId: req.params.id,
      },
      order: [
        ["firstName", "ASC"],
        ["lastName", "ASC"],
      ],
    });
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Sheet 1");
    const style = wb.createStyle({
      font: {
        bold: true,
        color: "#0048BA",
      },
    });
    const header = [
      { label: "Full Name", key: "name" },
      { label: "Date of Birth", key: "dateOfBirth" },
      { label: "Age", key: "age" },
      { label: "Phone", key: "phone" },
      { label: "Address", key: "address" },
      { label: "City", key: "city" },
      { label: "Zip Code", key: "zipcode" },
      { label: "Is New", key: "isNew", b: true },
    ];
    const row = 2;
    _.forEach(header, (v, i) => {
      ws.cell(1, i + 1)
        .string(v.label)
        .style(style);
    });
    _.forEach(patients, (v, i) => {
      _.forEach(header, (h, k) => {
        if (h.b) {
          if (_.get(patients[i], `${h.key}`, false)) {
            ws.cell(row + i, k + 1).string("Yes");
          } else {
            ws.cell(row + i, k + 1).string("No");
          }
        } else {
          ws.cell(row + i, k + 1).string(
            _.toString(_.get(patients[i], `${h.key}`, ""))
          );
        }
      });
    });
    wb.write(`clinic-${req.params.id}.xlsx`, res);
    res.status(200);
  } catch (e) {
    res.status(400);
    res.json({ message: e });
  }
});


module.exports = router;
