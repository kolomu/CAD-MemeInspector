
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const _ = require('lodash');

const JSONdb = require('simple-json-db');
const db = new JSONdb('database.json');

const { v4: uuidv4 } = require('uuid');

app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.post('/upload-meme', (req, res) => {
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
            const file_extension = file_name_arr[file_name_arr.length -1]; 
           
            file.mv(`./uploads/${id}.${file_extension}`);

            const meme_data = {
                name: file.name,
                mimetype: file.mimetype,
                size: file.size,
                upload_date: Date.now(),
                tags: tags_arr
            }

            db.set(id, meme_data);

            //send response
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

app.get('/memes', (req, res) => {
    res.send(db.JSON());
})

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})