import { ArrangedGraphData } from '../graphexp.service';
import { D3Node } from '../nodes/d3Node';
import { GraphConfig } from './graphConfig';
import { GraphViz } from './graphViz';
import * as d3 from 'd3';

export class GraphLinks {

  get config(): GraphConfig {
    return this.graphViz.config;
  }

  get graphRoot() {
    return this.graphViz.graphRoot;
  }

  get linkModels(): D3Node[] {
    return this.graphViz.linkModels;
  }

  get nodeModels(): D3Node[] {
    return this.graphViz.nodeModels;
  }

  get selectLinks() {
    return this.graphViz.selectLinks;
  }

  get selectEdgePaths() {
    return this.graphViz.selectEdgePaths;
  }

  get selectEdgeLabels() {
    return this.graphViz.selectEdgeLabels;
  }

  get selectGraphNodes() {
    return this.graphViz.selectGraphNodes;
  }

  update(arrangedData: ArrangedGraphData) {
    // links not active anymore are classified old_links
    //this.selectLinks.exit().classed('old_edge0', true).classed('active_edge', false);
    //this.selectEdgePaths.exit().classed('old_edgepath0', true).classed('active_edgepath', false);
    //this.selectEdgeLabels.exit().classed('old_edgelabel0', true).classed('active_edgelabel', false);

    // handling active links associated to the data
    const edgepaths_e = this.selectEdgePaths.enter(),
      edgelabels_e = this.selectEdgeLabels.enter(),
      link_e = this.selectLinks.enter();
    // Where we draw the edges
    const decor_out = this.decorate(link_e, edgepaths_e, edgelabels_e);

    const links = decor_out[0], edgepaths = decor_out[1],
      edgelabels = decor_out[2];

    // previous links plus new links are merged
    links.merge(this.selectLinks);
    edgepaths.merge(this.selectEdgePaths);
    edgelabels.merge(this.selectEdgeLabels);
  }

