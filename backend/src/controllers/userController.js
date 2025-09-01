const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" });

const JWT_ACCESSKEY = process.env.ACCESSKEY;
const JWT_REFRESHKEY = process.env.REFRESHKEY;

const createUser = async (req, res) => {
    try {
        const {name, username, email, password} = req.body;

        if (!name || !username || !email || !password)  {
            return res.status(400).json({error : 'all fields are required'})
        }

        if (!/^[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
            return res.status(400).json({ error: 'Invalid password format' });
        }

        const newUser = new User({name, username, email, password});
        await newUser.save();

        res.status(201).json(newUser);

    } catch (err) {
      if (err.name === 'ValidationError') {
        // schema validation error (regex, minlength, required, etc.)
        return res.status(400).json({ error: err.message });
      }

      if (err.code === 11000) {
        // duplicate key error (unique constraint)
        return res.status(400).json({ error: 'Duplicate field value entered' });
      }

      res.status(500).json({error : 'Server error'})
    }
};

const pagination = async (req, res) => {
  try {
    let { page = 1, limit = 10, role, name = '', username = '', sortBy = 'createdAt', order = 'desc' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (role) {
      filter.role = role
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }

    order = order === 'desc' ? -1 : 1

    const users = await User.find(filter)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total/limit),
      users
    })


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find().select('username')
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const postLog = async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password)  {
            return res.status(400).json({error : 'all fields are required'})
        }

        const user = await User.findOne({username}).select('+password');
        if(!user) {
          return res.status(400).json({error: 'Username or Password is Invalid'}) 
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
          return res.status(400).json({error: 'Username or Password is Invalid'}) 
        }

        const access_token = jwt.sign(
          {id: user._id, username: user.username, role: user.role}, JWT_ACCESSKEY, {expiresIn: '5s'}
        );

        const refresh_token = jwt.sign(
          {id: user._id}, JWT_REFRESHKEY, {expiresIn: '7d'}
        ); 

        const isProd = process.env.NODE_ENV === 'production'; // to check if running on http/localhost or https
        //this is running in localhost so it will be false

        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,   //JS can't read this
          signed: true,
          secure: false,     //isProd - this will be false because its in development/localhost/http
          sameSite: "lax", // strict - CSRF protection
          maxAge: 7*24*60*60*1000 // 7 days
        });
        
        res.status(200).json({message: "Succesfully Log-in", access_token});

    } catch (err) {
      res.status(500).json({error: err})
    }
};

const getLog =  (req, res) => {
  console.log(`welcome username: ${req.user.username}`)
  res.json({message: `welcome username: ${req.user.username}`, role: req.user.role});
};


const getRole = (req, res) => {
  console.log(`'Going to Superadmin User Role Modification Dashboard'`)
  res.json({message: 'Going to Superadmin User Role Modification Dashboard'});
};

const deleteUser = async (req, res) => {
  try {
    const {id} = req.params;

    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      console.log(`User with ID: ${id} does not exist`)
      return res.status(404).json({error: `User with ID: ${id} does not exist`})
    } 

    res.status(201).json({message: 'User succesfully deleted', user: deleteUser})
  } catch(err) {
    console.log('Server Error')
    res.status(500).json({error: 'Server Error'})
  }
};

const changeRole = async (req, res) => {
  try {
    const {username, role} = req.body;

    if(!username || !role) {
      return res.status(400).json({error : 'no username or role'});
    }
    const user = await User.findOne({username}).select('role');
    if(!user) {
      return res.status(400).json({error: "Username doesn't exist"});
    }
    user.role = role;
    await user.save();
    console.log("Successful" + user)
    res.status(201).json({message: 'Succesfully Replaced'})
  } catch(error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
  const token = req.signedCookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, JWT_REFRESHKEY);

    // Fetch user to get role & username
    const user = await User.findById(decoded.id);
    if (!user) return res.sendStatus(404);

    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_ACCESSKEY,
      { expiresIn: '5s' }
    );
    console.log('New token created')
    res.json({ access_token: newAccessToken });
  } catch (err) {
    return res.sendStatus(403); // invalid/expired refresh
  }
};

module.exports = {createUser, pagination, getUser, postLog, getLog, getRole, changeRole, deleteUser, refreshToken};