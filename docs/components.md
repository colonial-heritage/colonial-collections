# Components

We divide the components into page-specific and generic components.

## Page-specific components
Place the page-specific components in the `/app` folder at the same level as the page that uses the component.

## Generic components
Components are generic if they are being used on multiple pages. Place these components in the `/components` folder.

You can write generic components as *compound components* with a *dot notation*.

Writing components in little parts that work together to accomplish one task is called compound components. You can read about compound components here:

- https://betterprogramming.pub/compound-component-design-pattern-in-react-34b50e32dea0

If you use dot notation for the compound components, it is called dot notation components. You can read more about dot notation components here:

- https://andreidobrinski.com/blog/react-component-composition-with-dot-notation-exports/
- https://reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type