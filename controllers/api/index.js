const router = require('express').Router();


const customerRoutes = require('./customer-routes.js');
const appointmentRoutes = require('./appointment-routes.js');
const stylistRoutes = require('./stylist-routes.js');
const serviceRoutes = require('./service-routes.js');

router.use('/customer', customerRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/stylists', stylistRoutes);
router.use('/service', serviceRoutes);

module.exports = router;