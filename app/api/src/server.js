import {app} from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

try{
    await connectDB(env.mongoUri);
    app.listen(env.port, () => {
        console.log(`VetCare API listening on port ${env.port} in ${env.nodeEnv} mode`);
    });
} catch (error) {
    console.error('Error starting VetCare API:', error);
    console.error('Error details:', error.message);
    process.exit(1); // Exit the process with an error code
}