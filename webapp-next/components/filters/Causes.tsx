import { useCauses } from '@/utils/api';
import { Cm2dContext, SearchCategory } from '@/utils/cm2d-provider';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Stack
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
              {filters.categories[0] &&
                filters.categories[0].charAt(0).toUpperCase() +
                  filters.categories[0].substring(1)}
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
                {cause.label.charAt(0).toUpperCase() + cause.label.substring(1)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </InputGroup>
      {!!filters.categories.length && (
        <RadioGroup
          defaultValue={filters.categories_search}
          mt={6}
          px={3}
          onChange={(v: SearchCategory) => {
            setFilters({ ...filters, categories_search: v });
          }}
        >
          <Stack spacing={5} direction="column">
            <Radio colorScheme="primary" value="full">
              Toutes mentions de
            </Radio>
            <Radio colorScheme="primary" value="category_1">
              Cause ayant directement contribué au décès
            </Radio>
            <Radio colorScheme="primary" value="category_2">
              Autre cause associée
              <br /> ou comorbidité
            </Radio>
          </Stack>
        </RadioGroup>
      )}
    </Flex>
  );
};
