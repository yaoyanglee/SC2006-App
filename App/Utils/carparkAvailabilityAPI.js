import axios  from "axios";

const BASE_URL = 'https://api.data.gov.sg/v1/transport/carpark-availability';

const fetchCarparkAvailability = async (dateTime) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          date_time: dateTime,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching carpark availability:', error);
      throw error;
    }
  };
  
  export default {
    fetchCarparkAvailability,
  };