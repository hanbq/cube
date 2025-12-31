import { Palette, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    login?: {
      background?: string;
      backgroundRadial?: string;
      backgroundLinear?: string;
      cardBackground?: string;
      cardBorder?: string;
      buttonGradient?: string;
      buttonHoverGradient?: string;
      inputBackground?: string;
      inputBorder?: string;
      inputBorderHover?: string;
      borderTop?: string;
    };
  }

  interface PaletteOptions {
    login?: {
      background?: string;
      backgroundRadial?: string;
      backgroundLinear?: string;
      cardBackground?: string;
      cardBorder?: string;
      buttonGradient?: string;
      buttonHoverGradient?: string;
      inputBackground?: string;
      inputBorder?: string;
      inputBorderHover?: string;
      borderTop?: string;
    };
  }
}