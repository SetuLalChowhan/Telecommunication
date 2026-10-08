/**
 * Type shim for `helmet` v8 under `moduleResolution: nodenext`.
 *
 * helmet's package.json points `"types"` to `./index.d.cts` (a CJS
 * declaration) but the `exports.import` path resolves to `./index.mjs` which
 * carries no separate `.d.mts` declaration.  TypeScript 6 + nodenext
 * therefore sees the CTS namespace as non-callable (TS2349).
 *
 * This shim re-exports the full public surface from the CTS declaration while
 * marking the default export as a callable `Helmet` function so the type
 * checker is satisfied in ESM files.
 */
declare module 'helmet' {
  export { default } from 'helmet/index.d.cts';
  export * from 'helmet/index.d.cts';
}
