const router = require('express').Router();
const { Stylist, Service, Appointment } = require('../../models');
const withAuth = require("../../utils/auth");

//get api/stylists
router.get('/', (req, res) => {
    Stylist.findAll({
        attributes: {exclude: ['password']}
    })
        .then(dbStylistData => res.json(dbStylistData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get api/stylists/1
router.get('/:id', (req, res) => {
    Stylist.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Service,
                attributes: ['id', 'category', 'style', 'stylist_id', 'price', 'time_alloted'], 
                include: {
                    model: Appointment,
                    attributes: ['id', 'customer_id', 'appointment_date', 'appointment_date_end', 'appointment_time', 'appointment_time_end', 'service_id']
                }
            }
        ]
    })
    .then(dbStylistData => {
        if(!dbStylistData) {
            res.status(404).json({message: "No stylist found with that ID" });
            return;
        }
        res.json(dbStylistData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//post api/stylists
router.post('/', withAuth, (req, res) => {
    Stylist.create({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        salon_name: req.body.salon_name,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbStylistData => { 
        req.session.save(() => {
            req.session.stylist_id = dbStylistData.id;
            req.session.username = dbStylistData.username;
            req.session.loggedIn = true;

            res.json(dbStylistData);
        });
    })
       
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//login route
//http://localhost:3001/api/stylists/login
router.post('/login', withAuth, (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    Stylist.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbStylistData => {
      if (!dbStylistData) {
        res.status(400).json({ message: 'No stylist with that email address!' });
        return;
      }
  
      const validPassword = dbStylistData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        req.session.stylist_id = dbStylistData.id;
        req.session.username = dbStylistData.username;
        req.session.loggedIn = true;

        res.json({ stylist: dbStylistData, message: 'You are now logged in!' });
        });
    });
  });

  router.post('/logout', (req, res) => {
      if(req.session.loggedIn) {
          req.session.destroy(() => {
              res.status(204).end();
          });
      }
      else {
          res.status(404).end();
      }
  })
//put api/stylists/i
router.put('/:id', withAuth, (req, res) => {
    Stylist.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbStylistData => {
        if(!dbStylistData[0]) {
            res.status(404).json({message: "No stylist found with this id"});
            return;
        }
        res.json(dbStylistData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

//delete api/stylists/i
router.delete('/:id', withAuth, (req, res) => {
    Stylist.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbStylistData => {
        if(!dbStylistData) {
            res.status(404).json({message: "No stylist with that id found"});
            return;
        }
        res.json(dbStylistData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;