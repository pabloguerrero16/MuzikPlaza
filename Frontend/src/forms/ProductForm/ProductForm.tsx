import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import GenreSection from "./GenreSection";
import ArtistSection from "./ArtistSection";
import FormatSection from "./FormatSection";
import ImagesSection from "./ImagesSection";
import { ProductType } from "../../../../Backend/src/shared/types";
import { useEffect } from "react";

export type ProductFormData = {
  name: string;
  genre: string[];
  artist: string;
  format: string;
  releaseDate: Date;
  price: number;
  description: string;
  stock: number;
  imageUrls: string[];
  imageFiles: FileList;
};

type Props = {
  product?: ProductType;
  onSave: (productFormData: FormData) => void;
  isLoading: boolean;
};

const ProductForm = ({ onSave, isLoading, product }: Props) => {
  const formMethods = useForm<ProductFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(product);
  }, [product, reset]);

  const onSubmit = handleSubmit((formDataJson: ProductFormData) => {
    const formData = new FormData();
    if (product) {
      formData.append("productId", product._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("artist", formDataJson.artist);
    formData.append("description", formDataJson.description);
    formData.append("format", formDataJson.format);
    formData.append("stock", formDataJson.stock.toString());
    formData.append("price", formDataJson.price.toString());
    formData.append("releaseDate", formDataJson.releaseDate.toString());
    formDataJson.genre.forEach((genre, index) => {
      formData.append(`genre[${index}]`, genre);
    });

    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
  });
  return (
    <FormProvider {...formMethods}>
      <form
        className="flex flex-col gap-10 mx-5 lg:m-auto md:m-auto"
        onSubmit={onSubmit}
      >
        <DetailsSection />
        <GenreSection />
        <ArtistSection />
        <FormatSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-black text-white p-2 font-bold hover:bg-white hover:text-black text-xl rounded-lg w-44 lg:w-1/6 md:w-1/6 disabled:bg-gray-500 hover:border-2 hover:border-black"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ProductForm;
