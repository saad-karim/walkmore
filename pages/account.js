import {API} from '../services/fitbit/api'
import FitbitOAuth from '../services/fitbit/oauth'

export default function handler(req, res) {
  console.log('req: ', req)
  console.log('req.code: ', req.url.query.code)

  let tokens = {}
  if (req.url.query.code) {
    API.prototype.getAuthToken(req.url.query.code)
  }

  function getSteps() {
    API.prototype.getSteps()
  }

  return (
    <div>
        Create Account!
        <API/>
        <div>
            <button onClick={getSteps}>Get Steps</button>
        </div>
    </div>
  )
}