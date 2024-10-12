export type NodeId = string;

export interface Node<T = unknown> {
  id: NodeId;
  type: string;
  data: T;
  metadata: Record<string, unknown>;
}

export interface Edge {
  from: NodeId;
  to: NodeId;
  type: string;
  metadata: Record<string, unknown>;
}

export interface SerializedGraph {
  version: string;
  nodes: Node[];
  edges: Edge[];
}