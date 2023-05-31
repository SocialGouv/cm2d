import { Flex, Text } from '@chakra-ui/react';

type Props = {
  prefix: string;
  kpi: string;
};

export const KPI = (props: Props) => {
  const { prefix, kpi } = props;

  return (
    <Flex
      display="inline-flex"
      alignItems="center"
      bg="primary.75"
      color="primary.500"
      borderRadius="lg"
      px={3}
      py={1}
    >
      <Text size="sm" fontWeight={500}>
        {prefix} :
      </Text>
      <Text as="b" fontSize="2xl" ml={1}>
        {kpi}
      </Text>
    </Flex>
  );
};
