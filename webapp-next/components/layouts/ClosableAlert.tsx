import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertStatus,
  AlertTitle,
  Box,
  ChakraProps,
  CloseButton,
  useDisclosure
} from '@chakra-ui/react';

type Props = {
  status: AlertStatus;
  title?: string;
  content: JSX.Element;
};

export function ClosableAlert(props: Props & ChakraProps) {
  const { status, title, content, ...rest } = props;
  const { onClose, isOpen } = useDisclosure({ defaultIsOpen: true });

  const CustomAlertIcon = () => {
    switch (status) {
      case 'warning':
        return <InfoOutlineIcon mr={3} fontSize="xl" />;
    }

    return <AlertIcon />;
  };

  return isOpen ? (
    <Alert status={status} {...rest}>
      <CustomAlertIcon />
      <Box w="full">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{content}</AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  ) : (
    <></>
  );
}
