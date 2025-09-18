import React from 'react'
import Datepicker from '../components/Datepicker'
import { within, userEvent } from '@storybook/testing-library'

export default {
  title: 'Example/Datepicker',
  component: Datepicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export const Default = {
  args: {},
}

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  // open the calendar by clicking the input
  const input = await canvas.getByPlaceholderText('Select date')
  await userEvent.click(input)

  // pick today's date number in the calendar grid
  const today = new Date().getDate().toString()

  // wait for the day cell to appear (choose first match)
  const dayButton = await canvas.findByText((content, element) => {
    // ensure we match exact text and clickable element
    return content === today && element.closest('span')
  })

  await userEvent.click(dayButton)

  // assert the input value updated to include the selected day
  // Use a lightweight fallback assertion so the play function works without test helpers
  if (!input.value || !input.value.includes(today)) {
    throw new Error('Datepicker did not update input value after selecting a day')
  }
}
