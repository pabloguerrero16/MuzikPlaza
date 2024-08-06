import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./ProductForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DetailsSection = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const selectedDate = watch("releaseDate");
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setValue("releaseDate", date);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">Add Product</h1>
      <label className="text-gray-800 text-sm font-bold flex-1">
        Name
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>

      <div className="lg:flex gap-4 flex-row">
        <label className="text-gray-800 text-sm font-bold lg:flex-1 md:flex-1">
          Price
          <input
            type="number"
            min={1}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && (
            <span className="text-red-500">{errors.price.message}</span>
          )}
          <br />
        </label>
        <label className="text-gray-800 text-sm font-bold lg:flex-1 md:flex-1">
          Stock
          <input
            type="number"
            min={1}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("stock", { required: "Stock is required" })}
          />
          {errors.stock && (
            <span className="text-red-500">{errors.stock.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-800 text-sm font-bold flex-1">
        Release Date
        <DatePicker
          showIcon
          required
          selected={selectedDate ? new Date(selectedDate) : null}
          onChange={handleDateChange}
          className="border rounded w-full py-1 px-2 font-normal"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a Date"
          wrapperClassName="min-w-full"
          showYearDropdown
          scrollableYearDropdown={true}
          yearDropdownItemNumber={50}
        ></DatePicker>
        {errors.releaseDate && (
          <span className="text-red-500">{errors.releaseDate.message}</span>
        )}
      </label>
      <label className="text-gray-800 text-sm font-bold flex-1">
        Description
        <textarea
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>
    </div>
  );
};

export default DetailsSection;
