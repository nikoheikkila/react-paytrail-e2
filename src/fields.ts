import shajs from 'sha.js'

/**
 * Class for containing name-value pairs to be injected into the payment form.
 */
class FieldMap extends Map {
  /**
   * Adds an arbitrary field of `name` and value of `value` to the payment form.
   * If `value` is nullish, the operation is skipped.
   *
   * @param key the name for the input field
   * @param value the value for the input field
   */
  add(key: string, value: Nullable<string>) {
    if (value === undefined || value === null || value.length === 0) {
      return this
    }

    return this.set(key, value.toString())
  }

  /**
   * Adds `URL_*` fields to the payment form.
   *
   * @param urls
   */
  addURLs(urls: URLSet) {
    return this.add('URL_SUCCESS', urls.success.href).add('URL_CANCEL', urls.cancel.href).add('URL_NOTIFY', urls.notify?.href)
  }

  /**
   * Adds product information (`ITEM_*`) fields to the payment form.
   *
   * @param products
   */
  addProducts(products: Product[]) {
    products.forEach((product, index) => {
      const { id, title, price, quantity = '1', vat = '24', discount = '0', type = '1' } = product

      this.add(`ITEM_TITLE[${index}]`, title)
        .add(`ITEM_ID[${index}]`, id)
        .add(`ITEM_QUANTITY[${index}]`, quantity)
        .add(`ITEM_UNIT_PRICE[${index}]`, price.toFixed(2))
        .add(`ITEM_VAT_PERCENT[${index}]`, vat)
        .add(`ITEM_DISCOUNT_PERCENT[${index}]`, discount)
        .add(`ITEM_TYPE[${index}]`, type)
    })

    return this
  }

  /**
   * Adds customer information (`PAYER_*`) fields to the payment form.
   *
   * @param customer
   */
  addCustomer(customer: Customer) {
    return this.add('PAYER_PERSON_PHONE', customer?.phone)
      .add('PAYER_PERSON_EMAIL', customer?.email)
      .add('PAYER_PERSON_FIRSTNAME', customer?.firstName)
      .add('PAYER_PERSON_LASTNAME', customer?.lastName)
      .add('PAYER_COMPANY_NAME', customer?.company)
      .add('PAYER_PERSON_ADDR_STREET', customer?.address?.street)
      .add('PAYER_PERSON_ADDR_POSTAL_CODE', customer?.address?.postalCode)
      .add('PAYER_PERSON_ADDR_TOWN', customer?.address?.town)
      .add('PAYER_PERSON_ADDR_COUNTRY', customer?.address?.country)
  }

  /**
   * Adds message (`MSG_*`) fields to the payment form.
   *
   * @param messages
   */
  addMessages(messages: MessageSet) {
    return this.add('MSG_UI_MERCHANT_PANEL', messages?.merchantPanel)
      .add('MSG_SETTLEMENT_PAYER', messages?.payer)
      .add('MSG_UI_PAYMENT_METHOD', messages?.paymentMethod)
  }

  /**
   * Adds the PARAMS_OUT field and generates the PARAMS_IN value from the already passed fields.
   */
  addParams() {
    const outParameters = ['ORDER_NUMBER', 'PAYMENT_ID', 'AMOUNT', 'CURRENCY', 'PAYMENT_METHOD', 'TIMESTAMP', 'STATUS']
    this.add('PARAMS_OUT', outParameters.join(','))

    const inParameters = Array.from(this.keys())
    return this.add('PARAMS_IN', inParameters.join(','))
  }

  /**
   * Calculates the AUTHCODE from the current FieldMap values
   *
   * @param secret Merchant authentication hash.
   * @param algorithm Algorithm used for hashing.
   * @returns AUTHCODE converted to uppercase.
   */
  authCode(secret: string, algorithm: string): string {
    const values = [secret].concat(Array.from(this.values())).join('|')

    return shajs(algorithm).update(values).digest('hex').toUpperCase()
  }
}

export default FieldMap
