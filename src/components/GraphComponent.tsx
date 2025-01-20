import React, { useRef, useEffect } from "react";
import elements from "../constants/elements";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { type Cytoscape } from "cytoscape";
import cola from "cytoscape-cola";
import fcose from "cytoscape-fcose";
import coseBilkent from "cytoscape-cose-bilkent";
import cise from "cytoscape-cise";
import euler from "cytoscape-euler";
import Search from "./Search";
import COLORS from "../constants/colors";
// import cyarbor from "cytoscape-arbor";
// import arbor from "arbor";

// const cytoscape = require("cytoscape");
// const cyarbor = require("cytoscape-arbor");
// const arbor = require("arbor");

// cyarbor(cytoscape, arbor);

cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(coseBilkent);
cytoscape.use(cise);
cytoscape.use(euler);
// cytoscape.use(springy);
// springy(cytoscape);
// cytoscape.use(arbor);
// cyarbor(cytoscape, arbor);

const HierarchicalGraph = () => {
  const cyRef = useRef(null);

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
    if (!cy) return;

    // Highlight only the selected node and its connected edges/nodes
    cy.on("tap", "node.main", (event) => {
      const node = event.target;
      console.log("node >>>>>>", node);

      // Reset all nodes and edges
      // cy.elements().removeClass("hidden focused");

      // Highlight the clicked node and its neighbors
      // node.addClass("focused");
      // node.connectedEdges().forEach((edge) => edge.removeClass("hidden"));
      // node
      //   .connectedEdges()
      //   .connectedNodes()
      //   .forEach((n) => n.removeClass("hidden"));

      // Hide all unrelated nodes and edges
      // cy.elements().difference(node.connectedEdges().connectedNodes()).difference(node).addClass("hidden");

      cy.animate({
        // pan: { x: 100, y: 100 },
        zoom: 5,
        rotate: 30,
        scale: 1.1,
        fit: {
          eles: node.connectedEdges().connectedNodes(),
          padding: 20,
        },
        duration: 1000,
      });
    });

    // Reset view when clicking on the background
    cy.on("tap", (event) => {
      if (event.target === cy) {
        cy.elements().removeClass("hidden focused");
      }
    });

    // cy.userPanningEnabled(true);
    // setTimeout(() => {
    //   cy.animate({
    //     // rotate: 30,
    //     zoom: 0.1, // Set the desired zoom level (e.g., 2x zoom)
    //     center: { eles: cy.elements() }, // Center around all elements
    //     duration: 1000, // Animation duration in milliseconds
    //     easing: "ease-in-out",
    //   });
    // }, 500);
  }, []);

  // useEffect(() => {
  //   // Rotate the graph
  //   let angle = 0; // Initial rotation angle
  //   const center = cyRef.current.pan(); // Get the center of the graph

  //   const intervalId = setInterval(() => {
  //     angle += 1; // Increment angle by 1 degree
  //     const radians = (angle * Math.PI) / 180; // Convert to radians

  //     // Apply rotation transformation
  //     const x = Math.cos(radians) * center.x - Math.sin(radians) * center.y + center.x;
  //     const y = Math.sin(radians) * center.x + Math.cos(radians) * center.y + center.y;

  //     cyRef.current.pan({ x, y }); // Update the pan position
  //   }, 50); // Update every 50ms (adjust for smoothness)

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const layout = {
    name: "cose-bilkent",
    fit: true,
    // animate: true,
    randomize: true,
    // refresh: 100,
    padding: 10,
    nodeRepulsion: 15000,
    idealEdgeLength: 300,
    idealEdgeWidth: 300,
    nodeDimensionsIncludeLabels: false,
    // nodeOverlap: 100,
    // // idealEdgeLength: 100,
    edgeElasticity: 1,
    gravity: 0.6,
    // stiffness: 400,
    repulsion: 400,
    damping: 0.9,
    quality: "proof",
    // nodeSpacing: 500,
    // name: "springy",
    // nodeRepulsion: 1000,
    // idealEdgeLength: 50,
    // concentric: function (node) {
    //   // Central node gets the highest weight
    //   return node.data("level") === 1 ? 10 : 10;
    // },
    // levelWidth: function () {
    //   return 29; // Distance between levels
    // },
    // animate: true,
    // animationDuration: 1000,
    avoidOverlap: true,
    // spacingFactor: 1.5, // Adjust spacing between nodes
    // animate: true, // whether to show the layout as it's running
    // maxSimulationTime: 4000, // max length in ms to run the layout
    // ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
    // fit: true, // whether to fit the viewport to the graph
    // padding: 30, // padding on fit
    // boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    // randomize: false, // whether to use random initial positions
    // infinite: false, // overrides all other options for a forces-all-the-time mode
    // ready: undefined, // callback on layoutready
    // stop: undefined, // callback on layoutstop

    // // springy forces and config
    // stiffness: 400,
    // repulsion: 400,
    // damping: 0.5,
    // edgeLength: function (edge) {
    //   var length = edge.data("length");

    //   if (length !== undefined && !isNaN(length)) {
    //     return length;
    //   }
    // },
  };

  // let layout = {
  //   name: "cose-bilkent",
  //   animate: true, // Smooth transitions
  //   maxSimulationTime: 2000, // Run simulation longer for better results
  //   nodeSpacing: function (node) {
  //     return 100; // Minimum space between nodes
  //   },
  //   edgeLength: function (edge) {
  //     return 150; // Ideal length for edges
  //   },
  //   randomize: false, // Start with a pre-arranged layout
  //   fit: true, // Fit the graph to the viewport
  //   padding: 30, // Padding around the graph
  //   nodeRepulsion: 1000,
  // };

  const handleResultClick = (node: any) => {
    console.log("cy >>>>>>", cyRef.current);
    const targetNode = cyRef.current.getElementById(node.data.id);
    if (targetNode) {
      cyRef.current.animate({
        fit: { eles: targetNode.closedNeighborhood(), padding: 20 },
        duration: 1500,
      });
    }
    // setQuery("");
    // setResults([]);
  };

  return (
    <div>
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
    </div>
  );
};

export default HierarchicalGraph;
