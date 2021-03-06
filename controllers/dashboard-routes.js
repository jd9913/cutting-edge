const router = require('express').Router();
const {Service, Appointment, Customer, Stylist} = require('../models');
const withAuth = require('../utils/auth');

 router.get('/', (req, res) => {
    Customer.findOne({
        where: {
            // id: req.params.id
            customer_id: req.session.customer_id
        },
        attributes: { exclude: ['password'] },
        where: {
          id: req.params.id
      },
      attributes: ['id', 'customer_id','appointment_date', 'appointment_date_end', 'appointment_time' , 'appointment_time_end', 'service_id'],
      include: [
          {
              model: Customer,
              attributes: ['username', 'id']
          }, 
          {
              model: Service,
              attributes: ['style', 'id', 'price', 'description'],
          }
      ]
  })
    .then(dbCustomerData => {
        if(!dbCustomerData) {
            res.status(404).alert({message: "We could not find a customer with that id"});
            return;
        }
        const customer = dbCustomerData.get({plain:true});
        res.render('dashboard', {
            customer,
            loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


module.exports = router;