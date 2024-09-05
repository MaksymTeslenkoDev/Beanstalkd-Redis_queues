module.exports = ({ envs }) => {
  const host = envs.REDIS_HOST || 'localhost';
  return Object.freeze({
    client: {
      host,
      port: 6379,
      name: 'mymaster',
    },
  });
};
