import { useCauses } from '@/utils/api';
import { Filters } from '@/utils/cm2d-provider';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Causes = {
  id: number;
  label: string;
}[];

type Props = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};
export const FilterCauses = (props: Props) => {
  const { filters, setFilters } = props;
  const { data } = useCauses();

  if (!data) return <>...</>;

  const causes: Causes = data.result.hits.hits.map((d: any) => ({
    id: d._id,
    label: d._source.categories_level_1
  }));

  return (
    <InputGroup zIndex={2}>
      <InputLeftElement
        pointerEvents="none"
        top="50%"
        transform="translateY(-50%)"
      >
        <Image
          src={
            !!filters.categories_level_1.length
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
          bg={!!filters.categories_level_1.length ? 'primary.50' : 'white'}
          _focus={{ borderColor: 'primary.500' }}
          _hover={{ borderColor: 'primary.500' }}
        >
          <Flex alignItems={'center'}>
            {filters.categories_level_1[0] &&
              filters.categories_level_1[0].charAt(0).toUpperCase() +
                filters.categories_level_1[0].substring(1)}
            <ChevronDownIcon
              ml="auto"
              fontSize="2xl"
              color={
                !!filters.categories_level_1.length ? 'primary.500' : 'initial'
              }
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
                  categories_level_1: [cause.label]
                });
              }}
            >
              {cause.label.charAt(0).toUpperCase() + cause.label.substring(1)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </InputGroup>
  );
};
