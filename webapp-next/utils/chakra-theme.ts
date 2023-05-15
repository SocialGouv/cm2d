import { extendTheme } from '@chakra-ui/react';
import { ComponentStyleConfig } from '@chakra-ui/react';

const colors = {
  primary: {
    50: '#e3ebfd',
    100: '#b9ccfc',
    200: '#8eaafc',
    300: '#639bf9',
    400: '#3a7cfa',
    500: '#246CF9',
    600: '#1e5fd5',
    700: '#194fb2',
    800: '#133f8f',
    900: '#0d3170'
  },
  secondary: {
    50: '#f5f8fe',
    100: '#eaf0fd',
    200: '#dbe7fc',
    300: '#cce0fb',
    400: '#bad8fa',
    500: '#E9F1FF',
    600: '#c1d7f8',
    700: '#9abdec',
    800: '#73a9e1',
    900: '#4c82d5'
  }
};

const CM2DInput: ComponentStyleConfig = {
  baseStyle: {
    field: {
      py: 6
    }
  },
  variants: {
    outline: {
      field: {
        borderColor: 'secondary.500'
      }
    }
  }
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`
  },
  components: {
    Input: CM2DInput
  }
});

export default theme;
