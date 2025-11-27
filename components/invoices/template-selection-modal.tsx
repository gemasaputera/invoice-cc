"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, Sparkles, Briefcase, Minimize, Palette } from 'lucide-react'
import { toast } from 'sonner'

interface Template {
  id: string
  name: string
  description: string
  category: string
  previewUrl: string
  isDefault: boolean
  styles: any
}

interface TemplateSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: Template | 'blank') => void
  isLoading?: boolean
}

const CATEGORY_ICONS = {
  modern: Sparkles,
  professional: Briefcase,
  minimalist: Minimize,
  creative: Palette,
}

const CATEGORY_COLORS = {
  modern: 'bg-blue-100 text-blue-800',
  professional: 'bg-gray-100 text-gray-800',
  minimalist: 'bg-green-100 text-green-800',
  creative: 'bg-purple-100 text-purple-800',
}

export function TemplateSelectionModal({
  isOpen,
  onClose,
  onSelectTemplate,
  isLoading = false
}: TemplateSelectionModalProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | 'blank' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/invoice-templates')
        if (response.ok) {
          const data = await response.json()
          setTemplates(data.templates || [])
        } else {
          toast.error('Failed to load templates')
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
        toast.error('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen])

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      // onClose()
      setSelectedTemplate(null)
    }
  }

  const handleSelectBlank = () => {
    onSelectTemplate('blank')
    // onClose()
    setSelectedTemplate(null)
  }

  const renderTemplatePreview = (template: Template) => {
    // Create a simple preview based on template styles
    const styles = template.styles || {}
    const colors = styles.colors || {}

    return (
      <div
        className="h-40 rounded-lg border-2 p-3 bg-white relative overflow-hidden"
        style={{
          borderColor: colors.border || '#e5e7eb',
          backgroundColor: colors.background || '#ffffff'
        }}
      >
        {/* Header Preview */}
        <div className="flex justify-between items-start mb-2">
          <div className="w-12 h-4 rounded" style={{ backgroundColor: colors.accent || '#3b82f6' }} />
          <div className="w-16 h-3 rounded" style={{ backgroundColor: colors.primary || '#1f2937' }} />
        </div>

        {/* Invoice Details Preview */}
        <div className="space-y-1 mb-3">
          <div className="w-full h-2 rounded" style={{ backgroundColor: colors.secondary || '#6b7280' }} />
          <div className="w-3/4 h-2 rounded" style={{ backgroundColor: colors.secondary || '#6b7280' }} />
        </div>

        {/* Table Preview */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded" style={{ backgroundColor: colors.accent || '#3b82f6' }} />
          <div className="w-full h-1 rounded" style={{ backgroundColor: colors.border || '#e5e7eb' }} />
          <div className="w-full h-1 rounded" style={{ backgroundColor: colors.border || '#e5e7eb' }} />
        </div>

        {/* Total Preview */}
        <div className="absolute bottom-2 right-2">
          <div className="w-12 h-3 rounded" style={{ backgroundColor: colors.primary || '#1f2937' }} />
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Choose Invoice Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Blank Invoice Option */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === 'blank' ? 'ring-2 ring-primary shadow-md' : ''
            }`}
            onClick={() => setSelectedTemplate('blank')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <div className="text-gray-400 text-3xl">+</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">Start from Blank</h3>
                    {selectedTemplate === 'blank' && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Create a custom invoice from scratch with full control over layout and styling
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose a Template</h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const IconComponent = CATEGORY_ICONS[template.category as keyof typeof CATEGORY_ICONS] || Sparkles
                  const categoryColor = CATEGORY_COLORS[template.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.modern

                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate !== 'blank' && selectedTemplate?.id === template.id ? 'ring-2 ring-primary shadow-md' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Preview */}
                          {renderTemplatePreview(template)}

                          {/* Template Info */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{template.name}</h4>
                              {selectedTemplate !== 'blank' && selectedTemplate?.id === template.id && (
                                <Check className="w-5 h-5 text-green-600" />
                              )}
                              {template.isDefault && (
                                <Badge variant="default" className="text-xs">Default</Badge>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2">
                              {template.description}
                            </p>

                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4 text-gray-500" />
                              <Badge variant="secondary" className={`text-xs ${categoryColor}`}>
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSelectBlank}
              variant="outline"
              disabled={isLoading || selectedTemplate !== null && selectedTemplate !== 'blank'}
            >
              Use Blank
            </Button>
            <Button
              onClick={handleSelectTemplate}
              disabled={!selectedTemplate || selectedTemplate === 'blank' || isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create with Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}