import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

//API to change role of users
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to list car

export const addCar = async (req, res) => {
  try {
    const {_id} = req.user;

    // Parse car data
    let car = JSON.parse(req.body.carData);

    // Check for uploaded file
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const imageFile = req.file;

    // Upload to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // Optimize the image URL
    const optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" }, // resize
        { quality: "auto" }, // ✅ 'auto' must be in quotes
        { format: "webp" }, // convert to webp
      ],
    });

    const image = optimizedImageURL;

    // Save to DB
    await Car.create({ ...car, owner: _id, image });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.error("Add Car Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to list owner cars

export const getOwnerCars = async (req, res) => {
    try {
        const {_id} = req.user
        const cars = await Car.find({owner: _id})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const {_id} = req.user
        const {carId} = req.body
        const car = await Car.findById(carId)


        // Checking is car belongs to user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        car.isAvailable = !car.isAvailable
        await car.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to delete a car 
 
export const deleteCar = async (req, res) => {
    try {
        const {_id} = req.user
        const {carId} = req.body
        const car = await Car.findById(carId)


        // Checking is car belongs to user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        car.owner = null
        car.isAvailable = false

        await car.save()

        res.json({success: true, message: "Car removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard data