import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import Loading from '../components/loading'
import 'antd/dist/antd.css'
import Layout from '../components/layout'
import TestHoc from '../lib/with-redux'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'

class MyApp extends App{
	state = {
		loading: false,
	}
	//每次页面切换都会执行这个方法，将数据重新传递给组件重新渲染
	static async getInitialProps(ctx) {
		const { Component } = ctx
		let  pageProps = {} ;
		//不是每个组件都会有getInitProps
		if(Component.getInitialProps){
			pageProps = await Component.getInitialProps(ctx)
		}
		return {
			pageProps
		}
	}

	startLoading =  () => {
		this.setState({
			loading: true
		})
	}

	stopLoading = () => {
		this.setState({
			loading: false
		})
	}
	componentDidMount() {
		Router.events.on('routeChangeStart', this.startLoading)
		Router.events.on('routeChangeComplete', this.stopLoading)
		Router.events.on('routeChangeError', this.stopLoading)
	}

	componentWillUnmount() {
		Router.events.off('routeChangeStart', this.startLoading)
		Router.events.off('routeChangeComplete', this.stopLoading)
		Router.events.off('routeChangeError', this.stopLoading)
	}

	render(){
		const { Component, pageProps, reduxStore } = this.props
		return(
			<>
				<Provider store={reduxStore}>
					{ this.state.loading ? <Loading /> : null}
					<Layout>					
						<Component {...pageProps} />
					</Layout>
				</Provider>		
			</>
		)
	}
}

export default TestHoc(MyApp)