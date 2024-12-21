import React, { useState } from 'react';
import type { Meta as StorybookMeta, StoryObj } from '@storybook/react-webpack5';
import { PopupProps } from '../src/types';
import { Popup } from '../src';
import { Button, Center } from './components';
import { POSITION_TYPES } from '../src/Utils';
import { action } from '@storybook/addon-actions';

interface TooltipStoryArgs extends PopupProps {
  children: React.ReactNode;
}

type Story = StoryObj<TooltipStoryArgs>;

interface Meta extends StorybookMeta<typeof Popup> {
  argTypes?: {
    onOpen?: { action: string };
    onClose?: { action: string };
  };
}

const meta: Meta = {
  title: 'Example/Tooltip',
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

export const SimpleTooltip: Story = {
  args: {
    trigger: <Button>Hover Me</Button>,
    children: 'Tooltip content here',
    on: ['hover'],
  },
  render: (args: TooltipStoryArgs) => (
    <Center>
      <Popup {...args} />
    </Center>
  ),
};

export const PositionsTooltip: Story = {
  render: () => (
    <Center>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {POSITION_TYPES.map((position, i) => (
          <Popup
            key={`tooltip-${i}`}
            position={position}
            on={['hover']}
            trigger={
              <Button style={{ padding: 10, margin: 10 }}>{position}</Button>
            }
          >
            <h5>Tooltip with {position} position</h5>
            <p>Tooltip content here</p>
          </Popup>
        ))}
      </div>
    </Center>
  ),
};
