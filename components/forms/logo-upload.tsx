"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface LogoUploadProps {
  currentLogoUrl?: string | null
  onLogoChange?: (logoUrl: string | null) => void
  disabled?: boolean
}

export function LogoUpload({ currentLogoUrl, onLogoChange, disabled }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Client-side validation
      const maxSize = 2 * 1024 * 1024 // 2MB
      const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml']

      if (file.size > maxSize) {
        toast.error('File size must be less than 2MB')
        return
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PNG, JPG, and SVG files are allowed')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/logo', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (response.ok) {
          toast.success('Logo uploaded successfully')
          setPreviewUrl(result.url)
          onLogoChange?.(result.url)
        } else {
          throw new Error(result.error || 'Upload failed')
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to upload logo')
        // Reset preview on error
        setPreviewUrl(currentLogoUrl || null)
      } finally {
        setIsUploading(false)
      }
    },
    [currentLogoUrl, onLogoChange]
  )

  const handleRemoveLogo = async () => {
    setIsUploading(true)
    try {
      const response = await fetch('/api/upload/logo', {
        method: 'DELETE',
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Logo removed successfully')
        setPreviewUrl(null)
        onLogoChange?.(null)
      } else {
        throw new Error(result.error || 'Failed to remove logo')
      }
    } catch (error) {
      console.error('Remove logo error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to remove logo')
    } finally {
      setIsUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false,
    disabled: disabled || isUploading,
  })

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Business Logo</h3>
            <p className="text-sm text-muted-foreground">
              Upload your business logo to appear on invoices. Maximum size: 2MB.
              Recommended dimensions: 400x200px. Formats: PNG, JPG, SVG.
            </p>
          </div>

          {previewUrl ? (
            <div className="relative">
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-muted rounded-lg bg-muted/30">
                <img
                  src={previewUrl}
                  alt="Business logo preview"
                  className="max-w-full max-h-32 object-contain"
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveLogo}
                  disabled={disabled || isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/50 hover:bg-muted/30'
                }
                ${(disabled || isUploading) ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </>
                ) : (
                  <>
                    {isDragActive ? (
                      <>
                        <Upload className="h-8 w-8 text-primary" />
                        <p className="text-sm font-medium">Drop your logo here</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, SVG up to 2MB
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {!previewUrl && !isUploading && (
            <p className="text-xs text-muted-foreground text-center">
              Your logo will appear in the header of your invoices
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}