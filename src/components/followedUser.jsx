import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const ScrollablePersonList = ({ persons = [] }) => {
  const navigate = useNavigate();

  const sendPersonId = (personId) => {
    console.log("Selected PersonId:", personId);
    navigate(`/profile/${personId}`);
  };

  return (
    <div className="w-full flex justify-center overflow-x-auto   mt-6">
      <div className="flex gap-x-4 w-96">
        {persons.map((person) => (
          <div
            key={person?._id}
            className="flex flex-col items-center cursor-pointer min-w-[60px]"
            onClick={() => sendPersonId(person?._id)}
          >
            {person?.profilePicture ? (
              <img
                className="w-12 h-12 rounded-full border-2 border-white"
                src={person.profilePicture}
                alt={`${person?.username}'s Profile`}
              />
            ) : (
              <FaUserCircle className="w-12 h-12 text-gray-400" />
            )}
            <p className="text-xs text-black text-center truncate w-14">
              {person?.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollablePersonList;
