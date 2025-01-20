import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";

const generateTestData = () => {
  const elements = [];
  for (let i = 0; i < 1000; i++) {
    elements.push({ data: { id: `node${i}`, label: `Node ${i}` } });
    if (i > 0) {
      elements.push({ data: { source: `node${i - 1}`, target: `node${i}` } });
    }
  }
  return elements;
};

const Test: React.FC = () => {
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.layout({ name: "grid" }).run();
    }
  }, []);

  const layout = {
    name: "circle",
    animate: true,
    animationDuration: 1000,
  };

  return (
    <CytoscapeComponent
      elements={generateTestData()}
      style={{ width: "100vw", height: "100vh" }}
      cy={(cy) => {
        cyRef.current = cy;
      }}
	  layout={layout}
    />
  );
};

export default Test;
