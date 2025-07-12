import { AbstractControl } from '@angular/forms';

import * as moment from 'moment';

export const DATE_FORMAT = 'DDMMYYYY';

export interface Duration {
  value: number;
  unit: 'years' | 'months';
}

function isValidDate(date: string) {
  if (!date) return true;
  const unmaskedDate = date.replace(/\D/g, '');
  return moment(unmaskedDate, DATE_FORMAT, true).isValid();
}

export const dateValidator = (control: AbstractControl) => {
  return isValidDate(control.value) ? null : { date: true };
};

export const dateRangeValidator = (startControlName: string, endControlName: string, duration: Duration) => {
  return (group: AbstractControl): void => {
    const startControl = group.get(startControlName);
    const endControl = group.get(endControlName);

    if (!startControl?.value || startControl.invalid || !endControl?.value || endControl.invalid) {
      return;
    }

    const startMoment = moment(startControl.value.replace(/\D/g, ''), DATE_FORMAT);
    const endMoment = moment(endControl.value.replace(/\D/g, ''), DATE_FORMAT);
    const diff = endMoment.diff(startMoment, duration.unit, true);

    if (diff > duration.value) {
      endControl.setErrors({ range: { ...duration } });
    } else {
      endControl.setErrors(null);
    }
  };
};
