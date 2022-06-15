const router = require("express").Router();


let id = 1;
const allTasks = {
  priyansh123: [
    {
      id: 1,
      username:'priyansh123',
      name: "Test",
      stage: 0,
      priority: "High",
      deadline: new Date().toDateString(),
    },
  ],
};

router.post("/summary", async (req, res) => {
  const { username } = req.body;
  // check if user is present in the database (here we are storing in a variable for temp purpose)

  const userTaskList = allTasks[username];
  const summary = [
    { title: "Completed", value: 0 },
    { title: "Pending", value: 0 },
  ];
  if (userTaskList) {
    const completed = userTaskList.filter((obj) => obj.stage == 3);
    summary[0].value = completed.length;
    summary[1].value = userTaskList.length - completed.length;
    return res.status(200).send(summary);
  } else {
    summary[0].value = 0;
    summary[1].value = 0;
    return res.status(200).send(summary);
  }
});

router.post("/getAllTasks", async (req, res) => {
    console.log(req.body)
  const {  username} = req.body;
 

  try {
    
    const user = allTasks[username];
      if(user){
        return res.status(200).send(user);
      }
     else{ return res.status(200).send([]);}
   

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});














router.post("/createTask", async (req, res) => {
    console.log(req.body)
  const {  username} = req.body;
 

  try {
    
        id = id+1
        req.body.id = id
       allTasks[username]? allTasks[username].push(req.body):(allTasks[username]=[req.body])
      return res.status(200).send(req.body);
   

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.post("/editTask", async (req, res) => {
    console.log(req.body)
  const {username,taskId,obj} = req.body;
 

  try {
      const user = allTasks[username];
      if(user){
      const filtered= user.filter((item)=>item.id!==taskId);
     filtered.push(obj);
     allTasks[username]=filtered;
     return res.status(200).send({filtered,message:'task Edited succussfully'});
      }
      return res.status(200).send('task not found');

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.post("/deleteTask", async (req, res) => {
    console.log(req.body)
  const {username,taskId} = req.body;
  try {
      const user = allTasks[username];
      if(user){
      const filtered= user.filter((item)=>item.id!==taskId);
     allTasks[username]=filtered;
     return res.status(200).send({filtered,message:'task deleted successfully'});
      }
      return res.status(200).send('task not found');

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



module.exports = router;
