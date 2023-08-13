const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
let database = null;
const initializeDbAndServer = async () => {
  try {
      database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } 
  catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
const hastwo=(query1)=>{
  return (query1.status!==undefined && query1.priority!==undefined)
}
const hasstatus=(query1)=>{
  return query1.status!==undefined 
}
const haspriority=(query1)=>{
  return query1.priority!==undefined
}
app.get("/todos/",async(request,response)=>{
  let data=null;
  let getquery=""
  const {status,priority,search_q=""}=request.query
  switch(true){
    case hastwo(request.query):
      getquery=`select * from todo where todo like '%${search_q}%' and status='${status}' and priority='${priority}'`
      break
    case hasstatus(request.query):
      getquery=`select * from todo where todo like '%${search-q}%' and status='${status}';`
      break
    case haspriority(request.query):
      getquery=`select * from todo where todo like '%${search_q}%' and  priority='${priority}'`
      break
    default:
      getquery=`select * from todo where todo like '%${search_q}%'`
  }
  data=await database.all(getquery)
  response.send(data)
})
app.get("/todos/:todoId",async(request,response)=>{
  const {todoId}=request.params;
  const query1=`select * from todo where id=${todoId}`
  const res=await database.get(query1);
  response.send(res)
})
app.post("/todos/",async(request,response)=>{
  
  const {id,todo,priority,status}=request.body
  const query2=`insert into todo (id,todo,priority,status) values ('${id}','${todo}','${priority}','${status}')`
  await database.run(query2);
  response.send("Todo Successfully Added")
})

app.delete("/todos/:todoId",async(request,response)=>{
  const {todoId}=request.params;
  const query4=`delete from todo where id=${todoId}`
  await database.run(query4);
  response.send("Todo Deleted")
})
module.exports=app;
