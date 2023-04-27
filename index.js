const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path')

// Middleware--------------------------------
// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).array('files');

// -------------------------------------------



// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
//   const mimetype = filetypes.test(file.mimetype);

  if (extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// route + controller -------------------------------------
// API endpoint
app.post('/upload-file', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log(req.files);
      res.send('Files uploaded successfully!');
    }
  });
});
// -------------------------------------


// Start server
app.listen(8000, () => console.log('Server started on port 8000'));