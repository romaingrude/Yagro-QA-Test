import { RESTDataSource } from '@apollo/datasource-rest'
import productsDB from '../../db/products.json'
import manufacturerDB from '../../db/manufacturers.json'
import ingredientsDB from '../../db/ingredients.json'
import commodityProductsDB from '../../db/commodity_products.json'
import seedBagDB from '../../db/seed_bags.json'

const products = productsDB.products
const manufacturers = manufacturerDB.manufacturers
const ingredients = ingredientsDB.ingredients
const commodityProducts = commodityProductsDB.commodityProducts
const seedBags = seedBagDB.seedBags

class ProductsAPI extends RESTDataSource {
  getCommodityProductByTicker(ticker: string) {
    return commodityProducts.find(p => p.ticker == ticker)
  }

  getProducts(filters: object = {}) {
    let filteredProducts = products
    for (const [field, value] of Object.entries(filters))
      filteredProducts = filteredProducts.filter(k => k[field] == value)

    return filteredProducts
  }

  getProductById(productID: number) {
    return products.find(p => p.id == productID)
  }

  getProductAlternatives(productID: number) {
    return products.find(p => p.id == productID)?.altTo
  }

  getManufacturerById(manufacturerId: number) {
    return manufacturers.find(m => m.id == manufacturerId)
  }

  getIngredientById(ingredientID: number) {
    return ingredients.find(i => i.id == ingredientID)
  }

  getSeedBagInfo(seedId: number) {
    return seedBags.find(s => s.seedId == seedId)
  }
}

export default ProductsAPI
