import { gql } from 'graphql-tag'

export default gql`
  type Budget {
    id: ID!

    group: Group
    crop: Crop
    year: Int

    area: Float
    seedCost: Float
    fertiliserCost: Float
    chemicalCost: Float
    cropYield: Float
    salePrice: Float
  }

  type BudgetsSummary {
    year: Int
    areaSum: Float
    totalCost: Float
    totalSales: Float
  }

  input BudgetFilter {
    id: ID
    groupId: ID
    cropId: ID
    year: Int
  }

  type PagedBudgets implements PagedResponse {
    pageInfo: PageInfo!
    objects: [Budget]!
  }

  input BudgetSummaryInput {
    year: Int!
  }

  type TrackerYield {
    magnitude: Float
    units: String
    estimate: Boolean
    percentageChange: Float
  }

  type CostPerHa {
    cost: Float
    percentageChange: Float
  }

  type AvgPrice {
    avgPrice: Float
    percentageChange: Float
  }

  type TrackerSalesData {
    totalAmount: Float
    soldAmount: Float
    totalSale: Float
    contractedAmount: Float
    dimension: String
  }

  type TrackerCropPerformance {
    group: Group
    crop: Crop
    fieldArea: Float
    yield: TrackerYield
    costPerHa: CostPerHa
    avgPrice: AvgPrice
    salesData: TrackerSalesData
  }

  input TrackerCropsFilter {
    groupId: ID
    year: Int
    cropId: ID
  }

  type TrackerCrops {
    objects: [TrackerCropPerformance]!
  }

  enum MonthLabel {
    JANUARY
    FEBRUARY
    MARCH
    APRIL
    MAY
    JUNE
    JULY
    AUGUST
    SEPTEMBER
    OCTOBER
    NOVEMBER
    DECEMBER
  }

  type SalesList {
    prices: [Float]
    quantities: [Float]
  }

  type TrackerMonthlySales {
    group: Group!
    crop: Crop!
    year: Int!
    labels: [MonthLabel]!
    sales: SalesList
    contracts: SalesList
  }

  type CropMonthlySales {
    budgets: [Budget]!
    sales: [TrackerMonthlySales]!
  }

  type CategoryCost {
    category: String
    costPerHa: Float
  }

  type CostMonthly {
    categories: [CategoryCost]
    yearMonth: String
  }

  type TrackerMonthlyCosts {
    group: Group!
    crop: Crop!
    year: Int!
    area: Float!
    cropYield: Float!
    currentYear: [CostMonthly]
    marketCurrentYear: [CostMonthly]
  }

  type CropMonthlyCosts {
    budgets: [Budget]!
    costs: [TrackerMonthlyCosts]!
  }

  input TrackerMonthlyFilter {
    groupId: ID
    year: Int
    cropId: ID
  }

  type TrackerVarietySubcategoryPerformance {
    costPerHa: Float
    name: String
  }

  type TrackerVarietyPerformance {
    group: Group
    variety: Variety
    fieldArea: Float
    subcategories: [TrackerVarietySubcategoryPerformance]
  }

  type TrackerVarieties {
    objects: [TrackerVarietyPerformance]!
  }

  type Contract {
    group: Group
    crop: Crop
    variety: Variety
    purchaseCompany: String
    contractNumber: String
    year: Int
    date: String
    contractQuantity: Float
    budgetDeliveredPrice: Float
    totalPrice: Float
    remainingQuantity: Float
  }

  type Contracts {
    contracts: [Contract]!
  }

  type Sale {
    group: Group
    crop: Crop
    variety: Variety
    purchaseCompany: String
    contractNumber: String
    year: Int
    quantity: Float
    quality: String
    date: String
    budgetDeliveredPrice: Float
    totalPrice: Float
  }

  type Sales {
    sales: [Sale]!
  }

  type CommodityProduct {
    ticker: String
    humanReadableName: String
    currency: String
  }

  type Commodity {
    symbol: String
    timestamp: String
    tradingDay: String
    open: Float
    high: Float
    low: Float
    close: Float
    volume: Float
    openInterest: Float
    product: CommodityProduct
  }

  type Commodities {
    product: CommodityProduct
    objects: [Commodity]!
  }

  type Alert {
    group: Group
    commodityProduct: CommodityProduct
    criteria: String
  }

  type MarketAlerts {
    objects: [Alert]!
  }

  extend type Query {
    getBudgets(filters: BudgetFilter): PagedBudgets
    getCommodityData(ticker: String): Commodities
    getContracts(filters: TrackerCropsFilter): Contracts
    getAvailableCommodities: [String]
    getAlerts(groupId: ID, commodityTicker: String): MarketAlerts
    getSales(filters: TrackerCropsFilter): Sales
    getTrackerCropPerformance(filters: TrackerCropsFilter): TrackerCrops
    getTrackerMonthlySales(filters: TrackerMonthlyFilter): CropMonthlySales
    getTrackerMonthlyCosts(filters: TrackerMonthlyFilter): CropMonthlyCosts
    getTrackerContracts(filters: TrackerCropsFilter): Contracts
    getTrackerSales(filters: TrackerCropsFilter): Sales
    getTrackerVarietyPerformances(filters: TrackerCropsFilter): TrackerVarieties
  }
`
