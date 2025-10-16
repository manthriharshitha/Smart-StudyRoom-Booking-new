const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  const secret = process.env.JWT_SECRET || 'devsecret';
  return jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, secret, { expiresIn: '12h' });
}

async function signup(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, role: role || 'student', passwordHash });
  const token = signToken(user);
  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

module.exports = { signup, login };


