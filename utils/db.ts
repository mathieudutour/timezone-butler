import { MongoClient } from 'mongodb'
import { getUsers } from './slack-request'

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/${process.env.MONGO_DB}?retryWrites=true`

const getClient = () =>
  MongoClient.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

export type Team = {
  teamId: string
  teamName: string
  token: string
  botId: string
}

export const getTeams = async () => {
  const client = await getClient()
  const collection = client.db().collection('teams')

  let teams: Team[] = []
  try {
    teams = await collection.find().toArray()
  } catch (err) {
    console.log(err)
  }

  await client.close()
  return teams
}

export const getTeam = async (teamId: string) => {
  const client = await getClient()
  const collection = client.db().collection('teams')

  let team: Team | null = null
  try {
    team = await collection.findOne({ teamId })
  } catch (err) {
    console.log(err)
  }

  await client.close()

  if (team) {
    return getUsers(team.token, team.botId)
  }

  return null
}

export const addTeam = async (body: {
  access_token: string
  bot_user_id: string
  team: { id: string; name: string }
}) => {
  const client = await getClient()
  const collection = client.db().collection('teams')

  const team: Team = {
    teamId: body.team.id,
    teamName: body.team.name,
    token: body.access_token,
    botId: body.bot_user_id,
  }

  await collection.updateOne(
    { teamId: body.team.id },
    { $set: team },
    { upsert: true }
  )

  await client.close()

  return team
}

export const removeTeam = async (teamId: string) => {
  const client = await getClient()
  const collection = client.db().collection('teams')

  await collection.deleteOne({ teamId })

  await client.close()
}
