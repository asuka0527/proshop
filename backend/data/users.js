import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },

  {
    name: "Era Nakajima",
    email: "era@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Asuka Nakajima",
    email: "asuka@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
