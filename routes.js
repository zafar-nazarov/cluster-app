const router = require('express').Router();
const EmployeeController = require('./controllers/EmployeeController');

router.get('/employees', EmployeeController.getAll);

module.exports = router;