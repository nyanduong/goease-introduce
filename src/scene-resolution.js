// Follow browser zoom/HiDPI without allocating an unbounded WebGL buffer.
export function scenePixelRatio(width,height,pixelRatio=1,maxTextureSize=4096){
  if(width<=0||height<=0)return 1;
  const target=Math.max(1.25,Math.min(pixelRatio,4));
  return Math.min(target,Math.sqrt(4_000_000/(width*height)),Math.min(4096,maxTextureSize)/Math.max(width,height));
}
