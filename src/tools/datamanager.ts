import {MongoClient} from "mongodb";

import {Project} from "./data.model";

const MONGO_URL: string = process.env.MONGO_URL!;
const MONGO_DB_NAME: string = process.env.MONGO_DB_NAME!;
const MONGO_COLLECTION_PROJECTS: string = process.env.MONGO_COLLECTION_PROJECTS!;


export async function getProjects(){
    let mongoClient: MongoClient = new MongoClient(MONGO_URL);

    let projArray: Project[];
 

    try{
        await mongoClient.connect();
        // make an array of the projects collection. 
        projArray = await mongoClient.db(MONGO_DB_NAME).collection<Project>(MONGO_COLLECTION_PROJECTS).find().toArray();

        // convert all id's to strings
        projArray.forEach((proj:Project) => proj._id = proj._id.toString())
        
    }catch(error: any){
        console.log(`>>>>>>>ERROR : ${error.message}`);
        throw error;

    }finally{
        mongoClient.close();
    }
    return projArray;
}

