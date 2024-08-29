// FOR LATER: use a type parameter to represent the version of the ABI
// conditionally intersect or omit fields based on the version

export type Abi = Descriptors;

export type Descriptors = Descriptor[];

export type Descriptor =
  | Function
  | Event
  | Error
  | Constructor
  | Fallback
  | Receive;

export type Function = {
  type: "function";
  name: string;
  inputs: Input[];
  outputs: Output[];
  stateMutability: "pure" | "view" | "nonpayable" | "payable";
};

export type Event = {
  type: "event";
  name: string;
  inputs: (Input & { indexed: boolean })[];
  anonymous: boolean;
};

export type Error = {
  type: "error";
  name: string;
  inputs: Input[];
};

export type Constructor = {
  type: "constructor";
  inputs: Input[];
  stateMutability: "nonpayable" | "payable";
};

export type Fallback = {
  type: "fallback";
  stateMutability: "nonpayable" | "payable";
};

export type Receive = {
  type: "receive";
  stateMutability: "payable";
};

export type Input = {
  name: string;
  type: string;
  components?: Input[];
};

export type Output = Input;
