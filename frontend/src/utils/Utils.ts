export const InitialsGenerator = (name: string | undefined | null) => {
  if (!name) return "";

  // Ensure that 'name' contains at least one space
  const spaceIndex = name.indexOf(" ");
  if (spaceIndex === -1) return "";

  const firstInitial = name.substring(0, 1).toUpperCase();
  const secondInitial = name
    .substring(spaceIndex + 1, spaceIndex + 2)
    .toUpperCase();

  return firstInitial + " " + secondInitial;
};
