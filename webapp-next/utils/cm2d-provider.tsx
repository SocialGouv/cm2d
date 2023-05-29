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
  department: string[];
  start_date?: string;
  end_date?: string;
};

type Cm2dContextType = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  aggregations: any;
  setAggregations: Dispatch<SetStateAction<any>>;
  view: View;
  setView: Dispatch<SetStateAction<View>>;
  saveAggregateX: string | undefined;
  setSaveAggregateX: Dispatch<SetStateAction<string | undefined>>;
  saveAggregateY: string | undefined;
  setSaveAggregateY: Dispatch<SetStateAction<string | undefined>>;
};

export const Cm2dContext = createContext<Cm2dContextType | undefined>(
  undefined
);

type Cm2dProviderProps = {
  children: ReactNode;
};

export type View = 'line' | 'histogram' | 'table' | 'doughnut' | 'map';

export const baseAggregation = {
  aggregated_date: {
    date_histogram: {
      field: 'date',
      calendar_interval: 'week'
    }
  }
};

export function Cm2dProvider({ children }: Cm2dProviderProps) {
  const [filters, setFilters] = useState<Filters>({
    categories_level_1: [],
    death_location: [],
    age: [],
    sex: [],
    department: []
  });

  const [aggregations, setAggregations] = useState<any>(baseAggregation);

  const [view, setView] = useState<View>('line');
  const [saveAggregateX, setSaveAggregateX] = useState<string | undefined>();
  const [saveAggregateY, setSaveAggregateY] = useState<string | undefined>();

  return (
    <Cm2dContext.Provider
      value={{
        filters,
        setFilters,
        aggregations,
        setAggregations,
        view,
        setView,
        saveAggregateX,
        setSaveAggregateX,
        saveAggregateY,
        setSaveAggregateY
      }}
    >
      {children}
    </Cm2dContext.Provider>
  );
}
