const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const morgan = require('morgan')
const _ = require('lodash');

const { save_file } = require('./s3');
const { save_meme, get_memes } = require('./dynamo_db');

const { v4: uuidv4 } = require('uuid');

app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(morgan('dev'));

app.post('/api/upload-meme', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            const file = req.files.meme;
            const tags = req.body.tags;
            const tags_arr = tags ? tags.split(',').map(t => t.trim()) : [];
            const id = uuidv4();

            const file_name_arr = file.name.split('.');
            const file_extension = file_name_arr[file_name_arr.length - 1];
            const file_name = `${id}.${file_extension}`;

            try {
                await save_file(file_name, file.data);
            } catch (err) {
                console.log(err);
            } 

            const meme_data = {
                id,
                name: file.name,
                file_extension,
                mimetype: file.mimetype,
                size: file.size,
                upload_date: Date.now(),
                tags: tags_arr
            }

            try {
                await save_meme(id, meme_data)
            } catch(err) {
                 console.log(err);
                 return res.send({
                     message: err
                 });
             }

            res.send({
                status: true,
                message: 'File is uploaded',
                data: meme_data
            });

        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get('/api/memes', async (req, res) => {
    res.send(await get_memes());
})

app.use(express.static('public'))

app.get('/api/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

const server = app.listen(port, () => {
    console.log(`Meme Inspector listening at http://localhost:${port}`)
})