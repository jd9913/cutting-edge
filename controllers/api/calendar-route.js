const router = require('express').Router();
const { Appointment, Customer } = require('../../models');



router.get('/', (req, res) => {
    Appointment.findAll({
        attributes: ['id', 'customer_id', 'appointment_date', 'appointment_time', 'stylist_id'],
        include: [
            {
                model: Customer,
                attributes: ['username']
            }
        ]
    })
        .then(dbAppointmentData => res.json(dbAppointmentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//post api/appointment
router.post('/', (req, res) => {
    Appointment.create({
        customer_id: req.body.customer_id,
        appointment_date: req.body.appointment_date,
        appointment_time: req.body.appointment_time,
        stylist_id: req.body.stylist_id,
    })
    .then(dbAppointmentData => res.json(dbAppointmentData))
    console.log("hello")
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
    Appointment.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbAppointmentData => {
        if(!dbAppointmentData[0]) {
            res.status(404).json({message: "No appointment found with this id"});
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