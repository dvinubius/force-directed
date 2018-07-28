var winCenterX = window.innerWidth/2;
var winCenterY = window.innerHeight/2;
console.log(winCenterX, winCenterY);
var rootingStrength = 1;

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
                            .id(function(d) { return d.id; })
                            .distance(link => link.target.group * 100))
    .force("radial", d3.forceRadial(200,width / 2, height / 2)
                            .radius(node => node.id === "Root" ? 0 : node.group * 200)
                            .strength(node => node.id === "Root" ? 1 : 0.1))
    // .force("charge", d3.forceManyBody()
    //                         .strength(-120))
    .force("collision", d3.forceCollide()
                            .radius(node => node.id === "Root" ? 50 : 60))
    ;

d3.json("./miserables.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line");

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", nodeRad)
      .attr("fill", nodeCol)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});

function nodeRad(node) {
  return node.id === "Root" ? 15 : 8;
}
function nodeCol(node) {
  return node.id === "Root" ? "rgb(180,20,0)" : "rgb(20,20,20)";
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}