import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import axios from 'axios';
import { v1 as uuidv1 } from 'uuid';

const Report = ({ reportType, columns, endpoint }) => {
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async (page) => {
    const result = await axios(`${API_BASE_URL}${endpoint}/?page=${page}`);
    setReportData(result.data.results);
  };

  useEffect(() => {
    setLoading(true);
    fetchReportData(page);
  }, [page]);

  useEffect(() => {
    setLoading(false);
  }, [reportData]);

  return (
    <>
      <h1>{reportType}</h1>

      <ReportTable>
        <ReportTableHead columns={columns} />
        <ReportTableBody
          columns={columns}
          records={reportData}
          isLoading={loading}
        />
      </ReportTable>
    </>
  );
};

Report.propTypes = {
  reportType: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object),
  endpoint: PropTypes.string,
};

export default Report;

const ReportTable = ({ children }) => (
  <table className="usa-table">{children}</table>
);

ReportTable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

const ReportTableHead = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map((c) => (
          <th key={uuidv1()} scope="col">
            {c.title}
          </th>
        ))}
      </tr>
    </thead>
  );
};

ReportTableHead.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
};

const ReportTableBody = ({ columns, records, isLoading }) => {
  return isLoading ? (
    <tbody></tbody>
  ) : (
    <tbody>
      {records.map((r) => (
        <ReportTableRow key={uuidv1()} columns={columns} record={r} />
      ))}
    </tbody>
  );
};

ReportTableBody.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  records: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
};

const ReportTableRow = ({ columns, record }) => {
  return (
    <tr>
      {columns.map((c, i) => (
        <ReportTableCell
          key={uuidv1()}
          value={c.accessor(record)}
          isFirst={i == 0}
        />
      ))}
    </tr>
  );
};

ReportTableRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  record: PropTypes.object,
};

const ReportTableCell = ({ value, isFirst }) => {
  const parseValue = (value) => {
    if (typeof value == 'boolean') return String(value);
    if (typeof value == 'object') return <ObjectList object={value} />;
    return value;
  };

  value = parseValue(value);
  const boolClass = (value) =>
    value == 'true' || value == 'false' ? value : null;

  return isFirst ? (
    <th scope="row">{value}</th>
  ) : (
    <td className={boolClass(value)}>{value}</td>
  );
};

ReportTableCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool,
    PropTypes.object,
  ]),
  isFirst: PropTypes.bool,
};

const ObjectList = ({ object }) => {
  return (
    <ul>
      {Object.keys(object).map((k, i) => (
        <li key={uuidv1()}>
          <strong>{k}:</strong> {object[k]}
        </li>
      ))}
    </ul>
  );
};

ObjectList.propTypes = {
  record: PropTypes.object,
};