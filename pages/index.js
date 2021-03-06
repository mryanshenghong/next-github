import React from 'react'
import { connect } from 'react-redux'
import Router,{ withRouter } from 'next/router'
import getConfig from 'next/config'
import { useEffect } from 'react'
import { Button, Icon, Tabs } from 'antd'
import Repo from '../components/repo'
import { cacheArr } from '../lib/repo-basic-cache'
import LRU from 'lru-cache'

const { publicRuntimeConfig } = getConfig()
const api = require('../lib/api')

let localUserRepos, localUserStaredRepos
const isServer = typeof window === 'undefined'
const cache = new LRU({
  maxAge: 1000 * 60 * 10
})
function Home({ userRepos, userStaredRepos, user, router }) {
  

  // 记录 Tabs 当前激活的Tabpane
  const tabkey = router.query.key || '1'
  const handleTabChange = (activeKey) => {
      Router.push(`/?key=${activeKey}`)
  }

  useEffect( () =>{
    if(!isServer){
      // localUserRepos = userRepos
      // localUserStaredRepos = userStaredRepos
      if(userRepos){
        // cache.set('userRepos', userRepos)
        cacheArr(userRepos)
      }
      if(userStaredRepos){
        // cache.set('userStaredRepos',userStaredRepos)
        cacheArr(userStaredRepos)
      }
     }
  },[userRepos,userStaredRepos])

  if (!user || !user.id) {
    return (
      <div className="root">
        <p>未登录</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>点击登陆</Button>
        <style jsx>{`
        .root{
          height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }  
      `}</style>
      </div>
    )
  }
  return (
    <div className="root">
      <div className="user-info">
        <img className="avatar" src={user.avatar_url} alt="user-avatar" />
        <span className="login">{user.login}</span>
        <span className="user">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <Icon type="mail" style={{ marginRight: 10 }}></Icon>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className="user-repos">

        <Tabs defaultActiveKey={tabkey} onChange={handleTabChange} animated={false}>
          <Tabs.TabPane tab="你的仓库" key="1">
            {
              userRepos.map(repo => <Repo key={repo.id} repo={repo} />)
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="关注的仓库" key="2">
            {
              userStaredRepos.map(repo => <Repo key={repo.id} repo={repo} />)
            }
          </Tabs.TabPane>          
        </Tabs>
      </div>
      <style jsx>{`
        .root{
          display: flex;
          align-items: flex-start;
          padding: 20px 0;
        } 
        .user-info{
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login{
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name{
          font-size: 16px;
          color: #777;
        }
        .bio{
          margin-top: 20px;
          color: #333;
        }
        .avatar{
          width: 100%;
          border-radius: 5px;
        }
        .user-repos{
          flex-grow: 1;
        }
      `}</style>
    </div>
  )
}


Home.getInitialProps = async ({ ctx, reduxStore }) => {



  const user = reduxStore.getState().user
  if (!user || !user.id) {
    return { isLogin: false }
  }

if(!isServer){
  if( cache.get('userRepos') && cache.get('userStaredRepos')) {
    return {
      userRepos: cache.get('userRepos'),
      userStaredRepos: cache.get('userStaredRepos') 
    }
  }
}

  const userReposRes = await api.request({
    url: "/user/repos"
  }, ctx.req, ctx.res)

  const userStaredReposRes = await api.request({
    url: "/user/starred"
  }, ctx.req, ctx.res)



  return {
    isLogin: true,
    userRepos: userReposRes.data,
    userStaredRepos: userStaredReposRes.data
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default withRouter(connect(mapStateToProps)(Home))
