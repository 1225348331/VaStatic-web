<script setup>
import {
  NButton,
  NScrollbar,
  NUpload,
  NIcon,
  NText,
  NDivider,
  NSelect,
  NTag,
  NDataTable,
  NUploadDragger,
} from "naive-ui";
import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5";
import { staticData } from "../utils/calculate";
import { useMessage } from "naive-ui";
import { ref } from "vue";
import _ from "lodash";
const message = useMessage();
let data = ref([]);
let tableData = ref([]);
let tableColumn = [];
let selectedValue = ref(null);
let options = ref([]);
const ImportVendorID = ref(null);
const FactoryID = ref(null);
const FactoryName = ref(null);
const Statistics = ref(null); // 统计数据
const rowProps = ref((row) => {
  return {};
});

// 固定表头字段
let knownField = [
  "Product Description",
  "DPCI",
  "Spark PID",
  "Spark PID Description",
  "Manufacturer Style #",
  "Ent Ttl Rcpt U",
  "Intended Selling Channel",
  "CMS #",
  "Suggested Unit Retail",
  "Presentation Type",
  "Store Set Date",
  "Digital Launch Date",
  "Import Vendor ID",
  "Factory ID",
  "Factory Name",
];

knownField.forEach((item) => {
  if (["Import Vendor ID", "Factory ID", "Factory Name"].includes(item)) {
    return;
  }
  tableColumn.push({
    title: item,
    key: item,
  });
});

// 上传成功后
const handleFinish = ({ file, event }) => {
  let resData = JSON.parse(event.target.response);

  tableData.value.length = 0;
  data.value.length = 0;
  options.value.length = 0;
  ImportVendorID.value = null;
  FactoryID.value = null;
  FactoryName.value = null;
  selectedValue.value = null;

  // 所有表头字段
  let allField = resData[0];
  // 固定表头字段索引
  let fieldIndex = [];
  knownField.forEach((item) => {
    fieldIndex.push({
      field: item,
      index: allField.indexOf(item),
    });
  });

  resData.forEach((item, index) => {
    if (index) {
      let itemValue = {};
      fieldIndex.forEach((fieldInfo) => {
        itemValue[fieldInfo.field] = item[fieldInfo.index];
      });
      data.value.push(itemValue);
    }
  });
  // 升序排列
  data.value = _.sortBy(data.value, "DPCI");
  tableData.value = data.value;
  console.log(tableData.value)
  // 所有的Spark PID
  _.uniqBy(data.value, "Spark PID").forEach((item) => {
    options.value.push({
      label: item["Spark PID"],
      value: item["Spark PID"],
    });
  });

  message.success("上传成功啦~");
};

// 过滤筛选
const selectFilter = (value) => {
  selectedValue.value = value;
  tableData.value = data.value.filter((item) => {
    return item["Spark PID"] == value;
  });

  ImportVendorID.value = tableData.value[0]?.["Import Vendor ID"];
  FactoryID.value = tableData.value[0]?.["Factory ID"];
  FactoryName.value = tableData.value[0]?.["Factory Name"];
  Statistics.value = staticData(tableData.value);
  console.log(Statistics.value.tableColor);

  rowProps.value = (row) => {
    let color = "#fff";
    for (var key in Statistics.value.tableColor) {
      if (row["Product Description"].includes(key)) {
        color = Statistics.value.tableColor[key];
      }
    }
    // console.log(color)
    return {
      style: `background-color:${color};--n-merged-td-color:${color};`,
    };
  };
};

const copy = async (data) => {
  let contents = "";
  data.forEach((item) => {
    contents += item.data["DPCI"] + "\n";
  });
  await navigator.clipboard.writeText(contents);

  message.success("复制成功！");
};


</script>
<template>
  <n-scrollbar class="content" style="max-height: 100vh; min-height: 100vh">
    <!-- 上传 -->
    <n-upload
      multiple
      directory-dnd
      action="https://vaapi.jiangyuhui.top/"
      :max="1"
      @finish="handleFinish"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="36" :depth="3">
            <archive-icon />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          点击或者拖动文件到该区域来上传
        </n-text>
      </n-upload-dragger>
    </n-upload>
    <n-divider dashed>统计区域</n-divider>
    <!-- 筛选过滤 -->
    <n-select
      v-model:value="selectedValue"
      filterable
      placeholder="选择Spark PID"
      :options="options"
      :on-update:value="selectFilter"
    />
    <!-- 过滤信息 -->
    <div class="filterInfo">
      <n-tag :bordered="false" type="info">Import Vendor ID</n-tag>
      <span>{{ ImportVendorID }}</span>
      <n-tag :bordered="false" type="info">Factory ID</n-tag>
      <span>{{ FactoryID }}</span>
      <n-tag :bordered="false" type="info">Factory Name</n-tag>
      <span>{{ FactoryName }}</span>
    </div>
    <n-data-table
      :columns="tableColumn"
      :data="tableData"
      :row-props="rowProps"
      :bordered="false"
      :style="{ height: `450px` }"
      flex-height
    />
    <!-- 统计信息 -->
    <div class="staticInfo">
      <div class="colorInfo info">
        <h2>颜色统计</h2>
        <p v-for="(item, key) in Statistics?.vaColor">
          <n-tag :bordered="false" type="info">{{ key }}</n-tag>
          {{ item }}
        </p>
      </div>
      <div class="sizeInfo info">
        <h2>尺寸统计</h2>
        <p v-for="(item, key) in Statistics?.vaSize">
          <n-tag :bordered="false" type="info">{{ key }}</n-tag>
          {{ item }}
        </p>
      </div>
      <div class="DPCIInfo info">
        <h2>DPCI</h2>
        <div class="DPCIInfoContent">
          <div
            style="cursor: pointer"
            @click="copy(item)"
            v-for="item in Statistics?.groupColor"
          >
            <p type="info" v-for="ColorItem in item">
              <span style="user-select: none">
                {{ ColorItem.data["Product Description"] }}
              </span>
              <span style="user-select: none">{{ ColorItem.data["DPCI"] }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </n-scrollbar>
</template>
<style lang="scss" scoped>
.content {
  .n-upload {
    border-radius: 10px;
    box-shadow: 5px 15px 15px 2px rgba(0, 0, 0, 0.5);
    .n-upload-dragger {
      border-radius: 10px;
    }
  }
  .n-data-table {
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 5px 15px 15px 2px rgba(0, 0, 0, 0.5);
  }
  .n-select {
    width: 250px;
    padding-bottom: 5px;
  }

  .staticInfo {
    margin: 20px 0px;
    display: flex;
    flex-flow: row wrap;
    p {
      margin: 5px 0px;
    }
    .info {
      margin-right: 50px;
    }

    .DPCIInfo {
      .DPCIInfoContent {
        display: flex;
        flex-flow: row wrap;
        & > div {
          margin-right: 14px;
          margin-bottom: 14px;
          background-color: #2080f01f;
          color: #2080f0;
        }
        p {
          display: flex;
          justify-content: space-between;
          border-radius: 2px;
          padding: 0px 7px;
          height: 28px;
          line-height: 28px;
          span {
            margin: 0px 3px;
          }
        }
      }
    }
  }

  .filterInfo {
    margin: 0px 20px;
    span {
      padding: 0px 10px;
    }
  }
}
</style>
<style lang="scss">
.content {
  & > .n-scrollbar-container {
    & > .n-scrollbar-content {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      padding: 20px 20px;
    }
  }
}
</style>
