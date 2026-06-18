/** react-native-svg cannot parse CSS variables from Figma-exported SVGs */
export function prepareSvgForNative(svg: string): string {
  return svg
    .replace(/var\(--[^,]+,\s*([^)]+)\)/g, '$1')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\swidth="100%"/g, '')
    .replace(/\sheight="100%"/g, '');
}
