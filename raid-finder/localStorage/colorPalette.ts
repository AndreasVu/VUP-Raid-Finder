import { PaletteMode } from "@mui/material";
import { ColorTheme } from "../constants/localStorageKeys";

export const loadPalette = () => {
const storedValue = localStorage.getItem(ColorTheme);
return storedValue == null ? null : storedValue as PaletteMode
}

export const setPalette = (newColor: PaletteMode) => {
localStorage.setItem(ColorTheme, newColor);
}
