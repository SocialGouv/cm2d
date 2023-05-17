import { useCauses } from '@/utils/api';
import { Filters } from '@/utils/filters-provider';
import { InputGroup, InputLeftElement } from '@chakra-ui/react';
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

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!filters.categories_level_1.length) {
      setInputValue('');
    }
  }, [filters.categories_level_1]);

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
      <AutoComplete
        key={filters.categories_level_1.toString()}
        openOnFocus
        onSelectOption={selectedOption => {
          setFilters({
            ...filters,
            categories_level_1: [selectedOption.item.value]
          });

          setInputValue(selectedOption.item.value);
        }}
        restoreOnBlurIfEmpty={false}
      >
        <AutoCompleteInput
          pl={10}
          textTransform="capitalize"
          bg={!!inputValue ? 'primary.50' : 'white'}
          onChange={e => {
            if (!e.target.value) {
              setFilters({ ...filters, categories_level_1: [] });
            }
            setInputValue(e.target.value);
          }}
          onBlur={() => {
            if (!causes.map(c => c.label).includes(inputValue))
              setInputValue('');
          }}
          value={inputValue}
        />
        <AutoCompleteList>
          {causes.map(cause => (
            <AutoCompleteItem
              key={`option-${cause.id}`}
              value={cause.label}
              textTransform="capitalize"
            >
              {cause.label}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
    </InputGroup>
  );
};
