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
        </select>
      </div>
      
      <div class="control-group">
        <label>Имя префикса:</label>
        <input v-model="prefix" placeholder="color-" class="prefix-input" />
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
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'

export default {
  name: 'ExportView',
  
  setup() {
    const { colors } = useColorPalette()
    const exportFormat = ref('css')
    const prefix = ref('color-')
    
    const exportResult = computed(() => {
      const currentColors = colors.value.length > 0 ? colors.value : ['#667eea', '#764ba2', '#f56565', '#48bb78', '#ed8936']
      
      switch(exportFormat.value) {
        case 'css':
          return `:root {\n` + 
                 currentColors.map((color, i) => 
                   `  --${prefix.value}${i + 1}: ${color};`
                 ).join('\n') + 
                 `\n}`
        
        case 'scss':
          return currentColors.map((color, i) => 
            `$${prefix.value}${i + 1}: ${color};`
          ).join('\n')
        
        case 'tailwind':
          const obj = currentColors.reduce((acc, color, i) => {
            acc[`${prefix.value}${i + 1}`] = color
            return acc
          }, {})
          return `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(obj, null, 6)}\n    }\n  }\n}`
        
        case 'json':
          return JSON.stringify({
            name: "Color Palette",
            colors: currentColors,
            generated: new Date().toISOString()
          }, null, 2)
        
        default:
          return currentColors.join('\n')
      }
    })
    
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(exportResult.value)
        alert('Код скопирован в буфер обмена!')
      } catch (err) {
        console.error('Ошибка копирования:', err)
        alert('Не удалось скопировать код')
      }
    }
    
    const downloadFile = () => {
      let extension = 'txt'
      let mimeType = 'text/plain'
      
      switch(exportFormat.value) {
        case 'css': extension = 'css'; break
        case 'scss': extension = 'scss'; break
        case 'tailwind': extension = 'js'; mimeType = 'application/javascript'; break
        case 'json': extension = 'json'; mimeType = 'application/json'; break
      }
      
      const blob = new Blob([exportResult.value], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      
      a.href = url
      a.download = `palette-export.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
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
  max-width: 800px;
  margin: 0 auto;
  color: var(--text-primary);
}

.export-view h2 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.export-controls {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
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

.export-preview {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid var(--border);
}

.export-preview h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.code-block {
  background: var(--bg-card) !important;
  color: var(--text-primary) !important;
  font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  max-height: 300px;
  overflow-y: auto;
}

.export-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
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
}
</style>