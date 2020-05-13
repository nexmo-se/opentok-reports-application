<template>
  <div id="app">
    <img class="small_logo" alt="Vonage logo" src="./assets/small.svg" />
    <img class="big_logo" alt="Vonage logo" src="./assets/bigv.png" />
    <span class="vcard">
      <ReportsAPI class="api" />
    </span>
  </div>
</template>
<script>
  import ReportsAPI from "./components/ReportsAPI.vue";
  import "@vonagevolta/volta2/dist/css/volta.css";
  import "@vonagevolta/volta2/dist/css/addons/volta-prism.css";
  import "@vonagevolta/volta2/dist/css/addons/volta-flatpickr.min.css";
  import "@vonagevolta/volta2/dist/css/volta-templates.css";
  import VoltaIcons from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";

  export default {
    name: "app",
    components: {
      ReportsAPI
    },
    data() {
      return {
        VoltaIcons
      };
    }
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .small_logo {
    position: absolute;
    width: 10%;
    left: 5%;
    top: 5%;
  }

  .big_logo {
    position: absolute;
    height: 100%;
    right: 0px;
    top: 0px;
    bottom: 0px;
  }

  .vcard {
    position: absolute;
    left: 5%;
    top: 12%;
    width: 30%;
    background: #ffffff;
    border: 1px solid #e1e2e6;
    box-sizing: border-box;
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
  }
</style>
