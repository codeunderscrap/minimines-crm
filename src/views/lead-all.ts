import { defineView, ViewType } from 'twenty-sdk/define';
import {
  LEAD_ALL_VIEW_UNIVERSAL_IDENTIFIER,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineView({
  universalIdentifier: LEAD_ALL_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Leads',
  objectMetadataUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  position: 0,
  isCompact: false,
  viewFields: [
    { fieldMetadataUniversalIdentifier: '12b90fc3-ebff-4269-a4f1-ec1d1634aad7', position: 0, size: 200 },
    { fieldMetadataUniversalIdentifier: '3c5dbbb2-5915-4e16-bb7c-61cdab1a628d', position: 1, size: 180 },
    { fieldMetadataUniversalIdentifier: 'b21064a2-b73d-4680-8525-0a19f04ec0e4', position: 2, size: 200 },
    { fieldMetadataUniversalIdentifier: 'ddc9818e-4ad2-46af-9536-fcbb5a37f8a4', position: 3, size: 150 },
    { fieldMetadataUniversalIdentifier: '620d71c8-ff98-465e-a2d6-234531ba3858', position: 4, size: 120 },
    { fieldMetadataUniversalIdentifier: '0739daf4-5a5d-4fed-9132-fef2eb371192', position: 5, size: 110 },
    { fieldMetadataUniversalIdentifier: 'd584e26d-46a1-4181-b54d-cfae9849ac8d', position: 6, size: 130 },
    { fieldMetadataUniversalIdentifier: '368e7b51-512c-47bc-ad7f-d38a83ed1fbc', position: 7, size: 120 },
    { fieldMetadataUniversalIdentifier: '9bdde85a-038b-4b2a-8884-6330ce1484f1', position: 8, size: 100 },
    { fieldMetadataUniversalIdentifier: 'ab3b68ff-a256-474f-a59d-c148ba58a602', position: 9, size: 200 },
  ],
  viewFilters: [],
  viewSorts: [],
});
