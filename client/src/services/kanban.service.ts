import axios from "axios";
import { API_BASE_URL } from "../config/serverApiConfig";
import successHandler from "../request/successHandler";
import errorHandler from "../request/errorHundler";

export const fetchProjects = async (id: string) => {
  try {
    const { data, status } = await axios.get(
      `${API_BASE_URL}projects/getlist/${id}`,
      {
        withCredentials: true,
      }
    );
    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error: any) {
    return errorHandler(error);
  }
};

// export const fetchProjectInfo = async (id: string) => {
//   try {
//     const { data, status } = await axios.get(`${API_BASE_URL}projects/${id}`, {
//       withCredentials: true,
//     });
//     successHandler(
//       { data, status },
//       {
//         notifyOnSuccess: false,
//         notifyOnFailed: true,
//       }
//     );
//     return data;
//   } catch (error: any) {
//     return errorHandler(error);
//   }
// };

export const fetchTaskInfo = async (id: string | undefined) => {
  try {
    const { data, status } = await axios.get(`${API_BASE_URL}tasks/${id}`, {
      withCredentials: true,
    });
    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data.result;
  } catch (error: any) {
    return errorHandler(error);
  }
};

export const fetchUploadFile = async (idm: string | undefined, file: any) => {
  try {
    const { data, status } = await axios.put(
      `${API_BASE_URL}upload/${idm}`,
      {
        file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error: any) {
    return errorHandler(error);
  }
};

export const postCreateTask = async ({
  id_user,
  name,
}: {
  id_user: string;
  name: string;
}) => {
  try {
    const { data, status } = await axios.post(
      `${API_BASE_URL}projects`,
      {
        id_user,
        name,
      },
      {
        withCredentials: true,
      }
    );
    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error: any) {
    return errorHandler(error);
  }
};
