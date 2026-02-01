const db = require('../config/db');

const createUser = async (name, email, password) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email;
  `;
  const values = [name, email, password];
  const result = await db.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const updatePreferences = async (userId, preferences) => {
  const query = `
    UPDATE users 
    SET preferences = $2
    WHERE id = $1
    RETURNING id, name, email, preferences;
  `;
  const result = await db.query(query, [userId, preferences]);
  return result.rows[0];
};

const updateProfile = async (userId, name, email, phone) => {
  const query = `
    UPDATE users 
    SET name = $2, email = $3, phone = $4
    WHERE id = $1
    RETURNING id, name, email, phone, profile_image, preferences;
  `;
  const result = await db.query(query, [userId, name, email, phone]);
  return result.rows[0];
};

const updateProfileImage = async (userId, imageUrl) => {
  const query = `
    UPDATE users 
    SET profile_image = $2
    WHERE id = $1
    RETURNING id, name, email, profile_image, preferences;
  `;
  const result = await db.query(query, [userId, imageUrl]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  updatePreferences,
  updateProfile,
  updateProfileImage,
};
