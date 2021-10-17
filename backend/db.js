const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'meme_inspector';
const collectionName = 'memes';
let db = undefined;

module.exports = {
    init_db: async () => {
        console.log(`initialize db: [${url}] db: [${dbName}] collection: [${collectionName}]`)
        await client.connect();
        db = client.db(dbName);
    },

    destroy_db: () => {
        client.close();
    },

    getMemes: async () => {
        try {
            const collection = db.collection(collectionName);
            return collection.find({}).toArray();
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    saveMeme: async (id, meme_data) => {
        try {
            const collection = db.collection(collectionName);
            await collection.insertOne({ _id: id, ...meme_data });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}
