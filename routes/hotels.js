import express from "express";
import Hotel from "../models/Hotel.js";
import { countByCity, createHotel, deleteHotel, getHotel, getHotels, updatedHotel } from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/VeriftToken.js";

const router = express.Router();

//create
router.post("/",verifyAdmin, createHotel)
//update
router.put("/:id",verifyAdmin, updatedHotel)
//delete
router.delete("/find/:id",verifyAdmin,deleteHotel)
//get specific hotel
//get all hotels
router.get("/", getHotels)
router.get("/countByCity", countByCity)
router.get("/countByType", getHotels)
router.get("/:id",getHotel)

export default router;
