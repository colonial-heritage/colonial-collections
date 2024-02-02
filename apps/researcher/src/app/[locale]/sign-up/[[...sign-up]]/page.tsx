import {SignUp} from '@clerk/nextjs';
import {headers} from 'next/headers';

export default function Page() {
  // Get the path with the locale preset.
  const activePath = headers().get('x-pathname') || '/sign-up';

  return (
    <div>
      <div className="bg-consortiumBlue-800 text-white">
        <div className="max-w-6xl w-full m-auto px-4 sm:px-10">
          <h1 className="text-xl md:text-4xl py-10 md:py-20">
            Create an account
          </h1>
        </div>
      </div>

      <div className="mx-auto mt-16 px-4 sm:px-10 mb-16 max-w-6xl flex flex-col gap-6 w-full">
        <div className="flex flex-col md:flex-row w-full gap-20">
          <div className="w-full md:w-2/3 flex flex-col gap-6 order-2 md:order-1">
            <div className="flex-col flex gap-2">
              <h2 className="text-xl">Why create an account?</h2>
              <p>
                With an account you you have access to more functionality of
                this website. You can add your narratives to the objects, be
                part of a community or create lists to organise objects.
              </p>
              <p>
                The reason one needs to create an account is that we want to
                know who adds the data. This is one of the ways we prevent
                anonyous spamming.
              </p>

              <div className="flex-col flex gap-4 mt-12">
                <h2 className="text-xl">What can I do with an account</h2>
              </div>

              <div className="flex-col flex gap-4">
                <h3 className="text-lg">Add your narratives to objects</h3>
                <p>
                  One of the most important functionalities is that users can
                  add there narratives to the objects on this site. Users can
                  tell how the objects are being used or give it the name in own
                  language.{' '}
                </p>
                <p>
                  <em>Please note:</em> To add a narrative you need create an
                  account using Google or LinkedIn.
                </p>
              </div>

              <div className="flex-col flex gap-4">
                <h3 className="text-lg">Use communities</h3>
                <p>
                  Communities are groups of people that represent a specific
                  culture or geographical area. Anyone with an account can
                  become a member of a community/ You can also create your own
                  community.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 order-1 md:order-2">
            <div className="w-full p-4 md:sticky top-0 {{> styles/style_form }} rounded-lg min-h-[300px]">
              <div className="-translate-x-5 md:-translate-x-10">
                <SignUp path={activePath} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
