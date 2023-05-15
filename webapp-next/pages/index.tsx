import { useData } from '@/utils/api';
import { FilterContext } from '@/utils/filters-provider';
import { useContext } from 'react';

export default function Home() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('Menu must be used within a FilterProvider');
  }

  const { filters } = context;

  const { data } = useData(filters);
  if (!data) return <>...</>;

  return (
    <>
      <pre>
        {JSON.stringify(data.result.hits.total.value, null, 2)} objets trouvés
      </pre>
    </>
  );
}
