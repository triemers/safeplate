import { useState } from 'react'
import Tesseract from 'tesseract.js'

// Returns { extractedText, isProcessing, error, runOCR }
export function useOCR() {
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  async function runOCR(imageSource) {
    setIsProcessing(true)
    setError(null)
    try {
      const { data: { text } } = await Tesseract.recognize(imageSource, 'eng')
      setExtractedText(text)
      return text
    } catch (err) {
      setError('Could not read the image. Try a clearer photo.')
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  return { extractedText, isProcessing, error, runOCR }
}
