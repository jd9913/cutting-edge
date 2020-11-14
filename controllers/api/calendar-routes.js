const router = require('express').Router();

const { Appointment, Customer } = require('../../models');


router.get('/', (req, res)=>{
    Appointment.findAll({
        attributes:['id', 'customer_id', 'appointment_date', 'appointment_time', 'appointment_time_end', /*'appointment_date_end'*/, 'stylist_id'],

        include: [
            {
                model: Customer,
                attributes: ['username']
            }
        ]
    })
    .then(dbAppointmentData=>res.json
        (dbAppointmentData))
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        });
});

//post api/appointment

router.post('/', (req, res)=>{
    Appointment.create({
        customer_id: req.body.customer_id,
        appointment_date: req.body.appointment_date,
        appointment_time: req.body.appointment_time,
        appointment_time_end: req.body.appointment_time_end,
       /* appointment_date_end: req.body.appointment_date_end,*/
        stylist_id: req.body.stylist_id,
    })
    .then(dbAppointmentData=> res.json(dbApppointmentData))
    console.log('this is the appointment post route')
    .catch(err=>{
console.log('appnt did not post',err);
res.status(500).json(err);
    });
});











module.express=router;