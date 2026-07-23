import { defineView } from 'twenty-sdk/define';
import {
  CONVERSATION_MESSAGE_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: CONVERSATION_MESSAGE_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER,
  name: 'conversation-message-record-page-fields',
  type: 'FIELDS_WIDGET' as any,
  icon: 'IconMessage',
});
