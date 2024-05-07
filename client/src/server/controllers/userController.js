import mongoose from "mongoose";
import Users from "../models/userModel.js";
import Verification from "../models/emailVerification.js";
import { compareString } from "../utils/index.js";

export const updateUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    location,
    profileUrl,
    jobTitle,
    about,
  } = req.body;

  try {
    if (!firstName || !lastName || !email || !contact || !jobTitle || !about) {
      next("Please provide all required fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No User with id: ${id}`);
    }

    const updateUser = {
      firstName,
      lastName,
      email,
      contact,
      location,
      profileUrl,
      jobTitle,
      about,
      _id: id,
    };

    const user = await Users.findByIdAndUpdate(id, updateUser, { new: true });

    const token = user.createJWT();

    user.password = undefined;

    res.status(200).json({
      sucess: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const user = await Users.findById({ _id: id });

    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  Verification.findOne({ userId })
    .then((result) => {
      if (result) {
        const { expiresAt, token: hashedToken } = result;

        // token has expires
        if (expiresAt < Date.now()) {
          Verification.findOneAndDelete({ userId })
            .then(() => {
              Users.findOneAndDelete({ _id: userId })
                .then(() => {
                  const message = "Verification token has expired.";
                  res.redirect(
                    `/api-v1/users/verified?status=error&message=${message}`
                  );
                })
                .catch((err) => {
                  res.redirect(`/api-v1/users/verified?message=`);
                });
            })
            .catch((error) => {
              console.log(error);
              res.redirect(`/api-v1/users/verified?message=`);
            });
        } else {
          //token valid
          compareString(token, hashedToken)
            .then((isMatch) => {
              if (isMatch) {
                Users.findOneAndUpdate({ _id: userId }, { verified: true })
                  .then(() => {
                    Verification.findOneAndDelete({ userId }).then(() => {
                      const message = "Email verified successfully";
                      res.redirect(
                        `/api-v1/users/verified?status=success&message=${message}`
                      );
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    const message = "Verification failed or link is invalid";
                    res.redirect(
                      `/api-v1/users/verified?status=error&message=${message}`
                    );
                  });
              } else {
                // invalid token
                const message = "Verification failed or link is invalid";
                res.redirect(
                  `/api-v1/users/verified?status=error&message=${message}`
                );
              }
            })
            .catch((err) => {
              console.log(err);
              res.redirect(`/api-v1/users/verified?message=`);
            });
        }
      } else {
        const message = "Invalid verification link. Try again later.";
        res.redirect(`/api-v1/users/verified?status=error&message=${message}`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/api-v1/users/verified?message=`);
    });
};
