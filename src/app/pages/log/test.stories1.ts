import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';

import { ActionLogTableComponent } from './action-log/action-log-table.component';
import { LogComponent } from './log.component';

storiesOf('My Button', module)
  .addDecorator(
    moduleMetadata({
      declarations: [ActionLogTableComponent],
    }),
  )
  .add('with some emoji', () => ({
    component: LogComponent,
    props: {
      text: '😀 😎 👍 💯',
    },
  }))
  .add('with some emoji and action', () => ({
    component: LogComponent,
    props: {
      text: '😀 😎 👍 💯',
      click: action('clicked'),
    },
  }));
