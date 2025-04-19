const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { full_name, email, password, phone, address } = req.body;

  if (userService.findUserByEmail(email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: userService.countUsers() + 1,
    full_name,
    email,
    password,
    phone,
    address,
    created_at: new Date().toISOString().split("T")[0],
  };

  userService.createUser(newUser);
  res.status(201).json({ message: "User registered successfully" });
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    const user = userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        created_at: user.created_at
      },
      process.env.JWT_SECRET || "mysecret",
      { expiresIn: "1d" }
    );
    



    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logout successful" });
  });
};

exports.profile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.json({ user: req.session.user });
};

exports.getAllUsers = (req, res) => {
  const users = userService.getUsers();
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = userService.getUserById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: "User not found" });
};

