import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'testpage'
})
export class TestpagePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
