// Pnpm hooks to ensure compatibility with Vercel
module.exports = {
  hooks: {
    readPackage(pkg) {
      return pkg;
    }
  }
};

