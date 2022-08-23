import React, {useState} from "react";
import {useEffect} from "react";

type theme = "light" | "dark"

const getCurrentTheme = (): theme => {
    const currentHour = new Date().getHours();

    if (currentHour >= 18 || currentHour < 6) {
        return "dark"
    }

    return "light"
}


export const ThemeContext = React.createContext<theme>(getCurrentTheme());

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [theme, setTheme] = useState<theme>(getCurrentTheme());

    useEffect(() => {
        const interval = setInterval(() => {

            const currentTheme = getCurrentTheme();

            if (theme !== currentTheme) {
                setTheme(currentTheme)
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
