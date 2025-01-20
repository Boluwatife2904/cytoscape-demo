import { useRef, useEffect, useState } from "react";
import elements, { NodeOrEdge } from "../../constants/elements";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { type Core } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";

cytoscape.use(coseBilkent);

import Search from "../Search";
import COLORS from "../../constants/colors";
import Loader from "../Loader";

const HierarchicalGraph = () => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const parentNodes = elements.filter((node) => node?.data?.nodeType === "parent");

  const style = [
    {
      selector: "node",
      style: {
        label: "data(label)",
        backgroundColor: "#343434",
        color: "white",
        width: "label",
        height: "10",
        shape: "rectangle",
        textHalign: "center",
        textValign: "center",
        paddingLeft: "5px",
        paddingRight: "5px",
        fontSize: 9,
      },
    },
    {
      selector: "node.main",
      style: {
        label: "data(label)",
        backgroundColor: "white",
        color: "black",
      },
    },
    {
      selector: "node.hidden",
      style: { display: "none" },
    },
    {
      selector: "edge",
      style: {
        "curve-style": "bezier",
        "target-arrow-shape": "square",
        width: 0.3,
        lineColor: "white",
        "target-arrow-color": () => COLORS[Math.floor(Math.random() * COLORS.length)],
        "arrow-scale": 0.5,
      },
    },
  ];

  const layout = {
    name: "cose-bilkent",
    fit: true,
    animate: false,
    randomize: true,
    padding: 10,
    nodeRepulsion: 15000,
    idealEdgeLength: 300,
    idealEdgeWidth: 300,
    nodeDimensionsIncludeLabels: false,
    edgeElasticity: 1,
    gravity: 0.6,
    repulsion: 400,
    damping: 0.9,
    quality: "proof",
    avoidOverlap: true,
  };

  useEffect(() => {
    const cy = cyRef.current;

    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    if (!cy) return;

    cy.on("tap", "node.main", (event) => {
      const node = event.target;
      cy.animate({
        fit: { eles: node.connectedEdges().connectedNodes(), padding: 20 },
        duration: 1000,
      });
    });
  }, []);

  const handleNodeSelection = (node: NodeOrEdge) => {
    const targetNode = cyRef.current?.getElementById(node?.data?.id ?? "");
    if (targetNode) {
      cyRef.current?.animate({ fit: { eles: targetNode.closedNeighborhood(), padding: 20 }, duration: 1500 });
    }
  };

  return (
    <>
      {isLoading ? <Loader /> : <Search onHandleResult={($event) => handleNodeSelection($event)} nodes={parentNodes} />}
      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100dvh" }}
        stylesheet={style}
        layout={layout}
        userPanningEnabled
        panningEnabled
        zoomingEnabled
        cy={(cy: Core) => {
          cyRef.current = cy;
        }}
      />
    </>
  );
};

export default HierarchicalGraph;
