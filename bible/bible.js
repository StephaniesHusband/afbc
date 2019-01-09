const planBlob = "7297f5a9-12b6-11e9-998c-9dd8bcb68a80";
const bibleUrl = "https://www.biblegateway.com/passage/?version=NIV&search=";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var vm = new Vue({
   el: "#app",
   data: {
      isBusy: true,
      fields: [
         { key: "isRead", label: "Read" },
         { key: "date" },
         { key: "ot1", label: "Old Testament 1" },
         { key: "nt1", label: "New Testament" },
         { key: "ot2", label: "Old Testament 2" }
      ],
      plan: []
   },
   computed: {
      dayOfYear: function() {
         var dt = new Date();

         return (Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) - Date.UTC(dt.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
      }
   },
   mounted() {
      this.populate();
   },
   methods: {
      onRowClicked(record, index) {
         window.open(`${bibleUrl}${record.ot1};${record.nt1};${record.ot2}`);
      },
      saveBlob() {
         const me = this;

         Vue.nextTick(async () => {
            const blob = JSON.stringify(me.plan);

            try {
               await axios.put(`https://jsonblob.com/api/jsonBlob/${planBlob}`, blob, {
                  headers: {
                     "Content-Type": "application/json",
                     "Accept": "application/json"
                  }
               })
            }
            catch(e) {
               console.error(e);
            }
         });

      },
      async populate() {
         try {
            const response = await axios.get(`https://jsonblob.com/api/jsonBlob/${planBlob}`);

            // Save
            this.plan = response.data;

            Vue.nextTick(() => {
               const today = new Date();
               const todayNdx = this.plan.findIndex((row) => row.date === (MONTHS[today.getMonth()] + " " + ("0"+today.getDate()).slice(-2)));
               const unreadNdx = this.plan.findIndex((row) => !row.isRead)+1;
               const $table = document.querySelector("table");
               const rowTop = $table.rows[unreadNdx].offsetTop;

               // If we are in a stacked table then there is no header, else account for it.
               if (!document.querySelector(".b-table-stacked-sm")) {
                  unreadNdx++;
               }

               // Highlight today. Add 1 because nth-child is 1-based.
               document.querySelector(`tr:nth-child(${todayNdx+1})`).className = "table-info";

               // Scroll to today
               document.querySelector("html").scrollTop = (rowTop + $table.offsetTop);
            });
         }
         catch(e) {
            this.plan = [];

            console.error(e);
         }
      }
   }
});
