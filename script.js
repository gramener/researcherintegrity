/* global d3, bootstrap */
import { network } from "./node_modules/@gramex/network/dist/network.js";
import { pc } from "./node_modules/@gramex/ui/dist/format.js";

const { nodes, links } = await fetch("papers.json").then((r) => r.json());

const el = document.querySelector("#authorship-network");
const graph = network(el, { nodes, links, d3 });
el.parentElement.querySelector(".loading")?.remove();
const riColor = d3
  .scaleSequentialPow(d3.interpolateReds)
  .domain(d3.extent(nodes, (d) => d["RISK"]))
  .exponent(0.3);

graph.nodes
  .attr("fill", (d) => riColor(d["RISK"]))
  .attr("stroke", (d) => (d.type == "paper" ? "blue" : "black"))
  .attr("stroke-width", (d) => (d.type == "paper" ? 1 : 0.5))
  .attr("r", 5)
  .attr("data-bs-toggle", "tooltip")
  .attr(
    "title",
    (d) =>
      /* html */ `<div class="text-start"><strong>RISK</strong>: ${pc(d["RISK"])}</div>` +
      (d.type == "paper"
        ? ["DOI", "Year", "Publisher Name", "Journal Name"]
        : ["Author Name", "Org Division", "Org Name", "City"]
      )
        .map((col) => `<div class="text-start"><strong>${col}</strong>: ${d[col]}</div>`)
        .join(""),
  );
graph.links.attr("stroke", "rgba(0,0,0,0.2)");

new bootstrap.Tooltip("#authorship-network", { selector: '[data-bs-toggle="tooltip"]', html: true });
