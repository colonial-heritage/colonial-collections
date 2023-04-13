# Components

We divide the components into app-specific and generic components.

## App-specific components

Place the app-specific components in the `/apps/[app-name]/src/app` folder at the same level as the page that uses the component.

## Generic components

Components are generic if they are used in multiple apps. Place these components in the UI package at `/packages/ui`.

You can write generic components as *compound components* with a *dot notation*.

Components divided into little parts that work together to accomplish one task are called compound components. You can read about compound components here:

- https://betterprogramming.pub/compound-component-design-pattern-in-react-34b50e32dea0

If you use dot notation for the compound components, it is called dot notation components. You can read more about dot notation components here:

- https://andreidobrinski.com/blog/react-component-composition-with-dot-notation-exports/
- https://reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type
