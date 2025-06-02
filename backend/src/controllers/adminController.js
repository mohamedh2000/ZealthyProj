const pool = require('../config/database');

const adminController = {
  // Get current configuration
  getConfig: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM admin_config ORDER BY id DESC LIMIT 1');
      if (result.rows.length === 0) {
        // Return default configuration if none exists
        return res.json({
          page2: ['aboutMe', 'birthdate'],
          page3: ['address']
        });
      }
      res.json({
        page2: result.rows[0].page2_components,
        page3: result.rows[0].page3_components
      });
    } catch (error) {
      console.error('Error fetching config:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update configuration
  updateConfig: async (req, res) => {
    const { page2, page3 } = req.body;

    try {
      // First, delete all existing configurations
      await pool.query('DELETE FROM admin_config');
      
      // Then insert the new configuration
      const result = await pool.query(
        `INSERT INTO admin_config (page2_components, page3_components)
         VALUES ($1, $2)
         RETURNING *`,
        [JSON.stringify(page2), JSON.stringify(page3)]
      );
      
      res.json({
        page2: result.rows[0].page2_components,
        page3: result.rows[0].page3_components
      });
    } catch (error) {
      console.error('Error updating config:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = adminController; 