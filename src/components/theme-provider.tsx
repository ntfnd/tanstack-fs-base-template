import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

type ThemeProviderState = {
    theme: Theme;
    setTheme(theme: Theme): void;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
    undefined,
)

export const ThemeProvider = ({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === "undefined") {
            return defaultTheme
        }

        const stored = localStorage.getItem(storageKey)
        const isValidTheme = stored === "light" || stored === "dark" || stored === "system"

        if (isValidTheme) {
            return stored as Theme
        }

        return defaultTheme
    })

    useEffect(() => {
        if (typeof window === "undefined") return

        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const systemThemeMap: Readonly<Record<string, Theme>> = {
                true: "dark",
                false: "light",
            }
            const systemTheme = systemThemeMap[String(isDark)] || "light"

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (nextTheme: Theme) => {
            if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, nextTheme)
            }
            setThemeState(nextTheme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeProviderContext)

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    return context
}
