import express, { Request, Response } from "express";
import Product from "../models/product";
import Genre from "../models/genre";
import Artist from "../models/artist";
import { ProductType } from "../shared/types";
import { verifyToken, checkAdmin } from "../middleware/auth";
import multer from "multer";
import { body } from "express-validator";
import cloudinary from "cloudinary";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Add Product => /api/admin-products
router.post(
  "/",
  verifyToken,
  checkAdmin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("genre").notEmpty().isArray().withMessage("Genres is required"),
    body("artist").notEmpty().withMessage("Artist is required"),
    body("format").notEmpty().withMessage("Format is Required"),
    body("releaseDate")
      .notEmpty()
      .withMessage("Release Date is required")
      .isISO8601()
      .withMessage("Date must be in a valid Format"),
    body("price").notEmpty().isISO8601().withMessage("Price is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("stock").notEmpty().isNumeric().withMessage("Stock is required"),
  ],
  upload.array("imageFiles", 5),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newProduct: ProductType = req.body;

      // Upload Images to Cloudinary
      const imageUrls = await uploadImages(imageFiles);

      // Save Images URLs to the Product
      newProduct.imageUrls = imageUrls;
      newProduct.lastUpdated = new Date();

      // Save to Database
      const product = new Product(newProduct);
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      console.log("Error adding Product: ", error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
);

// Get Products => /api/admin-products
router.get(
  "/",
  verifyToken,
  checkAdmin,
  async (req: Request, res: Response) => {
    try {
      const products = await Product.find()
        .populate({
          path: "genre",
          select: "name",
        })
        .populate({
          path: "artist",
          select: "name",
        })
        .exec();

      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products: ", error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
);

// Add Genre => /api/admin-products/genre
router.post(
  "/genre",
  verifyToken,
  checkAdmin,
  [body("name").notEmpty().withMessage("Genre Name is Required")],
  async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const existingGenre = await Genre.findOne({ name });
      if (existingGenre) {
        return res.status(400).json({ message: "Genre already exists" });
      }

      const newGenre = new Genre({ name });
      await newGenre.save();
      res.status(201).json(newGenre);
    } catch (error) {
      console.log("Error adding Genre: ", error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
);

// Get Genres => /api/admin-products/genre
router.get(
  "/genre",
  verifyToken,
  checkAdmin,
  async (req: Request, res: Response) => {
    try {
      const genres = await Genre.find();
      res.status(200).json(genres);
    } catch (error) {
      console.log("Error fetching Genres: ", error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
);

// Add Artist => /api/admin-products/artist
router.post(
  "/artist",
  verifyToken,
  checkAdmin,
  [body("name").notEmpty().withMessage("Artsit Name is Required")],
  async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const existingArtist = await Artist.findOne({ name });
      if (existingArtist) {
        return res.status(400).json({ message: "Artisrt already exists" });
      }

      const newArtsist = new Artist({ name });
      await newArtsist.save();
      res.status(201).json(newArtsist);
    } catch (error) {
      console.log("Error adding Genre: ", error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
);

// Get Artists => /api/admin-products/artist
router.get(
  "/artist",
  verifyToken,
  checkAdmin,
  async (req: Request, res: Response) => {
    try {
      const artists = await Artist.find();
      res.status(200).json(artists);
    } catch (error) {
      console.log("Error fetching Artists: ", error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
);

// Upload Images to Cloudinary
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
