enum Category {
    Address,
    Integer,
    RationalNumber,
    Bool,
    FixedPoint,
    Array,
    ArraySlice,
    FixedBytes,
    Contract,
    Struct,
    Function,
    Enum,
    UserDefinedValueType,
    Tuple,
    Mapping,
    TypeType,
    Modifier,
    Magic,
    Module,
    InaccessibleDynamic
}

abstract class Type {
    static category: Category;
    abstract category: Category;
    abstract fullEncodingType({ packed }:{ packed?: boolean }): Type | null;
    abstract mobileType(): Type | null;
    abstract interfaceType(): Type | null;
}

abstract class IntegerType extends Type
{
    abstract numBits: () => number;
    abstract isSigned: () => boolean;
}

abstract class FixedBytesType extends Type
{
    abstract numBytes: () => number;
}


abstract class ArrayType {
    abstract baseType: Type;
    abstract isDynamicallySized(): boolean;
}

abstract class ABIFunctions
{
    abstract abiEncodingFunction: (from: Type, to: Type, options: EncodingOptions)  => string;
    abstract abiEncodingFunctionStringLiteral: (from: Type, to: Type, options: EncodingOptions)  => string;
    abstract abiEncodingFunctionSimpleArray: (from: Type, to: Type, options: EncodingOptions)  => string;
    abstract abiEncodingFunctionStruct: (from: Type, to: Type, options: EncodingOptions) => string;
    
}

abstract class YulUtilFunctions
{
    abstract cleanupFunction: (from: Type) => string
    abstract conversionFunction: (from: Type, to: Type) => string
    abstract leftAlignFunction: (from: Type) => string
}

abstract class Numeric
{
    // https://github.com/ethereum/solidity/blob/develop/libsolidity/codegen/YulUtilFunctions.cpp#L3916
    // cleans numberic types by `and`ing them with the max value for their bit size
    abstract toCompactHexWithPrefix: (from: IntegerType) => string
}

YulUtilFunctions.prototype.cleanupFunction = function(type: Type) {
    switch (type.category) {
        case Category.Integer: {
            const integerType = <IntegerType>type
            if (integerType.numBits() == 256)
                return ''
            else if (integerType.isSigned())
                return ''
            else
                return ''
            break
        }

    }
}