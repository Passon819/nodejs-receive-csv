const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/', storage: storage });


app.post('/upload', upload.single('csvFile'), (req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).send('No file uploaded');
  }

  console.log('File uploaded successfully:', uploadedFile.originalname);
  console.log('uploadedFile:', uploadedFile);

  // Process the uploaded CSV file here
  // ...
  const fileContent = uploadedFile.buffer.toString('utf8');
  console.log('fileContent:', fileContent);

  const results = [];
  const parser = csv();

  parser.on('data', (data) => {
    results.push(data);
  });

  parser.on('end', () => {
    // Now, 'results' is an array of objects
    console.log('Parsed CSV:', results);
    res.status(200).send('File uploaded and processed successfully.');
  });

  // Pipe the file content to the parser
  const stream = require('stream');
  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(fileContent));
  bufferStream.pipe(parser);

  //res.send('File uploaded successfully');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

