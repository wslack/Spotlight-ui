import React from 'react';
import QueryFilterSelect from './query-filter-select';
import { API_BASE_URL } from '../constants';
import { addOptionAll } from '../utils';
import useFetch from '../hooks/useFetch';

const Search200Filters = ({ filters }) => {
  const filterComponents = [];

  if (filters.includes('domain'))
    filterComponents.push(
      <label htmlFor="domainSearch">
        Domain Search
        <input
          type="text"
          name="domainSearch"
          id="domainSearch"
          data-key="domain"
        />
      </label>
    );

  if (filters.includes('organization'))
    filterComponents.push(<OrganizationFilter />);

  if (filters.includes('page-type')) filterComponents.push(<ScanPageFilter />);

  return <>{filterComponents.map(c => c)}</>;
};

const OrganizationFilter = () => {
  const organizations = useFetch(
    `${API_BASE_URL}lists/pagedata/values/organization`,
    {}
  );

  if (!organizations.response) return <p>Loading…</p>;

  const organizationOptions = addOptionAll(organizations.response).map(org => {
    const value = org === `All` ? `*` : org.replace(/ /g, '+');

    return (
      <option key={org} value={`"${value}"`}>
        {org}
      </option>
    );
  });

  return (
    <QueryFilterSelect
      label="Organization Name"
      name="organization"
      paramName="organization"
      optionsList={organizationOptions}
    />
  );
};

const ScanPageFilter = () => {
  const scanPages = useFetch(`${API_BASE_URL}lists/pagedata/values/data/`);
  if (!scanPages.response) return <p>Loading…</p>;

  const scanPageOptions = scanPages.response.map(page => {
    return (
      <option key={page} value={page}>
        {page}
      </option>
    );
  });

  return (
    <QueryFilterSelect
      label="Page Type"
      name="scanPageType"
      paramName="scanPageType"
      optionsList={scanPageOptions}
    />
  );
};
export default Search200Filters;