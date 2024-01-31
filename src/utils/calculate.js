import _ from "lodash";

// 统计
const calculate = (data) => {
  let obj = {};
  for (var key in data) {
    obj[key] = data[key]
      .map((item) => Math.round(item.num))
      .reduce((a, b) => a + b);
  }
  let sum = 0;
  for (var key in obj) {
    sum += obj[key];
  }
  obj["合计"] = sum;
  return obj;
};

const calTableColor = (data) => {
  let obj = {};
  let index = 0;
  for (var key in data) {
    if (index % 2) {
      obj[key] = "rgba(146, 208, 80,0.5)";
    } else {
      obj[key] = "rgb(255,255,255)";
    }
    index++;
  }
  return obj;
};

const customSortOrder = [
  "XS",
  "X Small",
  "S",
  "Small",
  "M",
  "Medium",
  "L",
  "Large",
  "XL",
  "X Large",
  "XXL",
  "XX Large",
  "1X",
  "2X",
  "3X",
  "4X",
];
// 自定义排序函数
const customSort = (objList) => {
  return _.sortBy(objList, (obj) => {
    const size = obj.size;
    if (_.isNumber(size)) {
      return size;
    } else if (_.isString(size) && /^\d+$/.test(size)) {
      return parseInt(size, 10);
    } else {
      if (customSortOrder.includes(size)) return customSortOrder.indexOf(size);
      return Infinity;
      // return obj["DPCI"];
    }
  });
};

// 尺码归类
const formatSize = {
  XXL: "XX Large",
  XL: "X Large",
  L: "Large",
  M: "Medium",
  S: "Small",
  XS: "X Small",
};

export function staticData(tableData) {
  // 定义正则表达式，用于匹配颜色和尺码部分
  const regex =
    /^(.+?)\s+((?:XX\s*Large|X\s*Large|Large|Medium|X\s*Small|Small|XS|S|M|L|XL|XXL|1X|2X|3X|4X|\s*0|\s*2|\s*4|\s*6|\s*8|\s*10|\s*12|\s*14|\s*16|\s*17|\s*18|\s*20|\s*22|\s*24|\s*26))$/;
  // 统计数据
  let staticData = [];

  tableData.forEach((item) => {
    const match = item["Product Description"].match(regex); // 使用正则表达式匹配字符串
    const color = match[1].trim(); // 颜色部分
    const size = formatSize[match[2]] ? formatSize[match[2]] : match[2]; // 尺码部分
    const num = item["Ent Ttl Rcpt U"];
    staticData.push({
      size,
      color,
      num,
      data: item,
    });
  });

  let groupColor = _.mapValues(
    _.groupBy(staticData, (item) => item.color),
    (group) => customSort(group)
  );
  let groupSize = _.groupBy(staticData, (item) => item.size);
  let vaColor = calculate(groupColor); // 颜色统计
  let vaSize = calculate(groupSize); // 尺寸统计
  const sortedKeys = _.sortBy(Object.keys(vaSize), (size) => {
    if (_.isNumber(size)) {
      return size;
    } else if (_.isString(size) && /^\d+$/.test(size)) {
      return parseInt(size, 10);
    } else {
      if (customSortOrder.includes(size)) return customSortOrder.indexOf(size);
      return Infinity;
      // return obj["DPCI"];
    }
  });
  let vaSortSize = {};
  sortedKeys.forEach((key) => (vaSortSize[key] = vaSize[key]));
  console.log(vaSortSize);
  let tableColor = calTableColor(groupColor);
  console.log(vaSize);
  console.log(groupColor);

  return {
    vaColor, // 颜色统计
    vaSize, // 尺寸统计
    vaSortSize, // 尺寸排序统计
    groupColor, // DPCI统计 按尺码排序
    tableColor,
  };
}
