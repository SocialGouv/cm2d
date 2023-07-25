import { extendTheme } from '@chakra-ui/react';
import { ComponentStyleConfig } from '@chakra-ui/react';
import { MultiSelectTheme } from 'chakra-multiselect';

const colors = {
  primaryOverlay: 'rgb(36, 108, 249, 0.8)',
  primary: {
    '50': '#F2F4FA',
    '75': '#F2F4FA',
    '100': '#CCD3EA',
    '200': '#454C75',
    '300': '#8091CA',
    '400': '#0A1547',
    '500': '#002395',
    '600': '#001F7C',
    '700': '#001B64',
    '800': '#00184C',
    '900': '#001534'
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
        textTransform: 'normal',
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
    heading: 'Marianne, Georgia, serif',
    body: 'Marianne, system-ui, sans-serif'
  },
  sizes: {
    88: '22rem'
  },
  components: {
    Input: CM2DInput,
    Button: CM2DButton,
    Table: CM2DTable,
    Alert: CM2DAlert,
    MultiSelect: MultiSelectTheme
  }
});

export default theme;
