for f in *.jpg; do
  cwebp -q 80 -m 6 -z 9 -pass 10 -metadata none "$f" -o "${f%.jpg}.webp"
done
