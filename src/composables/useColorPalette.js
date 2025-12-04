import { ref, computed, watch } from 'vue'
import { generateHarmoniousPalette, generateMonochromatic } from '../utils/colorUtils'

export function useColorPalette() {
  // Реактивное состояние
  const colors = ref([])
  const pinnedColors = ref([])
  const colorCount = ref(5)
  const format = ref('hex') // 'hex' или 'rgb'
  const savedPalettes = ref([])
  
  // Загрузка из localStorage
  const loadFromStorage = () => {
    const saved = localStorage.getItem('colorPalettes')
    if (saved) {
      try {
        savedPalettes.value = JSON.parse(saved)
      } catch (e) {
        savedPalettes.value = []
      }
    }
    
    const current = localStorage.getItem('currentPalette')
    if (current) {
      try {
        colors.value = JSON.parse(current)
      } catch (e) {
        colors.value = []
      }
    }
    
    // Если нет сохраненных цветов, генерируем начальную палитру
    if (colors.value.length === 0) {
      generatePalette('harmonious')
    }
  }
  
  // Сохранение в localStorage
  const saveToStorage = () => {
    localStorage.setItem('currentPalette', JSON.stringify(colors.value))
    localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes.value))
  }
  
  // Генерация новой палитры
  const generatePalette = (type = 'harmonious') => {
    let newColors
    
    if (type === 'monochromatic' && colors.value.length > 0) {
      newColors = generateMonochromatic(colors.value[0], colorCount.value)
    } else {
      newColors = generateHarmoniousPalette(colorCount.value)
    }
    
    // Сохраняем закрепленные цвета
    if (pinnedColors.value.length > 0) {
      pinnedColors.value.forEach((pinnedColor, index) => {
        if (index < newColors.length) {
          newColors[index] = pinnedColor
        }
      })
    }
    
    colors.value = newColors
    saveToStorage()
  }
  
  // Копирование цвета в буфер обмена
  const copyToClipboard = async (color) => {
    try {
      await navigator.clipboard.writeText(color)
      return true
    } catch (err) {
      console.error('Failed to copy: ', err)
      return false
    }
  }
  
  // Закрепление/открепление цвета
  const togglePinColor = (color) => {
    const index = pinnedColors.value.indexOf(color)
    
    if (index === -1) {
      pinnedColors.value.push(color)
    } else {
      pinnedColors.value.splice(index, 1)
    }
    
    saveToStorage()
  }
  
  // Сохранение палитры
  const savePalette = (name) => {
    const palette = {
      id: Date.now(),
      name: name || `Palette ${savedPalettes.value.length + 1}`,
      colors: [...colors.value],
      createdAt: new Date().toISOString()
    }
    
    savedPalettes.value.push(palette)
    saveToStorage()
  }
  
  // Удаление палитры
  const deletePalette = (id) => {
    savedPalettes.value = savedPalettes.value.filter(p => p.id !== id)
    saveToStorage()
  }
  
  // Автозагрузка при инициализации
  loadFromStorage()
  
  // Автосохранение при изменениях
  watch([colors, savedPalettes], saveToStorage, { deep: true })
  
  return {
    colors,
    pinnedColors,
    colorCount,
    format,
    savedPalettes,
    generatePalette,
    copyToClipboard,
    togglePinColor,
    savePalette,
    deletePalette
  }
}