import {getUserMemberships} from '@/lib/community';
import {objectList} from '@colonial-collections/database';
import {auth} from '@clerk/nextjs';

export default async function AddListForm() {
  const memberships = await getUserMemberships();
  const {userId} = auth();

  async function addList(formData: FormData) {
    'use server';

    const communityId = formData.get('communityId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const userId = formData.get('userId') as string;
    await objectList.createListForCommunity({
      communityId,
      name,
      description,
      userId,
    });
  }

  return (
    <form action={addList}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add list
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Add a personal or community list.
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-8">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name of list
          </label>
          <div className="mt-2">
            <input
              name="name"
              id="name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description (optional)
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="communityId"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Add to community
          </label>
          <select
            id="communityId"
            name="communityId"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {memberships?.map(membership => (
              <option
                key={membership.organization.id}
                value={membership.organization.id}
              >
                {membership.organization.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input type="hidden" name="userId" value={userId || ''} />
      <div className="mt-6 flex items-center gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
