import './App.css';
import Header from './components/header';
import Filter from './components/filter';
import SalesByDate from './components/sales-by-date';
import SalesSummary from './components/sales-summary';
import PieChartCard from './components/pie-chart-card';
import SalesTable from './components/sales-table';
import { useEffect, useMemo, useState } from 'react';
import { FilterData, PieChartConfig, SalesByPaymentMothod, SalesByStore } from 'types';
import { buildFilterParams, makeRequest } from 'utils/request';
import { buildSalesByPaymentMethod, buildSalesByStoreChart } from 'helpers';

function App() {
  const [filterData, setFilterData] = useState<FilterData>();
  const [salesByStore, setSalesByStore] = useState<PieChartConfig>();
  const [salesByPaymentMothod, setSalesByPaymentMothod] = useState<PieChartConfig>();

  const params = useMemo(() => buildFilterParams(filterData), [filterData]);

  useEffect(() => {
    //PIZZA DA LOJA
    makeRequest
      .get<SalesByStore[]>('/sales/by-store', { params })
      .then((response) => {
        const newSalesByStore = buildSalesByStoreChart(response.data);
        setSalesByStore(newSalesByStore);
      })
      .catch(() => {
        console.error('Error to fetch sales by store');
      });
  }, [params]);

  useEffect(() => {
    //GRÁFICO DO PAGAMENTO
    makeRequest
      .get<SalesByPaymentMothod[]>('/sales/by-payment-method', { params })
      .then((response) => {
        const newSalesByPaymentMethod = buildSalesByPaymentMethod(response.data);
        setSalesByPaymentMothod(newSalesByPaymentMethod);
      })
      .catch(() => {
        console.error('Error to fetch sales by payment method');
      });
  }, [params]);

  const onFilterChange = (filter: FilterData) => {
    setFilterData(filter);
  };

  return (
    <>
      <Header />
      <div className="app-container">
        <Filter onFilterChange={onFilterChange} />
        <SalesByDate filterData={filterData} />
        <div className="sales-overview-container">
          <SalesSummary filterData={filterData} />
          <PieChartCard name="Lojas" labels={salesByStore?.labels} series={salesByStore?.series} />
          <PieChartCard
            name="Pagamentos"
            labels={salesByPaymentMothod?.labels}
            series={salesByPaymentMothod?.series}
          />
        </div>
        <SalesTable filterData={filterData} />
      </div>
    </>
  );
}

export default App;
