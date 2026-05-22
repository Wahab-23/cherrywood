import os
import fitz  # PyMuPDF

pdf_file = "/Users/abdulwahab/Sites/cherrywood/public/uploads/Cherrywood Tower Brochure.pdf"
output_dir = "/Users/abdulwahab/Sites/cherrywood/scratch/brochure_pages"
os.makedirs(output_dir, exist_ok=True)

print("Opening PDF...")
doc = fitz.open(pdf_file)
print(f"Number of pages: {len(doc)}")

# Try to extract text using PyMuPDF to see if there's any text
has_text = False
text_content = []
for i in range(len(doc)):
    page = doc[i]
    text = page.get_text()
    if text.strip():
        has_text = True
        text_content.append(f"--- PAGE {i+1} ---\n{text}")

if has_text:
    print("Found text content using PyMuPDF!")
    with open("/Users/abdulwahab/Sites/cherrywood/scratch/pymupdf_text.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(text_content))
else:
    print("No text content found using PyMuPDF either. It is likely scanned or image-only.")

# Let's render all pages to PNG
for i in range(len(doc)):
    page = doc[i]
    pix = page.get_pixmap(dpi=150)  # moderate resolution
    out_path = os.path.join(output_dir, f"page_{i+1:02d}.png")
    pix.save(out_path)
    print(f"Saved {out_path}")

print("Done rendering all pages!")
