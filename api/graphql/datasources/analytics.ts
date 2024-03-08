import { RESTDataSource } from '@apollo/datasource-rest'
import cropsDB from '../../db/crops.json'
import distributorDB from '../../db/distributors.json'
import fieldsDB from '../../db/fields.json'
import productPricesDB from '../../db/product_prices.json'
import seasonsDB from '../../db/seasons.json'
import varietiesDB from '../../db/varieties.json'
import ingredientsDB from '../../db/ingredients.json'

const ingredients = ingredientsDB.ingredients
const crops = cropsDB.crops
const fields = fieldsDB.fields
const productPrices = productPricesDB.productPrices
const varieties = varietiesDB.varieties
const seasons = seasonsDB.seasons
const distributors = distributorDB.distributors

class AnalyticsAPI extends RESTDataSource {
  getCropById(cropId: number) {
    return crops.find(c => c.id == cropId)
  }

  getIngredientById(ingredientId: number) {
    return ingredients.find(i => i.id == ingredientId)
  }

  getDistributorById(distributorId: number) {
    return distributors.find(d => d.id == distributorId)
  }

  getVarietyById(varietyId: number) {
    return varieties.find(v => v.id == varietyId)
  }

  getFieldById(fieldId: string) {
    return fields.find(f => f.id == fieldId)
  }

  getSeasonById(seasonId: number) {
    return seasons.find(f => f.id == seasonId)
  }

  getProductPrices(filters: object = {}) {
    let filteredProductPrices = productPrices
    for (const [field, value] of Object.entries(filters))
      filteredProductPrices = filteredProductPrices.filter(k => k[field] == value)

    return filteredProductPrices
  }

  getProductPricesWithIdList(filters) {
    return productPrices.filter(p => filters.productIdList.includes(p.productId.toString()))
  }

  getPricePointsInDateRange(pricePoints, filters) {
    const filteredPricePoints: object[] = []
    const from = new Date(filters.from).getTime()
    const to = new Date(filters.to).getTime()
    pricePoints.forEach((pp) => {
      const pDate = new Date(pp.date).getTime()
      if (pDate >= from && pDate <= to)
        filteredPricePoints.push(pp)
    })
    return filteredPricePoints
  }

  getLowestPricePerUnit(productId: number) {
    const productPricePoints = productPrices
      .filter(p => p.productId == productId)
      .map(p => p.pricePoints)
      .flat()
    if (!productPricePoints.length)
      return null
    let lowestPricePerUnit = -1
    for (const point of productPricePoints) {
      const pricePerUnit = point.spend / point.units
      if (lowestPricePerUnit == -1 || pricePerUnit < lowestPricePerUnit)
        lowestPricePerUnit = pricePerUnit
    }
    return lowestPricePerUnit
  }

  getHighestPricePerUnit(productId: number) {
    const productPricePoints = productPrices
      .filter(p => p.productId == productId)
      .map(p => p.pricePoints)
      .flat()
    let highestPricePerUnit = -1
    for (const point of productPricePoints) {
      const pricePerUnit = point.spend / point.units
      if (highestPricePerUnit == -1 || pricePerUnit > highestPricePerUnit)
        highestPricePerUnit = pricePerUnit
    }
    return highestPricePerUnit
  }
}

export default AnalyticsAPI
