import {API} from '../services/fitbit/api'
import { withRouter } from 'next/router'
import queryString from 'query-string'

class Handler extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { router } = this.props
    if (router.asPath) {
      const parsed = queryString.parseUrl(router.asPath)
      console.log('parsed: ', parsed.query)
      API.prototype.getAuthToken(parsed.query.code)
      router.push('/account', '/account', { shallow: true })
    }
  }

  getSteps() {
    API.prototype.getSteps()
  }

  render() {
    return (
      <div>
          Create Account!
          <API/>
          <div>
              <button onClick={this.getSteps}>Get Steps</button>
          </div>
      </div>
    )
  }
}

export default withRouter(Handler)