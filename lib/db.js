const { MongoClient } = require('mongodb')

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@${process.env.MONGO_URL}/${process.env.NODE_ENV}?retryWrites=true`

const getClient = () =>
  MongoClient.connect(
    mongoURI,
    { useNewUrlParser: true }
  )

module.exports.getTeams = async () => {
  const client = await getClient()
  const collection = client.db().collection('teams')

  let teams = []
  try {
    teams = await collection.find().toArray()
  } catch (err) {
    console.log(err)
  }

  await client.close()
  return teams
}

module.exports.addTeam = async body => {
  const client = await getClient()
  const collection = client.db().collection('teams')

  const team = {
    teamId: body.team_id,
    teamName: body.team_name,
    token: body.bot.bot_access_token,
    botId: body.bot.bot_user_id,
  }

  await collection.updateOne(
    { teamId: body.team_id },
    { $set: team },
    { upsert: true }
  )

  await client.close()

  return team
}

module.exports.removeTeam = async teamId => {
  const client = await getClient()
  const collection = client.db().collection('teams')

  await collection.deleteOne({ teamId })

  await client.close()
}
