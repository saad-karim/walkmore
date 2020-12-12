import React from 'react';
import FitbitOAuth from './oauth'

export class API extends React.Component {
  constructor(props) {
    super(props);

    this.tokens = {}
    this.getAuthToken = this.getAuthToken.bind(this)
  }

  async getAuthToken(code) {
    this.tokens = await FitbitOAuth.prototype.tokens(code)
  }

  async getSteps() {
    const authTokens = await this.tokens
    fetch('https://api.fitbit.com/1/user/-/activities/steps/date/2020-12-05/1d.json', {
      headers: {
        Authorization: `${authTokens.token_type} ${authTokens.access_token}`,
      }
    })
    .then(response => response.json())
    .then((data) => {
      console.log('data: ', data['activities-steps'][0])
    })
    .catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <div>
        <h1>Connect to Fitbit</h1>
        <button onClick={FitbitOAuth.prototype.authorizationCode}>Fibtit</button>
      </div>
    )
  }
}
