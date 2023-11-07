const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => {
    console.log(
        `1. 🔥 Commun Error caused issue → : check your .env file first and add your mongodb url`
    );
    console.error(`🚫 Error → : ${error.message}`);
});

const app = require('./app');
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → On PORT : ${server.address().port}`);
});