import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode
} from 'react';

export type Filters = {
  categories_level_1: string[];
  death_location: string[];
  age: {
    min: number;
    max?: number;
  }[];
  sex: string[];
};

type FilterContextType = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);

type FilterProviderProps = {
  children: ReactNode;
};

export function FilterProvider({ children }: FilterProviderProps) {
  const [filters, setFilters] = useState<Filters>({
    categories_level_1: [],
    death_location: [],
    age: [],
    sex: []
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
