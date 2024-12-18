const dayjs = require('dayjs');
const express = require('express');
const {sendNoReplyEmail} = require('./src/email');
const cors = require('cors');
const clinicRoute = require('./src/clinic');
const patientsRoute = require('./src/patients');
const authRoute = require('./src/auth');
const {Clinic, Patients} = require('./models/tables');
const { Op } = require('sequelize');
const _ = require('lodash');
const serveIndex = require('serve-index');

const app = express(),
      bodyParser = require("body-parser");
      port = 3000;

const users = [];


app.use(cors());

app.get('/test', async (req, res) => {
  const c = await Clinic.findAll();
  res.send(`Total:${c.length}`);
});

app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/smsmclinic/dist/smsmclinic/"));

app.get('/api/', async (req, res) => {
  const today = dayjs().add(3, 'day');
  const result = {status: 'success'};
  try {
    const events = await Clinic.findAll({
      where: {
        date: { [Op.gte]: today.format("YYYY-MM-DD")},
        psychiatrist: false
      },
      include: [{model: Patients, as: 'Patients'}]
    });
    result.events = events.map(e => {
      return {
        'eventId': e.id,
        'date': e.date,
        'title': e.title,
        'full': e.desiredAttendance <= (e.Patients.length)
      };
    });
  } catch (e) {
    res.json({message: e, status: 'fail'});
  } finally {
    res.json(result);
  }
},);

app.get('/api/psychiatrist', async (req, res) => {
  const today = dayjs().add(3, 'day');
  const result = {status: 'success'};
  try {
    const events = await Clinic.findAll({
      where: {
        date: { [Op.gte]: today.format("YYYY-MM-DD")},
        psychiatrist: true
      },
      include: [{model: Patients, as: 'Patients'}]
    });
    result.events = events.map(e => {
      return {
        'eventId': e.id,
        'date': e.date,
        'title': e.title,
        'full': e.desiredAttendance <= (e.Patients.length)
      };
    });
  } catch (e) {
    res.json({message: e, status: 'fail'});
  } finally {
    res.json(result);
  }
},);

app.post('/api/schedule/', async (req, res) => {
    let result = {};
    try {
      const clinic = await Clinic.findOne({
        where: {
          id: req.body.eventId
        },
        include: [{model: Patients, as: 'Patients'}]
      });
      if (clinic && clinic.Patients.length < clinic.desiredAttendance && req.body.email && req.body.phone) {
        const startOfMonth = dayjs(clinic.date).startOf('month');
        const endOfMonth = dayjs(clinic.date).endOf('month');
        const check = await Patients.findAll({
          where: {
            [Op.or]: [
              {
                email: req.body.email
              },
              {
                phone: req.body.phone
              }
            ],
            firstName: _.startCase(req.body.firstName)
          },
          include: [{model: Clinic, where: {
              date: { [Op.gte]: startOfMonth.toDate(), [Op.lte]: endOfMonth.toDate() },
              title: 'Clinic'
          }}]
        });
        if (_.isEmpty(check)) {
          const payload = _.cloneDeep(req.body);
          payload.name = `${payload.firstName} ${payload.lastName}`;
          payload.firstName = _.startCase(payload.firstName);
          payload.lastName = _.startCase(payload.lastName);
          payload.city = _.startCase(payload.city);
          payload.address = _.startCase(payload.address);
          payload.clinicId = req.body.eventId;
          delete payload.eventId;
          const patient = await Patients.create(payload);
          const strDate = dayjs(clinic.date).format("MM/DD/YYYY");
          const subject = `St. Mina Clinic - ${strDate} Spot Claimed`;
          const message = `
          Dear ${patient.name},<br/>
          Spot reserved for ${patient.name} on ${strDate}.<br/>
          <h3>Important Notes</h3>
          1- The doctor will see one patient at a time.<br/>
            <br/>
          2- No family members or children allowed to come with the patient, except if the patient can not walk without assistance.<br/>
            <br/>
          3- Make sure to complete all the registration properly until you get a confirmation message. Print this confirmation message and bring it or have it ready on your phone when coming to the clinic.<br/>
            <br/>
          4- Must wear a mask at all times, including the time you are with the doctor.<br/>
            <br/>
          5- Please be aware that we only see uninsured individuals. If you have insurance we can't provide you any service.<br/>
            <br/>
          6- The patient is allowed to register <span style="color: red">once</span> per month. <span style="color: red">STRICTLY NO WALK-IN.</span> <br/>
            <br/>
          <br/>
          Any questions please call - <a href="tel:813-360-0622">813-360-0622</a>
          <br/>
          May the Lord bless you, <br/>
          St. Mina Clinic, Clearwater FL
         `;
          await sendNoReplyEmail(payload.email, subject, message);
          result.completed = message;
          result.id = patient.id;
        } else {
          throw "Patient is only allowed to register once per month.";
        }
      } else {
       throw "Sorry already full";
      }
      result.status = 'success';
    } catch (e) {
        res.status(400);
        result = {'message': e, status: 'fail'};
    } finally {
        res.json(result);
    }
},);


app.post('/api/user', (req, res) => {
  const user = req.body.user;
  users.push(user);

  res.json("user addedd");
});

app.get('/api/sample_email', (req, res) => {
  res.json({'message': "user addedd"});
});

app.use('/api', authRoute);
app.use('/api', clinicRoute);
app.use('/api', patientsRoute);

app.use(express.static(__dirname + "/"))
app.use('/files', serveIndex(__dirname + '/files'));

app.get('/*', (req,res) => {
  res.sendFile(process.cwd()+"/smsmclinic/dist/smsmclinic/index.html")
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
