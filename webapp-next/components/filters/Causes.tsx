import { useCauses } from '@/utils/api';
import { Cm2dContext } from '@/utils/cm2d-provider';
import { capitalizeString } from '@/utils/tools';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch
} from '@chakra-ui/react';
import Image from 'next/image';
import { useContext } from 'react';

type Causes = {
  id: number;
  label: string;
}[];

type Props = {};

export const FilterCauses = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters } = context;
  const { data } = useCauses();

  if (!data) return <>...</>;

  const causes: Causes = data.result.hits.hits.map((d: any) => ({
    id: d._id,
    label: d._source.categories_level_1
  }));

  return (
    <Flex flexDir="column">
      <InputGroup zIndex={2}>
        <InputLeftElement
          pointerEvents="none"
          top="50%"
          transform="translateY(-50%)"
        >
          <Image
            src={
              !!filters.categories.length
                ? 'icons/search-text-blue.svg'
                : 'icons/search-text.svg'
            }
            alt="Icone de recherche"
            width={24}
            height={24}
          />
        </InputLeftElement>
        <Menu>
          <MenuButton
            px={4}
            pl={10}
            py={3}
            w="full"
            textAlign="left"
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px"
            bg={!!filters.categories.length ? 'primary.50' : 'white'}
            _focus={{ borderColor: 'primary.500' }}
            _hover={{ borderColor: 'primary.500' }}
          >
            <Flex alignItems={'center'}>
              {filters.categories[0] && capitalizeString(filters.categories[0])}
              <ChevronDownIcon
                ml="auto"
                fontSize="2xl"
                color={!!filters.categories.length ? 'primary.500' : 'initial'}
              />
            </Flex>
          </MenuButton>
          <MenuList>
            {causes.map(cause => (
              <MenuItem
                key={`option-${cause.id}`}
                onClick={e => {
                  setFilters({
                    ...filters,
                    categories: [cause.label]
                  });
                }}
              >
                {capitalizeString(cause.label)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </InputGroup>
      {!!filters.categories.length && (
        <FormControl
          display="flex"
          alignItems="center"
          // justifyContent={'center'}
          pl={4}
          mt={4}
        >
          <Switch
            id="switch-category-1"
            size="sm"
            onChange={e => {
              setFilters({
                ...filters,
                categories_search: e.target.checked ? 'category_1' : 'full',
                categories_associate: e.target.checked
                  ? []
                  : filters.categories_associate
              });
            }}
          />
          <FormLabel
            htmlFor="switch-category-1"
            mb="0"
            cursor="pointer"
            ml={2}
            fontSize={'sm'}
            maxW="65%"
          >
            Rechercher uniquement dans le processus morbide
          </FormLabel>
        </FormControl>
      )}
    </Flex>
  );
};
