import {ReactNode} from 'react';
import Script from 'next/script';

type Props = {
  children: ReactNode;
};

// Even though this component is just passing its children through, the presence
// of this file fixes an issue in Next.js 13.4 where link clicks that switch
// the locale would otherwise cause a full reload.
export default function RootLayout({children}: Props) {
  return (
    <>
      {children}
      <Script
        id="Hotjar"
        dangerouslySetInnerHTML={{
          __html:
            "(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:3748028,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');",
        }}
      />
    </>
  );
}
