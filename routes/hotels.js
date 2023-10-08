import express from "express";
import Hotel from "../models/Hotel.js";
import { createHotel, deleteHotel, getHotel, getHotels, updatedHotel } from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/VeriftToken.js";

const router = express.Router();

//create
router.post("/",verifyAdmin, createHotel)
//update
router.put("/:id",verifyAdmin, updatedHotel)
//delete
router.delete("/:id",verifyAdmin,deleteHotel)
//get specific hotel
router.get("/:id",getHotel)
//get all hotels
router.get("/", getHotels)

export default router;
