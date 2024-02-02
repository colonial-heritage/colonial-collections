import {create} from 'zustand';

export const useLastSearch = create(() => ({lists: new Map()}));

export function saveLastSearch(baseUrl: string, urlWithSearchParams: string) {
  useLastSearch.setState(prev => ({
    lists: new Map(prev.lists).set(baseUrl, urlWithSearchParams),
  }));
}

export function getLastSearch(baseUrl: string) {
  return useLastSearch.getState().lists.get(baseUrl) || baseUrl;
}
