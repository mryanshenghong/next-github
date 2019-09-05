import withRepoBasic from '../../components/with-repo-basic'
import api from '../../lib/api'
import dynamic from 'next/dynamic'
const  MDRender =  dynamic( 
    () => import ('../../components/markdownRender')
  )

function Detail ({readme}) {

    return (
      <MDRender content={readme.content} isBase64 = {true} />
    )
}

Detail.getInitialProps = async ({
    ctx: {
      query: { owner, name },
      req,
      res,
    },
  }) => {
  
    const readmeResp = await api.request(
      {
        url: `/repos/${owner}/${name}/readme`,
      },
      req,
      res,
    )
  
    return {
      readme: readmeResp.data,
    }
  }

export default withRepoBasic(Detail)