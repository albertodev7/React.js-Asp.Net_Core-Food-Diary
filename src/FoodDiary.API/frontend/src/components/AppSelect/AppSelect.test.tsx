import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { SelectOption } from 'src/types';
import AppSelect from './AppSelect';

const TEST_OPTIONS: SelectOption[] = [
  {
    id: 1,
    name: 'John',
  },
  {
    id: 2,
    name: 'Peter',
  },
  {
    id: 3,
    name: 'Kate',
  },
];

type AppSelectTestProps = {
  initialValue?: SelectOption | null;
  allowEmptyOptions?: boolean;
};

const AppSelectTest: React.FC<AppSelectTestProps> = ({
  initialValue = null,
  allowEmptyOptions,
}) => {
  const [value, setValue] = useState<SelectOption | null>(initialValue);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  function getDisplayName({ name }: SelectOption) {
    return name;
  }

  function areOptionsEqual(first: SelectOption, second: SelectOption) {
    return first.name === second.name;
  }

  function handleChange(newValue: SelectOption | null) {
    setValue(newValue);
  }

  function handleOpen() {
    if (optionsLoaded) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setOptions(allowEmptyOptions ? [] : TEST_OPTIONS);
      setIsLoading(false);
      setOptionsLoaded(true);
    }, 50);
  }

  return (
    <AppSelect
      availableOptions={options}
      getDisplayName={getDisplayName}
      areOptionsEqual={areOptionsEqual}
      onChange={handleChange}
      onOpen={handleOpen}
      label="Name"
      placeholder="Select name"
      isLoading={isLoading}
      value={value}
    />
  );
};

test('all options are visible after clicking on input', async () => {
  render(<AppSelectTest />);

  await userEvent.click(screen.getByPlaceholderText(/select name/i));
  await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

  const options = screen.queryAllByRole('option');
  expect(options[0]).toHaveTextContent('John');
  expect(options[1]).toHaveTextContent('Peter');
  expect(options[2]).toHaveTextContent('Kate');
});

test('all options are visible if closed with filtered options and then opened again', async () => {
  render(<AppSelectTest />);

  const input = screen.getByPlaceholderText(/select name/i);
  await userEvent.click(input);
  await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
  await userEvent.type(input, 'Jo');
  await userEvent.click(screen.getByLabelText(/close/i));
  await userEvent.click(screen.getByLabelText(/open/i));

  expect(screen.queryAllByRole('option')[0]).toHaveTextContent('John');
});

test('visible options match input value', async () => {
  render(<AppSelectTest />);

  const input = screen.getByPlaceholderText(/select name/i);
  await userEvent.click(input);
  await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
  await userEvent.type(input, 'Jo');

  expect(screen.queryAllByRole('option')[0]).toHaveTextContent('John');
});

test('no options are visible if input value does not match any existing option', async () => {
  render(<AppSelectTest />);

  const input = screen.getByPlaceholderText(/select name/i);
  await userEvent.click(input);
  await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
  await userEvent.type(input, 'Jack');

  expect(screen.queryAllByRole('option')).toHaveLength(0);
});

test('initializes selected value if it specified', () => {
  render(<AppSelectTest initialValue={TEST_OPTIONS[1]} />);

  expect(screen.getByDisplayValue('Peter')).toBeInTheDocument();
});

test('no options are visible after input is closed', async () => {
  render(<AppSelectTest />);

  const input = screen.getByPlaceholderText(/select name/i);
  await userEvent.click(input);
  await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
  await userEvent.type(input, 'Jo');
  await userEvent.click(screen.getByLabelText(/close/i));

  expect(screen.queryAllByRole('option')).toHaveLength(0);
});

test('no options are visible after clicking on input if autocomplete has no options', async () => {
  render(<AppSelectTest allowEmptyOptions />);

  const input = screen.getByPlaceholderText(/select name/i);
  await userEvent.click(input);
  await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
  await userEvent.type(input, 'Jo');

  expect(screen.queryAllByRole('option')).toHaveLength(0);
});

test('value can be selected', async () => {
  render(<AppSelectTest />);

  const input = screen.getByPlaceholderText(/select name/i);
  await userEvent.click(input);
  await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
  await userEvent.type(input, 'ter');
  await userEvent.click(screen.queryAllByRole('option')[0]);

  expect(input).toHaveValue('Peter');
});

test('value can be changed', async () => {
  render(<AppSelectTest initialValue={TEST_OPTIONS[0]} />);

  const input = screen.getByPlaceholderText(/select name/i);
  await userEvent.click(input);
  await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
  await userEvent.clear(input);
  await userEvent.type(input, 'ter');
  await userEvent.click(screen.queryAllByRole('option')[0]);

  expect(input).toHaveValue('Peter');
});