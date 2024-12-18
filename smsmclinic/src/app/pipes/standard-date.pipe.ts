import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';

@Pipe({
  name: 'standardDate',
})
export class StandardDatePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    return _.isNil(value) || (value && _.toString(value).length < 4)
      ? ''
      : dayjs(value.replace('[UTC]', '')).format('MM/DD/YYYY');
  }
}
