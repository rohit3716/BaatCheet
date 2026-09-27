import { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

const ThemeToggle = () => {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Check if theme is saved in localStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
            // Initially set theme based on system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initialTheme = prefersDark ? "dark" : "light";
            setTheme(initialTheme);
            document.documentElement.setAttribute("data-theme", initialTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="text-base-content cursor-pointer hover:text-blue-500 transition-colors"
            title="Toggle Theme"
        >
            {theme === "dark" ? (
                <BsSun className="w-6 h-6 text-base-content hover:text-blue-500" />
            ) : (
                <BsMoon className="w-6 h-6 text-base-content hover:text-blue-500" />
            )}
        </button>
    );
};

export default ThemeToggle;
