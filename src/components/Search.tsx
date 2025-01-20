import React, { useState } from "react";
import Cytoscape from "cytoscape";

interface Node {
  data: { id: string; label: string };
}

interface SearchProps {
  cy: Cytoscape.Core;
  nodes: Node[];
  onHandleResult: (node: Node) => void;
}

const Search: React.FC<SearchProps> = ({ cy, nodes, onHandleResult }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Node[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (value) {
      console.log("query", nodes);
      const filteredNodes = nodes.filter((node) => node.data.label.toLowerCase().includes(value.toLowerCase()));
      setResults(filteredNodes);
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (node: Node) => {
    onHandleResult(node);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search">
      <input type="text" value={query} onChange={handleSearch} placeholder="Search" />
      {results.length > 0 && (
        <ul>
          {results.map((node) => (
            <li key={node.data.id} onClick={() => handleResultClick(node)}>
              {node.data.label ?? ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
