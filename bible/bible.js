const planBlob = "7297f5a9-12b6-11e9-998c-9dd8bcb68a80";
const bibleUrl = "https://www.biblegateway.com/passage/?version=NIV&search=";

var vm = new Vue({
   el: "#app",
   data: {
      fields: [
         { key: "isRead", label: "Read" },
         { key: "date" },
         { key: "ot1", label: "Old Testament 1" },
         { key: "nt1", label: "New Testament" },
         { key: "ot2", label: "Old Testament 2" }
      ],
      plan: []
   },
   created() {
      this.populate();
   },
   methods: {
      onRowClicked(record, index) {
         window.open(`${bibleUrl}${record.ot1};${record.nt1};${record.ot2}`);
      },
      saveBlob() {
         const me = this;

         setTimeout(function() {
            const blob = JSON.stringify(me.plan);

            axios({
               url: `https://jsonblob.com/api/jsonBlob/${planBlob}`,
               method: "PUT",
               data: blob,
               headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
               }
            })
         }, 250);

      },
      populate() {
         const me = this;

         axios.get(`https://jsonblob.com/api/jsonBlob/${planBlob}`)
            .then((response) => {
               // Save
               me.plan = response.data;

               // Wait for the plan to be drawn and then find the first unread row
               setTimeout(function() {
                  var unreadNdx;
                  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  var today = new Date();
                  var todayNdx = me.plan.findIndex((row) => row.date === (months[today.getMonth()] + " " + ("0"+today.getDate()).slice(-2)));
                  var top;

                  me.plan[todayNdx]._rowVariant = "info";

                  // Force _rowVariant to apply
                  me.$forceUpdate();

                  // The whole document scrolls so use "html". Do this after $forceUpdate.
                  unreadNdx = me.plan.findIndex((row) => !row.isRead)+1; // Add 1 to account for header
                  top = document.getElementsByTagName("table")[0].rows[unreadNdx].offsetTop;

                  document.querySelector("html").scrollTop = top;

               }, 250);
            });
      }
   }
});
