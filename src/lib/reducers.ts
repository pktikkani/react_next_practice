function vendorFilterReducer(state: VendorFilterState, action: VendorFilterAction): VendorFilterState {
    switch (action.type) {
        case "SET_SEARCH":
            return { ...state, searchText: action.text };
        case "TOGGLE_SORT":
            return { ...state, sortOrder: state.sortOrder === "asc" ? "desc" : "asc" };
        case "RESET":
            return { searchText: "", sortOrder: "asc" };
        default:
            const _exhaustive: never = action;
            throw new Error("Unknown action");
    }
}


const items = [
    { ItemCode: "A001", ItemName: "Chair", QuantityOnStock: 50 },
    { ItemCode: "A002", ItemName: "Table", QuantityOnStock: 30 },
    { ItemCode: "A003", ItemName: "Lamp", QuantityOnStock: 100 },
];

function addToRecord(record: any, [key, value]: [any, any]) {
    return { ...record, [key]: value };
}

function reduce(reducer: any, initialVal: any, arr: any) {
    var ret = initialVal;
    for (let elem of arr) {
        ret = reducer(ret, elem);
    }
    return ret;
}

console.log(reduce(addToRecord, {}, [
    ["ItemCode", "A001"],
    ["QuantityOnStock", 100],
    [ "ItemName", "Chair"]
]))

const total = items.reduce(function sumStock(accumulator, currentItem, c) {
    return accumulator + currentItem.QuantityOnStock;
},0);

console.log(total);

const groupByA = items.reduce(function arrangeByA(accumulator: any,currentItem, ){
   const firstLetter = currentItem.ItemName[0];
   if (!accumulator[firstLetter]) accumulator[firstLetter] = [];
   accumulator[firstLetter].push(currentItem);
   return accumulator;
},{});

console.log(groupByA);

const groupByCode = items.reduce(function arrangeByCode(accumulator: any,currentItem, ){
   const code = currentItem.ItemCode;
   if (!accumulator[code]) accumulator[code] = [];
   accumulator[code].push(currentItem);
   return accumulator;
},{});

console.log(groupByCode);

const itemsGreaterForty = items.reduce(function filterByForty(accumulator: any, currentItem) {
    if (currentItem.QuantityOnStock > 40) accumulator.push(currentItem);
    return accumulator;
}, [])

console.log(itemsGreaterForty);

const itemsUpperCase = items.reduce(function mapByUpperCase(accumulator: any, currentItem) {
    accumulator.push(currentItem.ItemName.toUpperCase());
    return accumulator;
}, [])
console.log(itemsUpperCase);