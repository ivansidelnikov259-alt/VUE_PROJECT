<template>
  <div class="export-view">
    <h2>📤 Экспорт цветов</h2>
    
    <div class="export-controls">
      <div class="control-group">
        <label>Формат экспорта:</label>
        <select v-model="exportFormat" class="format-select">
          <option value="css">CSS Variables</option>
          <option value="scss">SCSS Variables</option>
          <option value="tailwind">Tailwind Config</option>
          <option value="json">JSON</option>
          <option value="plain">Простой список</option>
          <option value="palette-types">Типы палитр (объяснение)</option>
          <option value="mood-guide">Гид по настроениям</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Имя префикса:</label>
        <input v-model="prefix" placeholder="color-" class="prefix-input" />
      </div>
    </div>
    
    <!-- Информация о текущей палитре -->
    <div class="current-palette-info" v-if="colors.length > 0">
      <h3>Текущая палитра:</h3>
      <div class="palette-preview">
        <div 
          v-for="(color, index) in colors" 
          :key="index"
          class="preview-color"
          :style="{ backgroundColor: color }"
          :title="color"
        >
          <span class="color-index">{{ index + 1 }}</span>
          <span class="color-value">{{ color }}</span>
        </div>
      </div>
    </div>
    
    <div class="export-preview">
      <h3>Предпросмотр:</h3>
      <pre class="code-block">{{ exportResult }}</pre>
    </div>
    
    <div class="export-actions">
      <button @click="copyToClipboard" class="copy-btn">
        📋 Копировать код
      </button>
      <button @click="downloadFile" class="download-btn">
        ⬇️ Скачать файл
      </button>
    </div>
    
    <!-- Информация о типах палитр для экспорта -->
    <div class="export-info">
      <h3>📝 Информация для экспорта</h3>
      <div class="info-grid">
        <div class="info-card">
          <h4>CSS Variables</h4>
          <p>Используйте для веб-проектов. Совместимо со всеми современными браузерами.</p>
        </div>
        
        <div class="info-card">
          <h4>SCSS Variables</h4>
          <p>Для проектов на Sass/SCSS. Поддерживает миксины и функции.</p>
        </div>
        
        <div class="info-card">
          <h4>Tailwind Config</h4>
          <p>Готовый конфиг для Tailwind CSS. Просто скопируйте в tailwind.config.js</p>
        </div>
        
        <div class="info-card">
          <h4>Типы палитр</h4>
          <p>Подробное объяснение различных типов цветовых схем с примерами.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'

