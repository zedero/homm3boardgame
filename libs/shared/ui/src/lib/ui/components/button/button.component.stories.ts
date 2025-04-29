import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'text',
      description: 'The theme of the button (e.g., primary, secondary)',
    },
    iconLeft: {
      control: 'text',
      description: 'Icon displayed on the left side of the button',
    },
    iconRight: {
      control: 'text',
      description: 'Icon displayed on the right side of the button',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button when true',
    },
  },
};
export default meta;

type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    theme: 'primary',
    iconLeft: 'gear',
    iconRight: 'right-icon',
    ariaLabel: 'Primary Button',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <homm-button>Primary Button</homm-button>`,
  }),
};

export const Icon: Story = {
  args: {
    iconLeft: 'gear',
    ariaLabel: 'Icon Button',
  },
};

export const IconWithText: Story = {
  args: {
    theme: 'primary',
    iconLeft: 'left-long',
    iconRight: 'right-long',
    ariaLabel: 'Primary Button',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <homm-button 
        [theme]="theme" 
        [iconLeft]="iconLeft" 
        [iconRight]="iconRight" 
        [ariaLabel]="ariaLabel" 
        [disabled]="disabled"
      >Primary Button</homm-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    theme: 'secondary',
    ariaLabel: 'Secondary Button',
  },
  render: (args) => ({
    props: args,
    template: `
      <homm-button 
        [theme]="theme"
      >Primary Button</homm-button>`,
  }),
};
