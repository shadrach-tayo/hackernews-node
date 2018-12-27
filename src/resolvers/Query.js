function feed(root, args, context, info) {
  return context.prisma.links();
}

module.exports = {
  feed
};
