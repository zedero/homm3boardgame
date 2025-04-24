import { Injectable, Signal, signal } from '@angular/core';
import * as TilesConfig from './json/tiles.json';
import * as DataConfig from './json/data.json';
import * as PortraitsConfig from './json/portraits.json';

type Enum = { [key: string]: number } & { [key: number]: string };
type NonRevEnum = { [key: string]: string };
type Portrait = {
  image: string;
  desc: string;
  faction: string;
};
type ExpansionContents = {
  [key: string]: { TOWN: number; FAR: number; NEAR: number; CENTER: number };
};

type TileConfig = {
  id: string;
  img: string;
  desc: string;
  expansionID: number;
  groundType: number;
  group: number;
  blocked: number[];
};

interface TileMap {
  [key: string]: TileConfig;
}

interface PortraitMap {
  [key: string]: Portrait;
}

@Injectable({
  providedIn: 'root',
})
export class DataConfigService {
  public GROUND_TYPE: Signal<Enum> = signal(
    this.arrayToEnum(DataConfig.GROUNDTYPE)
  );
  public GROUP: Signal<Enum> = signal(this.arrayToEnum(DataConfig.GROUP));
  public GROUP_DESC: Signal<NonRevEnum> = signal(DataConfig.GROUP_DESC);
  public EXPANSION: Signal<Enum> = signal(
    this.arrayToEnum(DataConfig.EXPANSION)
  );
  public PORTRAITS: Signal<PortraitMap> = signal(PortraitsConfig.PORTRAITS);
  public FACTIONS: Signal<NonRevEnum> = signal(DataConfig.FACTIONS);
  public EXPANSION_CONTENTS: Signal<ExpansionContents> = signal(
    DataConfig.EXPANSION_CONTENTS
  );
  public EXPANSION_FILTER_DESC: Signal<NonRevEnum> = signal(
    DataConfig.EXPANSION_FILTER_DESC
  );
  public TILES: Signal<TileMap> = signal(
    this.tileJsonToData({
      ...TilesConfig.TILES,
      ...TilesConfig.RANDOM_TILES,
    })
  );

  public filterOptions = {
    RANDOM: true,
    CORE: true,
    TOWER: true,
    RAMPART: true,
    FORTRESS: true,
    INFERNO: true,
  };

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
      val.expansionID = this.EXPANSION()[val.expansionID.split('.')[1]];
      val.groundType = this.GROUND_TYPE()[val.groundType.split('.')[1]];
      val.group = this.GROUP()[val.group.split('.')[1]];
      return [key, val];
    });

    return Object.fromEntries(result);
  }

  public getTileGroupById(id: string) {
    const tile: TileConfig = this.TILES()[id];
    const group = this.GROUP()[tile.group];
    if (group) {
      return group;
    }
    return null;
  }
}
