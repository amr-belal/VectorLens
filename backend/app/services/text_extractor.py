import fitz


class TextExtractor:
    
    def extract_from_pdf(self , file_path:str)->str:
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                page_text = page.get_text()
                if len(page_text.strip()) < 10:
                    pass
                else:
                    text += page.get_text()
                
        # image hint
        if not text.strip():
            text = "This document appears to be an image-based PDF. Consider using OCR for better results."
        return text
    
    
    
if __name__ == "__main__":
    extractor = TextExtractor()
    text = extractor.extract_from_pdf("../data/documents/marcus-sigmod2021_5553afe0.pdf")
    print(text[:500])  