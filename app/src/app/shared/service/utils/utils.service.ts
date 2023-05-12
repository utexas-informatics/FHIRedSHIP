import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  sortParams(url: any) {
    let queryParams = url.split('?')[1];
    let params = queryParams ? queryParams.split('&'):[];
    let pair = null;
    let data:any = {};
    params.forEach((d:any) => {
      pair = d.split('=');
      data[`${pair[0]}`] = pair[1];
    });
    if(Object.keys(data).length !== 0){
      data['tm'] = Date.now();
    }
    return data;
};
}
