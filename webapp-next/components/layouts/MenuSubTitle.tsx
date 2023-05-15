import { Text } from '@chakra-ui/react';

type Props = {
  title: string;
};

export function MenuSubTitle(props: Props) {
  const { title } = props;
  return (
    <Text fontWeight={600} mb={2}>
      {title}
    </Text>
  );
}
