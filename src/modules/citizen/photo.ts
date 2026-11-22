/** Largo máximo del Data URL de la foto ya comprimida (unos 88 KB de imagen). */
export const MAX_PHOTO_DATA_URL_LENGTH = 120_000
/** Archivo original máximo que se acepta antes de comprimir. */
export const MAX_SOURCE_FILE_BYTES = 15 * 1024 * 1024
const MAX_SIDE_STEPS = [1024, 800, 640, 480, 360]
const QUALITY_STEPS = [0.75, 0.6, 0.45, 0.35]

export class PhotoError extends Error {}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => { URL.revokeObjectURL(url); resolve(image) }
    image.onerror = () => { URL.revokeObjectURL(url); reject(new PhotoError('No se pudo leer la imagen. Probá con un JPG o PNG.')) }
    image.src = url
  })
}

/**
 * Reduce y recomprime la foto a JPEG hasta que el Data URL quede por debajo de
 * MAX_PHOTO_DATA_URL_LENGTH, para no agotar LocalStorage.
 */
export async function compressPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new PhotoError('El archivo debe ser una imagen.')
  if (file.size > MAX_SOURCE_FILE_BYTES) throw new PhotoError('La imagen es demasiado grande (máximo 15 MB).')

  const image = await loadImage(file)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new PhotoError('El navegador no permite procesar la imagen.')

  for (const maxSide of MAX_SIDE_STEPS) {
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight))
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    for (const quality of QUALITY_STEPS) {
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      if (dataUrl.length <= MAX_PHOTO_DATA_URL_LENGTH) return dataUrl
    }
  }
  throw new PhotoError('No se pudo reducir la foto lo suficiente. Probá con otra imagen.')
}

export function approximateKilobytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.round((base64.length * 3) / 4 / 1024)
}

export function isQuotaError(error: unknown): boolean {
  return error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error.code === 22)
}
