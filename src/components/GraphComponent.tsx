import React, { useRef, useEffect, useState } from "react";
import elements from "../constants/elements";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";

import Search from "./Search";
import COLORS from "../constants/colors";
import Loader from "./Loader";

cytoscape.use(coseBilkent);

const HierarchicalGraph = () => {
  const cyRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const mainNodes = elements.filter((node) => node.data.nodeType === "parent");

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
        // color: "black",
        fontSize: 9,
      },
    },
    {
      selector: "node.main",
      style: {
        label: "data(label)",
        backgroundColor: "white",
        color: "black",
        // width: 200,
        // height: 40,
        // shape: "rectangle",
        // textHalign: "center",
        // textValign: "center",
        // color: "black",
        // fontSize: 12,
        // borderRadius: 0,
      },
    },
    // {
    //   selector: "node(label)",
    //   style: {
    //     color: "blue",
    //     backgroundColor: "black",
    //     height: 'label',
    //     width: 'label',
    //     shape: "rectangle",
    //     borderRadius: 2,
    //     bottom: 40,
    // 		textHalign: "center",
    //     textValign: "center",
    //   },
    // },
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
        // width: 1.3,
        lineColor: "white",
        // lineCap: "round",
        // opacity: 0.5,
        // "target-arrow-shape": "triangle",
        "target-arrow-color": () => COLORS[Math.floor(Math.random() * COLORS.length)],
        "arrow-scale": 0.5,
        // "target-distance-from-node": 100,
      },
    },
    {
      selector: "edge.hidden",
      style: { display: "none" },
    },
    {
      selector: "node.focused",
      style: { backgroundColor: "#FF4500", width: 30, height: 30 },
    },
  ];

  useEffect(() => {
    const cy = cyRef.current;
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    if (!cy) return;

    // Highlight only the selected node and its connected edges/nodes
    cy.on("tap", "node.main", (event) => {
      const node = event.target;
      cy.animate({
        zoom: 5,
        rotate: 30,
        scale: 1.1,
        fit: { eles: node.connectedEdges().connectedNodes(), padding: 20 },
        duration: 1000,
      });
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        cy.elements().removeClass("hidden focused");
      }
    });
  }, []);

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

  const handleResultClick = (node: any) => {
    const targetNode = cyRef.current.getElementById(node.data.id);
    if (targetNode) {
      cyRef.current.animate({
        fit: { eles: targetNode.closedNeighborhood(), padding: 20 },
        duration: 1500,
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Search onHandleResult={($event) => handleResultClick($event)} nodes={mainNodes} />
      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100dvh" }}
        stylesheet={style}
        layout={layout}
        userPanningEnabled
        panningEnabled
        zoomingEnabled
        cy={(cy) => (cyRef.current = cy)}
      />
    </>
  );
};

export default HierarchicalGraph;
