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
  const { googlePlaceId, preAttractionId } = req.body;

  try {
    const day = await Day.findByPk(dayId);
    const attraction = await Attraction.create({
      dayId,
      googlePlaceId,
    });

    if (day.startAttractionId === null) {
      await day.update({ startAttractionId: attraction.id });
    } else {
      const preAttraction = await Attraction.findByPk(preAttractionId);
      await preAttraction.update({ nextAttractionId: attraction.id });
    }

    return res.status(201).json({ status: "success", data: attraction });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const deleteAttraction = async (req, res) => {
  const { dayId, attractionId } = req.params;
  const { preAttractionId } = req.body;

  try {
    const day = await Day.findByPk(dayId);

    if (!day) {
      return res
        .status(404)
        .json({ status: "error", message: "Day not found" });
    }

    const attraction = await Attraction.findByPk(attractionId);

    if (!attraction) {
      return res
        .status(404)
        .json({ status: "error", message: "Attraction not found" });
    }

    if (day.startAttractionId === attractionId) {
      await day.update({ startAttractionId: attraction.nextAttractionId });
    }

    if (preAttractionId) {
      const preAttraction = await Attraction.findByPk(preAttractionId);
      await preAttraction.update({
        nextAttractionId: attraction.nextAttractionId,
      });
    }

    await attraction.destroy();

    return res.status(204).json({ status: "success" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const updateAttractionOrder = async (req, res) => {
  const { dayId, attractionId } = req.params;
  const { oldPreAttractionId, newPreAttractionId } = req.body;

  try {
    const day = await Day.findByPk(dayId);

    if (!day) {
      return res
        .status(404)
        .json({ status: "error", message: "Day not found" });
    }

    const attraction = await Attraction.findByPk(attractionId);

    if (!attraction) {
      return res
        .status(404)
        .json({ status: "error", message: "Attraction not found" });
    }

    const oldPreAttraction = oldPreAttractionId
      ? await Attraction.findByPk(oldPreAttractionId)
      : null;

    const newPreAttraction = newPreAttractionId
      ? await Attraction.findByPk(newPreAttractionId)
      : null;

    if (oldPreAttraction) {
      await oldPreAttraction.update({
        nextAttractionId: attraction.nextAttractionId,
      });
    }

    if (newPreAttraction) {
      await attraction.update({
        nextAttractionId: newPreAttraction.nextAttractionId,
      });
      await newPreAttraction.update({ nextAttractionId: attractionId });
    } else {
      await attraction.update({ nextAttractionId: day.startAttractionId });
      await day.update({ startAttractionId: attractionId });
    }

    return res.status(200).json({ status: "success", data: attraction });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const updateAttractionTime = async (req, res) => {};

export const updateAttractionNote = async (req, res) => {};
