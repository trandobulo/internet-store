const currencyRow = (isListOpen) => (
  <svg
    className={isListOpen ? "notRotated" : "rotated"}
    id="currency"
    width="8"
    height="4"
    viewBox="0 0 8 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 3.5L4 0.5L7 3.5"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default currencyRow;
