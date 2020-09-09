import { Pipe, PipeTransform } from '@angular/core';

import { PLAYER_TYPES } from 'src/app/constants';

@Pipe({
  name: 'showSkill'
})
export class ShowSkillPipe implements PipeTransform {
  transform(skill: any, args?: any): any {
    const skillObj: any = PLAYER_TYPES.filter((type) => type.id === skill);
    return skillObj.length ? skillObj[0].title : '';
  }
}
