import { useFormContext } from "react-hook-form";
import { productFormat } from "../../config/product-options-config";
import { ProductFormData } from "./ProductForm";

const FormatSection = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ProductFormData>();
  const formatWatch = watch("format");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Format</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-3">
        {productFormat.map((format) => (
          <label
            className={
              formatWatch === format
                ? "cursor-pointer bg-black text-sm rounded-full text-white px-4 py-2 text-center font-semibold border-2"
                : "cursor-pointer bg-white text-sm rounded-full text-black px-4 py-2 text-center font-semibold border-black border-2"
            }
          >
            <input
              type="radio"
              value={format}
              {...register("format", {
                required: "This field is required",
              })}
              className="hidden"
            />
            <span>{format}</span>
          </label>
        ))}
      </div>
      {errors.format && (
        <span className="text-red-500 text-sm font-bold">
          {errors.format.message}
        </span>
      )}
    </div>
  );
};

export default FormatSection;
