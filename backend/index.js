const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const morgan = require('morgan')
const _ = require('lodash');

const { init_db, destroy_db, getMemes, saveMeme } = require('./db');
init_db();
const { v4: uuidv4 } = require('uuid');

app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
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
            const file_extension = file_name_arr[file_name_arr.length - 1];

            file.mv(`./public/uploads/${id}.${file_extension}`);

            const meme_data = {
                id,
                name: file.name,
                file_extension,
                mimetype: file.mimetype,
                size: file.size,
                upload_date: Date.now(),
                tags: tags_arr
            }

            saveMeme(id, meme_data);

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

app.get('/memes', async (req, res) => {
    res.send(await getMemes());
})

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

const server = app.listen(port, () => {
    console.log(`Meme Inspector listening at http://localhost:${port}`)
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('\nclosing db connection');
        destroy_db();
        console.log('HTTP server closed')
    });

})
