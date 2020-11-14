const { scheduler } = require("dhtmlx-scheduler");

   


function calendar(){
let dp=new dataProcessor("/calendar");
dp.init(scheduler);
dp.setTransactionMode("JSON", false);
  
  
}


    module.exports=calendar();