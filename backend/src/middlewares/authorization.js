function authorization(...authorizeRole) {
  return (req, res, next) => {
    if(!req.user || !authorizeRole.includes(req.user.role)) {
      console.log(`Forbidden: ${req.user.username} Role '${req.user.role}' is unauthorized`)
      return res.status(403).json({error: 'Forbidden: Unauthorized Role'})
    }
    next();
  };
}

module.exports = authorization;