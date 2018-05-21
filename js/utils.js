
/**
 * 计算出现总次数
 * posObj ['万位', '千位', '百位', '十位', '个位']
 * selectNumArr => 如时时彩[0,1,2,3,4,5,6,7,8,9]
 * openDataArr 开奖号码数组
 * return [[2,3,3,4,4,3,5,6,7],[2,3,3,4,4,3,5,6,7],[2,3,3,4,4,3,5,6,7],[2,3,3,4,4,3,5,6,7],[2,3,3,4,4,3,5,6,7]] 返回每个位置统计值集合
 */
function calcEachTotal(posObj, selectNumArr, openDataArr) {
    const totalArr = [];
    for (let posIndex in posObj) {
        const resultArr = [];
        selectNumArr.forEach(selectNum => {
            let count = 0;
            openDataArr.forEach(itemArr => {
                if (itemArr[posIndex] === Number(selectNum)) {
                    count += 1;
                }
            });
            resultArr.push(count);
        });
        totalArr.push(resultArr);
    }
    return totalArr;
}

/**
 * 号码分布总次数
 */
function caclDistributionTotalArr(selectNumArr, openDataArr) {
    const resultArr = [];
    selectNumArr.forEach(selectNum => {
        let count = 0;
        openDataArr.forEach(itemArr => {
            count += itemArr.filter(item => {
                return item === Number(selectNum);
            }).length;
        });
        resultArr.push(count);
    });
    return resultArr;
}

/**
 * 号码分布最大遗漏
 */
function getDistributionMissAndContinuousObj(selectNumArr, openDataArr) {
    const resultArr = [];
    selectNumArr.forEach(selectNum => {
        const arr = [];
        openDataArr.forEach((itemArr, index) => {
            if (itemArr.indexOf(Number(selectNum)) !== -1) {
                arr.push(index + 1);
            }
        });
        resultArr.push(arr);
    });
    const openDataArrLength = openDataArr.length;
    const missArr = resultArr.map(arr => {
        return calcMaxMiss(arr, openDataArrLength);
    });
    const continuousArr = resultArr.map(arr => {
        arr.sort();
        if (arr.length === 0) {
            return 0;
        }
        if (filterShunziArr(arr).length > 0) {
            return filterShunziArr(arr).sort((a, b) => b.length - a.length)[0].length;
        } else {
            return 1;
        }
    });
    return {
        missArr,
        continuousArr
    };
}

/**
 * 获取最大遗漏值和连出值对象
 */
function getMissAndContinuousObj(posObj, selectNumArr, openDataArr) {
    const missAndContinuousArr = [];
    for (let posIndex in posObj) {
        const resultArr = [];
        selectNumArr.forEach(selectNum => {
            const arr = [];
            openDataArr.forEach((itemArr, index) => {
                if (itemArr[posIndex] === Number(selectNum)) {
                    arr.push(index + 1);
                }
            });
            resultArr.push(arr);
        });
        missAndContinuousArr.push(resultArr);
    }
    //最大遗漏值
    const missArr = missAndContinuousArr.map(posItem => {
        const openDataArrLength = openDataArr.length;
        return posItem.map(itemArr => {
            return calcMaxMiss(itemArr, openDataArrLength);
        });
    });
    //最大连出值
    const continuousArr = missAndContinuousArr.map(posItem => {
        return posItem.map(itemArr => {
            itemArr.sort();
            if (itemArr.length === 0) {
                return 0;
            }
            if (filterShunziArr(itemArr).length > 0) {
                return filterShunziArr(itemArr).sort((a, b) => b.length - a.length)[0].length;
            } else {
                return 1;
            }
        });
    });
    return {
        missArr,
        continuousArr
    };
}

/**
 * 计算最大遗漏值
 * 
 * @param {Array} arr 选中的序号集合
 * @param {Number} openDataArrLength 列表的数量
 * @returns Number
 */
function calcMaxMiss(arr, openDataArrLength) {
    arr.sort();
    if (arr.length === 0) {
        return openDataArrLength;
    }
    if (arr.length === 1) {
        return Math.max(...[openDataArrLength - arr[0], arr[0] - 1]);
    }
    if (arr.length === 2) {
        return Math.max(...[openDataArrLength - arr[1], arr[1] - arr[0], arr[0] - 1]);
    }
    const result = [];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    result.push(min - 1);
    result.push(openDataArrLength - max);
    for (let i = 0; i < arr.length - 2; i++) {
        result.push(arr[i + 1] - arr[i] - 1);
    }
    return Math.max(...result);
}

/**
 * 从一组数字中取出顺子
 * 如[1,2,3,6,7,8] => [[1,2,3],[6,7,8]]
 * @param {数组} arr 
 * @returns 二维数组
 */
function filterShunziArr(arr) {
    var len = arr.length,
        before = arr[0],
        i = 1,
        res = [],
        result = [],
        current;
    for (; i < len; i++) {
        current = arr[i];
        if (current - before === 1) {
            if (res.length === 0) {
                res.push(before);
            }
            res.push(current);
        } else {
            if (res.length) {
                result.push(res);
            }
            res = [];
        }
        before = current;
    }
    if (res.length) {
        result.push(res);
    }
    return result;
}

/**
 * 计算3星组态
 * 规则：3个号码中有两个相同为“组三”，3个都不相同为“组六”,3个相同为“豹子”
 * @param {数组} arr [1,2,3],只能是3个元素
 */
function cacl3xZutai(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('所传参数必须是数组');
    }
    if (arr.length !== 3) {
        throw new Error('数组只能含3个数字');
    }
    arr = arr.map(v => Number(v));
    const obj = {
        1: '豹子',
        2: '组三',
        3: '组六'
    };
    const deduplicationArr = [...new Set(arr)]; //去重
    return obj[deduplicationArr.length];
}

/**
 * 计算跨度
 * 规则：计算数组元素中最大值和最小值的差值
 * @param {数组} arr 
 */
function calcKuadu(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('所传参数必须是数组');
    }
    arr = arr.map(v => Number(v));
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    return max - min;
}

/**
 * 计算和值
 * 规则：计算数组元素中所有值的和值
 * @param {数组} arr 
 */
function calcHezhi(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('所传参数必须是数组');
    }
    arr = arr.map(v => Number(v));
    return arr.reduce((a, b) => a + b);
}

/**
 * 计算二星对子
 * 
 * @param {Array} arr 
 * @returns Boolean
 */
function calc2xDuizi(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('所传参数必须是数组');
    }
    if (arr.length !== 2) {
        throw new Error('数组只能含2个数字');
    }
    arr = arr.map(v => Number(v));
    const length = [...new Set(arr)].length;
    if (length === 1) return true;
    return false;
}