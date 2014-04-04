// 1,4,5 are treated differently than other interval sizes,
//   this helps to identify them immediately
function getIntervalSpecies(size) {
  if (size === 1 || size === 4 || size === 5) {
    return 'P';
  } else {
    return 'M';
  }
}
