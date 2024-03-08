export default {
  Query: {
    getGroups: (_, __, { dataSources }) => {
      return dataSources.BusinessAPI.getGroups()
    },
  },
}
