import express from "express"
import { updatedUsers, deleteUsers, getUser, getUsers } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/VeriftToken.js";


const router = express.Router();

//checkauth
// router.get("/checkauthentication", verifyToken, (req, res, next) => {
//     res.send("Hello user, you are logged in"); 
// });

// router.get("/checkuser/:id",verifyUser, (req, res, next) => {
//     res.send("Hello user, you are logged in and You can delete your account"); 
// });

// router.get("/checkadmin/:id",verifyAdmin, (req, res, next) => {
//     res.send("Hello ADMIN, you are logged in and You can delete all accounts"); 
// });

//update
router.put("/:id",verifyUser, updatedUsers)
//delete
router.delete("/:id",verifyUser,deleteUsers)
//get specific hotel
router.get("/:id",verifyUser,getUser)
//get all hotels
router.get("/", verifyAdmin,getUsers)

export default router;