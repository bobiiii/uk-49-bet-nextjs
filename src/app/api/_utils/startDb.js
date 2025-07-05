import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// if (!process.env.MONGODB_URI_Production) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// }

const uri = process.env.ENVIRONMENT_TYPE === "PRODUCTION" ? process.env.MONGODB_URI_PRODUCTION : process.env.MONGODB_URI_DEVELOPMENT ;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let isConnected = false;

export const startDB = async (req, res, next) => {
  if (isConnected) {
    console.log('=> using existing database connection');
    // next();
    return;
  }

  if (process.env.ENVIRONMENT_TYPE === 'DEVELOPMENT') {
    console.info('Connecting to MongoDB (dev)...');

    if (!global.mongoose) {
      console.log('=> creating new database connection');
      global.mongoose = { conn: null, promise: null };
    
    }

    if (!global.mongoose.conn) {
    console.log('=> using new database connection');
      global.mongoose.promise = mongoose.connect(uri).then((mongoose) => {
        console.log('connected to Mongodb dev ');
        return mongoose;
      }).catch((err) => {
        console.log('Mongoose connection error: ', err);
            return NextResponse.json({ error: "Databse Connection Error" }, { status: 500 });
      });
    }

    console.log('=> using existing database connection');
    global.mongoose.conn = await global.mongoose.promise;
    // console.log("global.mongoose.conn  ", global.mongoose.conn);
    
    isConnected = !!global.mongoose.conn;
    console.log("isConnected  ", isConnected);

    // next();
  } else {
    console.info('Connecting to MongoDB (Production)...');
    const connection = await mongoose.connect(uri);
    isConnected = !!connection.connections[0].readyState;
    console.log('Connected to Mongodb (Production) ');
    // next();
  }
};

// module.exports = { startDB };