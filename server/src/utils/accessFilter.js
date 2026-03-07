export const accessFilter = (user) => {

  if (user.role === "owner") {
    return {};
  }

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return {
    createdBy: user._id,
    createdAt: { $gte: dayAgo }
  };
};