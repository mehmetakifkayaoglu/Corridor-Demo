import { Global, css } from "@emotion/react";

export const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        box-sizing: border-box;
      }
      html,
      body,
      #root {
        height: 100%;
      }
      body {
        margin: 0;
        overflow: hidden;
        background: #0d0f13;
        color: #e8eef7;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial,
          sans-serif;
      }
    `}
  />
);
