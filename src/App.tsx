import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { PaletteOptions } from "@mui/material";
const palette: PaletteOptions = {
  primary: {
    main: "#3b82f6",
  },
  secondary: {
    main: "#3b82f6",
  },
  info: {
    main: "#fff",
  },
  success: {
    main: "#4ade80",
  },
};
function App({ children }) {
  const theme = createTheme({
    palette: palette,
  });
  return (
    <ThemeProvider theme={theme}>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 gap-2">
        {children}
      </div>
    </ThemeProvider>
  );
}

export default App;
