# 把现在流行的前端SPA单页面应用，解决首页加载慢的问题(优化首屏的性能)，并且优化除了Google以外的搜索引擎的SEO优化

# NextJs 同构服务端渲染
	./sever.js
	const Next = require('next');
	const dev = process.env.NODE_ENV !== 'production';
	// 处理运行状态 
	const app = Next({ dev });
	app.prepare().then( ()=> {
		//使用Koa 框架完成对异步请求以及返回的统一处理
	})
# Koa 提供数据接口和服务端路由
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
	页面请求
	开始 => 浏览器发起page请求 => koa 接收请求 => nextjs(中间件) 渲染 => 调用app的getInitProps =>渲染最终html => 返回浏览器 => 结束
	组件请求
	客户端路由跳转
	开始 => 点击链接按钮 => 异步加载页面组件js => 调用页面getInitProps => 数据返回,路由变化 => 页面渲染 => 结束
# Redis 提供session储存
	-cookie
		
	-内存数据结构存储(类似于缓存),但是也可以使用redis做持久缓存.
	-key/value 的存储方式 set/get 的设置获取方法
	-支持多种数据结构,不仅仅是string
	- 修改redis 数据库密码 
		win win.redis.conf => requirepass 密码
	- 指定启动端口 
		win redis-cli -p 端口号
	- 输入数据库密码
		win auth 密码
	- 设置一个会过期的数据
		setex var(变量名) 10(过期时间/秒) 1(变量值) 
	- 设置独特的session id 
		set session:sessionId 123
		get section:123
	-获取所有的key 
		KEYs *
	-删除key
		DEL (key name)
	-nodejs 链接redis数据库并且操作数据
# 使用真实 Github API 
OAuth 提供第三方认证体系
	-OAuth的实现流程
	-OAuth安全如何保证
	-结合Github OAuth API用法
	-其他OAuth接入
# React Hooks 大量使用
	-useState
		const [valueName, setValue] = useState(value); //valueName 为自定义
	-useEffect 页面状态更新 useEffect就会执行
		useEffect( () => {
			setValue( val => () {

			})
		})
		useEffect第二参数加上[] 就会和componentDidMount 和 Unmount用法相同
		当数组里面有元素，并且元素在发生变化useEffect才会重新执行
	-useLayoutEffect
		layoutEffect永远在useEffect之前执行
	-useReducer
		function valueReducer(state,action){
			switch(action.type){
				case 'add':
					return state+1
				case 'mins':
					return state-1
				default:
					return state
			}
		}
		利用useReducer
		const [ valueName, dispatchValue ] = useReducer(valueReducer,value);
		dispatchValue({type:'add'},1)
	-useContext
		首先_app 里面要有一个context 组件提供一个变量
		import React from 'react'
		export default React.creactContext('');
		import MyContext from 'context.js'
		<NyContext value="test">
		...
		</MyContext>
		其他组件引用Context
		import MyContext from 'context.js'
		const context = useContext(MyContext)
		<p>{context}</p>
	-useRef
	    const aRef = useRef()
		在函数组件上 < ref = {aRef}></>
# 引入redux
	getInitProps 在页面卸载的时候数据都会删除
	我们需要保存一些数据减少http请求
	action = > reducer => store
		|					|
		<=	     UI			<=
# 集成 antD
	-nextjs 本身不支持css
	-使用css in js方案
	-安装 @zeit/next-css
	-根目录创建 next.config.js
	const WithCss = require('@zeit/next-css');

	if(typeof require !== 'undefined') {
	    require.extensions['.css'] = file => {}
	}

	module.exports = WithCss({})
	-antd 组件按需加载
	-安装插件 babel-plugin-import
	-根目录新建 .babelrc文件
		{
			"presets":["next/babel"],
			"plugins":[
				[
					"import",
					{
						"libraryName":"antd"
					}
				]
			]
		}
	- 重写_app.js
		import App from 'next/app';
		import 'antd/dist/antd.css';
		export default App;	

