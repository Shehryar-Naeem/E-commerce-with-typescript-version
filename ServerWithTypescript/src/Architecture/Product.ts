import mongoose from "mongoose"
export interface PModel extends mongoose.Document{
    name: string;
    discription: string;
    price: string;
    ratings: number;
    images: {
      public_id: string;
      img_url: string;
    }[];
    category: string;
    stock: number;
    noOfReviews: number;
    reviews: {
      _id?: string;
      user: mongoose.Types.ObjectId;
      name: string;
      rating: number;
      comment: string;
    }[];
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    _id: string;
    }