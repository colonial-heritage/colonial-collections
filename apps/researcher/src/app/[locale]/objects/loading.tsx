import Tabs from '@/components/tabs';

export default async function Loading() {
  return (
    <>
      <Tabs />

      <div className="flex flex-col md:flex-row gap-6">
        <aside
          id="facets"
          className="hidden md:flex w-full md:w-1/3 flex-row md:flex-col gap-10 overscroll-x-auto flex-nowrap border-white border-r-2"
        ></aside>

        <section className="w-full md:w-2/3 gap-6 flex flex-col">
          <div className="flex flex-1 flex-col space-y-2 p-6">
            <div className="bg-sand-100 h-4 w-3/4 rounded"></div>
            <div className="bg-sand-100 h-4 w-1/2 rounded mt-12"></div>
          </div>

          <div className="group relative flex flex-col overflow-hidden drop-shadow-md bg-white min-h-[150px] animate-pulse opacity-80">
            <div className="flex flex-1 flex-col space-y-2 p-6">
              <div className="bg-sand-100 h-4 w-3/4 rounded"></div>
            </div>
          </div>

          <div className="group relative flex flex-col overflow-hidden drop-shadow-md bg-white min-h-[150px] animate-pulse opacity-60">
            <div className="flex flex-1 flex-col space-y-2 p-6">
              <div className="bg-sand-100 h-4 w-1/4 rounded"></div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
