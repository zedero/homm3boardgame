import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'ButtonComponent',
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the button',
    },
    clicked: {
      action: 'clicked',
      description: 'Event emitted when the button is clicked',
    },
  },
};
export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    title: 'default button',
    clicked: () => console.log('clicked'),
  },
};
