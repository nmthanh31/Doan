const path = require("path");
const { readCSV, writeCSV } = require("../utils/csv");
const filePath = path.join(__dirname, "../data/users.csv");

exports.getUsers = () => {
  return readCSV(filePath);
};

exports.getUserById = (id) => {
  const users = readCSV(filePath);
  return users.find((u) => u.id === id);
};

exports.findUserByEmail = (email) => {
  const users = readCSV(filePath);
  return users.find((u) => u.email === email);
};

exports.createUser = (newUser) => {
  const users = readCSV(filePath);
  users.push(newUser);
  writeCSV(filePath, users);
};

exports.countUsers = () => {
  const users = readCSV(filePath);
  return users.length;
}