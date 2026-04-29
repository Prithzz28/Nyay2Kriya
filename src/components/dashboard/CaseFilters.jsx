export const CaseFilters = ({ filters, setFilters }) => {
  return (
    <section className="card compact-card">
      <div className="section-label">Filter approved cases</div>
      <div className="form-grid four-col">
        <label>
          Search
          <span className="field-hint">Case number, court, or party</span>
          <input
            value={filters.search}
            placeholder="Case number, court, party"
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          />
        </label>
        <label>
          Urgency
          <span className="field-hint">Only show selected urgency level</span>
          <select
            value={filters.urgency}
            onChange={(event) => setFilters({ ...filters, urgency: event.target.value })}
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label>
          From Date
          <span className="field-hint">Judgment date from</span>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => setFilters({ ...filters, fromDate: event.target.value })}
          />
        </label>
        <label>
          To Date
          <span className="field-hint">Judgment date to</span>
          <input
            type="date"
            value={filters.toDate}
            onChange={(event) => setFilters({ ...filters, toDate: event.target.value })}
          />
        </label>
      </div>
    </section>
  );
};
