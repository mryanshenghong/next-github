const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const Next = require('next')
const RedisSessionStore = require('./server/session-store')
const Redis = require('ioredis')
const auth = require('./server/auth')
const api = require('./server/api')
const atob = require('atob')

//设置nodejs 全局增加一个atob方法
global.atob = atob
// const koaBody = require('koa-body')

const dev = process.env.NODE_ENV !== 'production'
// 处理运行状态 
const app = Next({ dev });
const handle = app.getRequestHandler();

//创建redis client
const redis = new Redis()
// const redis = new Redis();
app.prepare().then( () => {
	const server = new Koa()
	const router = new Router()

	//设置一个字符串给server加密
	server.keys = ['Who is your daddy']
	const SEESION_CONFIG = {
		key: 'id',
		//redis 实现koa-session 保存session信息 cookies里面的信息只是一个标志信息用于获取redis里面的session信息
		store: new RedisSessionStore(redis),
		//设置session的过期时间
		// maxAge: 60*1000
	}


	//发送的post 请求可以通过ctx.req.body 获取
	// server.use(koaBody)
	
	server.use(session(SEESION_CONFIG,server))
	//配置处理github auth 登陆
	auth(server)
	api(server)
	router.get('/api/user/info', async ctx => {
		const user = ctx.session.userInfo
		if(!user){
			ctx.status = 401
			ctx.body = 'Need Login'
		}else{
			ctx.body = user
			ctx.set('Content-Type','application/json')
		}
	})
	server.use(router.routes())
	server.use(async (ctx,next) => {
		ctx.req.session = ctx.session
		await handle(ctx.req,ctx.res)
		ctx.respond = false;
	})
	server.listen(3000, () => {
		console.log('koa server listening on 3000')
	})
})