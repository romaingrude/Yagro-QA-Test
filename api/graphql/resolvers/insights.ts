import insightsDB from '../../db/insights.json'

const insights = insightsDB.insights

export default {
  Insight: {
    businessGroup: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.businessGroupId)
    },
  },
  Query: {
    getInsights: (_, { businessGroupId }) => {
      let filteredInsights = insights
      if (businessGroupId)
        filteredInsights = filteredInsights.filter(f => f.businessGroupId == businessGroupId)
      return filteredInsights
    },
  },
}
