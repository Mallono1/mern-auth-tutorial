import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    console.log('Received registration request:', req.body);

    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      addresses,
      password,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      console.log('Validation failed: Missing fields');
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled.',
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res
        .status(400)
        .json({ success: false, message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const validAddresses = Array.isArray(addresses) ? addresses : [];

    const user = new userModel({
      firstName,
      middleName,
      lastName,
      email,
      phone,
      addresses: validAddresses,
      passwordHash: hashedPassword,
    });

    await user.save();

    console.log('User registered successfully:', email);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please log in.',
    });
  } catch (error) {
    console.error('❌ Registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      sucess: false,
      message: 'Email and password are required',
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ sucess: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ sucess: false, message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ sucess: true });
  } catch (error) {
    res.json({ sucess: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ sucess: true, message: 'Logged out' });
  } catch (error) {
    res.json({ sucess: false, message: error.message });
  }
};
