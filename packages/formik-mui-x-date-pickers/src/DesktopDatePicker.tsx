import {
  DesktopDatePicker as MuiDesktopDatePicker,
  DesktopDatePickerProps as MuiDesktopDatePickerProps,
} from '@mui/x-date-pickers/DesktopDatePicker';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { FieldProps, getIn } from 'formik';
import * as React from 'react';
import { createErrorHandler } from './errorHandler';

export interface DesktopDatePickerProps
  extends FieldProps,
    Omit<MuiDesktopDatePickerProps, 'name' | 'value' | 'error'> {
  textField?: TextFieldProps;
}

export function fieldToDesktopDatePicker({
  field: { onChange: _onChange, ...field },
  form: {
    isSubmitting,
    touched,
    errors,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  },
  textField: { helperText, onBlur, ...textField } = {},
  disabled,
  label,
  onChange,
  onError,
  renderInput,
  ...props
}: DesktopDatePickerProps): MuiDesktopDatePickerProps {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    renderInput:
      renderInput ??
      ((params) => (
        <TextField
          {...params}
          error={showError}
          helperText={showError ? fieldError : helperText}
          label={label}
          onBlur={
            onBlur ??
            function () {
              setFieldTouched(field.name, true, true);
            }
          }
          {...textField}
        />
      )),
    disabled: disabled ?? isSubmitting,
    onChange:
      onChange ??
      function (date) {
        // Do not switch this order, otherwise you might cause a race condition
        // See https://github.com/formium/formik/issues/2083#issuecomment-884831583
        setFieldTouched(field.name, true, false);
        setFieldValue(field.name, date, true);
      },
    onError:
      onError ?? createErrorHandler(fieldError, field.name, setFieldError),
    label,
    ...field,
    ...props,
  };
}

export function DesktopDatePicker({
  children,
  ...props
}: DesktopDatePickerProps) {
  return (
    <MuiDesktopDatePicker {...fieldToDesktopDatePicker(props)}>
      {children}
    </MuiDesktopDatePicker>
  );
}

DesktopDatePicker.displayName = 'FormikMUIDesktopDatePicker';
