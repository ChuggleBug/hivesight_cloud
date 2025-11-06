import mongoose from 'mongoose';

export default function connectDB() {
    const db_url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    console.log('connecting to', db_url)
    return mongoose.connect(db_url)
        .then(() => {
            return true;
        })
        .catch(err => {
            return false;
        });
}
