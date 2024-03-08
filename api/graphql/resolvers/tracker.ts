import budgetsDB from '../../db/budgets.json'
import contractsDB from '../../db/contracts.json'
import monthlyCostsDB from '../../db/crop_monthly_costs.json'
import salesDB from '../../db/sales.json'
import trackerVarietiesDB from '../../db/tracker_varieties.json'
import commoditiesDB from '../../db/commodities.json'
import alertsDB from '../../db/alerts.json'

const budgets = budgetsDB.budgets
const cropMonthlyCosts = monthlyCostsDB.cropMonthlyCosts
const trackerVarietiesData = trackerVarietiesDB.trackerVarieties
const contractsData = contractsDB.contracts
const salesData = salesDB.sales
const commodityData = commoditiesDB.commodities
const marketAlerts = alertsDB.alerts

export default {
  Alert: {
    commodityProduct: (parent, _, { dataSources }) => {
      return dataSources.ProductsAPI.getCommodityProductByTicker(parent.commodityProductTicker)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
  },
  Budget: {
    crop: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getCropById(parent.cropId)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
  },
  Commodity: {
    product: (parent, _, { dataSources }) => {
      return dataSources.ProductsAPI.getCommodityProductByTicker(parent.symbol)
    },
  },
  Contract: {
    crop: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getCropById(parent.cropId)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
    remainingQuantity: (parent) => {
      const linkedSales = salesData.filter(f => f.contractNumber == parent.contractNumber).map(m => m.quantity)
      const totalSalesQuantity = linkedSales.reduce((curr, inc) => curr + inc, 0)
      return parent.contractQuantity - totalSalesQuantity
    },
    variety: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getVarietyById(parent.varietyId)
    },
  },
  Query: {
    getAlerts: (_, { groupId, commodityTicker }) => {
      let matchedAlerts = marketAlerts
      if (groupId)
        matchedAlerts = matchedAlerts.filter(f => f.groupId == groupId)
      if (commodityTicker)
        matchedAlerts = matchedAlerts.filter(f => f.commodityProductTicker === commodityTicker)
      return { objects: matchedAlerts }
    },

    getAvailableCommodities: () => {
      const tickers = commodityData.map(c => c.symbol)
      return new Set([...tickers])
    },

    getBudgets: (_, { filters }) => {
      let matchedBudgets = budgets
      if (filters.groupId)
        matchedBudgets = matchedBudgets.filter(f => f.groupId == filters.groupId)
      if (filters.year)
        matchedBudgets = matchedBudgets.filter(f => f.year == filters.year)
      if (filters.cropId)
        matchedBudgets = matchedBudgets.filter(f => f.cropId == filters.cropId)
      return { objects: matchedBudgets, pageInfo: { pageNumber: 1 } }
    },

    getCommodityData: (_, { ticker }, { dataSources }) => {
      let matchedCommodities = commodityData
      if (ticker)
        matchedCommodities = matchedCommodities.filter(f => f.symbol == ticker)
      const product = dataSources.ProductsAPI.getCommodityProductByTicker(ticker)
      return { objects: matchedCommodities, product }
    },

    getContracts: (_, { filters }) => {
      let matchedContracts = contractsData
      if (filters.groupId)
        matchedContracts = matchedContracts.filter(f => f.groupId == filters.groupId)
      if (filters.year)
        matchedContracts = matchedContracts.filter(f => f.year == filters.year)
      if (filters.cropId)
        matchedContracts = matchedContracts.filter(f => f.cropId == filters.cropId)
      return { contracts: matchedContracts }
    },

    getSales: (_, { filters }) => {
      let matchedSales = salesData
      if (filters.groupId)
        matchedSales = matchedSales.filter(f => f.groupId == filters.groupId)
      if (filters.year)
        matchedSales = matchedSales.filter(f => f.year == filters.year)
      if (filters.cropId)
        matchedSales = matchedSales.filter(f => f.cropId == filters.cropId)
      return { sales: matchedSales }
    },

    getTrackerContracts: (_, { filters }) => {
      let matchedContracts = contractsData

      if (filters.groupId)
        matchedContracts = matchedContracts.filter(f => f.groupId == filters.groupId)
      if (filters.year) {
        matchedContracts = matchedContracts.filter((f) => {
          return filters.year - 4 < f.year && f.year <= filters.year
        })
      }
      if (filters.cropId)
        matchedContracts = matchedContracts.filter(f => f.cropId == filters.cropId)
      return { contracts: matchedContracts }
    },

    getTrackerMonthlyCosts: (_, { filters }) => {
      let matchedCosts = cropMonthlyCosts
      if (filters.groupId)
        matchedCosts = matchedCosts.filter(f => f.groupId == filters.groupId)
      if (filters.year) {
        matchedCosts = matchedCosts.filter((f) => {
          return filters.year - 4 < f.year && f.year <= filters.year
        })
      }
      if (filters.cropId)
        matchedCosts = matchedCosts.filter(f => f.cropId == filters.cropId)
      let matchedBudgets = budgets
      if (filters.groupId)
        matchedBudgets = matchedBudgets.filter(f => f.groupId == filters.groupId)
      if (filters.year)
        matchedBudgets = matchedBudgets.filter(f => f.year == filters.year)
      if (filters.cropId)
        matchedBudgets = matchedBudgets.filter(f => f.cropId == filters.cropId)
      return { budgets: matchedBudgets, costs: matchedCosts }
    },

    getTrackerSales: (_, { filters }) => {
      let matchedSales = salesData
      if (filters.year) {
        matchedSales = matchedSales.filter((f) => {
          return filters.year - 4 < f.year && f.year <= filters.year
        })
      }
      if (filters.cropId)
        matchedSales = matchedSales.filter(f => f.cropId == filters.cropId)
      return { sales: matchedSales }
    },

    getTrackerVarietyPerformances: (_, { filters }, { dataSources }) => {
      let matchedVarieties = trackerVarietiesData
      if (filters.groupId)
        matchedVarieties = matchedVarieties.filter(f => f.groupId == filters.groupId)
      if (filters.year)
        matchedVarieties = matchedVarieties.filter(f => f.year == filters.year)
      if (filters.cropId) {
        matchedVarieties = matchedVarieties.filter(
          f => dataSources.AnalyticsAPI.getVarietyById(f.varietyId).cropId == filters.cropId,
        )
      }
      return { objects: matchedVarieties }
    },
  },
  Sale: {
    crop: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getCropById(parent.cropId)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
    variety: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getVarietyById(parent.varietyId)
    },
  },
  TrackerCropPerformance: {
    crop: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getCropById(parent.cropId)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
  },
  TrackerMonthlyCosts: {
    crop: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getCropById(parent.cropId)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
  },
  TrackerVarietyPerformance: {
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
    variety: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getVarietyById(parent.varietyId)
    },
  },
}
