import { toast } from 'react-hot-toast';

const handleApiError = (error: any) => {
  // Log the error for debugging
  console.error('API Error:', error);

  // Check if the error is an Axios error
  if (error.response) {
    // Server responded with a status code outside the range of 2xx
    const status = error.response.status;
    const message = error.response.data?.error || 'An unexpected error occurred.';

    // Handle specific status codes
    switch (status) {
      case 400:
        toast.error('Bad Request: ' + message);
        break;
      case 401:
        toast.error('Unauthorized: Please log in again.');
        break;
      case 403:
        toast.error('Forbidden: You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('Not Found: The requested resource could not be found.');
        break;
      case 500:
        toast.error('Server Error: Please try again later.');
        break;
      default:
        toast.error('Error: ' + message);
    }
  } else if (error.request) {
    // The request was made but no response was received
    toast.error('Network Error: Please check your internet connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    toast.error('Error: ' + error.message);
  }
};

export default handleApiError; 