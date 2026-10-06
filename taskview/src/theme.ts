import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { main: '#1f4e79' },
    secondary: { main: '#e07a1f' },
    background: { default: '#f4f6f8' }
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none' } }
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none' } }
    }
  }
});
