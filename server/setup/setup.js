require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

async function setupApp() {
    try {
        await mongoose.connect(process.env.DATABASE).catch(error => console.log(error));

        const Setting = require('../models/coreModels/Settings')

        console.log('👍 Settings created : Done!');
        process.exit();
    } catch (error) {
        console.log('\n🚫 Error! The Error info is below');
        console.log(error);
        process.exit();
    }
}

setupApp();