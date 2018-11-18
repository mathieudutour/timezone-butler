const { getTeams } = require('./db')
const slackRequest = require('./slack-request')

module.exports = async () => {
  if (!process.env.SLACK_CLIENT_ID) {
    console.error('missing slack client ID')
    process.exit(1)
  }

  if (!process.env.SLACK_CLIENT_SECRET) {
    console.error('missing slack client secret')
    process.exit(1)
  }

  if (!process.env.MONGO_USER) {
    console.error('missing mongo username')
    process.exit(1)
  }

  if (!process.env.MONGO_PASSWORD) {
    console.error('missing mongo password')
    process.exit(1)
  }

  if (!process.env.MONGO_URL) {
    console.error('missing mongo url')
    process.exit(1)
  }

  const teams = (await getTeams()).reduce((prev, team) => {
    // eslint-disable-next-line no-param-reassign
    prev[team.teamId] = {
      _token: team.token,
    }
    return prev
  }, {})

  const teamIds = Object.keys(teams)

  for (let i = 0; i < teamIds.length; i += 1) {
    const token = teams[teamIds[i]]._token
    teams[teamIds[i]] = await slackRequest.getUsers(token)
  }

  return teams
}
