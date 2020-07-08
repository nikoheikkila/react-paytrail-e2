import React from 'react'
import { render } from '@testing-library/react'
import { Form } from '.'

const getURLs = (baseURI: string): URLSet => ({
  success: new URL(`${baseURI}/success`),
  cancel: new URL(`${baseURI}/cancel`),
  notify: new URL(`${baseURI}/notify`),
})

test('Form renders with minimum required fields', async () => {
  const merchant: Merchant = {
    id: '1',
    secret: '123',
  }

  const orderNumber = '1'
  const urls = getURLs('https://example.com')

  const customer: Customer = {
    firstName: 'Alice',
    lastName: 'Angel',
  }

  const product: Product = {
    id: '123',
    title: 'Test Product',
    price: 100,
  }

  const { container } = render(<Form merchant={merchant} orderNumber={orderNumber} customer={customer} products={[product]} urls={urls} />)

  expect(container).toMatchSnapshot()
  expect(container.querySelectorAll('input')).toHaveLength(21)
  expect(container.querySelector('input[name=MERCHANT_ID]')).toHaveProperty('value', merchant.id)
  expect(container.querySelector('input[name=ORDER_NUMBER]')).toHaveProperty('value', orderNumber)
  expect(container.querySelector('input[name=PAYER_PERSON_FIRSTNAME]')).toHaveProperty('value', customer.firstName)
  expect(container.querySelector('input[name=PAYER_PERSON_LASTNAME]')).toHaveProperty('value', customer.lastName)
  expect(container.querySelector('input[name^=ITEM_ID')).toHaveProperty('value', product.id)
  expect(container.querySelector('input[name^=ITEM_TITLE')).toHaveProperty('value', product.title)
  expect(container.querySelector('input[name^=ITEM_UNIT_PRICE')).toHaveProperty('value', '100.00')
})

test('Form renders with all the fields', async () => {
  const merchant: Merchant = {
    id: '1',
    secret: '123',
  }

  const className = 'e2-test-form'
  const orderNumber = '1'
  const paymentMethods = [1, 2]
  const reference = 'RF123456789'
  const currency = 'EUR'
  const locale = 'fi_FI'
  const algorithm = 'sha256'
  const includeVat = false

  const expiresAt = '2021-01-01'
  const urls = getURLs('https://example.com')

  const customer: Customer = {
    firstName: 'Alice',
    lastName: 'Angel',
    phone: '040123456',
    email: 'alice@example.org',
    company: 'Acme Ltd',
    address: {
      street: 'Test Street 1',
      postalCode: '00100',
      town: 'Helsinki',
      country: 'FI',
    },
  }

  const product: Product = {
    id: '123',
    title: 'Test Product',
    price: 100,
    discount: '10',
    vat: '24',
    quantity: '1',
    type: '1',
  }

  const messages = {
    merchantPanel: "This is a message for the Merchant's Panel",
    payer: 'This is a message for the customer',
    paymentMethod: 'This is a message for the payment method',
  }

  const { container } = render(
    <Form
      className={className}
      debug
      merchant={merchant}
      orderNumber={orderNumber}
      urls={urls}
      customer={customer}
      products={[product]}
      currency={currency}
      locale={locale}
      reference={reference}
      paymentMethods={paymentMethods}
      includeVat={includeVat}
      algorithm={algorithm}
      messages={messages}
      expiresAt={expiresAt}
    />,
  )

  const expectedInputFields = 34
  const expectedDebugFields = expectedInputFields - 1 // AUTHCODE is not shown in debug

  expect(container).toMatchSnapshot()
  expect(container.querySelectorAll('input')).toHaveLength(expectedInputFields)
  expect(container.querySelectorAll('ul > li')).toHaveLength(expectedDebugFields)
  expect(container.querySelector('input[name=MERCHANT_ID')).toHaveProperty('value', merchant.id)
  expect(container.querySelector('input[name=ORDER_NUMBER')).toHaveProperty('value', orderNumber)
  expect(container.querySelector('input[name=PAYMENT_METHODS')).toHaveProperty('value', '1,2')
  expect(container.querySelector('input[name=REFERENCE_NUMBER')).toHaveProperty('value', reference)
  expect(container.querySelector('input[name=CURRENCY')).toHaveProperty('value', currency)
  expect(container.querySelector('input[name=LOCALE')).toHaveProperty('value', locale)
  expect(container.querySelector('input[name=VAT_IS_INCLUDED')).toHaveProperty('value', '0')
  expect(container.querySelector('input[name=EXPIRATION_FOR_PAYMENT_CREATION')).toHaveProperty('value', expiresAt)
  expect(container.querySelector('input[name=URL_SUCCESS')).toHaveProperty('value', urls.success.href)
  expect(container.querySelector('input[name=URL_CANCEL')).toHaveProperty('value', urls.cancel.href)
  expect(container.querySelector('input[name=URL_NOTIFY')).toHaveProperty('value', urls.notify?.href)
  expect(container.querySelector('input[name=PAYER_PERSON_FIRSTNAME]')).toHaveProperty('value', customer.firstName)
  expect(container.querySelector('input[name=PAYER_PERSON_LASTNAME]')).toHaveProperty('value', customer.lastName)
  expect(container.querySelector('input[name=PAYER_PERSON_PHONE]')).toHaveProperty('value', customer.phone)
  expect(container.querySelector('input[name=PAYER_PERSON_EMAIL]')).toHaveProperty('value', customer.email)
  expect(container.querySelector('input[name=PAYER_COMPANY_NAME]')).toHaveProperty('value', customer.company)
  expect(container.querySelector('input[name=PAYER_PERSON_ADDR_STREET]')).toHaveProperty('value', customer.address?.street)
  expect(container.querySelector('input[name=PAYER_PERSON_ADDR_POSTAL_CODE]')).toHaveProperty('value', customer.address?.postalCode)
  expect(container.querySelector('input[name=PAYER_PERSON_ADDR_TOWN]')).toHaveProperty('value', customer.address?.town)
  expect(container.querySelector('input[name=PAYER_PERSON_ADDR_COUNTRY]')).toHaveProperty('value', customer.address?.country)
  expect(container.querySelector('input[name^=ITEM_ID]')).toHaveProperty('value', product.id)
  expect(container.querySelector('input[name^=ITEM_TITLE]')).toHaveProperty('value', product.title)
  expect(container.querySelector('input[name^=ITEM_UNIT_PRICE]')).toHaveProperty('value', '100.00')
  expect(container.querySelector('input[name^=ITEM_VAT_PERCENT]')).toHaveProperty('value', product.vat)
  expect(container.querySelector('input[name^=ITEM_DISCOUNT_PERCENT]')).toHaveProperty('value', product.discount)
  expect(container.querySelector('input[name^=ITEM_TYPE]')).toHaveProperty('value', product.type)
  expect(container.querySelector('input[name=MSG_UI_MERCHANT_PANEL]')).toHaveProperty('value', messages.merchantPanel)
  expect(container.querySelector('input[name=MSG_UI_PAYMENT_METHOD]')).toHaveProperty('value', messages.paymentMethod)
  expect(container.querySelector('input[name=MSG_SETTLEMENT_PAYER]')).toHaveProperty('value', messages.payer)
})
