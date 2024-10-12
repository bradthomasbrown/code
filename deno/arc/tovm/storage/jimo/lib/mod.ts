import { Node, Edge, NodeId, SerializedGraph } from "../types/mod.ts";

export class SimpleGraph {
  private nodes: Map<NodeId, Node> = new Map();
  private edges: Edge[] = [];

  addNode<T>(node: Node<T>): void {
    this.nodes.set(node.id, node);
  }

  addEdge(edge: Edge): void {
    this.edges.push(edge);
  }

  getNode(id: NodeId): Node | undefined {
    return this.nodes.get(id);
  }

  getEdges(fromId: NodeId): Edge[] {
    return this.edges.filter(edge => edge.from === fromId);
  }

  serialize(): SerializedGraph {
    return {
      version: "1.0",
      nodes: Array.from(this.nodes.values()),
      edges: this.edges
    };
  }

  static deserialize(data: SerializedGraph): SimpleGraph {
    const graph = new SimpleGraph();
    data.nodes.forEach(node => graph.addNode(node));
    data.edges.forEach(edge => graph.addEdge(edge));
    return graph;
  }

  exportToJSON(): string {
    return JSON.stringify(this.serialize(), null, 2);
  }

  static importFromJSON(json: string): SimpleGraph {
    const data = JSON.parse(json) as SerializedGraph;
    return SimpleGraph.deserialize(data);
  }
}