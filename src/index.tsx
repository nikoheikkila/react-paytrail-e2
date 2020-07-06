import React from 'react'
import FieldMap from './fields'

/**
 * Debug component for displaying form inputs.
 * Control this component by passing the `debug` prop to the `<Form>`
 * component.
 */
const Debug: React.FC<DebugProps> = ({ fields }) => {
  return (
    <ul>
      {fields.map(([key, value], index) => (
        <li key={index}>
          <strong>{key}:</strong>
          <br />
          <code>{' ' + value}</code>
        </li>
      ))}
    </ul>
  )
}

/**
 * Form component for injecting the E2 payment form.
 *
 * @example ./example/App.js
 */
export const Form: React.FC<FormProps> = props => {
  const {
    merchant,
    orderNumber,
    customer,
    urls,
    products,
    locale = 'fi_FI',
    currency = 'EUR',
    reference = '',
    paymentMethods = [],
    messages = {},
    includeVat = true,
    algorithm = 'sha256',
    expiresAt = '',
    debug = false,
    className = 'e2-form',
  } = props

  const gateway = 'https://payment.paytrail.com/e2'
  const method = 'post'

  const fields = new FieldMap()

  fields
    .add('MERCHANT_ID', merchant.id)
    .add('ORDER_NUMBER', orderNumber)
    .add('PARAMS_IN', ' ')
    .add('LOCALE', locale)
    .add('CURRENCY', currency)
    .add('REFERENCE_NUMBER', reference)
    .add('EXPIRATION_FOR_PAYMENT_CREATION', expiresAt)
    .add('PAYMENT_METHODS', paymentMethods.join(','))
    .add('VAT_IS_INCLUDED', includeVat ? '1' : '0')
    .add('ALG', algorithm === 'sha256' ? '1' : '')
    .addURLs(urls)
    .addProducts(products)
    .addCustomer(customer)
    .addMessages(messages)
    .addParams()

  const fieldEntries = Array.from(fields.entries())

  return (
    <div>
      {debug && <Debug fields={fieldEntries} />}
      <form className={className} action={gateway} method={method}>
        {fieldEntries.map(([key, value], index) => (
          <input key={index} name={key} type='hidden' value={value} />
        ))}
        <input name='AUTHCODE' type='hidden' value={fields.authCode(merchant.secret, algorithm)} />
        <button type='submit'>Pay</button>
      </form>
    </div>
  )
}
