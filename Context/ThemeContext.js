import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { Appearance } from "react-native";

export const Themecontext = createContext()

export const ThemeProvider = ({ children }) => {
    const [Theme, SetTheme] = useState(Appearance.getColorScheme())
    const [Pref, Setpref] = useState(Appearance.getColorScheme())

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            Setpref(colorScheme);
        });

        return () => subscription.remove();
    }, []);
    const SetdarkTheme = () => {
        SetTheme("dark")
    }
    const SetLightTheme = () => {
        SetTheme("light")
    }
    const colorShades = {
        blackShades: {
            dark: "black",
            jet: "#343434",
            charcoal: "#36454F",
            eerieBlack: "#1B1B1B",
            dimGray: "#696969",
        },
        whiteShades: {
            white: "#FFFFFF",
            snow: "#FFFAFA",
            ghostWhite: "#F8F8FF",
            ivory: "#FFFFF0",
            floralWhite: "#FFFAF0",
        },
    };

    const getOppositeColor = (colorShades, darkKey = "eerieBlack", lightKey = "ghostWhite") => {
        if (Theme === "dark") {
            console.log(colorShades.whiteShades[lightKey])
            return colorShades.whiteShades[lightKey];
        } else if (Theme === "light") {
            return colorShades.blackShades[darkKey];
        }
    };

    const getSameColor = (colorShades, darkKey, lightKey) => {
        if (Theme === "dark") {
            return { color: colorShades.blackShades[darkKey] };
        } else if (Theme === "light") {
            return { color: colorShades.whiteShades[lightKey] };
        }
    };

    return (
        <Themecontext.Provider value={{ Theme, SetTheme, SetLightTheme, SetdarkTheme, Pref, getSameColor, getOppositeColor, colorShades }}>
            {children}
        </Themecontext.Provider>
    )

}


export const UseTheme = () => (
    useContext(Themecontext)
)