  tick() {
    this.selectLinks
      .attr('x1', function (d) {
        return d.source.x;
      })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      });

    this.selectEdgePaths.attr('d', function (d) {
      return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    });

    this.selectEdgeLabels.attr('transform', function (d) {
      if (d.target.x < d.source.x) {
        const bbox = this.getBBox();

        const rx = bbox.x + bbox.width / 2;
        const ry = bbox.y + bbox.height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      } else {
        return 'rotate(0)';
      }
    });
  }

  getStrokeWidth(d) {
    if ('stroke_width' in d) {
      return d.stroke_width;
    } else {
      return this.config.default_edge_stroke_width;
    }
  }

  getEdgeText(d) {
    if ('text' in d) {
      return d.text;
    } else {
      return d.properties.weight;
    }
  }

  getEdgeColor(d) {
    if ('color' in d) {
      return d.color;
    } else {
      return this.config.default_edge_color;
    }
  }

  /* TLDR
    1) Add a path alongside every edge
    2) Add text to the edges
    3) Bind that text to a textpath -
      which is referencing the path along the edge
    Graph's edge rendering, labeling happens here
    Example: http://bl.ocks.org/jhb/5955887
  */
  decorate(edges, edgepaths, edgelabels) {
    /// 1) Draw d3-'line' between nodes in dataset
    const edges_deco = edges.append('line')
      .attr('class', 'edge').classed('active_edge', true)
      .attr('source_ID', function (d) {
        return d.source;
      })
      .attr('target_ID', function (d) {
        return d.target;
      })
      .attr('ID', function (d) {
        return d.id;
      });

    this.createMarkers(edges_deco);

    // Attach the arrows
    edges_deco.attr('marker-end', function (d) {
      return 'url(#marker_' + d.id + ')'
    })
      .attr('stroke-width', (d) => this.getStrokeWidth(d))
      .append('title').text(function (d) {
        return d.properties.weight;
      });

    // Attach the edge labels
    const e_label = this.createEdgeLabels(edgepaths, edgelabels);
    const edgepaths_deco = e_label[0];
    const edgelabels_deco = e_label[1];
    /// 4) Finally set d3-'texpath' on text objects (composite edge objects w/ text decoration appended)
    // To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
    edgelabels_deco.append('textPath')
      .attr('class', 'edge_text')
      .attr('href', function (d, i) {
        return '#edgepath' + d.id.relationId
      })
      .style('text-anchor', 'middle')
      .style('pointer-events', 'none')
      .style('stroke', '#9A8F97')
      .attr('stroke-width', 1)
      .attr('startOffset', '50%')
      .text(function (d) {
        return d.label
      });

    // Attach the edge actions
    this.attachEdgeEvents(edges_deco)

    // Add property info if checkbox checked
    this.addEnabledProperties('edges', edgelabels_deco)

    return [edges_deco, edgepaths_deco, edgelabels_deco]

  }

  nodeModelById(id): D3Node {
    // return data associated to the node with id 'id'
    for (const node in this.nodeModels) {
      if (this.nodeModels[node].id === id) {
        return this.nodeModels[node];
      }
    }
  }

  createMarkers(edge_in) {
    const edge_data = edge_in.data();
    const arrow_data = this.graphRoot.selectAll('.arrow').data();
    const data = arrow_data.concat(edge_data);

    this.graphRoot.selectAll('.arrow')
      .data(data)
      .enter()
      .append('marker')
      .attr('class', 'arrow')
      .attr('id', (d) => { return 'marker_' + d.id })
      .attr('markerHeight', 5)
      .attr('markerWidth', 5)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', (d) => {
        const node = this.nodeModelById(d.target);
        return this.graphViz.graphNodes.getNodeSize(node) + this.graphViz.graphNodes.getNodeStrokeWidth(node);
      })
      .attr('refY', 0)
      .attr('viewBox', '0 -5 10 10')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .style('fill', (d) => { return this.getEdgeColor(d) });
  }

  addEnabledProperties(item, selected_items) {
    // Add text from a property if the checkbox is checked on the sidebar
    const item_properties = [];
    if (item === 'edges') {
      // TODO: get properties
      // item_properties = this.graphexpService.edgeProperties.value;
    } else if (item === 'nodes') {
      // item_properties = this.graphexpService.nodeProperties.value;
    }
    for (let prop_idx = 0; prop_idx < item_properties.length; prop_idx++) {
      const prop_name = item_properties[prop_idx];
      const prop_id_nb = prop_idx;
      const prop_id = item + '_' + prop_name;
      this.graphViz.attachEnabledProperties(selected_items, prop_name, prop_id_nb, item);
    }
  }

  createEdgeLabels(edgepaths, edgelabels) {
    /// 2) Draw d3-'path' between nodes in dataset, used later to hang textpath off of.  
    /// Controls where UI data goes
    const edgepaths_deco = edgepaths.append('path')
      .attr('class', 'edgepath').classed('active_edgepath', true)
      .style('pointer-events', 'none')
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0)
      .attr('id', function (d, i) {
        return 'edgepath' + d.id.relationId
      })
      .attr('ID', function (d) {
        return d.id;
      });
    /// 3) Draw d3-'text' between nodes in dataset.  
    /// This is our place that we control markup of incoming data only (color, position, etc)
    const edgelabels_deco = edgelabels.append('text')
      .attr('dy', -3)
      .attr('font-size', 8)
      .style('pointer-events', 'none')
      .attr('class', 'edgelabel').classed('active_edgelabel', true)
      .attr('id', function (d, i) {
        return 'edgelabel' + d.id
      })
      .attr('ID', function (d) {
        return d.id.relationId;
        //return d.id
      })

    return [edgepaths_deco, edgelabels_deco];

  }

  attachEdgeEvents(edge) {
    edge.on('mouseover', (theEdge, index, elements) => {
      //console.log('mouse over!!');
      const line = elements[index];
      d3.select(line).selectAll('.text_details').style('visibility', 'visible');
    })
      .on('mouseout', (theEdge, index, elements) => {
        const line = elements[index];
        d3.select(line).selectAll('.text_details').style('visibility', 'hidden');
      })
      .on('click', (theEdge, index, elements) => {
        console.log('edge clicked!');
      });

  }

  constructor(private graphViz: GraphViz) { }
}
