import { useEffect, useState } from 'react'

export function ThemeBtn({setIsLightOrDark = () => {}}) {
    const [theme, setTheme] = useState("dark")

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        const systemPefersDark = window.matchMedia('{prefers-color-schema: dark}').matches
        if(savedTheme){
            setTheme(savedTheme)
        }
        else if(systemPefersDark){
            setTheme(systemPefersDark)
        }
    }, [])

    useEffect(() => {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme)
        localStorage.setItem("theme", theme)
        setIsLightOrDark(theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === "light"? "dark": "light")
    }

  return (
        <button 
        onClick={toggleTheme} 
        aria-label={`Switch to ${theme === 'dark'? "light": "dark"} mode`}
        className='p-1 rounded-full bg-[#f1e8ff] dark:bg-gray-700 hover:bg-[#f1e8ff82] dark:hover:bg-gray-600 transition-colors cursor-pointer z-[100000000000]'
        >
            {
                theme === "dark"? (
                    <span className='text-yellow-300'>
                        ☀️
                    </span>
                ): (
                    <span className='text-gray-700'>
                        🌑
                    </span>
                )
            }
        </button>
  )
}

