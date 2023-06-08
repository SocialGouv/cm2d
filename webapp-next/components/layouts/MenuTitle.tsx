import { Button, Flex, Text, Image } from '@chakra-ui/react';

type Props = {
  title: string;
  button?: {
    label: string;
    onClick: () => void;
  };
};

export function MenuTitle(props: Props) {
  const { title, button } = props;
  return (
    <Flex alignItems={'center'} mb={5} pl={4}>
      <Text textTransform={'uppercase'} fontWeight={600}>
        {title}
      </Text>
      {button && (
        <Button
          ml="auto"
          onClick={button.onClick}
          variant="ghost"
          color="primary.500"
          size="xs"
          py={1}
        >
          <Image src="/icons/rotate-left-circle.svg" mr={1} /> {button.label}
        </Button>
      )}
    </Flex>
  );
}
