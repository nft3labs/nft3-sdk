module.exports = function override(config, env) {
  delete config.module.rules[1].oneOf[2].include
  return config
}