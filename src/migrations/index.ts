import * as migration_20261006_182330_initial from './20261006_182330_initial';
import * as migration_20261006_183230_r2_storage from './20261006_183230_r2_storage';

export const migrations = [
  {
    up: migration_20261006_182330_initial.up,
    down: migration_20261006_182330_initial.down,
    name: '20261006_182330_initial',
  },
  {
    up: migration_20261006_183230_r2_storage.up,
    down: migration_20261006_183230_r2_storage.down,
    name: '20261006_183230_r2_storage'
  },
];
