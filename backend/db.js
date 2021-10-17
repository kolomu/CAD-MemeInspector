const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'meme_inspector';
const memeCollectionName = 'memes';
let meme_collection = undefined;

module.exports = {
    init_db: async () => {
        console.log(`initialize db: [${url}] db: [${dbName}] collection: [${memeCollectionName}]`)
        await client.connect();
        const db = client.db(dbName);
        meme_collection = db.collection(memeCollectionName);
    },

    destroy_db: () => {
        client.close();
    },

    getMemes: async () => {
        try {
            return meme_collection.find({}).toArray();
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    saveMeme: async (id, meme_data) => {
        try {
            await meme_collection.insertOne({ _id: id, ...meme_data });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}
