import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Datepicker from '../components/Datepicker'

test('Datepicker renders to static markup', () => {
  const html = ReactDOMServer.renderToString(React.createElement(Datepicker))
  expect(html).toMatch(/Select date/)
})
