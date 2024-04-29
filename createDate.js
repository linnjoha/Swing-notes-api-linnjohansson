const createDate = () => {
  let date = new Date();
  const currentDate = date.toLocaleDateString("sv-SE");
  console.log(currentDate);
  return currentDate;
};

module.exports = { createDate };
