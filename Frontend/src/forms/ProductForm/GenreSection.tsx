import { useState } from "react";
import * as apiClient from "../../api-client";
import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./ProductForm";
import { useQuery } from "react-query";
import { TiDeleteOutline } from "react-icons/ti";

interface Genre {
  _id: string;
  name: string;
}

const GenreSection = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormData>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

  const {
    data: genres = [],
    error,
    isLoading,
  } = useQuery<Genre[]>("genres", apiClient.getGenres);

  const filteredGenres = genres.filter((genre: Genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenreSelect = (genre: Genre) => {
    if (!selectedGenres.find((g) => g._id === genre._id)) {
      const updatedGenres = [...selectedGenres, genre];
      setSelectedGenres(updatedGenres);
      setValue(
        "genre",
        updatedGenres.map((g) => g._id)
      );
      setSearchTerm("");
    }
  };

  const handleRemoveGenre = (genreId: string) => {
    const updatedGenres = selectedGenres.filter((g) => g._id !== genreId);
    setSelectedGenres(updatedGenres);
    setValue(
      "genre",
      updatedGenres.map((g) => g._id)
    );
  };

  if (isLoading) return <div>Loading genres...</div>;
  if (error) return <div>Error fetching genres</div>;

  return (
    <div className="flex flex-col gap-4">
      <label className="text-gray-700 text-sm font-bold flex-1">Genres</label>
      {errors.genre && (
        <span className="text-red-500 text-sm">{errors.genre.message}</span>
      )}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {selectedGenres.map((genre) => (
            <div
              key={genre._id}
              className="bg-gray-200 rounded p-1 flex items-center"
            >
              <span>{genre.name}</span>
              <button
                type="button"
                className="ml-2 text-red-500 justify-center"
                onClick={() => handleRemoveGenre(genre._id)}
              >
                <TiDeleteOutline />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="text"
        className="border rounded w-full py-1 px-2 font-normal mt-2"
        placeholder="Search genres..."
        value={searchTerm}
        {...register("genre", {
          validate: (genres) => {
            if (genres && genres.length > 0) {
              return true;
            } else {
              return "Select at least one Genre";
            }
          },
        })}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <div className="border rounded mt-2 max-h-40 overflow-y-auto">
          {filteredGenres.map((genre: Genre) => (
            <div
              key={genre._id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleGenreSelect(genre)}
            >
              {genre.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreSection;
