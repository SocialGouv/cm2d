import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect
} from 'react';

export type SearchCategory = 'full' | 'category_1' | 'category_2';

export type Filters = {
  department_filter: 'department' | 'home_department';
  categories: string[];
  categories_associate: string[];
  categories_search: SearchCategory;
  death_location: string[];
  age: {
    min: number;
    max?: number;
  }[];
  sex: string[];
  department: string[];
  home_department: string[];
  start_date?: string;
  end_date?: string;
};

export type User = {
  username?: string;
  email?: string;
  fullName?: string;
};

type Cm2dContextType = {
  firstDate: Date;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  selectedFiltersPile: string[];
  setSelectedFiltersPile: Dispatch<SetStateAction<string[]>>;
  aggregations: any;
  setAggregations: Dispatch<SetStateAction<any>>;
  view: View;
  setView: Dispatch<SetStateAction<View>>;
  saveAggregateX: string | undefined;
  setSaveAggregateX: Dispatch<SetStateAction<string | undefined>>;
  saveAggregateY: string | undefined;
  setSaveAggregateY: Dispatch<SetStateAction<string | undefined>>;
  CSVData: string[][];
  setCSVData: Dispatch<SetStateAction<string[][]>>;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
};

export const Cm2dContext = createContext<Cm2dContextType | undefined>(
  undefined
);

type Cm2dProviderProps = {
  children: ReactNode;
};

export type View = 'line' | 'histogram' | 'table' | 'doughnut' | 'map';

export const baseFilters: Filters = {
  department_filter: 'department',
  categories: [],
  categories_associate: [],
  categories_search: 'full',
  death_location: [],
  age: [],
  sex: [],
  department: [],
  home_department: []
};
export const baseAggregation = {
  aggregated_date: {
    date_histogram: {
      field: 'date',
      calendar_interval: 'week'
    }
  }
};

export function Cm2dProvider({ children }: Cm2dProviderProps) {
  const [filters, setFilters] = useState<Filters>(baseFilters);
  const [selectedFiltersPile, setSelectedFiltersPile] = useState<string[]>([]);
  const [aggregations, setAggregations] = useState<any>(baseAggregation);

  const [view, setView] = useState<View>('line');
  const [saveAggregateX, setSaveAggregateX] = useState<string | undefined>();
  const [saveAggregateY, setSaveAggregateY] = useState<string | undefined>();
  const [firstDate, setFirstDate] = useState<Date>(new Date());
  const [CSVData, setCSVData] = useState<string[][]>([]);
  const [user, setUser] = useState<User>({} as User);

  const fetchFirstData = () => {
    fetch('/api/elk/first', { method: 'GET' }).then(res =>
      res.json().then(data => {
        const date = data?.result?.hits?.hits[0]._source.date;
        if (date) setFirstDate(new Date(date));
      })
    );
  };

  const fetchUser = () => {
    fetch('/api/auth/user', { method: 'GET' }).then(res =>
      res.json().then(user => {
        if (user) {
          setUser({
            username: user.username,
            fullName: user.full_name,
            email: user.email
          });
        }
      })
    );
  };

  useEffect(() => {
    fetchFirstData();
    fetchUser();
  }, []);

  return (
    <Cm2dContext.Provider
      value={{
        firstDate,
        filters,
        setFilters,
        selectedFiltersPile,
        setSelectedFiltersPile,
        aggregations,
        setAggregations,
        view,
        setView,
        saveAggregateX,
        setSaveAggregateX,
        saveAggregateY,
        setSaveAggregateY,
        CSVData,
        setCSVData,
        user,
        setUser
      }}
    >
      {children}
    </Cm2dContext.Provider>
  );
}
