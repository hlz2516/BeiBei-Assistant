import Mock from "mockjs";

let Result = {
    status: 200,
    msg: "OK",
    data: null,
  };

  
  Mock.mock('/api/new','post',(data)=>{
    console.log('received',data);
    return Result
  })

  Mock.mock('/api/alltags','get',(data)=>{
    Result.data = ['html','css']
    return Result
  })

  Mock.mock('/api/checkname','get',(data)=>{
    Result.data = false
    return Result
  })