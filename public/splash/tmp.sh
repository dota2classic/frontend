for file in *.png; do
  cwebp -q 80 -m 6 "$file" -o "${file%.png}.webp"
done
