import sys
import pypdf

def extract_text(pdf_path, txt_path):
    print(f"Reading from {pdf_path}...")
    reader = pypdf.PdfReader(pdf_path)
    num_pages = len(reader.pages)
    print(f"Total pages: {num_pages}")
    
    with open(txt_path, "w", encoding="utf-8") as f:
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            f.write(f"\n--- PAGE {i + 1} ---\n")
            f.write(text)
            f.write("\n")
            print(f"Extracted page {i+1}/{num_pages}")

if __name__ == "__main__":
    pdf_file = "/Users/abdulwahab/Sites/cherrywood/public/uploads/Cherrywood Tower Brochure.pdf"
    txt_file = "/Users/abdulwahab/Sites/cherrywood/scratch/brochure_text.txt"
    extract_text(pdf_file, txt_file)
