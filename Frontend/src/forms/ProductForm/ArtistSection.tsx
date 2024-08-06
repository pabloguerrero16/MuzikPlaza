import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./ProductForm";
import * as apiClient from "../../api-client";
import { useQuery } from "react-query";

const ArtistSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const {
    data: artists,
    error,
    isLoading,
  } = useQuery("artists", apiClient.getArtists);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading artists</div>;

  const sortedArtists = [...artists].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="lfex flex-col gap-4">
      <label className="text-gray-800 text-sm font-bold flex-1">
        Artist
        <select
          className="border rounded w-full py-1 px-2"
          {...register("artist", { required: "Artist is required" })}
        >
          <option value="" className="font-sans">
            Select an Artist
          </option>
          {sortedArtists.map((artist: { _id: string; name: string }) => (
            <option key={artist._id} value={artist._id} className="font-sans">
              {artist.name}
            </option>
          ))}
        </select>
        {errors.artist && (
          <span className="text-red-500">{errors.artist.message}</span>
        )}
      </label>
    </div>
  );
};

export default ArtistSection;
