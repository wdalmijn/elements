import { object, text } from '@storybook/addon-knobs/react';
import * as React from 'react';

import { IProvider } from '../../containers/Provider';

export const providerKnobs = (): IProvider => ({
  host: text('host', 'https://stoplight.io/api'),
  token: text('token', ''),
  projectToken: text('projectToken', ''),
  icons: object('icons', {}),
  components: object('components', {
    link: ({ node, children }, key) => {
      return (
        <a key={key} className={node.className} href={node.url}>
          {children}
        </a>
      );
    },
  }),
});