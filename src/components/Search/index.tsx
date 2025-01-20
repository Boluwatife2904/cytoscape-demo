import "./index.css";

import { useState } from "react";

import { NodeOrEdge } from "../../constants/elements";

interface SearchProps {
  nodes: NodeOrEdge[];
  onHandleResult: (node: NodeOrEdge) => void;
}

const Search: React.FC<SearchProps> = ({ nodes, onHandleResult }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NodeOrEdge[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event?.target?.value ?? "";
    setQuery(value);
    if (value) {
      const filteredNodes = nodes.filter((node) => node?.data?.label?.toLowerCase().includes(value.toLowerCase()));
      setResults(filteredNodes);
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (node: NodeOrEdge) => {
    onHandleResult(node);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search">
      <input className="search__input" type="search" value={query} onChange={handleSearch} placeholder="Search" />
      {results && results.length > 0 && (
        <ul className="search__results">
          {results.map((node) => (
            <li key={node.data.id} className="search__result_item" onClick={() => handleResultClick(node)}>
              {node.data.label ?? ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
