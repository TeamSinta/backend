export const InitialsGenerator = (name: string) => {
  return name
    .substring(0, 1)
    .toUpperCase()
    .concat(
      name.substring(name.indexOf(" ") + 1, name.indexOf(" ") + 2).toUpperCase()
    );
};
