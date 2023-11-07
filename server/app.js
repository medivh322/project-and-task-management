const express = require('express');

const helmet = require('helmet');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreSign');
const errorHandlers = require('./handlers/errorHandlers');
const isValidToken = require('./controllers/coreControllers/authJwtController/isValidToken');

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


app.use('/api', coreAuthRouter);
app.use('/api', isValidToken);

app.use(errorHandlers.developmentErrors);

module.exports = app;