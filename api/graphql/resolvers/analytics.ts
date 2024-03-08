import budgetsDB from '../../db/budgets.json'
import cropPerformanceDB from '../../db/crop_performances.json'
import fieldPerformanceDB from '../../db/field_performances.json'
import groupsDB from '../../db/groups.json'
import priceCheckDB from '../../db/price_check.json'
import productsPricesDB from '../../db/product_prices.json'
import trackerCropsDB from '../../db/tracker_crops.json'
import varietyPerformanceDB from '../../db/variety_performances.json'
import virtualGroupsDB from '../../db/virtual_groups.json'
import fieldsComparisonDB from '../../db/fields_comparison.json'

const fieldPerformances = fieldPerformanceDB.fieldPerformances
const cropPerformances = cropPerformanceDB.cropPerformances
const trackerCrops = trackerCropsDB.trackerCrops
const budgets = budgetsDB.budgets
const varietyPerformance = varietyPerformanceDB.varietyPerformances
const virtualGroups = virtualGroupsDB.virtualGroups
const groups = groupsDB.groups
const priceCheckData = priceCheckDB.priceCheckData
const productPriceData = productsPricesDB.productPrices
const fieldsComparisonData = fieldsComparisonDB.fieldsComparison

export default {
  BuyingScore: {
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
    season: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getSeasonById(parent.seasonId)
    },
  },
  CropPerformance: {
    crop: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getCropById(parent.cropId)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
  },
  FieldPerformance: {
    area: (parent, _, { dataSources }) => {
      const field = dataSources.AnalyticsAPI.getFieldById(parent.fieldId)
      return field.area
    },
    field: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getFieldById(parent.fieldId)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
    variety: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getVarietyById(parent.varietyId)
    },
    year: (parent, _, { dataSources }) => {
      const field = dataSources.AnalyticsAPI.getFieldById(parent.fieldId)
      return field.year
    },
  },
  IngredientSummary: {
    ingredient: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getIngredientById(parent.id)
    },
  },
  PricePoint: {
    distributor: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getDistributorById(parent.distributorId)
    },
  },
  ProductPrices: {
    altBrandOpportunity: (parent, _, { dataSources }) => {
      const alternatives = dataSources.ProductsAPI.getProductAlternatives(parent.productId)
      if (!alternatives || alternatives.length == 0)
        return null
      const lowestPricePerUnit = dataSources.AnalyticsAPI.getLowestPricePerUnit(alternatives[0])
      if (!lowestPricePerUnit)
        return 0
      let totalOpportunity = 0
      for (const point of parent.pricePoints) {
        const pricePerUnit = point.spend / point.units
        const difference = pricePerUnit - lowestPricePerUnit
        totalOpportunity += difference * point.units
      }
      return totalOpportunity
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
    lowestPricePerUnit: (parent, __, { dataSources }) => {
      return dataSources.AnalyticsAPI.getLowestPricePerUnit(parent.productId)
    },
    highestPricePerUnit: (parent, __, { dataSources }) => {
      return dataSources.AnalyticsAPI.getHighestPricePerUnit(parent.productId)
    },
    opportunity: (parent, __, { dataSources }) => {
      const lowestPricePerUnit = dataSources.AnalyticsAPI.getLowestPricePerUnit(parent.productId)
      let totalOpportunity = 0
      for (const point of parent.pricePoints) {
        const pricePerUnit = point.spend / point.units
        const difference = pricePerUnit - lowestPricePerUnit
        totalOpportunity += difference * point.units
      }
      return totalOpportunity
    },
    product: (parent, _, { dataSources }) => {
      return dataSources.ProductsAPI.getProductById(parent.productId)
    },
    season: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getSeasonById(parent.seasonId)
    },
    totalSpend: (parent) => {
      return parent.pricePoints.reduce((a, b) => a + b.spend, 0)
    },
    unitsBought: (parent) => {
      return parent.pricePoints.reduce((a, b) => a + b.units, 0)
    },
  },
  ProgrammeApplication: {
    date: (parent) => {
      const parts = parent.date.split('-')
      const mydate = new Date(parts[2], Number.parseInt(parts[1]) - 1, parts[0])
      return mydate.toISOString()
    },
    product: (parent, _, { dataSources }) => {
      return dataSources.ProductsAPI.getProductById(parent.productId)
    },
  },
  Query: {
    getCropPerformance: (_, { filters }) => {
      let matchedCrops = cropPerformances
      if (filters.groupId)
        matchedCrops = matchedCrops.filter(c => c.groupId == filters.groupId)
      if (filters.year)
        matchedCrops = matchedCrops.filter(c => c.year == filters.year)
      if (filters.cropId)
        matchedCrops = matchedCrops.filter(c => c.cropId == filters.cropId)
      return { objects: matchedCrops, pageInfo: { pageNumber: 1 } }
    },
    getCrops: (_, { filters }, { dataSources }) => {
      let matchedCrops = cropPerformances
      if (filters.groupId)
        matchedCrops = matchedCrops.filter(f => f.groupId == filters.groupId)
      if (filters.year)
        matchedCrops = matchedCrops.filter(f => f.year == filters.year)
      return new Set([...matchedCrops.map(c => dataSources.AnalyticsAPI.getCropById(c.cropId)).sort()])
    },
    getFarmBuyingScore: (_, { groupId, seasonId }) => {
      const matchedBuyingScore = priceCheckData.find(f => f.groupId == groupId && f.seasonId == seasonId)
      return matchedBuyingScore
    },
    getFarmSeasons: (_, { groupId }, { dataSources }) => {
      if (!groupId)
        return []
      let filteredProductPriceData = productPriceData

      filteredProductPriceData = filteredProductPriceData
        .filter(f => f.groupId == groupId)
        .map(g => dataSources.AnalyticsAPI.getSeasonById(g.seasonId))
      const setOfSeasons = new Set([...filteredProductPriceData])

      const seasonSort = (a, b) => {
        const seasonA = a.season
        const seasonB = b.season
        const yearA = a.year
        const yearB = b.year

        if (yearA < yearB)
          return -1

        if (yearA > yearB)
          return 1

        if (yearA == yearB) {
          if (seasonA == 'Spring' && seasonB == 'Autumn')
            return -1

          if (seasonA == 'Autumn' && seasonB == 'Spring')
            return 1
        }
        return 0
      }

      return [...setOfSeasons].sort(seasonSort)
    },
    getFieldPerformance: (_, { filters }, { dataSources }) => {
      let matchedFields = fieldPerformances
      if (filters.groupId)
        matchedFields = matchedFields.filter(f => f.groupId == filters.groupId)
      if (filters.year) {
        matchedFields = matchedFields.filter(
          f => dataSources.AnalyticsAPI.getFieldById(f.fieldId)?.year == filters.year,
        )
      }
      if (filters.cropId) {
        matchedFields = matchedFields.filter(
          f => dataSources.AnalyticsAPI.getVarietyById(f.varietyId).cropId == filters.cropId,
        )
      }
      if (filters.varietyId)
        matchedFields = matchedFields.filter(f => f.varietyId == filters.varietyId)
      if (filters.fieldId)
        matchedFields = matchedFields.filter(f => f.fieldId == filters.fieldId)
      return { objects: matchedFields, pageInfo: { pageNumber: 1 } }
    },
    getFields: (_, { filters }, { dataSources }) => {
      let matchedFields = fieldPerformances
      if (filters.groupId)
        matchedFields = matchedFields.filter(f => f.groupId == filters.groupId)
      let mappedFields = matchedFields.map(f => dataSources.AnalyticsAPI.getFieldById(f.fieldId))
      if (filters.year)
        mappedFields = mappedFields.filter(f => Number(f.year) == filters.year)
      return new Set([...mappedFields.sort((a, b) => a.name - b.name)])
    },
    getFieldsComparison: (_, { groupId, year }) => {
      let filteredFieldsComparisonData = fieldsComparisonData
      if (!groupId || !year)
        return []
      if (groupId)
        filteredFieldsComparisonData = filteredFieldsComparisonData.filter(c => c.groupId == groupId)
      if (year)
        filteredFieldsComparisonData = filteredFieldsComparisonData.filter(c => c.harvestYear == year)
      return filteredFieldsComparisonData
    },
    getHarvestYears: (_, { groupId, type }, { dataSources }) => {
      const fieldYears = fieldPerformances
        .filter(f => f.groupId == groupId)
        .map(f => dataSources.AnalyticsAPI.getFieldById(f.fieldId).year)
      // todo: remove hardcoded 2023
      if (type == 'analytics')
        return new Set(fieldYears.filter(y => Number.parseInt(y) != 2023))
      const trackerYears = trackerCrops.filter(f => f.groupId == groupId).map(f => f.harvest_year)
      if (type == 'tracker')
        return new Set([...fieldYears, ...trackerYears])
      const budgetYears = budgets.filter(f => f.groupId == groupId).map(f => f.year)
      if (type == 'budgets')
        return new Set([...fieldYears, ...trackerYears, ...budgetYears])
      return []
    },
    getProductPriceData: (_, { filters }, { dataSources }) => {
      const matchedProductPrices = dataSources.AnalyticsAPI.getProductPrices(filters)
      return { objects: matchedProductPrices, pageInfo: { pageNumber: 1 } }
    },
    getProductPriceDataWholeYears: (_, { filters }, { dataSources }) => {
      if (!filters.groupId || !filters.year)
        return []
      let filteredProductPrices = productPriceData
      filteredProductPrices = filteredProductPrices.filter(f => f.groupId == filters.groupId)
      filteredProductPrices = filteredProductPrices.filter(
        f => dataSources.AnalyticsAPI.getSeasonById(f.seasonId)?.year >= filters.year - 2,
      )
      filteredProductPrices = filteredProductPrices.filter(
        f => dataSources.AnalyticsAPI.getSeasonById(f.seasonId)?.year <= filters.year,
      )
      return { objects: filteredProductPrices, pageInfo: { pageNumber: 1 } }
    },
    getProductPriceDataWithoutGroup: (_, { filters }, { dataSources }) => {
      const matchedProductPrices = dataSources.AnalyticsAPI.getProductPricesWithIdList(filters)
      matchedProductPrices.forEach((pp) => {
        pp.filteredPricePoints = dataSources.AnalyticsAPI.getPricePointsInDateRange(pp.pricePoints, filters)
      })
      return { objects: matchedProductPrices, pageInfo: { pageNumber: 1 } }
    },
    getProducts: (_, { filters }, { dataSources }) => {
      const matchedProducts = dataSources.ProductsAPI.getProducts(filters)
      return { objects: matchedProducts, pageInfo: { pageNumber: 1 } }
    },
    getSeedBagInfo: (_, { seedId }, { dataSources }) => {
      return dataSources.ProductsAPI.getSeedBagInfo(seedId)
    },
    getVGBuyingScores: (_, { virtualGroupId, seasonId }) => {
      if (!virtualGroupId || !seasonId)
        return []
      const groupsInVG = groups.filter(f => f.virtualGroups.includes(Number(virtualGroupId))).map(g => g.id)
      return priceCheckData.filter(f => groupsInVG.includes(f.groupId) && seasonId == f.seasonId)
    },
    getVGCropPerformances: (_, { virtualGroupId, year }) => {
      if (!virtualGroupId || !year)
        return []
      const groupsInVG = groups.filter(f => f.virtualGroups.includes(Number(virtualGroupId))).map(g => g.id)
      return cropPerformances.filter(f => groupsInVG.includes(f.groupId) && year == f.year)
    },
    getVGSeasons: (_, { virtualGroupId }, { dataSources }) => {
      if (!virtualGroupId)
        return []
      const groupsInVG = groups.filter(f => f.virtualGroups.includes(Number(virtualGroupId)))
      const seasons = priceCheckData
        .filter(f => groupsInVG.map(g => g.id).includes(f.groupId))
        .map(g => dataSources.AnalyticsAPI.getSeasonById(g.seasonId))
      return new Set([...seasons])
    },
    getVarietyPerformance: (_, { filters }, { dataSources }) => {
      let matchedVariety = varietyPerformance
      if (filters.groupId)
        matchedVariety = matchedVariety.filter(c => c.groupId == filters.groupId)
      if (filters.year)
        matchedVariety = matchedVariety.filter(c => c.year == filters.year)
      if (filters.cropId) {
        matchedVariety = matchedVariety.filter(
          c => dataSources.AnalyticsAPI.getVarietyById(c.varietyId).cropId == filters.cropId,
        )
      }
      if (filters.varietyId)
        matchedVariety = matchedVariety.filter(c => c.varietyId == filters.varietyId)
      return { objects: matchedVariety, pageInfo: { pageNumber: 1 } }
    },
    getVirtualGroupFarms: (_, { virtualGroupId }) => {
      if (!virtualGroupId)
        return []
      return groups.filter(f => f.virtualGroups.includes(Number(virtualGroupId)))
    },
    getVirtualGroups: (_, { groupId }) => {
      const groupsVirtualGroupsIds = groups.filter(f => f.id == groupId).map(g => g.virtualGroups)
      if (groupsVirtualGroupsIds.length == 1) {
        const vgs = groupsVirtualGroupsIds[0]
        const groupsVirtualGroups = virtualGroups.filter(f => vgs.includes(f.id))
        return groupsVirtualGroups
      }

      return []
    },
  },
  VGCropPerformance: {
    crop: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getCropById(parent.cropId)
    },
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
  },
  Variety: {
    crop: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getCropById(parent.cropId)
    },
  },
  VarietyPerformance: {
    group: (parent, _, { dataSources }) => {
      return dataSources.BusinessAPI.getGroupById(parent.groupId)
    },
    variety: (parent, _, { dataSources }) => {
      return dataSources.AnalyticsAPI.getVarietyById(parent.varietyId)
    },
  },
  Yield: {
    harvestDate: (parent) => {
      const parts = parent.harvestDate.split('-')
      const mydate = new Date(parts[2], Number.parseInt(parts[1]) - 1, parts[0])
      return mydate.toISOString()
    },
  },
}
