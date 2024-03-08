import type { Crop } from './crop'
import type { Group } from './group'
import type { Quantity } from './quantity'

interface AvgPrice {
  avgPrice: number
  percentageChange: number
}
interface CostPerHa {
  cost: number
  percentageChange: number
}

interface TrackerYield extends Quantity {
  magnitude: number
  units: string
  estimate: boolean
  percentageChange: number
}
interface TrackerSalesData {
  totalAmount: number
  soldAmount: number
  contractedAmount: number
  dimension: string
}
export interface TrackerCropData {
  crop: Crop
  fieldArea: number
  yield: TrackerYield
  costPerHa: CostPerHa
  avgPrice: AvgPrice
  salesData: TrackerSalesData
}

interface StringArray {
  [index: number]: string
}
interface NumberArray {
  [index: number]: number
}
interface SalesList {
  prices: NumberArray
  quantities: NumberArray
}
export interface TrackerMonthlySales {
  group: Group
  crop: Crop
  year: number
  labels: StringArray
  sales: SalesList
  contracts: SalesList
}
interface CategoryCost {
  category: string
  costPerHa: number
}

interface CategoryCostArray {
  [index: number]: CategoryCost
}

interface CostMonthly {
  cost: CategoryCostArray
  yearMonth: string
}
interface CostsArray {
  [index: number]: CostMonthly
}
export interface TrackerMonthlyCosts {
  group: Group
  crop: Crop
  year: number
  area: number
  cropYield: number
  currentYear: CostsArray
  marketCurrentYear: CostsArray
}

interface MarketBenchmark {
  max: number
  min: number
  median: number
  percentile25: number
  percentile75: number
}
export interface SingleCategory {
  category: string
  costPerHa: number
  cop: number
  marketBenchmark: MarketBenchmark
}
interface Variety {
  id: number
  name: string
  crop: Crop
}
export interface Contracts {
  crop: Crop
  variety: Variety
  purchaseCompany: string
  contractNumber: string
  year: number
  date: string
  contractQuantity: number
  budgetDeliveredPrice: number
  totalPrice: number
}
