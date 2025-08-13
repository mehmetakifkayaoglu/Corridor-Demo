import Corridor from "./components/Corridor";
import { theme } from "./theme";
import { ThemeProvider } from '@emotion/react'
import { GlobalStyles } from './global-styles'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Corridor />
    </ThemeProvider>
  )
}

export default App
