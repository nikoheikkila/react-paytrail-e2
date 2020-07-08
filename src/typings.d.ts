/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

interface SvgrComponent extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string
  const svgComponent: SvgrComponent
  export default svgUrl
  export { svgComponent as ReactComponent }
}

type Nullable<T> = T | undefined | null

interface Mappable<K, V> extends Map<K, V> {
  add: (key: string, value: Nullable<string>) => this
  addURLs: (urls: URLSet) => this
  addProducts: (products: Product[]) => this
  addCustomer: (customer: Customer) => this
  addParams: () => this
  addMessages: (messages: MessageSet) => this
  authCode: (secret: string, algorithm: string) => string
}

interface DebugProps {
  fields: [string, string][]
}

interface FormProps {
  merchant: Merchant
  orderNumber: string
  urls: URLSet
  customer: Customer
  products: Product[]
  debug?: boolean
  currency?: 'EUR'
  locale?: 'fi_FI' | 'sv_SE' | 'en_US'
  reference?: string
  paymentMethods?: number[]
  includeVat?: boolean
  algorithm?: 'sha256'
  messages?: MessageSet
  expiresAt?: string
  className?: string
}

interface Merchant {
  id: string
  secret: string
}

interface Customer {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  address?: {
    street: string
    postalCode: string
    town: string
    country: string
  }
}

interface URLSet {
  success: URL
  cancel: URL
  notify?: URL
}

interface Product {
  id: string
  title: string
  price: number
  quantity?: string
  discount?: string
  vat?: string
  type?: '1' | '2' | '3'
}

interface MessageSet {
  merchantPanel?: string
  payer?: string
  paymentMethod?: string
}
