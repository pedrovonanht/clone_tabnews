import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();
  const pepper = process.env.PASSWORD_PEPPER;

  const passwordWithPepper = password + pepper;
  return await bcryptjs.hash(passwordWithPepper, rounds);
}

function getNumberOfRounds() {
  let rounds = 14;

  if (process.env.NODE_ENV === "development") {
    rounds = 1;
  }

  return rounds;
}

async function compare(providedPassword, storedPassword) {
  const pepper = process.env.PASSWORD_PEPPER;
  const providedPasswordWithPepper = providedPassword + pepper;
  return await bcryptjs.compare(providedPasswordWithPepper, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
