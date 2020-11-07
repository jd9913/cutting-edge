const router = require('express').Router();
const { Appointment } = require('../../models');
const withAuth = require("../../utils/auth");

//get api/appointment
router.get('/', withAuth, (req, res) => {
    Appointment.findAll({
        Appointment: {exclude: ['password']}
    })
        .then(dbAppointmentData => res.json(dbAppointmentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get api/appointment/1
router.get('/:id', withAuth, (req, res) => {
    Appointment.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
    .then(dbAppointmentData => {
        if(!dbAppointmentData) {
            res.status(404).json({message: "No appointment found with that ID" });
            return;
        }
        res.json(dbAppointmentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//post api/appointment
router.post('/', withAuth, (req, res) => {
    Appointment.create({
        username: req.body.username,
        appointment_date: req.body.appointment_date,
        appointment_time: req.body.appointment_time,
        stylist_id: req.body.stylist_id,
    })
    .then(dbAppointmentData => res.json(dbAppointmentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//login route
//http://localhost:3001/api/appointment/login
router.post('/login', withAuth, (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    Appointment.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbAppointmentData => {
      if (!dbAppointmentData) {
        res.status(400).json({ message: 'No stylist with that email address!' });
        return;
      }
  
      const validPassword = dbAppointmentData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      res.json({ stylist: dbAppointmentData, message: 'You are now logged in!' });
    });
  });

//put api/appointment/i
router.put('/:id', withAuth, (req, res) => {
    Appointment.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbAppointmentData => {
        if(!dbAppointmentData[0]) {
            res.status(404).json({message: "No stylist found with this id"});
            return;
        }
        res.json(dbAppointmentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

//delete api/appointment/i
router.delete('/:id', withAuth, (req, res) => {
    Appointment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbAppointmentData => {
        if(!dbAppointmentData) {
            res.status(404).json({message: "No stylist with that id found"});
            return;
        }
        res.json(dbAppointmentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;