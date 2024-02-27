/* global d3, bootstrap */
import { network } from "./node_modules/@gramex/network/dist/network.js";
import { kpartite } from "./node_modules/@gramex/network/dist/kpartite.js";

const data = await d3.csv("papers.csv");
const { nodes, links } = kpartite(
  data,
  {
    Author: (d) => JSON.stringify([d["Author Name"], d["Org Division"], d["Org Name"]]),
    Paper: (d) => d.DOI,
  },
  {
    count: 1,
  },
);

const el = document.querySelector("#authorship-network");
const graph = network(el, { nodes, links, d3 });
el.parentElement.querySelector(".loading")?.remove();

graph.nodes
  .attr("fill", (d) => (d.key == "Author" ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"))
  .attr("r", 5)
  .attr("data-bs-toggle", "tooltip")
  .attr("title", (d) => d.value);
graph.links.attr("stroke", "rgba(0,0,0,0.2)");

new bootstrap.Tooltip("#authorship-network", { selector: '[data-bs-toggle="tooltip"]' });
