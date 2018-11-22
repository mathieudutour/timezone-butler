<div align="center">
<img alt="Timezone Butler" height="128" width="128" src="https://user-images.githubusercontent.com/3254314/48670329-e7bfa980-eb0d-11e8-8449-d4370d6d1e9f.png" align="center" />

<h1>Meet your new Timezone Butler</h1>
<p>
  A Slack butler who will take care of the timezone differences in your team.
</p>
<div>&nbsp;</div>
<a href="/slack-direct-install">
  <img
      alt="Add to Slack"
      height="40"
      width="139"
      src="https://platform.slack-edge.com/img/add_to_slack@2x.png"  />
</a>
<div>&nbsp;</div>
<div>&nbsp;</div>
<img src="https://user-images.githubusercontent.com/3254314/48909801-82055180-ee6e-11e8-904c-c4713900a46c.png" alt="Timezone Butler demo" />

</div>
<div height="100px">&nbsp;</div><div height="100px">&nbsp;</div>

## Installation

Click on the button below:

<a href="/slack-direct-install">
  <img
      alt="Add to Slack"
      height="40"
      width="139"
      src="https://platform.slack-edge.com/img/add_to_slack@2x.png" />
</a>

## Contributing

- Fork the repo
- Clone the repo
- Install the dependency:
  ```bash
  npm install
  npm install -g ngrok
  ```
- Copy `.env.example` to `.env` and replace the environment variables (you will need to [create a new slack app](https://api.slack.com/apps))
- Start the server
  ```bash
  npm run dev
  ```
- expose your server to the internet
  ```bash
  ngrok http 3000
  ```

## License

ISC (like MIT but simpler)
