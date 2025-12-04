// Функция для генерации случайного HEX цвета
export function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

// Генерация гармоничной палитры
export function generateHarmoniousPalette(count = 5) {
  const baseHue = Math.floor(Math.random() * 360)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const hue = (baseHue + (i * 360 / count)) % 360
    const saturation = 60 + Math.random() * 30
    const lightness = 40 + Math.random() * 30
    
    colors.push(hslToHex(hue, saturation, lightness))
  }
  
  return colors
}

// Конвертация HSL в HEX
function hslToHex(h, s, l) {
  h /= 360
  s /= 100
  l /= 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Конвертация HEX в RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Вычисление контраста между цветами (WCAG)
export function getContrastRatio(color1, color2) {
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)
  
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Преобразование HEX в строку RGB
export function hexToRgbString(hex) {
  const rgb = hexToRgb(hex)
  return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''
}

// Генерация монохромной палитры
export function generateMonochromatic(baseColor, count = 5) {
  const baseHsl = hexToHsl(baseColor)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const lightness = 20 + (i * 60 / (count - 1))
    colors.push(hslToHex(baseHsl.h, baseHsl.s, lightness))
  }
  
  return colors
}

// Конвертация HEX в HSL
function hexToHsl(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return { h: 0, s: 0, l: 0 }
  
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// Проверка валидности HEX цвета
export function isValidHex(hex) {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

// Осветление цвета
export function lightenColor(hex, percent) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const amount = Math.round(2.55 * percent)
  const r = Math.min(255, rgb.r + amount)
  const g = Math.min(255, rgb.g + amount)
  const b = Math.min(255, rgb.b + amount)
  
  return rgbToHex(r, g, b)
}

// Затемнение цвета
export function darkenColor(hex, percent) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const amount = Math.round(2.55 * percent)
  const r = Math.max(0, rgb.r - amount)
  const g = Math.max(0, rgb.g - amount)
  const b = Math.max(0, rgb.b - amount)
  
  return rgbToHex(r, g, b)
}

// Конвертация RGB в HEX
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}