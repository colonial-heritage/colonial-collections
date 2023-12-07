import SearchResults from './search-results';
import Home from './home';

interface Props {
  searchParams?: {[filter: string]: string};
}

export default async function Page({searchParams = {}}: Props) {
  if (searchParams.query) {
    return <SearchResults searchParams={searchParams} />;
  }
  return <Home />;
}