export default {
  name: 'ExportView',
  
  setup() {
    const { colors } = useColorPalette()
    const exportFormat = ref('css')
    const prefix = ref('color-')
    
    // Загружаем сохраненный формат
    onMounted(() => {
      const savedFormat = localStorage.getItem('exportFormat')
      if (savedFormat) exportFormat.value = savedFormat
      
      const savedPrefix = localStorage.getItem('exportPrefix')
      if (savedPrefix) prefix.value = savedPrefix
    })
    
    const exportResult = computed(() => {
      const currentColors = colors.value.length > 0 ? colors.value : ['#667eea', '#764ba2', '#f56565', '#48bb78', '#ed8936']
      
      switch(exportFormat.value) {
        case 'css':
          return `:root {\n` + 
                 currentColors.map((color, i) => 
                   `  --${prefix.value}${i + 1}: ${color};`
                 ).join('\n') + 
                 `\n}\n\n/* Использование: */\n/* .element { color: var(--${prefix.value}1); } */`
        
        case 'scss':
          return currentColors.map((color, i) => 
            `$${prefix.value}${i + 1}: ${color};`
          ).join('\n') + `\n\n// Использование:\n// .element { color: $${prefix.value}1; }`
        
        case 'tailwind':
          const obj = currentColors.reduce((acc, color, i) => {
            acc[`${prefix.value}${i + 1}`] = color
            return acc
          }, {})
          return `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(obj, null, 6)}\n    }\n  }\n}\n\n// Использование в Tailwind: bg-${prefix.value}1`
        
        case 'json':
          return JSON.stringify({
            name: "Color Palette",
            colors: currentColors,
            paletteType: localStorage.getItem('paletteType') || 'harmonious',
            baseColor: localStorage.getItem('baseColor') || '#667eea',
            generated: new Date().toISOString(),
            exportDate: new Date().toLocaleString('ru-RU')
          }, null, 2)
        
        case 'palette-types':
          return `/*
 * ТИПЫ ЦВЕТОВЫХ ПАЛИТР
 * 
 * 1. Аналогичная (Analogous) - ${currentColors.slice(0, 3).join(', ')}
 *    - Цвета рядом на цветовом круге (±30°)
 *    - Гармоничные, спокойные сочетания
 *    - Идеально для: фонов, градиентов, мягких интерфейсов
 * 
 * 2. Триада (Triadic) - ${currentColors.slice(0, 3).join(', ')}
 *    - Три равноудаленных цвета (120° разница)
 *    - Контрастные, сбалансированные сочетания
 *    - Идеально для: акцентов, кнопок, важных элементов
 * 
 * 3. Комплементарная (Complementary) - ${currentColors.slice(0, 2).join(' и ')}
 *    - Противоположные цвета (180° разница)
 *    - Максимальный контраст, внимание
 *    - Идеально для: CTA-кнопок, предупреждений, выделения
 * 
 * 4. Монохромная (Monochromatic) - ${currentColors.slice(0, 4).join(', ')}
 *    - Оттенки одного цвета
 *    - Единообразный, профессиональный вид
 *    - Идеально для: брендинга, корпоративных сайтов
 * 
 * 5. По настроению (Mood-based)
 *    - Спокойные: пастельные синие/зеленые (#a8d8ea, #aa96da)
 *    - Энергичные: яркие красные/оранжевые (#ff165d, #ff9a00)
 *    - Профессиональные: приглушенные синие/серые (#2d4059, #ea5455)
 */
`
        
        case 'mood-guide':
          return `/*
 * ГИД ПО ЦВЕТОВЫМ НАСТРОЕНИЯМ
 * 
 * 🎭 СПОКОЙНЫЕ ПАЛИТРЫ
 * Характеристики:
 *   - Низкая насыщенность (20-60%)
 *   - Высокая светлота (50-80%)
 *   - Тона: синие, зеленые, пастельные
 * Использование:
 *   - Медитативные приложения
 *   - Сайты здоровья и wellness
 *   - Образовательные платформы
 * Пример: ${['#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2'].join(', ')}
 * 
 * ⚡ ЭНЕРГИЧНЫЕ ПАЛИТРЫ
 * Характеристики:
 *   - Высокая насыщенность (70-100%)
 *   - Средняя светлота (40-60%)
 *   - Тона: красные, оранжевые, яркие
 * Использование:
 *   - Спортивные приложения
 *   - Развлекательные платформы
 *   - Детские сайты
 * Пример: ${['#ff165d', '#ff9a00', '#ffde00', '#08ffc8'].join(', ')}
 * 
 * 💼 ПРОФЕССИОНАЛЬНЫЕ ПАЛИТРЫ
 * Характеристики:
 *   - Низкая насыщенность (10-40%)
 *   - Темные тона (20-50%)
 *   - Тона: синие, серые, приглушенные
 * Использование:
 *   - Корпоративные сайты
 *   - Банковские приложения
 *   - Юридические фирмы
 * Пример: ${['#2d4059', '#ea5455', '#f07b3f', '#ffd460'].join(', ')}
 * 
 * 🎨 КРЕАТИВНЫЕ ПАЛИТРЫ
 * Характеристики:
 *   - Высокая контрастность
 *   - Разнообразие цветов
 *   - Неожиданные сочетания
 * Использование:
 *   - Дизайн-студии
 *   - Художественные проекты
 *   - Креативные агентства
 * Пример: ${['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c'].join(', ')}
 */
`
        
        default:
          return currentColors.join('\n')
      }
    })
    
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(exportResult.value)
        
        // Сохраняем настройки
        localStorage.setItem('exportFormat', exportFormat.value)
        localStorage.setItem('exportPrefix', prefix.value)
        
        alert('Код скопирован в буфер обмена!')
      } catch (err) {
        console.error('Ошибка копирования:', err)
        alert('Не удалось скопировать код')
      }
    }
    
    const downloadFile = () => {
      let extension = 'txt'
      let mimeType = 'text/plain'
      let fileName = 'palette-export'
      
      switch(exportFormat.value) {
        case 'css': 
          extension = 'css'
          fileName = 'colors'
          break
        case 'scss': 
          extension = 'scss'
          fileName = '_colors'
          break
        case 'tailwind': 
          extension = 'js'
          mimeType = 'application/javascript'
          fileName = 'tailwind.config.colors'
          break
        case 'json': 
          extension = 'json'
          mimeType = 'application/json'
          fileName = 'palette'
          break
        case 'palette-types': 
          extension = 'md'
          fileName = 'palette-types-guide'
          break
        case 'mood-guide': 
          extension = 'md'
          fileName = 'color-mood-guide'
          break
      }
      
      const blob = new Blob([exportResult.value], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      
      a.href = url
      a.download = `${fileName}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Сохраняем настройки
      localStorage.setItem('exportFormat', exportFormat.value)
      localStorage.setItem('exportPrefix', prefix.value)
    }
    
    return {
      colors,
      exportFormat,
      prefix,
      exportResult,
      copyToClipboard,
      downloadFile
    }
  }
}
</script>

<style scoped>
.export-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: var(--text-primary);
}

.export-view h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-controls {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  background: var(--bg-tertiary);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 250px;
}

.control-group label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.format-select, .prefix-input {
  padding: 0.75rem 1rem;
  background: var(--bg-input);
  color: var(--text-primary);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.format-select:focus, .prefix-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.current-palette-info {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  margin-bottom: 2rem;
  box-shadow: var(--shadow-default);
}

.current-palette-info h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.palette-preview {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem;
}

.preview-color {
  flex: 0 0 120px;
  height: 100px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.5rem;
}

.color-index {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.color-value {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  text-align: center;
}

.export-preview {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-default);
}

.export-preview h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.code-block {
  background: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
  font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  max-height: 400px;
  overflow-y: auto;
  tab-size: 2;
}

.export-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.copy-btn, .download-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.copy-btn:hover, .download-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.copy-btn {
  background: var(--primary);
  color: white;
}

.download-btn {
  background: var(--success);
  color: white;
}

.export-info {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border);
  margin-top: 2rem;
  box-shadow: var(--shadow-default);
}

.export-info h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  border: 1px solid var(--border);
  transition: all var(--transition-fast);
}

.info-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-light);
  box-shadow: var(--shadow-default);
}

.info-card h4 {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.info-card p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 768px) {
  .export-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .control-group {
    min-width: 100%;
  }
  
  .export-actions {
    flex-direction: column;
  }
  
  .copy-btn, .download-btn {
    width: 100%;
    justify-content: center;
  }
  
  .palette-preview {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .preview-color {
    flex: 0 0 calc(50% - 0.5rem);
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>