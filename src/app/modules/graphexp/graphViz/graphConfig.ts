import { GraphsonFormat } from '../graphexp.service';
import * as d3 from 'd3';

export class GraphConfig {
  enableEdit = true;
  nodeLabels: string[] = [];
  linkLabels: string[] = [];
  numberOfLayers = 3;

  format: GraphsonFormat = GraphsonFormat.GraphSON3;

  // Physics
  force_strength = -600;
  link_strength = 0.2;
  force_x_strength = 0.1;
  force_y_strength = 0.1;

  // Nodes
  default_node_size = 10;
  default_stroke_width = 2;
  default_node_color = '#9A8F97';
  active_node_margin = 6;
  active_node_margin_opacity = 0.3;

  // Edges
  default_edge_stroke_width = 3;
  default_edge_color = '#FF6600';
  edge_label_color = '#3D3D3D';

  colorPalette: (item: any) => any = d3.scaleOrdinal(d3.schemeCategory20);
}
