function addValues(arg1, arg2) {
    const arg1Type = typeof arg1;
    const arg2Type = typeof arg2;

    if (arg1Type !== arg2Type) throw new Error("Argument's types must be the same!");

    switch (arg1Type) {
        case "bigint":
        case "string":
        case "number":
            return arg1 + arg2

        case "boolean":
            return arg1 || arg2;

        case "undefined":
            return undefined;

        case "symbol":
            throw new Error("Addition of symbols is not possible!");

        case "object":
            return addObjects(arg1, arg2);

        default:
            throw new Error("Unreachable code!");
    }
}

function addObjects(obj1, obj2) {
    if (typeof obj1 !== "object" || typeof obj2 !== "object")
        throw new Error(`${addObjects.name} only accepts objects as parameters!`);

    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if (compareArrays(obj1Keys, obj2Keys)) {
        let newObj = {};

        for (let i = 0; i < obj1Keys.length; ++i) {
            newObj[obj1Keys[i]] = addValues(obj1[obj1Keys[i]], obj2[obj2Keys[i]]);
        }
        return newObj;
    } else {
        let newObj = {};

        let sharedKeys = obj1Keys.filter(key => obj2Keys.includes(key));
        let obj1LeftKeys = obj1Keys.filter(key => !sharedKeys.includes(key));
        let obj2LeftKeys = obj2Keys.filter(key => !sharedKeys.includes(key));

        if (sharedKeys.length !== 0) {
            for (let i = 0; i < sharedKeys.length; ++i) {
                newObj[sharedKeys[i]] = addValues(obj1[sharedKeys[i]], obj2[sharedKeys[i]]);
            }
        }

        if (obj1LeftKeys.length !== 0) {
            for (let i = 0; i < obj1LeftKeys.length; ++i) {
                newObj[obj1LeftKeys[i]] = obj1[obj1LeftKeys[i]];
            }
        }

        if (obj2LeftKeys.length !== 0) {
            for (let i = 0; i < obj2LeftKeys.length; ++i) {
                newObj[obj2LeftKeys[i]] = obj2[obj2LeftKeys[i]];
            }
        }

        return newObj;
    }
}

function compareArrays(array1, array2) {
    if (typeof array1 !== "object" || typeof array2 !== "object")
        throw new Error(`${compareArrays.name} accepts array as parameters`)

    return JSON.stringify(array1) === JSON.stringify(array2);
}

function stringifyValue(arg) {
    const argType = typeof arg;

    switch (argType) {
        case "object":
            return JSON.stringify(arg);

        case "number":
        case "boolean":
        case "bigint":
        case "undefined":
        case "symbol":
            return String(arg);

        case "function":
            return arg.name;

        case "string":
            return arg;

        default:
            throw new Error("Unreachable code!");
    }
}

function convertToNumber(arg) {
    const argType = typeof arg;

    switch (argType) {
        case "bigint":
        case "number":
            return arg;

        case "string":
            return Number.parseFloat(arg);

        case "symbol":
            throw new Error("Cannot convert symbol to number!");

        case "boolean":
            return Number(arg);

        case "undefined":
            throw new Error("Cannot convert undefined to number!");

        case "function":
            throw new Error("Cannot convert function to number!");

        case "object":
            throw new Error("Cannot convert object to number!");

        default:
            throw new Error("Unreachable code!");
    }
}

function coerceToType(value, type) {
    const types = ["symbol", "number", "bigint", "boolean", "function", "object", "undefined", "string"];
    const valueType = typeof value;

    if (typeof type !== "string") throw new Error("Type parameter must be a string!");

    if (types.indexOf(type) === -1) throw new Error(`There is no ${type} type in JS!`);

    switch (type) {
        case "string":
            return typeof value === "object" ? JSON.stringify(value) : value.toString();

        case "number":
        case "bigint":
            if (valueType === "object" || valueType === "undefined" || valueType === "function" || valueType === "symbol")
                throw new Error(`Cannot convert number to ${valueType}!`);

            return Number.parseFloat(value.toString());

        case "boolean":
            return Boolean(value);

        case "symbol":
            if (valueType !== "number" || valueType !== "string")
                throw new Error(`Cannot convert symbol ${valueType}!`);

            return Symbol(value);

        case "function":
            throw new Error("Cannot convert function to any value!");

        case "undefined":
            throw new Error("Cannot convert undefined to any value!");
    }
}

function invertBoolean(arg) {
    if (typeof arg !== "boolean") throw new Error("Arg must be a boolean type!");

    return !arg;
}

export { addValues, invertBoolean, stringifyValue, coerceToType };