import React from 'react';
import type { Meta as StorybookMeta, StoryObj } from '@storybook/react-webpack5';
import { action } from '@storybook/addon-actions';
import { PopupProps } from '../src/types';
import { Popup } from '../src';
import { Button, Center } from './components';

import './index.css';

const Menu = () => (
  <div className="menu">
    <div className="menu-item"> item 1</div>
    <div className="menu-item"> item test </div>
    <div className="menu-item"> item 3</div>
    <Popup
      trigger={<div className="menu-item"> Sub Menu</div>}
      position={['left top', 'left top']}
      on="hover"
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: 'none' }}
      onClose={() => console.log('close ')}
      onOpen={() => console.log('open ')}
      arrow={false}
    >
      <div className="menu">
        <div className="menu-item">Submenu Item 1</div>
        <div className="menu-item">Submenu Item 2</div>
        <div className="menu-item">Submenu Item 3</div>
      </div>
    </Popup>
    <div className="menu-item"> item 4</div>
    <div className="menu-item"> item 5</div>
  </div>
);

type Story = StoryObj<typeof Popup>;

interface Meta extends StorybookMeta<typeof Popup> {
  argTypes?: {
    onOpen?: { action: string };
    onClose?: { action: string };
  };
}

const meta: Meta = {
  title: 'Example/Menu',
  component: Popup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onOpen: { action: 'opened' },
    onClose: { action: 'closed' }
  }
};

export default meta;

export const SimpleMenu: Story = {
  render: () => (
    <Center>
      <Menu />
    </Center>
  ),
};
