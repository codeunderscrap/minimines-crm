import { defineView, ViewType } from 'twenty-sdk/define';
import {
  CONVERSATION_MESSAGE_ALL_VIEW_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: CONVERSATION_MESSAGE_ALL_VIEW_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER,
  name: 'all-conversation-message',
  type: ViewType.TABLE,
  icon: 'IconMessage',
});
