import { defineObject, FieldType } from 'twenty-sdk/define';

export default defineObject({
  universalIdentifier: '03987302-22c9-4308-a280-e16738c722af',
  nameSingular: 'lMETracker',
  namePlural: 'lMETrackers',
  labelSingular: 'LME Tracker',
  labelPlural: 'LME Trackers',
  description: 'Tracks daily London Metal Exchange rates for pricing calculation',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: 'c83b1a20-3b99-4c22-b7e2-45e0f44481aa',
  fields: [
    { universalIdentifier: 'c83b1a20-3b99-4c22-b7e2-45e0f44481aa', name: 'name', type: FieldType.TEXT, label: 'Tracker Name' },
    {
      universalIdentifier: 'b89b1a20-3b99-4c22-b7e2-45e0f44481ff',
      name: 'metalType',
      type: FieldType.SELECT,
      label: 'Metal Type',
      options: [
        { position: 0, color: 'green', label: 'Aluminum', value: 'AL' },
        { position: 1, color: 'green', label: 'Iron', value: 'FE' },
        { position: 2, color: 'green', label: 'Copper', value: 'CU' },
        { position: 3, color: 'green', label: 'Cobalt', value: 'CO' },
        { position: 4, color: 'green', label: 'Lithium', value: 'LI' }
      ]
    },
    { universalIdentifier: 'e56b1a20-3b99-4c22-b7e2-45e0f44481cc', name: 'rateDate', type: FieldType.DATE_TIME, label: 'Rate Date' },
    { universalIdentifier: 'f67b1a20-3b99-4c22-b7e2-45e0f44481dd', name: 'rateUSD', type: FieldType.NUMBER, label: 'Rate (USD/MT)' },
    { universalIdentifier: 'a78b1a20-3b99-4c22-b7e2-45e0f44481ee', name: 'source', type: FieldType.TEXT, label: 'Data Source' }
  ]
});
