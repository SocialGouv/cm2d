import { extendTheme } from '@chakra-ui/react';
import { ComponentStyleConfig } from '@chakra-ui/react';

const colors = {
  primary: {
    50: '#F4F8FF',
    75: '#E9F1FF',
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
  },
  highlight: {
    50: '#FFFAF0',
    100: '#FEEBCB',
    200: '#FFD88A',
    300: '#F8AB4E',
    400: '#FFB637',
    500: '#F8AB4E',
    600: '#E79729',
    700: '#D0800D',
    800: '#B86A00',
    900: '#9A5500'
  },
  neutral: {
    50: '#E0E4E9',
    100: '#CDD3DA',
    200: '#ABB4C2',
    300: '#8A95AA',
    400: '#697694',
    500: '#718096',
    600: '#526380',
    700: '#364A6C',
    800: '#1F344E',
    900: '#031F33'
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

const CM2DTable: ComponentStyleConfig = {
  variants: {
    primary: {
      th: {
        color: 'neutral.500',
        fontWeight: 400,
        textTransform: 'capitalize',
        fontSize: 'sm'
      },
      tr: {
        td: {
          py: 4,
          _first: {
            borderRadius: 'lg'
          },
          _last: {
            borderRadius: 'lg'
          }
        },
        _odd: {
          background: 'primary.50'
        }
      }
    }
  }
};

const CM2DButton: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: 'lg',
    py: 5
  },
  variants: {
    highlight: {
      borderWidth: 1,
      py: 6,
      borderColor: 'highlight.100',
      bg: 'highlight.50',
      fontWeight: 500,
      _hover: {
        bg: 'highlight.100'
      }
    },
    light: {
      bg: 'white',
      borderWidth: 1,
      borderColor: 'primary.50',
      fontWeight: 500
    }
  }
};

const CM2DAlert: ComponentStyleConfig = {
  baseStyle: {
    container: {
      borderRadius: 'lg',
      bg: 'highlight.50',
      color: 'orange.500'
    },
    description: {
      fontWeight: 500
    },
    icon: {
      bg: 'highlight.50',
      color: 'highlight.500'
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
    Input: CM2DInput,
    Button: CM2DButton,
    Table: CM2DTable,
    Alert: CM2DAlert
  }
});

export default theme;
