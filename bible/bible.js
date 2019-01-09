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
   computed: {
      dayOfYear: function() {
         var dt = new Date();

         return (Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) - Date.UTC(dt.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
      }
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
                  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  var today = new Date();
                  var todayNdx = me.plan.findIndex((row) => row.date === (months[today.getMonth()] + " " + ("0"+today.getDate()).slice(-2)));
                  var unreadNdx = me.plan.findIndex((row) => !row.isRead)+1;
                  var $table = document.querySelector("table");
                  var rowTop;

                  // If we are in a stacked table then there is no header, else account for it.
                  if (!document.querySelector(".b-table-stacked-sm")) {
                     unreadNdx++;
                  }
                  rowTop = $table.rows[unreadNdx].offsetTop;

                  // Highlight today. Add 1 because nth-child is 1-based.
                  document.querySelector(`tr:nth-child(${todayNdx+1})`).className = "table-info";

                  // Scroll to today
                  document.querySelector("html").scrollTop = (rowTop + $table.offsetTop);

               }, 2000); // TODO there has to be a better way
            });
      }
   }
});
