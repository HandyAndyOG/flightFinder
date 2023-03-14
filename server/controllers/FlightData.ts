import { Flight } from "../Model/model";

export const fetchData = async () => {
  try {
    return await Flight.find({});
  } catch (e) {
    console.log(e.message);
    return
  }
};
