'use client';

import {useListStore} from '@colonial-collections/list-store';

// A checked checkbox will set the filter 'onlyMyCommunities' to the string 'true'.
// The value must be a string so the list updater can place it into the search params.
export function MyCommunityToggle() {
  const filterChange = useListStore(s => s.filterChange);

  return (
    <input
      type="checkbox"
      id="onlyMy"
      name="onlyMy"
      onChange={event =>
        filterChange(
          'onlyMyCommunities',
          event.target.checked ? 'true' : undefined
        )
      }
    />
  );
}
