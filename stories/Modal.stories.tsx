import React, { useRef, useState } from 'react';
import type { Meta as StorybookMeta, StoryObj } from '@storybook/react-webpack5';
import { action } from '@storybook/addon-actions';
import { PopupProps } from '../src/types';
import { Popup } from '../src';
import { Button, Center, Content } from './components';

import '../src/index.css';

interface Meta extends StorybookMeta<typeof Popup> {
  argTypes?: {
    onOpen?: { action: string };
    onClose?: { action: string };
  };
}

const meta: Meta = {
  title: 'Example/Modal',
  component: Popup,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

interface ModalStoryArgs extends PopupProps {
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}

type Story = StoryObj<ModalStoryArgs>;

export const SimpleModal: Story = {
  args: {
    trigger: <Button>Click Me</Button>,
    modal: true,
    children: 'Modal content Here',
    onOpen: () => {},
    onClose: () => {}
  },
  render: (args: ModalStoryArgs) => (
    <Center>
      <Popup {...args} />
    </Center>
  ),
};

export const ContentAsFun: Story = {
  args: {
    modal: true,
    trigger: (isOpen: boolean) => (
      <Button>this should work {isOpen ? 'opened' : 'closed'}</Button>
    ),
    children: (close: () => void) => (
      <div>
        <p>Modal content with close function</p>
        <Button onClick={() => close()}>close modal</Button>
      </div>
    ),
  },
};

export const ControlledModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <Center>
        <Button onClick={() => setOpen(prev => !prev)}>
          Toggle Controlled Modal
        </Button>
        <Popup 
          open={open} 
          onClose={() => setOpen(false)}
          modal
          lockScroll
        >
          Controlled Modal Content
        </Popup>
      </Center>
    );
  },
};
