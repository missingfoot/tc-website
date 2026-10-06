import * as migration_20261006_182330_initial from './20261006_182330_initial';

export const migrations = [
  {
    up: migration_20261006_182330_initial.up,
    down: migration_20261006_182330_initial.down,
    name: '20261006_182330_initial'
  },
];
