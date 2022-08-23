import React, { useState } from "react";
import { useEffect } from "react";

type theme = "light" | "dark"

export const ThemeContext = React.createContext<theme>("light");

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [theme, setTheme] = useState<theme>("light");

    useEffect(() => {
        const interval = setInterval(() => {
            const currentHour = new Date().getHours();

            if (theme !== "dark" && currentHour >= 18) {
                setTheme("dark")
            }

            if (theme !== "light" && currentHour < 18) {
                setTheme("light")
            }

        }, 10000)

        return () => {
            clearInterval(interval);
        }

    }, []);


    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}
