import React from 'react';

export default class FitbitOAuth extends React.Component {

  constructor() {
    super();

    this.state = { modalOpened: false };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(prevState => ({ modalOpened: !prevState.modalOpened }));
  }

  authorizationCode() {
    console.log('Connect to Fitbit authorization server')

    const url = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22BY92&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Faccount&scope=activity%20profile&expires_in=604800'
    window.open(url, "_self")
  }

  async body(authCode) {
    var details = {
        'clientId': '22BY92',
        'grant_type': 'authorization_code',
        'redirect_uri': 'http://localhost:3000/account',
        'code': authCode,
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody
  }

  // Reaches out to fitbit API with authorization code to get access and refresh token
  async tokens(authCode) {
    const base64 = require('base-64')
    console.info('fitbit oauth api called')

    const formBody = await this.body(authCode)
 
    let d = {}
    console.info('fetching tokens...')
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + base64.encode('22BY92:59248fdc4ed1ba0916ba6bb51ff7694a'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    })

    const data = (await response).json()
    if (!response.ok) {
      const error = (await data)
      if (error.error) {
        throw new Error(error.error)
      }
      throw error
    }

    const text = await data

    return await text
  }
}