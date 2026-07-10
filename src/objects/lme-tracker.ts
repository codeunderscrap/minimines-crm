import { defineObject, defineField } from 'twenty-sdk/define';

export default defineObject({
  nameSingular: 'LMETracker',
  namePlural: 'LMETrackers',
  labelSingular: 'LME Tracker',
  labelPlural: 'LME Trackers',
  description: 'Tracks daily London Metal Exchange rates for pricing calculation',
  fields: {
    metalType: defineField.select({
      label: 'Metal Type',
      options: [
        { label: 'Aluminum', value: 'AL' },
        { label: 'Iron', value: 'FE' },
        { label: 'Copper', value: 'CU' },
        { label: 'Cobalt', value: 'CO' },
        { label: 'Lithium', value: 'LI' }
      ]
    }),
    rateDate: defineField.date({ label: 'Rate Date' }),
    rateUSD: defineField.number({ label: 'Rate (USD/MT)' }),
    source: defineField.text({ label: 'Data Source' })
  }
});
