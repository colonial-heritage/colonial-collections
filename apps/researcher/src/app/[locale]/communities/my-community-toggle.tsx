'use client';

import {useListStore} from '@colonial-collections/list-store';

// A checked checkbox will set the filter 'onlyMyCommunities' to the string 'true'.
// The value must be a string so the list updater can place it into the search params.
export function MyCommunityToggle() {
  const filterChange = useListStore(s => s.filterChange);
  const selectedFilters = useListStore(s => s.selectedFilters);
  const isChecked = selectedFilters.onlyMyCommunities === 'true';

  return (
    <input
      data-testid="my-community-toggle"
      type="checkbox"
      id="onlyMy"
      name="onlyMy"
      checked={isChecked}
      onChange={event =>
        filterChange(
          'onlyMyCommunities',
          event.target.checked ? 'true' : undefined
        )
      }
    />
  );
}
