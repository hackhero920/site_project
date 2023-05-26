---
title: 'Next.js/Stitches: Handling Flash of Default Theme'
date: '2023-05-26'
---

If you have chosen Stitches as the styling library for your Next.js app, you have probably noticed the additional configuration required to ensure they work together seamlessly. As per the Stitches docs, we have to include the following code in the `<Head />` element of the Next document:

```tsx {2} showLineNumbers
<Head>
  <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
</Head>
```

If you have created additional themes using Stitches and are applying those themes from `localStorage`, you may notice a momentary flash of your default theme before the correct theme is applied.

The reason for this behavior is that the `getCssText` function of Stitches, which is injected into the `<Head />` element, does not include styles for non-default themes. Consequently, these styles are **not** included in the initial HTML document delivered by Next.js, but are instead loaded client-side. You can confirm this by inspecting the HTML delivered by Next.js on the first load using the Network tab in your browser. You will observe that it does not contain styles for non-default themes.

To resolve this issue, we can generate the CSS for the non-default Stitches theme and append it to the `<style />` element in `_document.tsx`.

First, add the following code snippet to `_document.tsx` in your app:

```ts showLineNumbers
import { Token } from '@stitches/react/types/theme';

type StitchesTheme = typeof stitchesTheme; // Import your non-default Stitches theme and use it here as a type. 

const defineCssVar = (object: string | Token<any, string, any, ''>, value?: string, prefix?: string) => {
  if (typeof object === 'string') {
    return `--${prefix ? `${prefix}-` : ''}${object}: ${value}`;
  }

  return `--${object.scale ? `${object.scale}-` : ''}${object.token}: ${object.value}`;
};

const getThemeCss = (themes: StitchesTheme[]): string => {
  let css = '';

  for (let i = 0; i < themes.length; i++) {
    const themeVars: string[] = Object.values(themes[i].colors).map((value) => `${defineCssVar(value)};`);

    const themeCss: string = `.${themes[i].className}{${themeVars.join('')}}`;

    css += themeCss;
  }

  return css;
};

const themeCss = getThemeCss([stitchesTheme]);
```

The `getThemeCss()` function here parses all the colors of the theme(s) and generates CSS out of them. 

Now, you can take the generated CSS and append it to the `dangerouslySetInnerHTML` prop on the `<style />` element used by Stitches:

``` tsx {5} showLineNumbers
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() + themeCss }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

Now, if you reinspect the HTML document rendered by Next.js, you will notice that the styles of the extra theme(s) are included. Reloading the page should no longer result in a flash of the default theme. 

For reference, here's an example of what the entire `_document.tsx` would look like in my case:

``` tsx showLineNumbers
import { Html, Head, Main, NextScript } from 'next/document';
import { getCssText, lightTheme } from '../../stitches.config'; // path-to/stitches.config
import { type Token } from '@stitches/react/types/theme';

type StitchesTheme = typeof lightTheme; // Import your non-default Stitches theme and use it here as a type.

const defineCssVar = (object: string | Token<any, string, any, ''>, value?: string, prefix?: string) => {
  if (typeof object === 'string') {
    return `--${prefix ? `${prefix}-` : ''}${object}: ${value}`;
  }

  return `--${object.scale ? `${object.scale}-` : ''}${object.token}: ${object.value}`;
};

const getThemeCss = (themes: StitchesTheme[]): string => {
  let css = '';

  for (let i = 0; i < themes.length; i++) {
    const themeVars: string[] = Object.values(themes[i].colors).map((value) => `${defineCssVar(value)};`);

    const themeCss: string = `.${themes[i].className}{${themeVars.join('')}}`;

    css += themeCss;
  }

  return css;
};

const themeCss = getThemeCss([lightTheme]);

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() + themeCss }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```