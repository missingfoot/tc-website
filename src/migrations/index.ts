import * as migration_20261006_182330_initial from './20261006_182330_initial';
import * as migration_20261006_183230_r2_storage from './20261006_183230_r2_storage';
import * as migration_20261006_210304_mission_blocks from './20261006_210304_mission_blocks';
import * as migration_20261006_213423_more_pages from './20261006_213423_more_pages';
import * as migration_20261006_214846_locations from './20261006_214846_locations';
import * as migration_20261006_215011_gallery_names from './20261006_215011_gallery_names';
import * as migration_20261006_215228_listing_sections from './20261006_215228_listing_sections';
import * as migration_20261006_215559_co_living_sections from './20261006_215559_co_living_sections';
import * as migration_20261006_220612_rooms_and_old_oak from './20261006_220612_rooms_and_old_oak';

export const migrations = [
  {
    up: migration_20261006_182330_initial.up,
    down: migration_20261006_182330_initial.down,
    name: '20261006_182330_initial',
  },
  {
    up: migration_20261006_183230_r2_storage.up,
    down: migration_20261006_183230_r2_storage.down,
    name: '20261006_183230_r2_storage',
  },
  {
    up: migration_20261006_210304_mission_blocks.up,
    down: migration_20261006_210304_mission_blocks.down,
    name: '20261006_210304_mission_blocks',
  },
  {
    up: migration_20261006_213423_more_pages.up,
    down: migration_20261006_213423_more_pages.down,
    name: '20261006_213423_more_pages',
  },
  {
    up: migration_20261006_214846_locations.up,
    down: migration_20261006_214846_locations.down,
    name: '20261006_214846_locations',
  },
  {
    up: migration_20261006_215011_gallery_names.up,
    down: migration_20261006_215011_gallery_names.down,
    name: '20261006_215011_gallery_names',
  },
  {
    up: migration_20261006_215228_listing_sections.up,
    down: migration_20261006_215228_listing_sections.down,
    name: '20261006_215228_listing_sections',
  },
  {
    up: migration_20261006_215559_co_living_sections.up,
    down: migration_20261006_215559_co_living_sections.down,
    name: '20261006_215559_co_living_sections',
  },
  {
    up: migration_20261006_220612_rooms_and_old_oak.up,
    down: migration_20261006_220612_rooms_and_old_oak.down,
    name: '20261006_220612_rooms_and_old_oak'
  },
];
