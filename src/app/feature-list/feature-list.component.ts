import { Component, OnInit } from '@angular/core';
import { FeaturesService } from '../services/features.service';
import { filter, flatMap, reduce, map, debounce, toArray } from 'rxjs/operators';
import { Feature } from "../model/feature.model"
import { interval } from 'rxjs';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss']
})
export class FeatureListComponent implements OnInit {

  features:Feature[] = [];
  showLoad = true;
  errorMessage: string = null;
  constructor(private service: FeaturesService) { }

  ngOnInit() {
    this.getFilteredFeatures(null);
  }

  getFilteredFeatures(searchQuery) {
    this.showLoad = true;
    this.service.loadAll().pipe(
      flatMap(
        (d) => {
          this.features = [];
          return d;
        }
      ),
      filter(
        (data: Feature) => {
          if(searchQuery == null || searchQuery == '') {
            return true;
          }
          
          if(data.id.toLowerCase().indexOf(searchQuery) > -1){
            return true;
          }

          return false;

        }
      ),
      reduce<Feature, Feature[]>(
        (acc: Feature[], d: Feature) => {
          if(!(acc instanceof Array)) {
            acc = [acc];
          }
          acc.push(d);
          return acc;
        }
      )
    ).subscribe(      
      (data) => {
        if(!(data instanceof Array)) {
          return this.features = [data];
        }

        return this.features = data;
      },
      err => console.log(err),
      () => this.showLoad = false
    )
  }

  getFeature(item) {
    if (item && "id" in item) {
      var _item = item.id.split(":");
      if (_item.length == 2) {
        _item = [_item[1]];
      }

      _item = _item[0].split("#");

      return `${_item[0]} ${_item[1]} ${_item[2]}`
    }

  }

  getFeatureParent(item) {
    if (item && "id" in item) {
      var _item = item.id.split(":");
      if (_item.length == 2) {
        return this.getFeature({ "id": _item[0] });
      }
    }
  }

  hasParent(item) {
    if (item && "id" in item) {
      return item.id.indexOf(":") !== -1;
    }
  }

  isOn(flag: Feature) {
    
    if(this.isSync(flag)){
      return false;
    }

    if (flag && "state" in flag) {
      if (flag.state == 'GLOBAL') {
        return true;
      }
    }
    
    return false;
  }

  isOff(flag: Feature) {
    if(this.isSync(flag)){
      return false;
    }

    return !this.isOn(flag);
  }

  isSync(flag: Feature) {
    if(flag.sync) {
      return true;
    }
    return false;
  }

  onPatchFeature(feature: Feature, state: string): void {
    this.update_list_features(feature, state);
  }

  private update_list_features(feature: Feature, state: string) {
    feature.sync = true;
    this.service.updateStatus(feature, state).subscribe(
      resp => {
        let _index = this.features.findIndex(v => v.id == resp.id);
        feature.state = state;
        this.features[_index] = resp;
        feature.sync = false;
      }
    )
  }
}
