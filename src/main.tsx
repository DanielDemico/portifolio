import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { I18nProvider } from '@/i18n/I18nProvider'
import App from './App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        {/* reducedMotion="user": respeita a preferência do sistema por menos movimento */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
