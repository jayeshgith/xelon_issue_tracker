import { RotateCcw, Search } from 'lucide-react';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../constants/options.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';

const IssueFilters = ({ filters, categories, developers, isAdmin, onChange, onApply, onReset }) => (
  <form className="panel grid gap-4 p-4 lg:grid-cols-6" onSubmit={onApply}>
    <div className="lg:col-span-2">
      <Input
        id="search"
        name="search"
        label="Search"
        placeholder="Issue ID, title, description"
        value={filters.search}
        onChange={onChange}
      />
    </div>
    <Select id="status" name="status" label="Status" value={filters.status} onChange={onChange}>
      <option value="">All statuses</option>
      {STATUS_OPTIONS.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </Select>
    <Select id="category" name="category" label="Category" value={filters.category} onChange={onChange}>
      <option value="">All categories</option>
      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </Select>
    <Select id="priority" name="priority" label="Priority" value={filters.priority} onChange={onChange}>
      <option value="">All priorities</option>
      {PRIORITY_OPTIONS.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </Select>
    {isAdmin ? (
      <Select id="developer" name="developer" label="Developer" value={filters.developer} onChange={onChange}>
        <option value="">All developers</option>
        {developers.map((developer) => (
          <option key={developer._id} value={developer._id}>
            {developer.firstName} {developer.lastName}
          </option>
        ))}
      </Select>
    ) : null}
    <div className="flex items-end gap-2 lg:col-span-6">
      <Button type="submit">
        <Search size={16} />
        Search
      </Button>
      <Button type="button" variant="secondary" onClick={onReset}>
        <RotateCcw size={16} />
        Reset
      </Button>
    </div>
  </form>
);

export default IssueFilters;
