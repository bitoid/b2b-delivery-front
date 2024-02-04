import { CommentProps } from "@/types/order";
import { useState } from "react";

const Comment: React.FC<CommentProps> = ({ text }) => {
  const [isComment, setIsComment] = useState(false);

  return (
    <span
      className=" px-3 text-sm text-gray-500 cursor-pointer min-w-[120px] relative"
      onMouseOver={() => setIsComment(true)}
      onTouchStart={() => setIsComment(true)}
      onMouseOut={() => setIsComment(false)}
    >
      {isComment && text ? (
        <span className="bg-white absolute break-words w-[350px] p-2 rounded-[5px] z-10 shadow-2xl">
          {text}
        </span>
      ) : (
        <span>{text.slice(0, 6)}...</span>
      )}
    </span>
  );
};

export default Comment;
