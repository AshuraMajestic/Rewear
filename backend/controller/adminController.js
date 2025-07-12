import jwt from 'jsonwebtoken';

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-default-secret';
    const adminEmail = process.env.ADMIN_EMAIL;

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Check if it's an admin token
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Admin privileges required'
      });
    }

    if (decoded.email !== adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Invalid admin'
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if credentials are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET || 'your-default-secret';

    // Check if environment variables are set
    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Validate credentials
    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: adminEmail,
        role: "admin"
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        email: adminEmail,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-default-secret';
    const adminEmail = process.env.ADMIN_EMAIL;

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Check if it's an admin token
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    if (decoded.email !== adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Invalid admin'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

