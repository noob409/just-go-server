import axios from "axios";
import { getCache, setCache } from "../../utils/placeUtils.js";

export const getDetailPlace = async (req, res) => {
  const { googlePlaceIdList } = req.body;

  try {
    const placeList = [];

    for (const placeId of googlePlaceIdList) {
      let place = await getCache(placeId);
  
      if (!place) {
        const result = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?fields=place_id%2Cname%2Cphoto%2Crating%2Cformatted_address%2Cformatted_phone_number%2Cwebsite%2Copening_hours&place_id=${placeId}&key=${process.env.GOOGLE_MAP_API_KEY}&language=zh-TW&region=TW`);

        const newPlace = {
          placeId: result.data.result.place_id,
          name: result.data.result.name,
          photo: result.data.result.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.data.result.photos[0].photo_reference}&key=${process.env.GOOGLE_MAP_API_KEY}` : null,
          rating: result.data.result.rating,
          formatted_address: result.data.result.formatted_address,
          formatted_phone_number: result.data.result.formatted_phone_number,
          website: result.data.result.website,
          opening_hours: result.data.result.opening_hours ? result.data.result.opening_hours.weekday_text : null
        }
  
        await setCache(placeId, newPlace);
        place = newPlace;
      }
  
      placeList.push(place);
    }

    return res.status(200).json({ status: "success", data: placeList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
