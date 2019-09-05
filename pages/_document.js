/*
* @Author: SHENGHONG YAN
* @Date:   2019-08-27 18:17:06
* @Last Modified by:   SHENGHONG YAN
* @Last Modified time: 2019-08-27 19:11:31
*/
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStylesheet } from 'styled-components' 
class MyDocument extends Document {
	static async getInitProps(ctx){
		const originalRenderPage = ctx.renderPage;
		const sheet = new ServerStylesheet()
		try{
			ctx.renderPage = () => 
			originalRenderPage({
				enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
			})
			const props = await Document.getInitProps(ctx);	
			return {
				...props,
				styles:(
					<>
					{props.styles}{sheet.getStyleElement()}
					</>
				)
			}					
		} finally{
			sheet.seal();
		}	
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