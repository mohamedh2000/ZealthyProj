const pool = require('../config/database');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create or update user
  createOrUpdateUser: async (req, res) => {
    const {
      email,
      password,
      about_me,
      birthdate,
      street_address,
      city,
      state,
      zip,
      current_step
    } = req.body;

    try {
      // Check if user exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        // Update existing user
        const result = await pool.query(
          `UPDATE users 
           SET about_me = $1,
               birthdate = $2,
               street_address = $3,
               city = $4,
               state = $5,
               zip = $6,
               current_step = $7,
               updated_at = CURRENT_TIMESTAMP
           WHERE email = $8
           RETURNING *`,
          [about_me, birthdate, street_address, city, state, zip, current_step, email]
        );
        res.json(result.rows[0]);
      } else {
        // Create new user
        const result = await pool.query(
          `INSERT INTO users 
           (email, password, about_me, birthdate, street_address, city, state, zip, current_step)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [email, password, about_me, birthdate, street_address, city, state, zip, current_step || 1]
        );
        res.status(201).json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get user progress
  getUserProgress: async (req, res) => {
    const { email } = req.params;

    try {
      const result = await pool.query(
        'SELECT current_step FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ currentStep: result.rows[0].current_step });
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController; 