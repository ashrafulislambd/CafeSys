import {
  require_authRecipe_shared2,
  require_emailpassword,
  require_emailpassword_shared2,
  require_emailpassword_shared3,
  require_emailpassword_shared4,
  require_emailpassword_shared5
} from "./chunk-G3QHAW7W.js";
import {
  require_authRecipe_shared,
  require_cookieHandler,
  require_error,
  require_genericComponentOverrideContext,
  require_jsx_runtime,
  require_multifactorauth_shared,
  require_multitenancy,
  require_normalisedURLDomain,
  require_normalisedURLPath2 as require_normalisedURLPath,
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
  require_react
} from "./chunk-VX2H6PUQ.js";
import {
  __commonJS
} from "./chunk-G3PMV62Z.js";

// node_modules/supertokens-auth-react/lib/build/emailpassword.js
var require_emailpassword2 = __commonJS({
  "node_modules/supertokens-auth-react/lib/build/emailpassword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils = require_utils();
    var componentOverrideContext = require_emailpassword_shared2();
    var recipe = require_emailpassword_shared3();
    require_react();
    require_error();
    require_cookieHandler();
    require_normalisedURLDomain();
    require_normalisedURLPath();
    require_windowHandler();
    require_genericComponentOverrideContext();
    require_jsx_runtime();
    require_superTokens();
    require_supertokens_web_js();
    require_postSuperTokensInitCallbacks();
    require_multitenancy();
    require_utils2();
    require_emailpassword();
    require_authRecipe_shared2();
    require_recipeModule_shared();
    require_multifactorauth_shared();
    require_session();
    require_oauth2provider_shared();
    require_oauth2provider();
    require_emailpassword_shared4();
    require_authRecipe_shared();
    require_emailpassword_shared5();
    var Wrapper = (
      /** @class */
      (function() {
        function Wrapper2() {
        }
        Wrapper2.init = function(config) {
          return recipe.EmailPassword.init(config);
        };
        Wrapper2.signOut = function(input) {
          return utils.__awaiter(this, void 0, void 0, function() {
            return utils.__generator(this, function(_a) {
              return [
                2,
                recipe.EmailPassword.getInstanceOrThrow().signOut({
                  userContext: utils.getNormalisedUserContext(
                    input === null || input === void 0 ? void 0 : input.userContext
                  )
                })
              ];
            });
          });
        };
        Wrapper2.submitNewPassword = function(input) {
          return utils.__awaiter(this, void 0, void 0, function() {
            return utils.__generator(this, function(_a) {
              return [
                2,
                recipe.EmailPassword.getInstanceOrThrow().webJSRecipe.submitNewPassword(
                  utils.__assign(utils.__assign({}, input), {
                    userContext: utils.getNormalisedUserContext(input.userContext)
                  })
                )
              ];
            });
          });
        };
        Wrapper2.sendPasswordResetEmail = function(input) {
          return utils.__awaiter(this, void 0, void 0, function() {
            return utils.__generator(this, function(_a) {
              return [
                2,
                recipe.EmailPassword.getInstanceOrThrow().webJSRecipe.sendPasswordResetEmail(
                  utils.__assign(utils.__assign({}, input), {
                    userContext: utils.getNormalisedUserContext(input.userContext)
                  })
                )
              ];
            });
          });
        };
        Wrapper2.signUp = function(input) {
          return utils.__awaiter(this, void 0, void 0, function() {
            return utils.__generator(this, function(_a) {
              return [
                2,
                recipe.EmailPassword.getInstanceOrThrow().webJSRecipe.signUp(
                  utils.__assign(utils.__assign({}, input), {
                    userContext: utils.getNormalisedUserContext(input.userContext)
                  })
                )
              ];
            });
          });
        };
        Wrapper2.signIn = function(input) {
          return utils.__awaiter(this, void 0, void 0, function() {
            return utils.__generator(this, function(_a) {
              return [
                2,
                recipe.EmailPassword.getInstanceOrThrow().webJSRecipe.signIn(
                  utils.__assign(utils.__assign({}, input), {
                    userContext: utils.getNormalisedUserContext(input.userContext)
                  })
                )
              ];
            });
          });
        };
        Wrapper2.doesEmailExist = function(input) {
          return utils.__awaiter(this, void 0, void 0, function() {
            return utils.__generator(this, function(_a) {
              return [
                2,
                recipe.EmailPassword.getInstanceOrThrow().webJSRecipe.doesEmailExist(
                  utils.__assign(utils.__assign({}, input), {
                    userContext: utils.getNormalisedUserContext(input.userContext)
                  })
                )
              ];
            });
          });
        };
        Wrapper2.getResetPasswordTokenFromURL = function(input) {
          return recipe.EmailPassword.getInstanceOrThrow().webJSRecipe.getResetPasswordTokenFromURL(
            utils.__assign(utils.__assign({}, input), {
              userContext: utils.getNormalisedUserContext(
                input === null || input === void 0 ? void 0 : input.userContext
              )
            })
          );
        };
        Wrapper2.ComponentsOverrideProvider = componentOverrideContext.Provider;
        return Wrapper2;
      })()
    );
    var init = Wrapper.init;
    var signOut = Wrapper.signOut;
    var submitNewPassword = Wrapper.submitNewPassword;
    var sendPasswordResetEmail = Wrapper.sendPasswordResetEmail;
    var signUp = Wrapper.signUp;
    var signIn = Wrapper.signIn;
    var doesEmailExist = Wrapper.doesEmailExist;
    var getResetPasswordTokenFromURL = Wrapper.getResetPasswordTokenFromURL;
    var EmailPasswordComponentsOverrideProvider = Wrapper.ComponentsOverrideProvider;
    exports.EmailPasswordComponentsOverrideProvider = EmailPasswordComponentsOverrideProvider;
    exports.default = Wrapper;
    exports.doesEmailExist = doesEmailExist;
    exports.getResetPasswordTokenFromURL = getResetPasswordTokenFromURL;
    exports.init = init;
    exports.sendPasswordResetEmail = sendPasswordResetEmail;
    exports.signIn = signIn;
    exports.signOut = signOut;
    exports.signUp = signUp;
    exports.submitNewPassword = submitNewPassword;
  }
});

// node_modules/supertokens-auth-react/recipe/emailpassword/index.js
var require_emailpassword3 = __commonJS({
  "node_modules/supertokens-auth-react/recipe/emailpassword/index.js"(exports) {
    function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    exports.__esModule = true;
    __export(require_emailpassword2());
  }
});
export default require_emailpassword3();
//# sourceMappingURL=supertokens-auth-react_recipe_emailpassword.js.map
