import { GraphQLError } from 'graphql'
import groupsDB from '../../db/groups.json'
import usersDB from '../../db/users.json'

const users = usersDB.users
const groups = groupsDB.groups
// eslint-disable-next-line node/prefer-global/process
const demoPass = process.env.demoPassword

export default {
  Mutation: {
    loginUser: (_, { input }) => {
      const matchedUsers = users.filter(user => user.email === input.email && demoPass === input.password)
      if (matchedUsers.length === 1) {
        const activeGroups = groups.filter(group => group.users.includes(matchedUsers[0].email))
        return {
          auth_token: 'YAGRO_TOKEN',
          group: activeGroups[0],
          refresh_token: 'REFRESH_TOKEN',
          user: matchedUsers[0],
        }
      }
      else {
        throw new GraphQLError('the error message', {

          extensions: {

            code: 'BAD_USER_INPUT',

          },

        })
      }
    },
  },
}
