/*
* @Author: SHENGHONG YAN
* @Date:   2019-08-26 21:33:14
* @Last Modified by:   SHENGHONG YAN
* @Last Modified time: 2019-08-26 21:50:51
*/
const Redis = require('ioredis');

//创建一个redis client 实例
const redis = new Redis({
	port: 6379,
	// password:'',
	// host: '127.0.0.1'
})

// redis 的方法都是 promise对象

redis.set('a').then( (res) => {
	console.log(res);
}).catch( err =>{
	console.log(err);
})

redis.get('a').then( (res) => {
	console.log(res);
}).catch( err =>{
	console.log(err);
})

redis.keys('*').then((res)=>{
	console.log(res);
}).catch( err => {
	console.log(err);
})

redis.setex('c',10,1).then( (res)=> {
	console.log(res);
})


