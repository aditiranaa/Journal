import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system' | 'sepia'
type Font = 'sans' | 'serif' | 'mono'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  font: Font
  wallpaper: string | null
  setTheme: (theme: Theme) => void
  setFont: (font: Font) => void
  setWallpaper: (wallpaper: string | null) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  font: 'sans',
  wallpaper: null,
  setTheme: () => null,
  setFont: () => null,
  setWallpaper: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {

  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const [font, setFont] = useState<Font>(
    () => (localStorage.getItem('font') as Font) || 'sans'
  )

  const [wallpaper, setWallpaper] = useState<string | null>(
    () => localStorage.getItem('wallpaper')
  )

  // 🎨 APPLY THEME
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark', 'sepia')

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const appliedTheme =
      theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

    root.classList.add(appliedTheme)
  }, [theme])

  // 🔤 APPLY FONT + WALLPAPER
  useEffect(() => {
    document.body.className = font

    if (wallpaper) {
      document.body.style.backgroundImage = `url(${wallpaper})`
      document.body.style.backgroundSize = 'cover'
    } else {
      document.body.style.backgroundImage = 'none'
    }
  }, [font, wallpaper])

  // 💾 SAVE
  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme)
    setThemeState(theme)
  }

  const updateFont = (f: Font) => {
    localStorage.setItem('font', f)
    setFont(f)
  }

  const updateWallpaper = (w: string | null) => {
    if (w) localStorage.setItem('wallpaper', w)
    else localStorage.removeItem('wallpaper')
    setWallpaper(w)
  }

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        font,
        wallpaper,
        setTheme,
        setFont: updateFont,
        setWallpaper: updateWallpaper,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}