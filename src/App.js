import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import Chart from 'react-apexcharts';
import styles from './CustomerTable.module.css';

const CustomerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [data] = useState([
    { id: 1, name: 'Ahmed Ali', customer_id: 1, date: '2022-01-01', amount: 1000 },
    { id: 2, name: '', customer_id: 1, date: '2022-01-02', amount: 2000 },
    { id: 3, name: 'Aya Elsayed', customer_id: 2, date: '2022-01-01', amount: 550 },
    { id: 4, name: '', customer_id: 2, date: '2022-01-02', amount: 1300 },
    { id: 5, name: 'mina Adel', customer_id: 3, date: '2022-01-02', amount: 1250 },
    { id: 6, name: 'sarah Reda', customer_id: 4, date: '2022-01-01', amount: 750 },
    { id: 7, name: 'mohamed Elsayed', customer_id: 5, date: '2022-01-02', amount: 875 },
  ]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    const customerAmounts = data.reduce((acc, curr) => {
      if (curr.name) {
        if (!acc[curr.name]) {
          acc[curr.name] = 0;
        }
        acc[curr.name] += curr.amount;
      }
      return acc;
    }, {});

    const names = Object.keys(customerAmounts);
    const amounts = Object.values(customerAmounts);

    setChartOptions({
      chart: {
        id: 'customer-amount-chart'
      },
      xaxis: {
        categories: names
      }
    });

    setChartSeries([{
      name: 'Amount',
      data: amounts
    }]);
  }, [data]);

  const handleSearch = () => {
    if (searchTerm) {
      const idMatch = data.filter(item => item.id.toString() === searchTerm);
      if (idMatch.length > 0) {
        setFilteredData(idMatch);
        setNoDataFound(false);
      } else {
        const nameMatch = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (nameMatch.length > 0) {
          setFilteredData(nameMatch);
          setNoDataFound(false);
        } else {
          setFilteredData([]);
          setNoDataFound(true);
        }
      }
    } else {
      setFilteredData(data);
      setNoDataFound(false);
    }
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Customer ID', selector: row => row.customer_id, sortable: true },
    { name: 'Date', selector: row => row.date, sortable: true },
    { name: 'Amount', selector: row => row.amount, sortable: true },
  ];

  return (
    <div className={`p-4 ${styles.body}`}>
      <h2 className="fw-bold">Add Customer</h2>
      <div className="d-flex flex-column mb-3">
        <label htmlFor="customerSearch">Enter Part of customer name or id:</label>
        <input
          type="text"
          id="customerSearch"
          className="form-control w-50"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="d-flex gap-1 mb-4">
        <button className="btn btn-outline-dark" onClick={handleSearch}>Search</button>
        <button className="btn btn-outline-dark" onClick={() => { setSearchTerm(''); setFilteredData(data); setNoDataFound(false); }}>Clear</button>
      </div>
      <div className={`table-responsive table-striped ${styles.tableResponsive}`}>
        {noDataFound ? (
          <div className="alert alert-warning" role="alert">
            No data found
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData.length ? filteredData : data}
            pagination
            highlightOnHover
            className={`${styles.table} table-hover`}
          />
        )}
      </div>
      <div className={`mt-4 ${styles.chartContainer}`}>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height="350"
        />
      </div>
    </div>
  );
};
export default CustomerTable;