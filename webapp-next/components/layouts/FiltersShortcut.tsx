import { FilterContext, Filters } from '@/utils/filters-provider';
import { ISODateToMonthYear, getLabelFromElkField } from '@/utils/tools';
import { CloseIcon } from '@chakra-ui/icons';
import { Box, Tag, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export function FiltersShortcut() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('Header must be used within a FilterProvider');
  }

  const { filters, setFilters } = context;

  const CustomTag = ({
    field_name,
    value,
    onDelete
  }: {
    field_name: keyof Filters;
    value: string;
    onDelete: () => void;
  }) => {
    return (
      <Tag
        color="primary.500"
        bg="primary.50"
        py={2}
        fontSize="md"
        mr={2}
        mb={2}
      >
        <Text>
          {`${getLabelFromElkField(field_name)} : `}
          <Text
            display="inline-block"
            css={{
              '&::first-letter': {
                textTransform: 'uppercase'
              }
            }}
          >
            {value}
          </Text>
        </Text>
        <CloseIcon
          bg="primary.100"
          cursor="pointer"
          borderRadius="50%"
          fontSize="lg"
          ml={2}
          p={1}
          onClick={onDelete}
        />
      </Tag>
    );
  };

  return (
    <Box py={4}>
      {(Object.keys(filters) as Array<keyof Filters>).map(key => {
        if (!filters[key]) return <></>;

        switch (key) {
          case 'age':
            return filters[key].map(value => (
              <CustomTag
                key={`${key}-${value}`}
                field_name={key}
                value={`entre ${value.min} et ${value.max} ans`}
                onDelete={() => {
                  setFilters({
                    ...filters,
                    age: [...filters.age.filter(a => a.min !== value.min)]
                  });
                }}
              />
            ));
          case 'categories_level_1':
          case 'death_location':
          case 'sex':
            return filters[key].map(value => (
              <CustomTag
                key={`${key}-${value}`}
                field_name={key}
                value={value}
                onDelete={() => {
                  setFilters({
                    ...filters,
                    [key]: filters[key].filter(v => v !== value)
                  });
                }}
              />
            ));
          case 'start_date':
            let value = `à partir de ${ISODateToMonthYear(
              filters[key] as string
            )}`;
            if (filters['end_date'])
              value = `de ${ISODateToMonthYear(
                filters[key] as string
              )} à ${ISODateToMonthYear(filters['end_date'])}`;
            return (
              <CustomTag
                field_name={key}
                value={value}
                onDelete={() => {
                  setFilters({
                    ...filters,
                    start_date: undefined,
                    end_date: undefined
                  });
                }}
              />
            );
        }
      })}
    </Box>
  );
}
