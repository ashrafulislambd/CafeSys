import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

const origin = typeof window !== "undefined" ? window.location.origin : "";

const superTokensTheme = `
[data-supertokens~="container"] {
  --palette-background: 30, 41, 59 !important;
  --palette-inputBackground: 15, 23, 42 !important;
  --palette-inputBorder: 148, 163, 184 !important;
  --palette-primary: 58, 175, 169 !important;
  --palette-primaryBorder: 45, 138, 132 !important;
  --palette-textTitle: 248, 250, 252 !important;
  --palette-textLabel: 226, 232, 240 !important;
  --palette-textInput: 248, 250, 252 !important;
  --palette-textPrimary: 203, 213, 225 !important;
  --palette-textLink: 58, 175, 169 !important;
  --palette-buttonText: 255, 255, 255 !important;
  --palette-textGray: 148, 163, 184 !important;
  --palette-superTokensBrandingBackground: 51, 65, 85 !important;
  --palette-superTokensBrandingText: 148, 163, 184 !important;
  --palette-buttonGreyedOut: 71, 85, 105 !important;

  margin-top: 48px !important;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 24px 45px -28px rgba(0, 0, 0, 0.9) !important;
  background: rgba(30, 41, 59, 0.72) !important;
  backdrop-filter: blur(18px) !important;
  -webkit-backdrop-filter: blur(18px) !important;
}

[data-supertokens~="container"] * {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    sans-serif !important;
}

[data-supertokens~="button"] {
  height: 42px !important;
  border-radius: 10px !important;
  border: 0 !important;
  background: linear-gradient(120deg, #3aafa9 0%, #2d8a84 100%) !important;
  box-shadow: 0 8px 18px rgba(58, 175, 169, 0.3) !important;
}

[data-supertokens~="button"]:hover {
  filter: brightness(1.06);
}

[data-supertokens~="inputWrapper"] {
  height: 42px !important;
  border-radius: 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  background: rgba(15, 23, 42, 0.6) !important;
}

[data-supertokens~="inputWrapper"]:focus-within {
  border-color: rgb(58, 175, 169) !important;
  box-shadow: 0 0 0 3px rgba(58, 175, 169, 0.24) !important;
}

[data-supertokens~="input"]::placeholder {
  color: rgb(148, 163, 184) !important;
}

[data-supertokens~="divider"] {
  border-bottom-color: rgba(255, 255, 255, 0.12) !important;
}

[data-supertokens~="superTokensBranding"] {
  display: none !important;
}
`;

SuperTokens.init({
  appInfo: {
    appName: "IUT Cafeteria",
    apiDomain: origin,
    websiteDomain: origin,
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [EmailPassword.init({ style: superTokensTheme }), Session.init()],
});
