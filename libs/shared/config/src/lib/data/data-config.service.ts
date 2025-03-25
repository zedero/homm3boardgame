import { Injectable } from '@angular/core';
import * as TilesConfig from './json/tiles.json';
import * as DataConfig from './json/data.json';
import * as PortraitsConfig from './json/portraits.json';

type Enum = { [key: string]: number } & { [key: number]: string };
type NonRevEnum = { [key: string]: string };
type Portrait = {
  [key: string]: { image: string; desc: string; faction: string };
};
type ExpansionContents = {
  [key: string]: { TOWN: number; FAR: number; NEAR: number; CENTER: number };
};

type Tile = {
  id: string;
  img: string;
  desc: string;
  expansionID: number;
  groundType: number;
  group: number;
  blocked: number[];
};

@Injectable({
  providedIn: 'root',
})
export class DataConfigService {
  public GROUND_TYPE: Enum = this.arrayToEnum(DataConfig.GROUNDTYPE);
  public GROUP: Enum = this.arrayToEnum(DataConfig.GROUP);
  public GROUP_DESC: NonRevEnum = DataConfig.GROUP_DESC;
  public EXPANSION: Enum = this.arrayToEnum(DataConfig.EXPANSION);
  public PORTRAITS: Portrait = PortraitsConfig.PORTRAITS;
  public FACTIONS: NonRevEnum = DataConfig.FACTIONS;
  public EXPANSION_CONTENTS: ExpansionContents = DataConfig.EXPANSION_CONTENTS;
  public EXPANSION_FILTER_DESC: NonRevEnum = DataConfig.EXPANSION_FILTER_DESC;
  public TILES: Tile[] = this.tileJsonToData({
    ...TilesConfig.TILES,
    ...TilesConfig.RANDOM_TILES,
  });

  private arrayToEnum(arr: string[]) {
    const result: Enum = {};
    arr.forEach((entry: string, index: number) => {
      result[entry] = index;
      result[index] = entry;
    });
    return result;
  }

  private tileJsonToData(data: any) {
    const result = Object.entries(data).map(([key, val]: [string, any]) => {
      val.expansionID = this.EXPANSION[val.expansionID.split('.')[1]];
      val.groundType = this.GROUND_TYPE[val.groundType.split('.')[1]];
      val.group = this.GROUP[val.group.split('.')[1]];
      return [key, val];
    });

    return Object.fromEntries(result);
  }
}
