import addCsvToDatabase from "@/helpers/addCsvToDatabase";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [fileDragActive, setFileDragActive] = useState(false);
  const [saveKey, setSaveKey] = useState("");

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setFileDragActive(true);
    } else if (e.type === "dragleave") {
      setFileDragActive(false);
    }
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setFileDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleFiles = function (file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      const data = await addCsvToDatabase(e.target.result);
      router.push(data?.saveKey);
    };
    reader.readAsText(file[0]);
  };

  const handleSaveKey = () => {
    if (saveKey) {
      router.push(saveKey);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-12 space-y-6">
      <h1 className="text-xl text-center">
        ETL Tool with Front-End File Upload and Basic Transformation Features
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveKey();
        }}
        className="flex flex-col items-center space-y-3"
      >
        <h4 className="text-lg text-center">
          Enter a save key or upload a new file
        </h4>
        <input
          value={saveKey}
          onChange={(e) => {
            setSaveKey(e.target.value);
          }}
          type="text"
          placeholder="Type here"
          className="w-full max-w-xs input input-bordered"
        />
        <button className="w-32 btn">Go!</button>
      </form>
      <div className="flex items-center justify-center w-1/2 h-full">
        <form
          className="relative w-full text-center h-96"
          onDragEnter={(e) => handleDrag(e, "file")}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            id="input-file-upload"
            className="hidden"
            onChange={handleChange}
          />
          <label
            className={`h-full flex items-center justify-center border-2 border-dashed rounded-md border-gray-600 text-gray-500 cursor-pointer ${
              fileDragActive ? "bg-gray-700" : "bg-transparent"
            }`}
            htmlFor="input-file-upload"
          >
            <div>
              <p>Drag and drop your file here or</p>

              <button
                className="p-1 text-base bg-transparent border-none cursor-pointer hover:underline"
                onClick={onButtonClick}
              >
                Upload a file
              </button>
            </div>
          </label>
          {fileDragActive && (
            <div
              className="absolute inset-0 w-full h-full rounded-2xl"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            ></div>
          )}
        </form>
      </div>
    </div>
  );
}
