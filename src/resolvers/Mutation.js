const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  // encrypt user password
  const password = await bcrypt.hash(args.password, 10);

  // create user with encrypted password
  const user = await context.prisma.createUser({ ...args, password });

  // generate unique user token
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  // attempt to get user from database
  const user = await context.prisma.user({ email: args.email });

  // throw error if user doesn't exist
  if (!user) {
    throw new Error("No such user found");
  }

  // validate user password
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  // asign new token to loggedIn user
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

function post(parent, args, context) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

async function vote(parent, args, context, info) {
  // verify user is authenticated to vote
  const userId = getUserId(context);

  // check if link exists in the database
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
}

module.exports = {
  signup,
  login,
  post,
  vote
};
