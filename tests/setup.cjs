const Module = require("node:module");
const path = require("node:path");

const originalResolveFilename = Module._resolveFilename;
const buildSrcRoot = path.join(process.cwd(), ".test-build", "src");

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(buildSrcRoot, request.slice(2)),
      parent,
      isMain,
      options,
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
