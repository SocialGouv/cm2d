import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode
} from 'react';

export type Filters = {
  causes: string[];
  ages: {
    min: number;
    max?: number;
  }[];
  sexes: string[];
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
    causes: [],
    ages: [],
    sexes: []
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
