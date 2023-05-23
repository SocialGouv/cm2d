import { StarIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';

type Props = {};

export const ActionBookmarks = (props: Props) => {
  return (
    <Button
      type="button"
      colorScheme="highlight"
      variant="highlight"
      leftIcon={
        <StarIcon
          bg="highlight.200"
          color="highlight.500"
          p={1}
          borderRadius="md"
          w={5}
          h={5}
          mr={2}
        />
      }
    >
      {' '}
      Ajouter la recherche aux favoris
    </Button>
  );
};
