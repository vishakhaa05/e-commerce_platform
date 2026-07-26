import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendEmail } from '../utils/email.js';

const getAccessExpiration = () => process.env.JWT_ACCESS_EXPIRATION || '15m';
const getRefreshExpiration = () => process.env.JWT_REFRESH_EXPIRATION || '7d';

const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fm_access_secret',
    { expiresIn: getAccessExpiration() as any }
  );
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'fm_refresh_secret',
    { expiresIn: getRefreshExpiration() as any }
  );
};

const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  // Set HTTP-only Cookie for Refresh Token
  const cookieOptions: any = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth', // only send for auth operations
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Remove password from output
  const userOutput = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    addresses: user.addresses,
  };

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: userOutput,
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email address already registered.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email,
      passwordHash,
      verificationToken,
      isVerified: false,
    });

    // Send verification email
    const frontendUrl = process.env.FRONTEND_URL || 'https://e-commerce-platform-llu4.vercel.app';
    const verifyUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const message = `Welcome to BigMarket! Please verify your email by clicking the link: \n\n ${verifyUrl} \n\n If you did not request this, please ignore this email.`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #10b981;">Verify your BigMarket Account</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering at BigMarket. Click the button below to verify your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #10b981; text-decoration: none; border-radius: 5px; margin: 15px 0;">Verify Email</a>
        <p>Or copy and paste this URL into your browser:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Happy Shopping!</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'BigMarket Account Verification',
        message,
        html,
      });
      res.status(201).json({
        success: true,
        message: 'Registration successful! Verification email sent.',
      });
    } catch (err) {
      console.error(err);
      res.status(201).json({
        success: true,
        message: 'Registration successful, but failed to send verification email. Please contact support.',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ success: false, message: 'Verification token is required.' });
      return;
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'No refresh token provided.' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fm_refresh_secret') as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ success: false, message: 'Session owner does not exist.' });
      return;
    }

    // Return new access token, keep refresh token active in cookie
    const accessToken = generateAccessToken(user._id.toString());

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please login again.' });
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/api/auth',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak user presence, just say email was sent if it existed
      res.status(200).json({ success: true, message: 'If registered, a password reset link has been sent.' });
      return;
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const message = `You requested a password reset. Please click the following link to reset your password: \n\n ${resetUrl} \n\n This link expires in 30 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #ef4444;">Reset your BigMarket Password</h2>
        <p>Hi ${user.name},</p>
        <p>You are receiving this because you (or someone else) requested a password reset for your account.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #ef4444; text-decoration: none; border-radius: 5px; margin: 15px 0;">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'BigMarket Password Reset Request',
        message,
        html,
      });
      res.status(200).json({ success: true, message: 'Password reset link sent to email.' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ success: false, message: 'Failed to send password reset email. Try again.' });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token) {
      res.status(400).json({ success: false, message: 'Token is required.' });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    next(error);
  }
};
