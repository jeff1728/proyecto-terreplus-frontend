import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every page.
 * The <head> doesn't need to be provided as it will be inferred from the content.
 *
 * The `ScrollViewStyleReset` component removes the default scrollbar styling on the web.
 *
 * Use this file to define globals css, fonts, or other scripts.
 */
export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                <style dangerouslySetInnerHTML={{
                    __html: `
          /* Leaflet map container height fix */
          .leaflet-container {
            height: 100%;
            width: 100%;
          }
        `}} />

                {/* 
          This is a hack to hide the body scrollbar on web to make it feel like a native app.
        */}
                <ScrollViewStyleReset />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
