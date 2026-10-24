/// <reference types="vite/client" />
/// <reference types="../file-routes.d.ts" />

// unplugin-icons' bundled Solid types use `ComponentProps` from `solid-js`,
// whose Solid 2 version only accepts components, not intrinsic element names.
declare module '~icons/*' {
  import type { ComponentProps, JSX } from '@solidjs/web';

  const component: (props: ComponentProps<'svg'>) => JSX.Element;
  export default component;
}
