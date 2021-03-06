const router = require('express').Router();

const customerRoutes = require('./customer-route.js');
const appointmentRoutes = require('./appointment-routes.js');
const stylistRoutes = require('./stylist-routes.js');
const serviceRoutes = require('./service-routes.js');
const calendarRoutes=require('./calendar-routes');

router.use('/customer', customerRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/stylists', stylistRoutes);
router.use('/service', serviceRoutes);
router.use('/calendar', calendarRoutes);

module.exports = router;