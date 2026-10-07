import * as migration_20261006_182330_initial from './20261006_182330_initial';
import * as migration_20261006_183230_r2_storage from './20261006_183230_r2_storage';
import * as migration_20261006_210304_mission_blocks from './20261006_210304_mission_blocks';
import * as migration_20261006_213423_more_pages from './20261006_213423_more_pages';
import * as migration_20261006_214846_locations from './20261006_214846_locations';
import * as migration_20261006_215011_gallery_names from './20261006_215011_gallery_names';
import * as migration_20261006_215228_listing_sections from './20261006_215228_listing_sections';
import * as migration_20261006_215559_co_living_sections from './20261006_215559_co_living_sections';
import * as migration_20261006_220612_rooms_and_old_oak from './20261006_220612_rooms_and_old_oak';
import * as migration_20261006_222059_hero_button from './20261006_222059_hero_button';
import * as migration_20261006_223713_navigation from './20261006_223713_navigation';
import * as migration_20261006_224517_contact_details from './20261006_224517_contact_details';
import * as migration_20261006_225143_shared_globals from './20261006_225143_shared_globals';
import * as migration_20261006_230016_working_standard_list from './20261006_230016_working_standard_list';
import * as migration_20261006_231629_pricing_settings from './20261006_231629_pricing_settings';
import * as migration_20261006_232454_templates from './20261006_232454_templates';
import * as migration_20261006_233437_remove_location_pages from './20261006_233437_remove_location_pages';
import * as migration_20261007_000623_structured_pricing from './20261007_000623_structured_pricing';

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
    name: '20261006_220612_rooms_and_old_oak',
  },
  {
    up: migration_20261006_222059_hero_button.up,
    down: migration_20261006_222059_hero_button.down,
    name: '20261006_222059_hero_button',
  },
  {
    up: migration_20261006_223713_navigation.up,
    down: migration_20261006_223713_navigation.down,
    name: '20261006_223713_navigation',
  },
  {
    up: migration_20261006_224517_contact_details.up,
    down: migration_20261006_224517_contact_details.down,
    name: '20261006_224517_contact_details',
  },
  {
    up: migration_20261006_225143_shared_globals.up,
    down: migration_20261006_225143_shared_globals.down,
    name: '20261006_225143_shared_globals',
  },
  {
    up: migration_20261006_230016_working_standard_list.up,
    down: migration_20261006_230016_working_standard_list.down,
    name: '20261006_230016_working_standard_list',
  },
  {
    up: migration_20261006_231629_pricing_settings.up,
    down: migration_20261006_231629_pricing_settings.down,
    name: '20261006_231629_pricing_settings',
  },
  {
    up: migration_20261006_232454_templates.up,
    down: migration_20261006_232454_templates.down,
    name: '20261006_232454_templates',
  },
  {
    up: migration_20261006_233437_remove_location_pages.up,
    down: migration_20261006_233437_remove_location_pages.down,
    name: '20261006_233437_remove_location_pages',
  },
  {
    up: migration_20261007_000623_structured_pricing.up,
    down: migration_20261007_000623_structured_pricing.down,
    name: '20261007_000623_structured_pricing'
  },
];
