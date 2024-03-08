import AnalyticsAPI from './analytics'
import BusinessAPI from './business'
import ProductsAPI from './products'

const dataSources = {
  AnalyticsAPI: new AnalyticsAPI(),
  BusinessAPI: new BusinessAPI(),
  ProductsAPI: new ProductsAPI(),
}

export default dataSources
