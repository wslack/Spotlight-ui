import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { DispatchQueryContext } from './report-query-provider';

const ReportFilters = ({ reportType }) => {
  const dictionary = { security: 'pshtt', design: 'uswds2' };
  const [loading, setLoading] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [scanDates, setScanDates] = useState([]);

  reportType = dictionary[reportType] || reportType;

  const dispatchQuery = useContext(DispatchQueryContext);

  const fetchList = (reportType, list) => {
    return axios.get(`${API_BASE_URL}lists/${reportType}/${list}`);
  };

  const handleFilterChange = (filter) => {
    const filterName = Object.keys(filter)[0];
    if (filter[filterName] == '') {
      dispatchQuery({
        type: `REMOVE_FILTERS`,
        filtersToRemove: [filterName],
      });
    } else {
      dispatchQuery({
        type: `APPLY_FILTER`,
        newFilter: { filters: filter },
      });
    }
  };

  useEffect(() => {
    axios
      .all([
        fetchList(reportType, 'agencies'),
        axios.get(`${API_BASE_URL}lists/dates/`),
      ])
      .then(
        axios.spread((...[agencies, dates]) => {
          setAgencies(agencies.data);
          setLoading(false);
        })
      );
  }, []);

  return loading ? (
    <div>Loading…</div>
  ) : (
    <FilterForm
      reportType={reportType}
      agencies={agencies}
      handleFilterChange={handleFilterChange}
    />
  );
};

export default ReportFilters;

const FilterForm = ({ reportType, agencies, handleFilterChange }) => {
  let reportSpecificFilters;

  if (reportType == 'uswds2') {
    reportSpecificFilters = (
      <UswdsFilters handleFilterChange={handleFilterChange} />
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault}>
      <DomainFilter handleFilterChange={handleFilterChange} />
      <AgenciesFilter
        agenciesList={agencies}
        handleFilterChange={handleFilterChange}
      />
      {reportSpecificFilters}
    </form>
  );
};

const AgenciesFilter = ({ agenciesList, handleFilterChange }) => {
  return (
    <>
      <label htmlFor="agency">Agency</label>
      <select
        name="agency"
        id="agency"
        onChange={(e) =>
          handleFilterChange({ [e.target.name]: e.target.value })
        }
      >
        {agenciesList.length == 0
          ? null
          : agenciesList.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
      </select>
    </>
  );
};

const DomainFilter = ({ handleFilterChange }) => {
  return (
    <>
      <label htmlFor="domain">Domain</label>
      <input
        type="text"
        id="domain"
        name="domain"
        onChange={(e) =>
          handleFilterChange({ [e.target.name]: `${e.target.value}*` })
        }
      />
    </>
  );
};

const UswdsFilters = ({ handleFilterChange }) => {
  return (
    <>
      <UswdsVersionFilter handleFilterChange={handleFilterChange} />
    </>
  );
};

const UswdsVersionFilter = ({ handleFilterChange }) => {
  const versions = [
    '',
    0,
    'v2.3.1',
    'v2.0.3',
    'v1.1.0',
    'v1.4.1',
    'v1.6.3',
    'v2.2.1',
    'v0.14.0',
  ];

  return (
    <>
      <label htmlFor="uswds-version">USWDS Version</label>
      <select
        id="uswds-version"
        name="uswds-version"
        onChange={(e) =>
          handleFilterChange({ 'data.uswdsversion': e.target.value })
        }
      >
        {versions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </>
  );
};
