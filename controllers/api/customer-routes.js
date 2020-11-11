const router = require("express").Router();
const { Appointment ,Customer, Service } = require("../../models");
//const withAuth = require("../../utils/auth");

//get api/customer
router.get('/', (req, res) => {
    Customer.findAll({
        attributes: {exclude: ['password']}
    })
        .then(dbCustomerData => res.json(dbCustomerData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET Customer by id
router.get('/:id', (req, res) => {
    Customer.findOne({
      attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
    },
    attributes: [
        'id',
        'username',
        'first_name',
        'last_name',
    ],
    include: [
        {
            model: Appointment,
            attributes: ['id', 'customer_id', 'appointment_date', 'appointment_time', 'stylist_id'],   
        }, 
        {
            model: Service,
            attributes: ['style', 'description'],
        }      
    ]
})
      .then(dbCustomerData => {
        if (!dbCustomerData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbCustomerData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // POST Customer
router.post("/", (req, res) => {
    Customer.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        
  })
  
  .then(dbCustomerData => {
    req.session.save(() => {
    req.session.customer_Id = dbCustomerData.id;
      req.session.email = dbCustomerData.email;
      req.session.loggedIn = true;
      console.log("hello")

     res.json(dbCustomerData);
   });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// Login
router.post("/login", (req, res) => {
    Customer.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbCustomerData => {
    if (!dbCustomerData) {
      res.status(400).json({ message: 'No Customer account found!' });
      return;
    }

    res.json({ user: dbUserData });

    const validPassword = dbCustomerData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.customerId = dbCustomerData.id;
      req.session.email = dbCustomerData.email;
      req.session.loggedIn = true;
  
      res.json({ customer: dbCustomerData, message: 'You are now logged in!' });
    });
  });
});



router.put('/:id', (req, res) => { 
    // pass in req.body instead to only update what's passed through
    Customer.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id,
      }
    })
      .then(dbCustomerData => {
        if (!dbCustomerData[0]) {
          res.status(404).json({ message: 'No customer found with this id' });
          return;
        }
        res.json(dbCustomerData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });



router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

router.delete("/:id", (req, res) => {
  Customer.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbCustomerData => {
    if (!dbCustomerData) {
      res.status(404).json({ message: 'No customer found with this id' });
      return;
    }
    res.json(dbCustomerData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;