const axios = require('axios')
const github_base_url = 'https://api.github.com'
const { requestGithub } = require('../lib/api')

module.exports = server => {
    server.use( async (ctx,next) => {
        const path = ctx.path
        const method = ctx.method
        if(path.startsWith('/github/')){
            const session = ctx.session
            const githubAuth = session && session.githubAuth
            const headers = {}
            if(githubAuth && githubAuth.access_token){
                headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
            }            
            const res = await requestGithub(method,ctx.url.replace('/github/','/'), {} ,headers)

            ctx.status = res.status
            ctx.body = res.data
        }else{
            await next()
        }
    })
}