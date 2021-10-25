// import { S3Client } from "@aws-sdk/client-s3";
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const REGION = "eu-central-1"; 
const s3Client = new S3Client({ region: REGION });
const bucket_name = "meme-inspector-bucket";

module.exports = {
    save_file: async (file_name, content) => {
        const params = {
            Bucket: bucket_name, 
            Key: file_name, 
            Body: content, 
        };
        
        try {
            const results = await s3Client.send(new PutObjectCommand(params));
            console.log(`Successfully created: ${params.Key} and uploaded it to ${params.Bucket}/${params.Key}`);
            return results;
        } catch (err) {
            console.log("Error", err);
        }
    },
}
