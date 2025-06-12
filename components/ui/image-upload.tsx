"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onChange?: (files: File[]) => void
  onUpload?: (files: File[]) => Promise<string[]>
  value?: string[]
  maxFiles?: number
  maxSize?: number
  accept?: string[]
}

export function ImageUpload({
  onChange,
  onUpload,
  value = [],
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  accept = ["image/jpeg", "image/png", "image/webp"],
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>(value)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      // Verificar si se excede el número máximo de archivos
      if (acceptedFiles.length + previews.length > maxFiles) {
        setError(`No se pueden subir más de ${maxFiles} imágenes`)
        return
      }

      // Verificar el tamaño de los archivos
      const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSize)
      if (oversizedFiles.length > 0) {
        setError(`Algunos archivos exceden el tamaño máximo de ${maxSize / (1024 * 1024)}MB`)
        return
      }

      // Actualizar los archivos
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])

      // Llamar al callback onChange si existe
      if (onChange) {
        onChange([...files, ...acceptedFiles])
      }

      // Si existe onUpload, subir los archivos
      if (onUpload) {
        setIsUploading(true)
        try {
          const urls = await onUpload(acceptedFiles)
          setPreviews((prevPreviews) => [...prevPreviews, ...urls])
        } catch (error) {
          console.error("Error al subir imágenes:", error)
          setError("Error al subir las imágenes")
        } finally {
          setIsUploading(false)
        }
      } else {
        // Si no hay onUpload, crear previews locales
        const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
      }
    },
    [files, maxFiles, maxSize, onChange, onUpload, previews.length],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxFiles,
    maxSize,
  })

  const removeImage = (index: number) => {
    const newPreviews = [...previews]
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)

    const newFiles = [...files]
    if (index < newFiles.length) {
      newFiles.splice(index, 1)
      setFiles(newFiles)
      if (onChange) {
        onChange(newFiles)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/20 hover:border-muted-foreground/50"
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-muted-foreground">Subiendo imágenes...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {isDragActive ? "Suelta las imágenes aquí" : "Arrastra y suelta imágenes aquí"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">o haz clic para seleccionar archivos</p>
            <Button type="button" variant="outline" size="sm" className="mt-4">
              Seleccionar imágenes
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
