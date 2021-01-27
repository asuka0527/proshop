import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from "../constants/userConstants";
import axios from "axios";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    //We set "Content-Type": "application/json" in our headers when we sent data with our request, like when a new user registers. We set the Authorization: "Bearer token" when we need to access a protected route and the token will give permission to access. In our case, we have routes that are protected that only a registered user can access and routes where only if the user is an administrator of the site can access them. If there is no data being sent with the request, there is no need to set "Content-Type": "application/json" like if an admin deletes a user we only need to set the Bearer token.

    // When we need to pass anything from front-end to back-end, then we need to set content-type property.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
