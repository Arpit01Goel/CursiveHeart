import React from "react";

function LetterList({ letters, onLetterClick }) {
  const groupLettersByWeek = (letters) => {
    const weeks = {};

    letters.forEach((letter) => {
      const date = new Date(letter.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay())); // Start of the week (Sunday)
      const weekKey = weekStart.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(letter);
    });

    return weeks;
  };

  const groupedLetters = groupLettersByWeek(letters);

  return (
    <div className="w-full max-w-6xl mt-8">
      {Object.keys(groupedLetters).map((weekKey) => (
        <div key={weekKey} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Week Starting: {weekKey}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedLetters[weekKey].map((letter) => (
              <div
                key={letter._id}
                className="bg-white p-4 rounded-lg shadow-md relative cursor-pointer"
                onClick={() => onLetterClick(letter)} // Trigger the click handler
              >
                <h3 className="text-lg font-bold mb-2">{letter.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Date: {new Date(letter.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  {letter.content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LetterList;