import { ref, watchEffect, onMounted } from 'vue'

export function useTheme() {
  const isDarkTheme = ref(false)
  
  const loadTheme = () => {
    try {
      const savedTheme = localStorage.getItem('colorPaletteTheme')
      if (savedTheme) {
        isDarkTheme.value = savedTheme === 'dark'
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        isDarkTheme.value = prefersDark
      }
      applyTheme()
    } catch (error) {
      console.error('Error loading theme:', error)
      isDarkTheme.value = false
      applyTheme()
    }
  }
  
  const applyTheme = () => {
    const htmlElement = document.documentElement
    
    if (isDarkTheme.value) {
      htmlElement.classList.add('dark-theme')
      htmlElement.classList.remove('light-theme')
      htmlElement.setAttribute('data-theme', 'dark')
    } else {
      htmlElement.classList.add('light-theme')
      htmlElement.classList.remove('dark-theme')
      htmlElement.setAttribute('data-theme', 'light')
    }
    
    const themeColor = isDarkTheme.value ? '#1a1a1a' : '#f5f5f5'
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.name = 'theme-color'
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.content = themeColor
  }
  
  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    try {
      localStorage.setItem('colorPaletteTheme', isDarkTheme.value ? 'dark' : 'light')
    } catch (error) {
      console.error('Error saving theme:', error)
    }
    applyTheme()
  }
  
  const setTheme = (theme) => {
    if (theme === 'dark' || theme === 'light') {
      isDarkTheme.value = theme === 'dark'
      try {
        localStorage.setItem('colorPaletteTheme', theme)
      } catch (error) {
        console.error('Error saving theme:', error)
      }
      applyTheme()
    }
  }
  
  onMounted(() => {
    loadTheme()
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('colorPaletteTheme')) {
        isDarkTheme.value = e.matches
        applyTheme()
      }
    }
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } else {
      mediaQuery.addListener(handleSystemThemeChange)
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      } else {
        mediaQuery.removeListener(handleSystemThemeChange)
      }
    }
  })
  
  watchEffect(() => {
    applyTheme()
  })
  
  return {
    isDarkTheme,
    toggleTheme,
    setTheme,
    loadTheme
  }
}