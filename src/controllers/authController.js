import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendResetPasswordEmail } from '../services/emailService.js';
import createSession from '../services/session.js';
import Session from '../models/Session.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, role, phone_number, pin } = req.body;
    const account_balance = 0;

    // Check if the email already exists
    const check = await User.findOne({ where: { email: email } });

    if (check) {
      return res.status(400).json({
        status: 'failed',
        message: "Email has already been used"
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user', // Default to 'user' if no role is specified
      phone_number,
      pin,
      account_balance
    });

    // Fetch the newly created user
    const users = await User.findOne({
      where: { email: user.email },
    });

    // Generate token
    const token = generateToken(user.id);

    return res.status(201).json({
      status: 'success',
      data: {
        users,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user.id);

    // Data to be passed to createSession
    const data = [token, user.id];
    const userId = user.id

    // Create session
    const session = await createSession(token, userId);
    if (session.status === 'success') {
      // Respond with success and token
      return res.status(200).json({
        status: 'success',
        data: {
          user,
          token
        }
      });
    }
  } catch (error) {
    next(error);
  }
};


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    try {
      await sendResetPasswordEmail(user.email, resetToken);

      res.json({
        status: 'success',
        message: 'Reset token sent to email'
      });
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        status: 'error',
        message: 'Error sending email. Please try again later.'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired'
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Generate new token
    const newToken = generateToken(user.id);

    res.json({
      status: 'success',
      data: {
        user,
        token: newToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    // Retrieve token from request headers
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Token not provided",
      });
    }

    // Decode and verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    // Find the session by token
    const session = await Session.findOne({
      where: { token },
    });

    if (!session) {
      return res.status(404).json({
        status: "error",
        message: "Session not found",
      });
    }

    // Check if the session is already inactive
    if (session.status === "inactive") {
      return res.status(400).json({
        status: "error",
        message: "Session is already inactive",
      });
    }

    // Update the session status to "inactive"
    await session.update({ status: "inactive" });

    // Respond with success
    return res.status(200).json({
      status: "success",
      message: "User successfully logged out",
      userId: decoded.id, // Optional: Include user details in the response
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      status: "error",
      message: "Logout failed due to an internal error",
      error: error.message,
    });
  }
};