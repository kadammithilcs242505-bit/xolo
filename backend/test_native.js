const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://xolo:123654@ac-wdsaqoz-shard-00-01.pimqihw.mongodb.net:27017,ac-wdsaqoz-shard-00-00.pimqihw.mongodb.net:27017,ac-wdsaqoz-shard-00-02.pimqihw.mongodb.net:27017/cab_booking?authSource=admin&replicaSet=atlas-w22di7-shard-0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
