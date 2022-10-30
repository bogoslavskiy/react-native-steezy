export function createDynamicStyleVars<TVars>(dynamicVarsHook: () => TVars) {
  return dynamicVarsHook;
}
