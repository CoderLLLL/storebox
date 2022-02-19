var deRepeat = function (arr1, arr2) {
    var newArr = new Set();
    if (arr1.length !== 0) {
        for (var _i = 0, arr1_1 = arr1; _i < arr1_1.length; _i++) {
            var item = arr1_1[_i];
            newArr.add(item);
        }
    }
    for (var _a = 0, arr2_1 = arr2; _a < arr2_1.length; _a++) {
        var item = arr2_1[_a];
        newArr.add(item);
    }
    return Array.from(newArr);
};
export default deRepeat;
