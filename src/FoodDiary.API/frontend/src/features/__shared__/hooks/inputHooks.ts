import { TextFieldProps } from '@material-ui/core';
import { KeyboardDatePickerProps } from '@material-ui/pickers';

import createInputHook from './createInputHook';
import createValidatedInputHook from './createValidatedInputHook';

export const useTextInput = createInputHook<string, TextFieldProps>((value, setValue) => ({
  value,
  onChange: event => {
    setValue(event.target.value);
  },
}));

export const useNumericInput = createInputHook<number, TextFieldProps>((value, setValue) => ({
  value,
  onChange: event => {
    setValue(Number(event.target.value));
  },
}));

export const useDateInput = createInputHook<Date | null, KeyboardDatePickerProps>(
  (value, setValue) => ({
    value,
    onChange: newDate => {
      setValue(newDate);
    },
  }),
);

export const useValidatedTextInput = createValidatedInputHook<string, TextFieldProps>(useTextInput);

export const useValidatedNumericInput = createValidatedInputHook<number, TextFieldProps>(
  useNumericInput,
);

export const useValidatedDateInput = createValidatedInputHook<Date | null, KeyboardDatePickerProps>(
  useDateInput,
);
