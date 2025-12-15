import bcrypt from 'bcryptjs';

const password = 'Levi20111028!'; // je echte wachtwoord
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
// hashed password: $2a$10$5vYZ5vYZ5vYZ5vYZ5vYZ5vYZ5vYZ5vYZ5vYZ5vY
