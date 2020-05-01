import React, { useState, useEffect } from 'react';

const Pagination = ({ recordCount, handleFilterQuery }) => {
  const [recordsPerPage, setRecordsPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [positionInList, setPositionInList] = useState('beginning');
  const numPages = Math.ceil(recordCount / recordsPerPage);

  const MAX_VISIBLE = 5;
  const IS_BEGINNING =
    (currentPage <= MAX_VISIBLE && numPages > MAX_VISIBLE) || numPages == 0;
  const IS_MIDDLE =
    currentPage > MAX_VISIBLE && currentPage <= numPages - MAX_VISIBLE;

  const checkPositionInList = () => {
    if (IS_BEGINNING) {
      setPositionInList('beginning');
    } else if (IS_MIDDLE) {
      setPositionInList('middle');
    } else {
      setPositionInList('end');
    }
  };

  const handlePageNav = pageNum => {
    setCurrentPage(pageNum);
    handleFilterQuery({ page: pageNum });
    checkPositionInList();
  };

  let pageLinks = [];

  if (IS_BEGINNING) {
    for (let i = 1; i <= MAX_VISIBLE; i++) {
      pageLinks.push(
        <PaginationLink
          isCurrent={i === currentPage}
          pageNum={i}
          handlePageNav={handlePageNav}
          currentPage={currentPage}
        />
      );
    }
  } else if (IS_MIDDLE) {
    for (let i = currentPage; i < currentPage + MAX_VISIBLE; i++) {
      pageLinks.push(
        <PaginationLink
          isCurrent={i === currentPage}
          pageNum={i}
          handlePageNav={handlePageNav}
          currentPage={currentPage}
        />
      );
    }
  } else {
    let index = numPages - MAX_VISIBLE;
    index = index > 0 ? index : 1;
    for (let i = index; i <= numPages; i++) {
      pageLinks.push(
        <PaginationLink
          isCurrent={i === currentPage}
          pageNum={i}
          handlePageNav={handlePageNav}
          currentPage={currentPage}
        />
      );
    }
  }

  useEffect(() => {
    checkPositionInList();
  }, [currentPage]);

  return numPages <= 1 ? (
    ''
  ) : (
    <>
      {/* <RecordsPerPageSelect
        recordsPerPage={recordsPerPage}
        handlePageNav={handlePageNav}
        setRecordsPerPage={setRecordsPerPage}
        handleFilterQuery={handleFilterQuery}
      /> */}
      <nav className={`pagination ${positionInList}`}>
        <ol>
          <li>
            {currentPage === 1 ? (
              <span className="disabled">Prev</span>
            ) : (
              <a
                href="#0"
                onClick={e => {
                  e.preventDefault();
                  handlePageNav(currentPage - 1);
                }}
              >
                Prev
              </a>
            )}
          </li>
          <li className="firstPage">
            <PaginationLink
              pageNum={1}
              handlePageNav={handlePageNav}
              currentPage={currentPage}
            />
          </li>
          {pageLinks.map((link, i) => (
            <li key={i}>{link}</li>
          ))}
          <li className="lastPage">
            <PaginationLink
              pageNum={numPages}
              handlePageNav={handlePageNav}
              currentPage={currentPage}
            />
          </li>
          <li>
            {currentPage === numPages ? (
              <span className="disabled">Next</span>
            ) : (
              <a
                href="#0"
                onClick={e => {
                  e.preventDefault();
                  handlePageNav(currentPage + 1);
                }}
              >
                Next
              </a>
            )}
          </li>
        </ol>
      </nav>
    </>
  );
};

const RecordsPerPageSelect = ({
  recordsPerPage,
  handleFilterQuery,
  setRecordsPerPage,
}) => {
  const recordsPerPageOptions = [20, 50, 100];
  const handleChangeRecordsPerPage = numRecords => {
    setRecordsPerPage(numRecords);
    handleFilterQuery({ page_size: numRecords });
  };

  return (
    <>
      Showing
      <select
        id="recordsPerPage"
        name="recordsPerPage"
        value={recordsPerPage}
        onChange={e => handleChangeRecordsPerPage(e.target.value)}
      >
        {recordsPerPageOptions.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <label htmlFor="recordsPerPage">records per page.</label>
    </>
  );
};

const PaginationLink = ({ isCurrent, pageNum, handlePageNav, className }) => {
  return isCurrent ? (
    <span className={className} aria-current={isCurrent}>
      {pageNum}
    </span>
  ) : (
    <a
      key={pageNum}
      href="#0"
      onClick={e => {
        e.preventDefault();
        handlePageNav(pageNum);
      }}
      aria-current={isCurrent}
      aria-label={`Page ${pageNum}`}
      className={className}
    >
      {pageNum}
    </a>
  );
};

export default Pagination;
