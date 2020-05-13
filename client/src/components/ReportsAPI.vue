<template>
  <div class="inputstyle">
    <h3>OpenTok Insights API Client</h3>
    <vlt-field big>
      <vlt-input class="input-field" id="api-key" label="Project API Key" :val="apiKey" v-model="apiKey" />
    </vlt-field>
    <vlt-field big>
      <vlt-input class="input-field" id="api-secret" label="Project API Secret" :val="apiSecret" v-model="apiSecret" />
    </vlt-field>
    <div class="time">
      <vlt-input class="input-field" id="start-date" placeholder="Start Date" style="width: 48%" v-model="startDate" />
      <vlt-input class="input-field" id="end-date" placeholder="End Date" style="width: 48%" v-model="endDate" />
    </div>
    <h3 class="input-field" v-if="status === 'GENERATING'">Generating report, please wait...</h3>
    <vlt-button v-else id="next-button" v-on:click="generateReport" class="vltb">
      Generate Report
    </vlt-button>
  </div>
</template>

<script >
  import { VltField, VltInput, VltButton } from "@vonagevolta/vue";

  // import Datepicker from "vuejs-datepicker";
  import * as flatpickr from "@vonagevolta/volta2/js/addons/volta-flatpickr.js";
  import fecha from "fecha";

  function originApiUrl() {
    let url = location.origin;
    if (process.env.NODE_ENV === "development") {
        url = 'http://localhost:3000'; 
    }
    return url;
  }; 
  
  function initialState() {
    return {
      apiServer: originApiUrl(),
      apiKey: "",
      apiSecret: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "REPORT"
    };
  }

  export default {
    name: "ReportsAPI",
    props: {
      msg: String
    },
    components: {
      VltField,
      VltInput,
      VltButton
    },
    data: function() {
      return initialState();
    },
    methods: {
      async generateReport() {
        if (!this.apiKey || !this.apiSecret) {
          this.$swal("Must fill all the details!");
          return;
        }

        let body = {
          api_key: this.apiKey,
          api_secret: this.apiSecret,
          date_start: (new Date(this.startDate).getTime() / 1000).toFixed(),
          date_end: (new Date(this.endDate).getTime() / 1000).toFixed()
        };

        this.status = "GENERATING";

        var vm = this;
        try {
          const response = await this.axios.post(
            this.apiServer + "/report",
            body
          );
          if (response.status === 200) {
            vm.handleReport(response);
          } else {
            vm.$swal(`Error: ${JSON.stringify(response)}`);
          }
        } catch (err) {
          vm.$swal(err.toString());
          this.resetWindow();
        }
      },
      handleReport(response) {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "report.csv");
        document.body.appendChild(fileLink);

        fileLink.click();
        this.resetWindow();
      },
      resetWindow: function() {
        Object.assign(this.$data, initialState());
      }
    },
    mounted() {
      flatpickr("#start-date", { dateFormat: "d M Y" });
      flatpickr("#end-date", { dateFormat: "d M Y" });
    }
  };
</script>

<style scoped>
  .inputstyle {
    align-items: flex-start;
    margin: auto;
    padding: 48px;
  }

  .input-field {
    margin-top: 5%;
  }

  h3 {
    display: flex;
    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    line-height: 26px;
  }

  .vltb {
    display: flex;
    margin-top: 32px;
    width: 189px;
    height: 48px;

    border-radius: 6px;

    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
    background: #131415;
  }

  .time {
    display: flex;
    padding-top: 16px;
    justify-content: space-between;
  }
</style>
