/** @const */
const REDOC_CONFIG = {
  title: "API Docs",
  specUrl: "/docs/swagger.json",
  nonce: "", // <= it is optional,we can omit this key and value
  // we are now start supporting the redocOptions object
  // you can omit the options object if you don't need it
  // https://redocly.com/docs/api-reference-docs/configuration/functionality/
  redocOptions: {
    theme: {
      colors: {
        primary: {
          main: "#6EC5AB",
        },
      },
      typography: {
        fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
        fontSize: "15px",
        lineHeight: "1.5",
        code: {
          code: "#87E8C7",
          backgroundColor: "#4D4D4E",
        },
      },
      menu: {
        backgroundColor: "#ffffff",
      },
    },
  },
};

export default REDOC_CONFIG;
