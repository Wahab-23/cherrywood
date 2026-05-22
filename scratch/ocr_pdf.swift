import Foundation
import Vision
import AppKit

func ocr(imagePath: String) -> String {
    guard let image = NSImage(contentsOfFile: imagePath),
          let tiffData = image.tiffRepresentation,
          let imageSource = CGImageSourceCreateWithData(tiffData as CFData, nil),
          let cgImage = CGImageSourceCreateImageAtIndex(imageSource, 0, nil) else {
        return "Could not load image: \(imagePath)"
    }
    
    var resultText = ""
    let semaphore = DispatchSemaphore(value: 0)
    
    let request = VNRecognizeTextRequest { request, error in
        defer { semaphore.signal() }
        if let error = error {
            resultText = "Error: \(error.localizedDescription)"
            return
        }
        guard let observations = request.results as? [VNRecognizedTextObservation] else {
            return
        }
        let recognizedStrings = observations.compactMap { observation in
            observation.topCandidates(1).first?.string
        }
        resultText = recognizedStrings.joined(separator: "\n")
    }
    
    request.recognitionLevel = .accurate
    
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
        semaphore.wait()
    } catch {
        resultText = "Failed to perform request: \(error.localizedDescription)"
    }
    
    return resultText
}

let pagesDir = "/Users/abdulwahab/Sites/cherrywood/scratch/brochure_pages"
let fm = FileManager.default
do {
    let files = try fm.contentsOfDirectory(atPath: pagesDir)
    let pngFiles = files.filter { $0.hasSuffix(".png") }.sorted()
    
    var fullText = ""
    for file in pngFiles {
        let fullPath = (pagesDir as NSString).appendingPathComponent(file)
        print("OCRing \(file)...")
        let text = ocr(imagePath: fullPath)
        fullText += "\n--- PAGE \(file) ---\n"
        fullText += text
        fullText += "\n"
    }
    
    let outputPath = "/Users/abdulwahab/Sites/cherrywood/scratch/brochure_ocr.txt"
    try fullText.write(toFile: outputPath, atomically: true, encoding: .utf8)
    print("Done! OCR results saved to \(outputPath)")
} catch {
    print("Error: \(error)")
}
