import multer from 'multer'
import path from 'path'
import fs from 'fs'

const tempDir = 'tmp/'
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10 // Max 10 files
  }
})

export const uploadMultiple = (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Max 10MB per file' })
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'Too many files. Max 10 files allowed' })
      }
      return res.status(400).json({ message: err.message })
    }
    next()
  })
}