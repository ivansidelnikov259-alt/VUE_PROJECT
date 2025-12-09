// Функция для генерации случайного HEX цвета
export function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

// Генерация гармоничной палитры (с базовым цветом или без)
export function generateHarmoniousPalette(count = 5, baseColor = null) {
  let baseHue
  
  if (baseColor) {
    const hsl = hexToHsl(baseColor)
    baseHue = hsl.h
  } else {
    baseHue = Math.floor(Math.random() * 360)
  }
  
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
// colorUtils.js - ДОБАВЛЯЕМ В КОНЕЦ ФАЙЛА

// Генерация аналогичной палитры (analogous)
export function generateAnalogousPalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    // Смещаем hue на +/- 30 градусов
    const hue = (hsl.h + (i - Math.floor(count / 2)) * 30 + 360) % 360
    const saturation = Math.min(100, hsl.s + (Math.random() * 20 - 10))
    const lightness = Math.min(90, Math.max(10, hsl.l + (Math.random() * 20 - 10)))
    
    colors.push(hslToHex(hue, saturation, lightness))
  }
  
  return colors
}

// Генерация триады (triadic)
export function generateTriadicPalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor)
  const colors = [baseColor]
  
  // Основные цвета триады
  const hue1 = (hsl.h + 120) % 360
  const hue2 = (hsl.h + 240) % 360
  
  colors.push(hslToHex(hue1, hsl.s, hsl.l))
  colors.push(hslToHex(hue2, hsl.s, hsl.l))
  
  // Добавляем дополнительные оттенки
  for (let i = 3; i < count; i++) {
    const hue = (hsl.h + (i * 60)) % 360
    const saturation = Math.min(100, hsl.s + (Math.random() * 30 - 15))
    const lightness = Math.min(90, Math.max(10, hsl.l + (Math.random() * 30 - 15)))
    
    colors.push(hslToHex(hue, saturation, lightness))
  }
  
  return colors.slice(0, count)
}

// Генерация комплементарной палитры (complementary)
export function generateComplementaryPalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor)
  const colors = [baseColor]
  
  // Комплементарный цвет
  const complementaryHue = (hsl.h + 180) % 360
  colors.push(hslToHex(complementaryHue, hsl.s, hsl.l))
  
  // Добавляем дополнительные оттенки
  for (let i = 2; i < count; i++) {
    const hue = i % 2 === 0 
      ? (hsl.h + Math.random() * 60) % 360
      : (complementaryHue + Math.random() * 60) % 360
    
    const saturation = Math.min(100, hsl.s + (Math.random() * 20 - 10))
    const lightness = Math.min(90, Math.max(10, hsl.l + (Math.random() * 20 - 10)))
    
    colors.push(hslToHex(hue, saturation, lightness))
  }
  
  return colors
}

// Генерация по настроению
export function generateMoodPalette(moodType, count = 5) {
  let baseHue, saturationRange, lightnessRange
  
  switch(moodType) {
    case 'calm':
      // Спокойные: синие, зеленые, пастельные
      baseHue = Math.random() * 180 // 0-180 (сине-зеленая зона)
      saturationRange = [20, 60] // низкая насыщенность
      lightnessRange = [50, 80] // средняя-высокая светлота
      break
      
    case 'energetic':
      // Энергичные: красные, оранжевые, яркие
      baseHue = Math.random() * 60 + 340 // 340-40 (красно-оранжевая зона)
      if (baseHue >= 360) baseHue -= 360
      saturationRange = [70, 100] // высокая насыщенность
      lightnessRange = [40, 60] // средняя светлота
      break
      
    case 'professional':
      // Профессиональные: синие, серые, приглушенные
      baseHue = Math.random() * 60 + 200 // 200-260 (сине-фиолетовая зона)
      saturationRange = [10, 40] // низкая насыщенность
      lightnessRange = [20, 50] // темные тона
      break
      
    default:
      baseHue = Math.random() * 360
      saturationRange = [30, 80]
      lightnessRange = [30, 70]
  }
  
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const hue = (baseHue + (i * 30)) % 360
    const saturation = saturationRange[0] + Math.random() * (saturationRange[1] - saturationRange[0])
    const lightness = lightnessRange[0] + Math.random() * (lightnessRange[1] - lightnessRange[0])
    
    colors.push(hslToHex(hue, saturation, lightness))
  }
  
  return colors
}

// Создание цветового круга данных
export function generateColorWheelData(baseColor = null) {
  const segments = 12
  const colors = []
  
  for (let i = 0; i < segments; i++) {
    const hue = (i * 30) % 360
    const saturation = 70
    const lightness = 60
    
    colors.push({
      hue,
      saturation,
      lightness,
      color: hslToHex(hue, saturation, lightness),
      angle: i * 30,
      isBase: baseColor ? 
        Math.abs(hue - hexToHsl(baseColor).h) < 15 : 
        i === 0
    })
  }
  
  return colors
}
// Добавляем эти функции в colorUtils.js если их еще нет:

// Генерация тетрадной палитры
export function generateTetradicPalette(baseColor, count = 4) {
  const hsl = hexToHsl(baseColor)
  const colors = [baseColor]
  
  // Добавляем цвета с шагом 90 градусов
  for (let i = 1; i < count; i++) {
    const hue = (hsl.h + (i * 90)) % 360
    const saturation = Math.min(100, hsl.s + (Math.random() * 20 - 10))
    const lightness = Math.min(90, Math.max(10, hsl.l + (Math.random() * 20 - 10)))
    
    colors.push(hslToHex(hue, saturation, lightness))
  }
  
  return colors
}