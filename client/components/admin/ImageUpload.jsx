'use client'
import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function ImageUpload({ images, setImages, maxFiles = 10 }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
    e.target.value = '' // Reset input to allow same file re-upload
  }

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (images.length + imageFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`)
      return
    }
    
    const newImages = imageFiles.map(file => ({
      file, // Keep the original File object
      preview: URL.createObjectURL(file), // Create preview URL
      name: file.name
    }))
    
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(images[index].preview)
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Hotel Images *
      </label>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop images here, or{' '}
          <label 
            htmlFor="image-upload"
            className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
          >
            browse
          </label>
        </p>
        <p className="text-sm text-gray-500">
          PNG, JPG, GIF up to 10MB each (max {maxFiles} images)
        </p>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images ({images.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}