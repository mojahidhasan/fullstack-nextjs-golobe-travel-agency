import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./MongoDBClient";

export default MongoDBAdapter(client);
