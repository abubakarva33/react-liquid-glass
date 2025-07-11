// global.d.ts
import * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      feTurbulence: React.DetailedHTMLProps<React.SVGAttributes<SVGElement>, SVGElement>;
      feDisplacementMap: React.DetailedHTMLProps<React.SVGAttributes<SVGElement>, SVGElement>;
      animate: React.DetailedHTMLProps<React.SVGAttributes<SVGElement>, SVGElement>;
      filter: React.DetailedHTMLProps<React.SVGAttributes<SVGElement>, SVGElement>;
    }
  }
}
