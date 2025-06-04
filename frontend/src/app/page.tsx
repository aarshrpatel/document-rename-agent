"use client";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, UploadCloud } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [classification, setClassification] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);

  const todayKey = new Date().toISOString().split("T")[0];
  useEffect(() => {
    const storedDate = localStorage.getItem("uploadDate");
    let count = 0;
    if (storedDate === todayKey) {
      count = parseInt(localStorage.getItem("uploadCount") || "0", 10);
    } else {
      localStorage.setItem("uploadDate", todayKey);
      localStorage.setItem("uploadCount", "0");
    }
    setUploadCount(count);
  }, [todayKey]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (uploadCount >= 5) {
      setStatus("Daily free upload limit reached. Please sign up for unlimited access.");
      return;
    }

    try {
      setLoadingStep("Uploading");
      setStatus("");
      const formData = new FormData();
      formData.append("file", file!);

      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setFilename(data.filename);

      setLoadingStep("Classifying");
      const classifyRes = await fetch("http://127.0.0.1:8000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: data.filename }),
      });
      const classifyData = await classifyRes.json();
      setClassification(classifyData.classification);

      setLoadingStep("Suggesting");
      const suggestRes = await fetch("http://127.0.0.1:8000/suggest-filenames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: data.filename }),
      });
      const suggestData = await suggestRes.json();
      setSuggestions(suggestData.suggestions ?? []);

      setLoadingStep(null);
      // increment upload count
      const newCount = uploadCount + 1;
      localStorage.setItem("uploadCount", newCount.toString());
      setUploadCount(newCount);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Something went wrong.");
      setLoadingStep(null);
    }
  }

  async function handleRename(newName: string) {
    try {
      setLoadingStep("Renaming");
      await fetch("http://127.0.0.1:8000/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_name: filename, new_name: newName }),
      });
      setSelected(newName);
      setLoadingStep(null);
      setStatus("Renamed successfully!");
    } catch (error) {
      console.error("Rename error:", error);
      setStatus("Rename failed.");
      setLoadingStep(null);
    }
  }

  return (
    <main className="max-w-xl mx-auto flex flex-col items-center gap-6 p-8 rounded-xl shadow-lg bg-background mt-12">
      {/* Intro Hero Section */}
      <section className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Welcome to Document Rename Agent</h2>
        <p className="text-lg text-foreground opacity-80">AI-powered filename suggestions. Free users can upload up to 5 documents per day.</p>
      </section>

      {uploadCount < 5 ? (
        <form onSubmit={handleUpload} className="flex flex-col gap-4 items-center w-full">
          <label className="w-full text-center border-2 border-dashed border-gray-400 p-6 rounded cursor-pointer hover:border-primary-hover transition-colors">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <span className="text-primary font-semibold">{file.name}</span>
            ) : (
              <div className="flex flex-col items-center text-foreground opacity-60">
                <UploadCloud className="w-8 h-8 mb-2 text-primary" />
                <p>Click to upload PDF</p>
              </div>
            )}
          </label>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover disabled:bg-gray-400 transition-colors"
            disabled={!file || !!loadingStep}
          >
            {loadingStep ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" /> {loadingStep}...
              </span>
            ) : (
              "Upload & Classify"
            )}
          </button>

          {status && <div className="text-danger mt-2">{status}</div>}
          {classification && (
            <div className="text-lg text-foreground">
              Classification: <b>{classification}</b>
            </div>
          )}
          {Array.isArray(suggestions) && suggestions.length > 0 && (
            <div className="w-full">
              <h3 className="font-bold text-center mb-2">Suggested Filenames:</h3>
              <ul className="grid grid-cols-1 gap-2">
                {suggestions.map((s) => (
                  <li key={s} className="w-full text-center">
                    <button
                      className="w-full px-4 py-2 bg-success text-white rounded hover:bg-success-hover disabled:opacity-50 transition-colors"
                      onClick={() => handleRename(s)}
                      disabled={!!selected || !!loadingStep}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selected && (
            <div className="text-success flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> File renamed to: <b>{selected}</b>
              </div>
              <a
                href={`http://127.0.0.1:8000/download/${encodeURIComponent(selected)}`}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
                download
              >
                Download File
              </a>
            </div>
          )}
        </form>
      ) : (
        <div className="text-center bg-yellow-100 text-yellow-800 p-6 rounded">
          You have reached your daily free upload limit.{" "}
          <a href="/signup" className="underline font-semibold">
            Sign up
          </a>{" "}
          for unlimited uploads.
        </div>
      )}
    </main>
  );
}