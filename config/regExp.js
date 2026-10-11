module.exports = {
  username: {
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{2,50}$/,
    message: "Username verification failed.",
  },
  user_id: {
    pattern: /^[a-zA-Z0-9_-]{4,50}$/,
    message: "User ID verification failed.",
  },
  password: {
    pattern: /^[@$!%*?&A-Za-z\d]{6,20}$/,
    message: "Password verification failed.",
  },
};
