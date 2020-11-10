module.exports = {
  secret: 'sssssh this is the jwt secret',
  options: {
    algorithm: "HS256",
    expiresIn: "10h", // 👈 extend the expired time if you want to develop features! So you don't need to relogin
    issuer: 'api.transaction.com',
    audience: 'transaction.com',
  },
};