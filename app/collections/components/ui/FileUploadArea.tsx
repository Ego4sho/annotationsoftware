import { Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { File } from '../../types'

interface FileUploadAreaProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  maxFiles: number
  accept: string
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  files,
  onFilesChange,
  maxFiles,
  accept
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (newFiles: FileList | File[]) => {
    const validFiles = Array.from(newFiles)
      .slice(0, maxFiles - files.length)
      .filter(file => accept.includes(file.type) || accept.includes(`.${file.name.split('.').pop()}`))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.split('/')[0] as 'video' | 'audio' | 'sensor',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }))

    onFilesChange([...files, ...validFiles])
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-[#604abd] transition-colors"
      >
        <div className="flex flex-col items-center">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-gray-400 mt-2">Drop files here or click to upload</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => handleFiles(e.target.files!)}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <span className="text-white">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilesChange(files.filter((_, i) => i !== index))}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 