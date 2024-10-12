// Generic Value Implementation

// Phantom type helper
const phantom = <T>(_: never): T => <T>undefined;

// Type extractor for phantom types
type ExtractPhantom<T> = T extends (_: never) => infer R ? R : never;

// Brand type
type Brand = readonly string[];

// Generic Value type
type GenericValue<B extends Brand, T = unknown> = B & {
    (): T;
    _phantom: (_: never) => T;
};

// Helper to create a GenericValue
function createGenericValue<B extends Brand, T>(
    brand: B,
    constructor: () => T
): GenericValue<B, T> {
    const value = Object.assign(
        function(this: B) {
            return constructor();
        },
        {
            ...brand,
            _phantom: phantom<T>
        }
    );
    return value;
}

// Type extractor for GenericValue
type ExtractGenericValueType<T> = T extends GenericValue<Brand, infer R> ? R : never;

// Example: Number type
const NumberTypeBrand = ["type", "number"] as const;
const NumberType = createGenericValue(NumberTypeBrand, () => 0);

// Example: String type
const StringTypeBrand = ["type", "string"] as const;
const StringType = createGenericValue(StringTypeBrand, () => "");

// Example: Complex type (Tuple)
const TupleTypeBrand = ["type", "tuple"] as const;
const TupleType = createGenericValue(TupleTypeBrand, () => [0, ""]);

// Usage examples
const num: ExtractGenericValueType<typeof NumberType> = 42;
const str: ExtractGenericValueType<typeof StringType> = "Hello, World!";
const tuple: ExtractGenericValueType<typeof TupleType> = [1, "test"];

// Generic function that works with GenericValue
function processGenericValue<T extends GenericValue<Brand, any>>(value: T): ExtractGenericValueType<T> {
    return value();
}

console.log(processGenericValue(NumberType)); // Outputs: 0
console.log(processGenericValue(StringType)); // Outputs: ""
console.log(processGenericValue(TupleType)); // Outputs: [0, ""]

// Creating a parameterized GenericValue (similar to type constructor with arguments)
function createParameterizedGenericValue<B extends Brand, P, T>(
    brand: B,
    constructor: (param: P) => T
): (param: P) => GenericValue<B, T> {
    return (param: P) => createGenericValue(brand, () => constructor(param));
}

type Lens<T, U> = {
    get(obj: T): U
    set(val: U, obj: T): T
}

const FirstItemInArrayLensBrand = ["lens", "firstItemInArray"] as const;
const FirstItemInArrayLens = createParameterizedGenericValue(FirstItemInArrayLensBrand, <A>(): Lens<A[], A> => ({
    get: (arr) => arr[0],
    set: (val, arr) => [val, ...arr.slice(1)]
}));

// Example: Parameterized Array type
const ArrayTypeBrand = ["type", "array"] as const;
const ArrayType = createParameterizedGenericValue(ArrayTypeBrand, <T>(length: number) => new Array<T>(length));

const numberArray = ArrayType(5);
const numbers: ExtractGenericValueType<typeof numberArray> = [1, 2, 3, 4, 5];

console.log(processGenericValue(numberArray)); // Outputs: [empty × 5]