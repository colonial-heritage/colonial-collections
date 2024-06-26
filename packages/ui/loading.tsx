import classNames from 'classnames';

interface Props {
  variant: 'blue' | 'green';
}

export function Loading({variant}: Props) {
  const loadingClassName = classNames(
    'w-full min-h-[80vh] flex justify-center items-center',
    {
      'text-consortium-green-500 bg-consortium-green-300': variant === 'green',
      'text-consortium-blue-300 bg-consortium-blue-800': variant === 'blue',
    }
  );
  return (
    <div data-testid="loading-element" className={loadingClassName}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="58"
        height="58"
        viewBox="0 0 58 58"
        className="w-10 h-10 animate-spin"
        fill="currentColor"
      >
        <g id="Loader" transform="translate(-331 -185.463)">
          <rect
            id="Rectangle_89"
            data-name="Rectangle 89"
            width="58"
            height="58"
            transform="translate(331 185.463)"
            fill="none"
          />
          <g
            id="Group_121"
            data-name="Group 121"
            transform="translate(333 190.464)"
          >
            <g
              id="Group_103"
              data-name="Group 103"
              transform="translate(16.651)"
            >
              <path
                id="Path_97"
                data-name="Path 97"
                d="M40.928,22.642a18.888,18.888,0,0,0,10.259-3.007.579.579,0,0,0-.309-1.064H30.99a.579.579,0,0,0-.309,1.064A18.888,18.888,0,0,0,40.94,22.642Z"
                transform="translate(-30.404 -18.57)"
              />
              <path
                id="Path_98"
                data-name="Path 98"
                d="M40.925,26.8A18.941,18.941,0,0,0,51.172,23.8a.579.579,0,0,0-.309-1.064H31a.579.579,0,0,0-.309,1.064A18.941,18.941,0,0,0,40.938,26.8Z"
                transform="translate(-30.402 -17.579)"
              />
              <path
                id="Path_99"
                data-name="Path 99"
                d="M40.93,52.43a18.888,18.888,0,0,0-10.259,3.007A.579.579,0,0,0,30.98,56.5H50.868a.579.579,0,0,0,.309-1.064A18.888,18.888,0,0,0,40.918,52.43Z"
                transform="translate(-30.406 -10.526)"
              />
            </g>
            <g
              id="Group_104"
              data-name="Group 104"
              transform="translate(4.46 6.483)"
            >
              <path
                id="Path_100"
                data-name="Path 100"
                d="M29.125,34.726A18.888,18.888,0,0,0,31.65,24.355a.579.579,0,0,0-1.077-.26L20.635,41.3a.576.576,0,0,0,.755.8,18.962,18.962,0,0,0,7.722-7.376Z"
                transform="translate(-20.556 -23.809)"
              />
              <path
                id="Path_101"
                data-name="Path 101"
                d="M50.839,47.261a18.8,18.8,0,0,0-2.525,10.383.579.579,0,0,0,1.077.26l9.95-17.227a.576.576,0,0,0-.755-.8,18.916,18.916,0,0,0-7.735,7.376Z"
                transform="translate(-13.967 -20.008)"
              />
              <path
                id="Path_102"
                data-name="Path 102"
                d="M54.449,49.338a18.888,18.888,0,0,0-2.525,10.371.579.579,0,0,0,1.077.26l9.938-17.2a.576.576,0,0,0-.755-.8,18.962,18.962,0,0,0-7.722,7.376Z"
                transform="translate(-13.109 -19.512)"
              />
            </g>
            <g
              id="Group_105"
              data-name="Group 105"
              transform="translate(0 6.458)"
            >
              <path
                id="Path_103"
                data-name="Path 103"
                d="M25.526,49.338a18.916,18.916,0,0,0-7.735-7.376.575.575,0,0,0-.755.8l9.95,17.227a.579.579,0,0,0,1.077-.26,19.011,19.011,0,0,0-2.525-10.383Z"
                transform="translate(-16.952 -19.487)"
              />
              <path
                id="Path_104"
                data-name="Path 104"
                d="M29.123,47.258A18.886,18.886,0,0,0,21.4,39.883a.575.575,0,0,0-.755.8l9.938,17.2a.579.579,0,0,0,1.077-.26,18.97,18.97,0,0,0-2.525-10.371Z"
                transform="translate(-16.094 -19.981)"
              />
              <path
                id="Path_105"
                data-name="Path 105"
                d="M50.841,34.73a18.916,18.916,0,0,0,7.735,7.376.575.575,0,0,0,.755-.8l-9.95-17.227a.579.579,0,0,0-1.077.26,19.011,19.011,0,0,0,2.525,10.383Z"
                transform="translate(-9.509 -23.789)"
              />
            </g>
            <path
              id="Path_106"
              data-name="Path 106"
              d="M59.532,44.991a3.389,3.389,0,0,0,0-5.247A17.373,17.373,0,0,1,55.41,34.88a17.642,17.642,0,0,1-2.153-6.015,3.4,3.4,0,0,0-4.542-2.624,17.664,17.664,0,0,1-6.274,1.139,17.565,17.565,0,0,1-6.274-1.139,3.4,3.4,0,0,0-4.542,2.624,17.717,17.717,0,0,1-2.153,6.015,17.446,17.446,0,0,1-4.133,4.864,3.4,3.4,0,0,0,0,5.247,17.82,17.82,0,0,1,6.287,10.866,3.4,3.4,0,0,0,4.542,2.624,17.892,17.892,0,0,1,12.561,0,3.4,3.4,0,0,0,4.542-2.624,17.881,17.881,0,0,1,6.274-10.866Z"
              transform="translate(-15.254 -16.8)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
