import Mock from 'mockjs'

const result = {
  status: 200,
  data:null,
  msg:'OK'
}

// Mock.mock('/api/login', 'post', (req)=>{
//   const data = JSON.parse(req.body)
//   result.data = {
//     id:3,
//     name:data.username,
//     sessionid:'dfs25d4fdg54q3rl'
//   }
// })
