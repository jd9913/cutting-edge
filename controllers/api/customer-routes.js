const router = require("express").Router();
const { Customer } = require("../../models");

router.post("/", (req, res) => {
    Customer.create({
    username: req.body.username,
    password: req.body.password
  })
  .then(dbCustomerData => {
    req.session.save(() => {
      req.session.customerId = dbCustomerData.id;
      req.session.username = dbCustomerData.username;
      req.session.loggedIn = true;

      res.json(dbCustomerData);
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post("/login", (req, res) => {
    Customer.findOne({
    where: {
      username: req.body.username
    }
  }).then(dbCustomerData => {
    if (!dbCustomerData) {
      res.status(400).json({ message: 'No Customer account found!' });
      return;
    }

    const validPassword = dbCustomerData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.customerId = dbCustomerData.id;
      req.session.username = dbCustomerData.username;
      req.session.loggedIn = true;
  
      res.json({ customer: dbCustomerData, message: 'You are now logged in!' });
    });
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

router.delete("/customer/:id", (req, res) => {
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