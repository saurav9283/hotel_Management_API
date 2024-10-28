import Hotel from "../models/Hotel.js";
import Room from "../models/Rooms.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json({ mag: "hotel saved!", savedHotel });
  } catch (err) {
    next(err);
  }
};

export const updatedHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getHotelsByQuery = async (req, res, next) => {
  const { city, min, max } = req.query;
  // console.log(city,min,max,"kjhgf")
  
  try {
    const hotels = await Hotel.find({
      city: city,
      cheapestPrice: { $gte: min || 0, $lte: max || 1500 }
    });
    // console.log(hotels)
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({featured:true}).limit(req.query)
    res.status(200).json(hotels);
  } 
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map(async (city) => {
        return await Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({type : "hotel"})
    const appartmentCount =await Hotel.countDocuments({type : "appartments"})
    const resortCount =await Hotel.countDocuments({type : "resorts"})
    const villsCount =await Hotel.countDocuments({type : "villa"})
    const cabinCount =await Hotel.countDocuments({type : "cabin"})
    res.status(200).json([
      {type:"hotel" , count: hotelCount},
      {type:"appartments" , count: appartmentCount},
      {type:"resorts" , count: resortCount},
      {type:"villas" , count: villsCount},
      {type:"cabins" , count: cabinCount},
    ]);
  } catch (err) {
    next(err);
  }
};


export const gethotelRooms = async (req,res,next)=>{
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
      const list = await Promise.all(hotel?.rooms?.map(async (room) => {
          return await Room.findById(room);
    }))
    res.status(200).json(list);
  } catch (error) {
    console.log(error)
    next(error)
  }
}