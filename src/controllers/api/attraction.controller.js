import Attraction from "../../models/attraction.js";
import Day from "../../models/day.js";

export const getAttractions = async (req, res) => {
  const { dayId } = req.params;

  try {
    // 獲取所有跟 dayId 相關的 attraction
    const attractions = await Attraction.findAll({
      where: {
        dayId,
      },
    });

    if (!attractions) {
      return res
        .status(404)
        .json({ status: "error", message: "Attractions not found" });
    }

    return res.status(200).json({ status: "success", data: attractions });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const createAttraction = async (req, res) => {
  const { dayId } = req.params;
  const { googlePlaceId, previousAttractionId } = req.body;

  try {
    const day = await Day.findByPk(dayId);
    const attraction = await Attraction.create({
      dayId,
      googlePlaceId,
    });

    if (day.startAttractionId === null) {
      await day.update({ startAttractionId: attraction.id });
    } else {
      const previousAttraction = await Attraction.findByPk(
        previousAttractionId
      );
      await previousAttraction.update({ nextAttractionId: attraction.id });
    }

    return res.status(201).json({ status: "success", data: attraction });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const deleteAttraction = async (req, res) => {};

export const updateAttractionTime = async (req, res) => {};

export const updateAttractionNote = async (req, res) => {};
