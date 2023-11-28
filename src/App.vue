<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import { NConfigProvider,NMessageProvider } from "naive-ui";

const themeOverrides = {
  common: {
    primaryColor: "#FF0000",
  },
  DataTable: {
    borderRadius: "10px",
  },
  Select:{
    borderRadius: "7px",
  },
  DataTable:{
    tdColorHover:'rgba(255,255,255,0)'
  }
  // ...
};

// ...
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <HelloWorld />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