# NextJs
	-page 页面路由根据page文件夹下的文件生成
	文件夹下的js，每一个js文件代表一个路径下的页面
	path/a => a.js path/b  => b.js
	- .next 默认产生的目录
	编译代码的内容，监听源代码，压缩与优化代码
	- Link 组件  import Link from 'next/link'
	本身不渲染任何内容，需要插入其他标签
	link内只能有一个容器子根节点，Link只会给这个子节点添加onclick跳转事件
	- Router 模块 import Router from 'next/router'
	() => {
		Router.push(path);
	}
	- 动态路由 
	只能使用 query 的方法 ？ value = 1
	获取动态路由的参数
	import { withRouter } from 'next/router'
	export default withRouter(param)
	- 路由映射
	<Link href = "/a?id=1" as="/a/1">...</Link>
	改变路由具体显示的方式，然地址readable

	Router.push({
		pathname:'/a',
		query:{
			id:1,
		}
	},'/a/1')
	刷新页面会显示404
	服务端不知道前端会做了路由映射
	需要koa中间件管理路由路径
	const router = new Router();
	router.get('./a/:id',async (ctx)=> {
		const id = ctx.params.id;
		await handle(ctx.req,ctx.res,{
			pathname:'/a',
			query:{id}
		})
		ctx.response = false;
	})

	server.use(router.routes());
	这样页面刷新，浏览器也能正常加载不会出现404


	- Router 钩子函数
	- getInitProps nextjs数据获取的规范
	挂载在组件上的方法 获取数据 
	完成客户端服务端数据上的同步
	const C = () => <div></div>
	C.getInitProps = async (ctx) => {

		return await {
			name: 'ba'
		}
	}
	只有放在pages里面的组件才会对应自己的getInitProps方法,换句话说只有在路由切换的时候才会触发这个方法

	-自定义 _app.js
	 固定layout
	 保持一些公用的状态
	 给具体页面传递一些自定义数据
	 自定义的错误处理
	import App, { Container } from 'next/app';
	import 'antd/dist/antd.css';

	class MyApp extends App{
		//每次页面切换都会执行这个方法，将数据重新传递给组件重新渲染
		static async getInitProps({Component,ctx}) {
			let  props ;
			//不是每个组件都会有getInitProps
			if(Component.getInitProps){
				props = await Component.getInitProps(ctx);
			}
			return {
				props
			}
		}
		render(){
			const { Component } = this.props;
			return(
				<Container>
					<Component {...props} />
				</Container>
			)
		}
	}

	export default MyApp;
	-自定义document
	只有在服务端渲染的时候才会被调用的组件
	修改服务端渲染的文档内容
	配合第三方css in js 的方案
	import Document, { Html, Head, Main, NextScript } from 'next/document';

	class MyDocument extends Document {
		static async getInitProps(ctx){
			const props = await Document.getInitProps(ctx);
			return {...props}
		}
		render() {
			return(
				<Html>
					<Head>
						<style>
							{ `.box{color:red}`}
						</style>
					</Head>
					<body>
						<Main />
						<NextScript />
					</body>
				</Html>
			)
		}
	}

	export default MyDocument;	
	- 定义样式
	nextjs 默认使用 styleJsx 方案
	组件内样式
	<style jsx>{
		`
			a{
				color:blue;
			}
		`
		}</style>
	全局样式
	<style jsx global>
	-集成第三方 css方案 styled-component
	在自定义MyDocument 的getInitProps方法内
	static async getInitProps(ctx){
		const originalRenderPage = ctx.renderPage;
		const sheet = new ServerStylesheet()
		try{
			ctx.renderPage = () => originalRenderPage({
				enhanceApp: App => (...props) =>sheet.collectStyles(<App {...props}/>),
			})
			const props = await Document.getInitProps(ctx);	
			return {
				...props,
				styles:<>{props.styles}{sheet.getStyleElement()}</>
			}					
		} finally{
			sheet.seal()
		}	
	}

	-lazyLoading nextjs默认情况下都已经做了lazyloading
		异步加载模块
		在模块的getInitProps方法
		const moment = import('moment')
		moment.default()		
		异步加载组件
		在模块中引入
		import dynamic from 'next/dynamic'
		//需要加载的模块
		const Comp = dynamic(import(path))
	-next.config.js
	const withCss = require('@zeit/next-css')
	const config = require('./config')

	const configs = {
	  // 编译文件的输出目录
	  distDir: 'dest',
	  // 是否给每个路由生成Etag
	  generateEtags: true,
	  // 页面内容缓存配置
	  onDemandEntries: {
	    // 内容在内存中缓存的时长（ms）
	    maxInactiveAge: 25 * 1000,
	    // 同时缓存多少个页面
	    pagesBufferLength: 2,
	  },
	  // 在pages目录下那种后缀的文件会被认为是页面
	  pageExtensions: ['jsx', 'js'],
	  // 配置buildId
	  generateBuildId: async () => {
	    if (process.env.YOUR_BUILD_ID) {
	      return process.env.YOUR_BUILD_ID
	    }

	    // 返回null使用默认的unique id
	    return null
	  },
	  // 手动修改webpack config
	  webpack(config, options) {
	    return config
	  },
	  // 修改webpackDevMiddleware配置
	  webpackDevMiddleware: config => {
	    return config
	  },
	  // 可以在页面上通过 procsess.env.customKey 获取 value
	  env: {
	    customKey: 'value',
	  },
	  // 下面两个要通过 'next/config' 来读取
	  // 只有在服务端渲染时才会获取的配置
	  serverRuntimeConfig: {
	    mySecret: 'secret',
	    secondSecret: process.env.SECOND_SECRET,
	  },
	  // 在服务端渲染和客户端渲染都可获取的配置
	  publicRuntimeConfig: {
	    staticFolder: '/static',
	  },
	}

	if (typeof require !== 'undefined') {
	  require.extensions['.css'] = file => {}
	}

	const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
	const SCOPE = 'user'

	module.exports = withCss({
	  publicRuntimeConfig: {
	    GITHUB_OAUTH_URL,
	    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${
	      config.github.client_id
	    }&scope=${SCOPE}`,
	  },
	})

# 本地测试
-安装依赖
npm install
- 修改config.sample.js
client id client secret 在github setting development 里面获取!
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = '' //github client id
module.exports = {
    github:{
        client_id,
        client_secret:'', //github client secret
        request_token_url:'https://github.com/login/oauth/access_token',    
    },
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${
        client_id
    }&scope=${SCOPE}`  
}
- 本地运行
npm run dev
