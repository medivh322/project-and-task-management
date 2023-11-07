const express = require('express');

const router = express.Router();

const { 
    login,
} = require('../../controllers/coreControllers/authJwtController');
const { signup } = require('../../controllers/coreControllers/signupController');
const { catchErrors } = require('../../handlers/errorHandlers');

router.post('/login', catchErrors(login))
router.post('/registration', catchErrors(signup))

module.exports = router;