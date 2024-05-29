import { AlertProps, createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { alertAnatomy } from "@chakra-ui/anatomy";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(alertAnatomy.keys);

const baseStyle = definePartsStyle((props: AlertProps) => {
  const { status } = props;

  const base = {
    container: {
      borderRadius: "lg",
    },
    description: {
      fontWeight: 500,
    },
  };

  const statusBases = {
    success: base,
    info: base,
    warning: {
      container: {
        borderRadius: "lg",
        bg: "highlight.50",
        color: "orange.500",
      },
      icon: {
        bg: "highlight.50",
        color: "highlight.500",
      },
      description: {
        fontWeight: 500,
      },
    },
    error: base,
  };

  const baseStyle = statusBases[status as keyof typeof statusBases];

  return baseStyle;
});

export const alertTheme = defineMultiStyleConfig({ baseStyle });
