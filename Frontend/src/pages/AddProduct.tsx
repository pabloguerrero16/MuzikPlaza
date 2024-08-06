import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import ProductForm from "../forms/ProductForm/ProductForm";

const AddProduct = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addProduct, {
    onSuccess: () => {
      showToast({ message: "Product Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Product", type: "ERROR" });
    },
  });

  const handleSave = (productFormData: FormData) => {
    mutate(productFormData);
  };
  return <ProductForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddProduct;
