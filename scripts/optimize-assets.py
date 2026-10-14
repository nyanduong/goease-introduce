"""Create responsive WebP siblings; original photographs and brand assets stay intact."""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
assets = root / 'dist' / 'assets'
sources = {
    'ha-long': assets / 'halong.png',
    'hoi-an': root / 'qa' / 'source-images' / 'hoi-an.jpg',
    'sa-pa': root / 'qa' / 'source-images' / 'sa-pa.jpg',
    'da-lat': root / 'qa' / 'source-images' / 'da-lat.jpg',
}
for name, source in sources.items():
    if not source.exists():
        continue
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        for width in (480, 960, 1280):
            height = round(image.height * width / image.width)
            image.resize((width, height), Image.Resampling.LANCZOS).save(
                assets / f'{name}-{width}.webp', 'WEBP', quality=84, method=6
            )
for name, source, size in (
    ('goease-logo-small', 'goease-logo.png', 128),
    ('goease-logo-cutout-small', 'goease-logo-cutout.png', 320),
):
    with Image.open(assets / source) as original:
        image = original.convert('RGBA')
        image.thumbnail((size, size), Image.Resampling.LANCZOS)
        image.save(assets / f'{name}.webp', 'WEBP', lossless=True, method=6)
for file in sorted(assets.glob('*.webp')):
    print(f'{file.name}: {file.stat().st_size:,} bytes')
