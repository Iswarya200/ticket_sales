const router = require('express').Router();
const { generateQRCode } = require('../controllers/qrcodeController');

router.post('/generate', generateQRCode);

module.exports = router;