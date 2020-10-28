import React, { useState } from 'react'

import { Form } from '@paytrail/react-paytrail-e2'
import './index.css'

/**
 * Application displaying the payment form
 * @link https://docs.paytrail.com
 *
 * @remark
 * For type information, see the src/typings.d.ts file in parent project.
 */
const App = () => {
  const [debug, toggleDebug] = useState(false)

  /**
   * Merchant should be fetched from your backend configuration.
   * To use this library, the ID and merchant secret is required.
   * Don't expose the merchant ID and secret in client-side code but use a suitable
   * framework and environment variables instead.
   * The values below are for demo usage only.
   */
  const merchant = {
    id: '13466',
    secret: '6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ',
  }

  /**
   * Order number should identify your transaction as uniquely as possible.
   */
  const orderNumber = `ORDER-${Math.floor(Math.random() * 9999)}`

  /**
   * Customer should be fetched from your webshop using all the information
   * available. At least the first and last names should be specified.
   */
  const customer = {
    firstName: 'Alice',
    lastName: 'Angel',
    email: 'alice@example.org',
    phone: '040123456',
    company: 'Acme Ltd',
    address: {
      street: 'Test Street 1',
      postalCode: '100200',
      town: 'Helsinki',
      country: 'FI',
    },
  }

  /**
   * @member success - URL where the customer is redirected after successful payment.
   * @member cancel - URL where customer is redirected after failed or cancelled payment.
   * @member notify - URL to be called when the payment has been marked as paid.
   */
  const urls = {
    success: new URL('http://example.com/success'),
    cancel: new URL('http://example.com/cancel'),
    notify: new URL('http://example.com/notify'),
  }

  /**
   * This library does not support arbitrary amounts, hence at least one
   * product should be listed as part of the transaction. For each product,
   * at least ID, title, and price should be specified.
   */
  const products = [
    {
      id: 1,
      title: 'Deluxe Couch',
      price: 499.899,
      quantity: 1,
      discount: 10,
      type: 1,
    },
    {
      id: 2,
      title: 'Shipping fees',
      price: 10.0,
      quantity: 1,
      discount: 0,
      type: 2,
    },
  ]

  /**
   * Other parameters below include the following.
   *
   * @param className - Class name passed to the rendered form to use with styling.
   * @param debug - Prints the form keys and values before the form itself. Defaults to false.
   * @param currency - Only accepted value is 'EUR'.
   * @param locale - Accepted values are 'fi_FI', 'sv_SE', and 'en_US'
   * @param reference - Finnish formatted reference number for transaction.
   * @param paymentMethods: - List of payment method IDs for transaction.
   * @param includeVat - Whether VAT is included in the total price.
   * @param expiresAt - ISO 8601 notation of the transaction expiration.
   * @param algorithm - Hashing algorith for the authcode. Only SHA-256 supported.
   * @param messages - Different messages to be displayed along the payment process.
   * @returns Form component
   */
  return (
    <div className='container'>
      <h1>Paytrail E2 Interface Form Component</h1>
      <p>
        This component has been created with React, and it embeds the Paytrail's E2 payment form on this page. You can click on <em>Toggle Debug Values</em> or
        use the DevTools to see all the values.
      </p>
      {/* eslint-disable-next-line */}
      <a href='#' className='toggle-debug' onClick={() => toggleDebug(!debug)}>
        Toggle Debug Values
      </a>
      <hr />
      <Form
        className='e2-demo'
        debug={debug}
        merchant={merchant}
        orderNumber={orderNumber}
        urls={urls}
        customer={customer}
        products={products}
        currency='EUR'
        locale='fi_FI'
        reference='RF111232'
        paymentMethods={[1, 2]}
        includeVat
        expiresAt='2099-01-01T12:00:00+00:00'
        algorithm='sha256'
        messages={{
          merchantPanel: "This is a message for the Merchant's Panel",
          payer: 'This is a message for the customer',
          paymentMethod: 'This is a message for the payment method',
        }}
      />
    </div>
  )
}

export default App
