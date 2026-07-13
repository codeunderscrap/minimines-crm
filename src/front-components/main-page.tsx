import { defineFrontComponent } from 'twenty-sdk/define';
import React from 'react';

import {
  APP_DISPLAY_NAME,
  MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

const MainPage = () => {
  return (
    <div style={{ padding: '50px', fontSize: '24px', fontFamily: 'sans-serif' }}>
      <h1>HELLO DASHBOARD</h1>
      <p>If you see this, the component injection works!</p>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: APP_DISPLAY_NAME,
  description: 'MiniMines Custom CRM Dashboard',
  component: MainPage,
});
