import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd'
import { useState, useCallback, forwardRef } from 'react'
import Container from './container'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import * as userActionCreator from '../store/user/userActionCreactor'
import axios from 'axios'
import { withRouter, Router } from 'next/router'
import Link from 'next/link'
const { Header, Content, Footer } = Layout
const { publicRuntimeConfig } = getConfig()

const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20
}

const footerStyle ={
    textAlign:'center'
}

const MyIcon = forwardRef( (props,ref) => <Icon ref={props.ref} type="github" style={githubIconStyle}></Icon>  )
function MyLayout ({ children, user, logout, router }) {
    const urlQuery = router.query && router.query.query
    const [search, setSearch] = useState( urlQuery ||'')
    const handleSearchChange = useCallback((event) => {
        setSearch(event.target.value)
    }, [])

    const handleOnSearch = useCallback( () => {
        router.push(`/search?query=${search}`)
    }, [search])

    const handleLogout = useCallback( () => {
        logout()
    },[logout])

    const handleGoToOauth = useCallback( (e) => {
        e.preventDefault()
        axios.get(`/prepare-auth?url=${router.asPath}`).then( res => {
            if(res.status === 200){
                location.href = publicRuntimeConfig.OAUTH_URL
            }else{
                console.log('prepare auth failed',res)
            }
        }).catch( err => {
            console.log(err)
        })
    },[])
    const userDropDwon = (
        <Menu>
            <Menu.Item>
                <a onClick={handleLogout}>登出</a>
            </Menu.Item>
        </Menu>
    )
    return (
        <Layout>
            <Header>
                <Container renderer={ <div className="header-inner" />}>
                    <div className="header-left">
                        <div className="Logo">
                            <Link href="/" >
                                <MyIcon />
                            </Link>
                        </div>
                        <div>
                            <Input.Search
                                placeholder="搜索仓库"
                                value={search}
                                onChange={handleSearchChange}
                                onSearch={handleOnSearch}
                            />
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user">
                            {
                                user && user.id ? (
                                    <Dropdown overlay={userDropDwon}>
                                        <a href="/">
                                                <Avatar size={40} src={user.avatar_url}></Avatar>
                                        </a>                                    
                                    </Dropdown>
                                ): ( 
                                    <Tooltip title="点击登录">
                                        <a href={`/prepare-auth?url=${router.asPath}`}>
                                            <Avatar size={40} icon="user"></Avatar>
                                        </a>                                        
                                    </Tooltip>                               
                                )
                            }
                        </div>                          
                    </div>                    
                </Container>
            </Header>
            <Content >
                <Container>{children}</Container>
            </Content>
            <Footer style={footerStyle}>
                Developer By Shenghong Yan @
                <a href="mailto:mryanshenghong@gmail.com">mryanshenghong@gmail.com</a>
            </Footer>
            <style jsx>{`
                .header-inner{
                    display:flex;
                    justify-content:space-between;
                }
                .header-left{
                    display:flex;
                    justify-content:space-between;
                }
                `}</style>
            <style jsx global>{`
                    #__next{
                        height:100%;
                    }
                    .ant-layout{
                        min-height: 100%;
                    }
                    .ant-layout-header{
                        padding-left: 0;
                        padding-right:0;  
                    }
                    .ant-layout-content{
                        background: #fff;
                    }
            `}</style>
        </Layout>
    )
}

const mapStateToProps = (state) => {
	return {
		user : state.user
	}
}

const mapDispatchToProps = (dispatch) =>{
    return {
        logout(){
            dispatch(userActionCreator.logout())
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(MyLayout))
