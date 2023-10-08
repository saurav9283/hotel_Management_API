import express from "express";
import { verifyAdmin } from "../utils/VeriftToken.js";
import { createRoom, deleteRoom, getRoom, getRooms, updatedRoom } from "../controllers/room.js";

const router = express.Router();

//create
router.post("/:hotelid",verifyAdmin, createRoom)
//update
router.put("/:id",verifyAdmin, updatedRoom)
//delete
router.delete("/:id/:hotelid",verifyAdmin,deleteRoom)
//get specific hotel
router.get("/:id",getRoom)
//get all hotels
router.get("/", getRooms)

export default router;
