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
import { Dispatch, SetStateAction } from 'react';

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
    <InputGroup zIndex={1}>
      <InputLeftElement
        pointerEvents="none"
        top="50%"
        transform="translateY(-50%)"
      >
        <Image
          src="icons/search-text.svg"
          color="gray.300"
          alt="Icone de recherche"
          width={24}
          height={24}
        />
      </InputLeftElement>
      <AutoComplete
        openOnFocus
        onChange={(val: string) => {
          setFilters({ ...filters, causes: [val] });
        }}
      >
        <AutoCompleteInput pl={10} textTransform="capitalize" />
        <AutoCompleteList>
          {causes.map(cause => (
            <AutoCompleteItem
              key={`option-${cause.id}`}
              value={cause.label}
              getValue={() => cause.label}
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
