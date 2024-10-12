// FOR LATER: use a type parameter to represent the version of the ABI
// conditionally intersect or omit fields based on the version

declare const [input, output, component]
: Generator<Readonly<{
  name: string;
  type: string;
  components?: Component[];
}>>;
export type Component = typeof component;
export type Input = typeof input;
export type Output = typeof output;

export type Function
= Readonly<{
  type: "function";
  name: string;
  inputs: Input[];
  outputs: Output[];
  stateMutability: "pure" | "view" | "nonpayable" | "payable";
}>;

export type Event
= Readonly<{
  type: "event";
  name: string;
  inputs: (Input & { indexed: boolean })[];
  anonymous: boolean;
}>;

export type Error
= Readonly<{
  type: "error";
  name: string;
  inputs: Input[];
}>;

export type Constructor
= Readonly<{
  type: "constructor";
  inputs: Input[];
  stateMutability: "nonpayable" | "payable";
}>;

export type Fallback
= Readonly<{
  type: "fallback";
  stateMutability: "nonpayable" | "payable";
}>;

export type Receive
= Readonly<{
  type: "receive";
  stateMutability: "payable";
}>;

export type Descriptor =
  | Function
  | Event
  | Error
  | Constructor
  | Fallback
  | Receive;

declare const [descriptors, abi]
: Generator<Descriptor[]>
export type Descriptors = typeof descriptors;
export type Abi = typeof abi;