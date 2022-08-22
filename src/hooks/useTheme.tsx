import React, {useEffect, useState} from "react";


type theme = "light" | "dark"

const useTheme = (): theme => {

    const [theme, setTheme] = useState<theme>('light');

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


    return theme
}

export default useTheme;
