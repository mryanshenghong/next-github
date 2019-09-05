/*
* @Author: SHENGHONG YAN
* @Date:   2019-08-26 21:45:55
* @Last Modified by:   SHENGHONG YAN
* @Last Modified time: 2019-08-26 21:46:15
*/
/*
* @Author: SHENGHONG YAN
* @Date:   2019-08-26 20:12:17
* @Last Modified by:   SHENGHONG YAN
* @Last Modified time: 2019-08-26 20:49:16
*/
const Koa = require('koa');
const Router = require('koa-router');
const Next = require('next');


const dev = process.env.NODE_ENV !== 'production';
// 处理运行状态 
const app = Next({ dev });
const handle = app.getRequestHandler();

app.prepare().then( () => {
	const server = new Koa();
	const router = new Router();
	
	// 获取地址参数 /test/:id 
	// cxt.params.id
	// router.get('/test',(ctx)=>{
	// 	ctx.body = `<p>${ctx.path}<p>`
	// })
	// ctx 记录请求和返回的内容
	// next 执行下一个中间件 异步调用都是用 async/await 来控制顺序
	// ctx.path 请求路径
	// ctx.method  请求方法



	server.use(async (ctx,next) => {
		await handle(ctx.req,ctx.res);
		ctx.respond = false;
		// await next();
	})

	// server.use(router.routes());
	server.listen(3000, () => {
		console.log('koa server listening on 3000');
	})
})