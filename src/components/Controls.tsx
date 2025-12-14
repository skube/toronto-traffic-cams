

interface ControlsProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  sortValue: string;
  onSortChange: (val: string) => void;
}

export function Controls({ searchTerm, onSearchChange, sortValue, onSortChange }: ControlsProps) {
  return (
    <div className="controls-container">
      <div role="search" style={{ width: "100%", maxWidth: "300px" }}>
        <input
          type="text"
          placeholder="Search road name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search cameras"
        />
      </div>
      <select
        className="sort-select"
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort cameras"
      >
        <option value="name">Sort by Name</option>
        <option value="north-south">North to South</option>
        <option value="south-north">South to North</option>
        <option value="west-east">West to East</option>
        <option value="east-west">East to West</option>
      </select>
    </div>
  );
}
