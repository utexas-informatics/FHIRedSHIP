const router = require('express').Router();
const auditController = require('../controllers/audit.controller');

router.post('/callback', auditController.callback);

module.exports = router;