import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./ProductForm";
import { useCallback, useEffect, useRef, useState } from "react";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ProductFormData>();

  const existingImageUrls = watch("imageUrls");
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  const [files, setFiles] = useState<File[]>([]);
  const galleryRef = useRef<HTMLUListElement | null>(null);

  const addFile = useCallback((file: File) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    selectedFiles.forEach((file) => addFile(file));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    droppedFiles.forEach((file) => addFile(file));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDeleteNew = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  useEffect(() => {
    setValue("imageFiles", files as any);
  }, [files, setValue]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <section className="overflow-auto p-8 w-full h-full flex flex-col">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div className="relative group">
                <img src={url} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <header
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center"
        >
          <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
            <span>Drag and drop your</span>&nbsp;<span>files anywhere or</span>
          </p>
          <input
            id="hidden-input"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            {...register("imageFiles", {
              validate: (imageFiles) => {
                const totalLength =
                  imageFiles.length + (existingImageUrls?.length || 0);
                if (totalLength === 0) {
                  return "Add at least one image";
                }

                if (totalLength > 6) {
                  return "Total number of images should not be more tha 6";
                }
              },
            })}
            onChange={handleFileSelect}
          />
          <label
            htmlFor="hidden-input"
            className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
          >
            Upload a file
          </label>
          {errors.imageFiles && (
            <span className="text-red-500 text-sm font-bold">
              {errors.imageFiles.message}
            </span>
          )}
        </header>

        <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
          To Upload
        </h1>

        <ul
          ref={galleryRef}
          id="gallery"
          className="flex flex-1 flex-wrap -m-1"
        >
          {files.length === 0 && (
            <li
              id="empty"
              className="h-full w-full text-center flex flex-col justify-center items-center"
            >
              <img
                className="mx-auto w-32"
                src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                alt="no data"
              />
              <span className="text-small text-gray-500">
                No files selected
              </span>
            </li>
          )}
          {files.map((file) => (
            <li
              key={file.name}
              className="flex flex-col justify-center items-center"
            >
              <img
                className="w-32"
                src={URL.createObjectURL(file)}
                alt={file.name}
              />
              <h1 className="text-gray-900">{file.name}</h1>
              <span className="text-gray-500">
                {file.size > 1024
                  ? file.size > 1048576
                    ? Math.round(file.size / 1048576) + "mb"
                    : Math.round(file.size / 1024) + "kb"
                  : file.size + "b"}
              </span>
              <button
                onClick={() => handleDeleteNew(file)}
                className="mt-2 px-3 py-1 bg-red-200 hover:bg-red-300 focus:shadow-outline focus:outline-none rounded-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ImagesSection;
