const { DynamoDBClient, PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const REGION = "eu-central-1";
const dynamoClient = new DynamoDBClient({ region: REGION });
const tableName = "meme-inspector-dynamo";

module.exports = {
  save_meme: (id, meme_data) => {
    const { name, file_extension, mimetype, size, upload_date, tags } = meme_data;

    const params = {
      TableName: tableName,

      Item: {
        id: { S: id },
        name: { S: name },
        file_extension: { S: file_extension },
        mimetype: { S: mimetype },
        size: { S: size.toString() },
        upload_date: { S: upload_date.toString() },
        tags: { SS: tags }
      }
    };

    return dynamoClient.send(new PutItemCommand(params));
  },

  get_memes: async () => {
    var params = { TableName: tableName };
    const command = new ScanCommand(params);
    const response = await dynamoClient.send(command);
    const memes = response.Items.map(meme => {
      return {
        id: meme.id.S,
        name: meme.name.S,
        file_extension: meme.file_extension.S,
        mimetype: meme.mimetype.S,
        size: meme.size.S,
        upload_date: Number.parseInt(meme.upload_date.S),
        tags: meme.tags.SS
      };
    });

    return memes;
  }
}