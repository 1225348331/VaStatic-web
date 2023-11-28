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
    /^(.+?)\s+((?:XX\s*Large|X\s*Large|Large|Medium|X\s*Small|Small|XS|S|M|L|XL|XXL))$/;
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

  let groupColor = _.groupBy(staticData, (item) => item.color);
  let groupSize = _.groupBy(staticData, (item) => item.size);
  let vaColor = calculate(groupColor);
  let vaSize = calculate(groupSize);
  let tableColor = calTableColor(groupColor);

  return {
    vaColor,
    vaSize,
    groupColor,
    tableColor,
  };
}
