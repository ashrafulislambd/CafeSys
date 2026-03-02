import {
  require_index2,
  require_multifactorauth,
  require_multifactorauth_shared2,
  require_multitenancy_shared,
  require_sessionClaimValidatorStore2 as require_sessionClaimValidatorStore,
  require_translationContext
} from "./chunk-HDCSRBUP.js";
import {
  require_authRecipe_shared,
  require_cookieHandler,
  require_error,
  require_genericComponentOverrideContext,
  require_jsx_runtime,
  require_multifactorauth_shared,
  require_multitenancy,
  require_normalisedURLDomain,
  require_normalisedURLPath,
  require_normalisedURLPath2,
  require_oauth2provider,
  require_oauth2provider_shared,
  require_postSuperTokensInitCallbacks2 as require_postSuperTokensInitCallbacks,
  require_recipeModule_shared,
  require_session2 as require_session,
  require_superTokens,
  require_supertokens_web_js,
  require_utils,
  require_utils5 as require_utils2,
  require_windowHandler
} from "./chunk-M7WLRBIA.js";
import {
  require_react_dom
} from "./chunk-AU2MKR2E.js";
import {
  require_react
} from "./chunk-VX2H6PUQ.js";
import {
  __commonJS
} from "./chunk-G3PMV62Z.js";

// node_modules/supertokens-auth-react/lib/build/ui-entry.js
var require_ui_entry = __commonJS({
  "node_modules/supertokens-auth-react/lib/build/ui-entry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_utils();
    require_jsx_runtime();
    require_react();
    var uiEntry = require_index2();
    require_superTokens();
    require_error();
    require_cookieHandler();
    require_normalisedURLDomain();
    require_normalisedURLPath2();
    require_windowHandler();
    require_translationContext();
    require_react_dom();
    require_multitenancy_shared();
    require_genericComponentOverrideContext();
    require_multifactorauth_shared2();
    require_multifactorauth();
    require_utils2();
    require_postSuperTokensInitCallbacks();
    require_sessionClaimValidatorStore();
    require_recipeModule_shared();
    require_multifactorauth_shared();
    require_session();
    require_oauth2provider_shared();
    require_oauth2provider();
    require_authRecipe_shared();
    require_normalisedURLPath();
    require_supertokens_web_js();
    require_multitenancy();
    exports.AuthPage = uiEntry.AuthPage;
    exports.AuthPageComponentList = uiEntry.AuthPageComponentList;
    exports.AuthPageFooter = uiEntry.AuthPageFooter;
    exports.AuthPageHeader = uiEntry.AuthPageHeader;
    exports.AuthPageTheme = uiEntry.AuthPageTheme;
    exports.AuthRecipeComponentsOverrideContextProvider = uiEntry.Provider;
    exports.canHandleRoute = uiEntry.canHandleRoute;
    exports.default = uiEntry.UI;
    exports.getRoutingComponent = uiEntry.getRoutingComponent;
    exports.getSuperTokensRoutesForReactRouterDom = uiEntry.getSuperTokensRoutesForReactRouterDom;
    exports.languageTranslations = uiEntry.languageTranslations;
  }
});

// node_modules/supertokens-auth-react/ui/index.js
var require_ui = __commonJS({
  "node_modules/supertokens-auth-react/ui/index.js"(exports) {
    function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    exports.__esModule = true;
    __export(require_ui_entry());
  }
});
export default require_ui();
//# sourceMappingURL=supertokens-auth-react_ui.js.map
