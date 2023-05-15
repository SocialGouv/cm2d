import { Text } from '@chakra-ui/react';

type Props = {
  title: string;
};

export function MenuTitle(props: Props) {
  const { title } = props;
  return (
    <Text pl={4} mb={5} textTransform={'uppercase'} fontWeight={600}>
      {title}
    </Text>
  );
}
