import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect
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

export type User = {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

type Cm2dContextType = {
  firstDate: Date;
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

export const baseFilters = {
  categories_level_1: [],
  death_location: [],
  age: [],
  sex: [],
  department: []
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
            firstName: user.full_name.split(' ')[0],
            lastName: user.full_name.split(' ')[1],
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
