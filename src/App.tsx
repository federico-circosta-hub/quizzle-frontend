import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

function App({ children }) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#5001FF",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-500 gap-2">
        {children}
      </div>
    </ThemeProvider>
  );
}

export default App;
