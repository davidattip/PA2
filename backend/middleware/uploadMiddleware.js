const multer = require('multer');
const path = require('path');

// Configuration de multer pour stocker les fichiers téléchargés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Assurez-vous que ce dossier existe
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtrage des fichiers pour accepter uniquement certains types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type!');
  }
};

// Initialisation de multer avec le stockage configuré et le filtre de fichier
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB par fichier
  fileFilter,
});

module.exports = upload;
